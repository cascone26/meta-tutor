// Generates ecclesiastical-Latin word audio for SoundStudio, and — unlike
// the first pass at this — actually verifies each file before shipping it.
//
// Pipeline per word: real Latin spelling -> ecclesiastical TTS spelling
// (src/lib/latin-ecclesiastical-spelling.ts) -> real Italian neural voice
// (edge-tts) -> speech-recognition round-trip via Whisper -> score the
// transcription against what was actually asked for. If the first voice's
// rendering doesn't round-trip cleanly, it tries the next voice in the list
// before giving up and flagging the word for a human ear. This is the "listen
// and grade the bot" tool — Claude has no ears, this is the substitute.
//
// Usage: node scripts/gen-latin-audio.mjs [--force]
//   --force  re-synthesize + re-verify every word, not just missing ones

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FORCE = process.argv.includes("--force");

// Isabella first (best result in manual testing on real vocab words), Diego
// and Giuseppe as fallbacks — different voice = different G2P guess for an
// out-of-vocabulary word, which is exactly the failure mode being worked
// around.
const VOICES = ["it-IT-IsabellaNeural", "it-IT-DiegoNeural", "it-IT-GiuseppeMultilingualNeural"];

async function main() {
  const { latinAudioManifest } = await import(path.join(ROOT, "src/lib/rca-content/latin-core.ts"));
  const { toEcclesiasticalTtsSpelling } = await import(path.join(ROOT, "src/lib/latin-ecclesiastical-spelling.ts"));
  const { slugify } = await import(path.join(ROOT, "src/lib/audio-slug.ts"));
  const { synthesizeAndVerify } = await import(path.join(ROOT, "scripts/lib/tts-verify.mjs"));

  const outDir = path.join(ROOT, "public/audio/latin");
  await mkdir(outDir, { recursive: true });

  const results = [];
  for (const latinForm of latinAudioManifest) {
    const filename = slugify(latinForm);
    const outPath = path.join(outDir, `${filename}.mp3`);
    if (existsSync(outPath) && !FORCE) {
      console.log(`skip  ${latinForm} (already exists — pass --force to re-verify)`);
      continue;
    }
    const ttsSpelling = toEcclesiasticalTtsSpelling(latinForm);
    const result = await synthesizeAndVerify({
      text: ttsSpelling,
      expectedText: ttsSpelling,
      voices: VOICES,
      language: "Italian",
      outPath,
      threshold: 0.65,
    });
    results.push({ latin: latinForm, ttsSpelling, ...result });
    const tag = result.pass ? "PASS " : "FLAG ";
    console.log(`${tag} ${latinForm} (${ttsSpelling}) -> voice=${result.voice} heard "${result.transcript}" score=${result.score.toFixed(2)}`);
  }

  const passed = results.filter((r) => r.pass).length;
  const flagged = results.filter((r) => !r.pass);
  console.log(`\n${passed}/${results.length} passed whisper round-trip verification.`);
  if (flagged.length) {
    const reportPath = path.join(outDir, "_verification-flags.json");
    await writeFile(reportPath, JSON.stringify(flagged, null, 2));
    console.log(`${flagged.length} flagged — shipped best-scoring attempt anyway, but listen to these yourself:`);
    for (const f of flagged) console.log(`  - ${f.latin}: whisper heard "${f.transcript}" (best score ${f.score.toFixed(2)}, voice ${f.voice})`);
    console.log(`Full report: ${reportPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
