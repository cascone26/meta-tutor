// Generates the phonogram keyword + Latin pronunciation audio used by
// SoundStudio (src/components/rca/SoundStudio.tsx). Pulls the manifests
// straight from the real content files (src/lib/rca-content/phonogram-sounds.ts,
// latin-core.ts) via Node's native TS import (Node 22+, erasable-syntax type
// stripping) so this can never silently drift out of sync with the content —
// re-run any time those files change.
//
// Uses macOS `say` (built-in, offline, no API cost) + ffmpeg to produce real
// mp3 files checked into public/audio/, rather than relying on live
// browser speechSynthesis — quality/voice availability varies a lot across
// the devices a student's family might use, and pre-generated files are
// consistent, cacheable, and free.
//
// Usage: node scripts/gen-sound-audio.mjs

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const VOICE = "Samantha";


async function genOne(text, outDir, filename) {
  const mp3Path = path.join(outDir, `${filename}.mp3`);
  if (existsSync(mp3Path)) return { filename, skipped: true };
  const aiffPath = path.join(outDir, `${filename}.aiff`);
  await run("say", ["-v", VOICE, "-o", aiffPath, text]);
  await run("ffmpeg", ["-y", "-i", aiffPath, "-codec:a", "libmp3lame", "-qscale:a", "3", mp3Path]);
  await rm(aiffPath);
  return { filename, skipped: false };
}

async function genBatch(items, outDir, label) {
  await mkdir(outDir, { recursive: true });
  let made = 0, skipped = 0;
  for (const { text, filename } of items) {
    const r = await genOne(text, outDir, filename);
    if (r.skipped) skipped++; else made++;
  }
  console.log(`${label}: ${made} generated, ${skipped} already existed, ${items.length} total`);
}

async function main() {
  const { phonogramKeywords } = await import(
    path.join(ROOT, "src/lib/rca-content/phonogram-sounds.ts")
  );
  const { latinAudioManifest } = await import(
    path.join(ROOT, "src/lib/rca-content/latin-core.ts")
  );
  const { slugify } = await import(path.join(ROOT, "src/lib/audio-slug.ts"));

  const phonogramItems = phonogramKeywords.map((w) => ({ text: w, filename: slugify(w) }));
  await genBatch(phonogramItems, path.join(ROOT, "public/audio/phonograms"), "Phonogram keywords");

  const latinItems = latinAudioManifest.map(({ respelling, label }) => ({
    text: respelling,
    filename: slugify(label),
  }));
  await genBatch(latinItems, path.join(ROOT, "public/audio/latin"), "Latin words");

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
