// Generates the phonogram keyword audio used by SoundStudio
// (src/components/rca/SoundStudio.tsx), from the real content file
// (src/lib/rca-content/phonogram-sounds.ts) via Node's native TS import —
// re-run any time that file changes.
//
// Uses macOS `say` (built-in, offline, no API cost) + ffmpeg. Every file is
// transcribed back with Whisper as a sanity check, but empirically (2026-08-24)
// this round-trip is NOT reliable signal for these specific files: re-running
// Whisper's base model on the exact same "cat.mp3" three times in a row
// produced three different, unrelated hallucinated transcriptions ("the" /
// "Yep." / "here" — none of them "cat"). That's a documented Whisper failure
// mode on very short (<1s), low-context isolated-word clips, not evidence the
// audio is wrong — "cat" read by Samantha, a mature first-party English
// voice, on a totally ordinary word, is not a real risk case. Flags below are
// kept for visibility (a genuinely silent/corrupt file would flag every time,
// consistently) but treat a one-off flag on a real English word as noise
// unless it repeats across multiple runs. Latin gets the full multi-voice
// verify treatment in scripts/gen-latin-audio.mjs instead, where the failure
// mode being tested (an Italian voice mispronouncing an unfamiliar foreign
// word) is real and this same round-trip check caught real problems.
//
// Usage: node scripts/gen-phonogram-audio.mjs

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const VOICE = "Samantha";

async function genOne(text, outDir, filename) {
  const mp3Path = path.join(outDir, `${filename}.mp3`);
  if (existsSync(mp3Path)) return { filename, skipped: true, mp3Path };
  const aiffPath = path.join(outDir, `${filename}.aiff`);
  await run("say", ["-v", VOICE, "-o", aiffPath, text]);
  await run("ffmpeg", ["-y", "-i", aiffPath, "-codec:a", "libmp3lame", "-qscale:a", "3", mp3Path]);
  await rm(aiffPath);
  return { filename, skipped: false, mp3Path };
}

async function main() {
  const { phonogramKeywords } = await import(path.join(ROOT, "src/lib/rca-content/phonogram-sounds.ts"));
  const { slugify } = await import(path.join(ROOT, "src/lib/audio-slug.ts"));
  const { transcribe, similarity } = await import(path.join(ROOT, "scripts/lib/tts-verify.mjs"));

  const outDir = path.join(ROOT, "public/audio/phonograms");
  await mkdir(outDir, { recursive: true });

  let made = 0, skipped = 0;
  const flagged = [];
  for (const word of phonogramKeywords) {
    const { mp3Path, skipped: wasSkipped } = await genOne(word, outDir, slugify(word));
    if (wasSkipped) skipped++; else made++;
    const transcript = await transcribe(mp3Path, "English", "base");
    const score = similarity(transcript, word);
    if (score < 0.65) {
      flagged.push({ word, transcript, score: score.toFixed(2) });
      console.log(`FLAG  "${word}" -> whisper heard "${transcript}" (score ${score.toFixed(2)})`);
    }
  }

  console.log(`Phonogram keywords: ${made} generated, ${skipped} already existed, ${phonogramKeywords.length} total, ${flagged.length} flagged`);
  if (flagged.length) {
    const reportPath = path.join(outDir, "_verification-flags.json");
    await writeFile(reportPath, JSON.stringify(flagged, null, 2));
    console.log(`Flagged words written to ${reportPath} — low-confidence (see header comment); only worth a listen if a word flags on repeated runs.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
