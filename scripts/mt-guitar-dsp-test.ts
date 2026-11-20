// Direct unit test of the pitch/chord DSP against synthetic signals — independent of whatever
// Chromium's --use-fake-device-for-media-stream actually emits (observed near-silent in the
// live-mic Playwright check, which is a mic-fixture question, not a DSP-correctness one).
import { detectPitchYin } from "../src/lib/guitar/pitch-detection";
import { chromaFromSpectrum, scoreAgainstChord, CHORD_MATCH_PASS_THRESHOLD } from "../src/lib/guitar/chord-detection";
import { chordById, CHORDS } from "../src/lib/guitar/chords-data";
import { describeFrequency } from "../src/lib/guitar/notes";

const SAMPLE_RATE = 44100;

function sineBuffer(freq: number, length: number, sampleRate: number): Float32Array {
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i++) buf[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate);
  return buf;
}

function multiToneSpectrum(freqs: number[], fftSize: number, sampleRate: number): Float32Array {
  // Synthesize a dB-magnitude spectrum (as AnalyserNode.getFloatFrequencyData would return)
  // with peaks at each target frequency's nearest bin.
  const bins = fftSize / 2;
  const spectrum = new Float32Array(bins).fill(-100);
  const binHz = sampleRate / fftSize;
  for (const f of freqs) {
    const bin = Math.round(f / binHz);
    if (bin >= 0 && bin < bins) spectrum[bin] = -10;
  }
  return spectrum;
}

let failures = 0;
function check(label: string, cond: boolean, detail: string) {
  console.log(`${cond ? "PASS" : "FAIL"} — ${label}${detail ? `: ${detail}` : ""}`);
  if (!cond) failures++;
}

// 1) YIN pitch detection on pure tones across the guitar's open-string range.
console.log("\n=== Pitch detection (YIN) ===");
for (const freq of [82.41, 110, 146.83, 196, 246.94, 329.63]) {
  const buf = sineBuffer(freq, 2048, SAMPLE_RATE);
  const result = detectPitchYin(buf, SAMPLE_RATE);
  const detected = result?.frequency ?? -1;
  const errHz = Math.abs(detected - freq);
  check(`${freq}Hz sine`, result !== null && errHz < 1, `detected ${detected.toFixed(2)}Hz (err ${errHz.toFixed(3)}Hz)`);
}

// Octave-adjacent low E (open string) — stress case for half-buffer YIN resolution.
const lowE = sineBuffer(82.41, 4096, SAMPLE_RATE);
const lowEResult = detectPitchYin(lowE, SAMPLE_RATE);
check("low E (82.41Hz) with larger buffer", lowEResult !== null && Math.abs(lowEResult.frequency - 82.41) < 1, `${lowEResult?.frequency.toFixed(2)}Hz`);

// 2) describeFrequency note naming sanity.
console.log("\n=== Note naming ===");
const a440 = describeFrequency(440);
check("440Hz = A4, 0 cents", a440.name === "A" && a440.octave === 4 && Math.abs(a440.cents) <= 1, JSON.stringify(a440));
const e2 = describeFrequency(82.41);
check("82.41Hz = E2", e2.name === "E" && e2.octave === 2, JSON.stringify(e2));

// 3) Chord detection: synthesize each chord's exact pitch classes as spectral peaks (using
// octave 3 as a stand-in register) and confirm matchChord/scoreAgainstChord pick the right one.
console.log("\n=== Chord detection (chroma matching) ===");
const FFT_SIZE = 32768; // must match useGuitarAudio's FREQ_FFT_SIZE
for (const target of CHORDS) {
  const shape = chordById(target.id)!;
  // Reconstruct the actual sounded frequencies for this shape (not just pitch classes) so the
  // synthetic spectrum matches what chromaFromSpectrum would see from a real strum.
  const STANDARD_TUNING_MIDI = [40, 45, 50, 55, 59, 64];
  const freqs: number[] = [];
  shape.frets.forEach((f, i) => {
    if (f === "x") return;
    const midi = STANDARD_TUNING_MIDI[i] + (f as number);
    freqs.push(440 * Math.pow(2, (midi - 69) / 12));
  });
  const spectrum = multiToneSpectrum(freqs, FFT_SIZE, SAMPLE_RATE);
  const chroma = chromaFromSpectrum(spectrum, SAMPLE_RATE, FFT_SIZE);
  const selfScore = scoreAgainstChord(chroma, shape);
  check(`${shape.id} (${shape.display}) scores well above the pass threshold against itself`, selfScore >= CHORD_MATCH_PASS_THRESHOLD, `score=${selfScore.toFixed(3)} (threshold ${CHORD_MATCH_PASS_THRESHOLD})`);

  // Cross-check: every other chord with a DIFFERENT pitch-class set should score lower than
  // this chord does against its own target — i.e. no silent misidentification.
  for (const other of CHORDS) {
    if (other.id === shape.id) continue;
    const otherShape = chordById(other.id)!;
    const crossScore = scoreAgainstChord(chroma, otherShape);
    if (crossScore > selfScore) {
      check(`${shape.id}'s own chroma doesn't score higher against ${other.id}`, false, `self=${selfScore.toFixed(3)} vs ${other.id}=${crossScore.toFixed(3)}`);
    }
  }
}

console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
