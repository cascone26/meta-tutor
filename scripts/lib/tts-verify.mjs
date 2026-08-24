// Reusable TTS -> speech-recognition round-trip checker. This is the actual
// "listen and grade the bot" tool — Claude has no ears, so instead of
// assuming a hand-picked respelling sounds right, this generates the
// candidate audio, transcribes it back with Whisper, and scores how close
// the transcription is to what was actually asked for. A bad TTS rendering
// (wrong phoneme, mangled word) shows up as a bad transcription; a good one
// round-trips cleanly. Used by gen-latin-audio.mjs, but general-purpose —
// works for any (text, voice, language) combo.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const run = promisify(execFile);

export function normalize(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents/macrons
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// 1.0 = identical, 0.0 = nothing alike. Normalized edit distance ratio.
export function similarity(a, b) {
  const na = normalize(a), nb = normalize(b);
  if (!na && !nb) return 1;
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  const dist = levenshtein(na, nb);
  return 1 - dist / Math.max(na.length, nb.length);
}

export async function synthesizeEdgeTts(text, voice, outPath) {
  await run("edge-tts", ["--voice", voice, "--text", text, "--write-media", outPath]);
}

let WHISPER_WARMED = false;

// Runs the `whisper` CLI on an mp3 and returns the plain transcript text.
export async function transcribe(mp3Path, language, model = "base") {
  const dir = await mkdtemp(path.join(tmpdir(), "whisper-out-"));
  try {
    await run("whisper", [
      mp3Path, "--model", model, "--language", language,
      "--fp16", "False", "--output_format", "txt", "--output_dir", dir,
    ], { maxBuffer: 1024 * 1024 * 20 });
    WHISPER_WARMED = true;
    const base = path.basename(mp3Path).replace(/\.[^.]+$/, "");
    const txt = await readFile(path.join(dir, `${base}.txt`), "utf8");
    return txt.trim();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export function whisperIsWarmed() {
  return WHISPER_WARMED;
}

// Full round-trip: synthesize with each candidate voice in order, transcribe,
// score against `expectedText`, stop at the first voice that clears
// `threshold`. Returns the best attempt even if none clear it (caller decides
// whether to ship anyway or flag for human review) plus the full attempt log.
export async function synthesizeAndVerify({ text, expectedText, voices, language, outPath, threshold = 0.65, model = "base" }) {
  const attempts = [];
  let best = null;
  for (const voice of voices) {
    await synthesizeEdgeTts(text, voice, outPath);
    const transcript = await transcribe(outPath, language, model);
    const score = similarity(transcript, expectedText);
    attempts.push({ voice, transcript, score });
    if (!best || score > best.score) best = { voice, transcript, score };
    if (score >= threshold) return { pass: true, ...best, attempts };
  }
  // Leave the file written as the best-scoring attempt, not just the last one tried.
  if (best.voice !== voices[voices.length - 1]) {
    await synthesizeEdgeTts(text, best.voice, outPath);
  }
  return { pass: false, ...best, attempts };
}
