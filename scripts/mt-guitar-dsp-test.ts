// Direct unit test of the pitch/chord DSP against synthetic signals — independent of whatever
// Chromium's --use-fake-device-for-media-stream actually emits (observed near-silent in the
// live-mic Playwright check, which is a mic-fixture question, not a DSP-correctness one).
import { detectPitchYin } from "../src/lib/guitar/pitch-detection";
import { createPitchStabilizer } from "../src/lib/guitar/pitch-stabilizer";
import { chromaFromSpectrum, scoreAgainstChord, CHORD_MATCH_PASS_THRESHOLD } from "../src/lib/guitar/chord-detection";
import { chordById, CHORDS } from "../src/lib/guitar/chords-data";
import { describeFrequency } from "../src/lib/guitar/notes";

const SAMPLE_RATE = 44100;

function sineBuffer(freq: number, length: number, sampleRate: number): Float32Array {
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i++) buf[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate);
  return buf;
}

// A real plucked string isn't a pure tone — it's a fundamental plus a decaying harmonic
// series, often picked up with mic self-noise and a slight amplitude decay even within one
// analysis window. This generator stresses the algorithm against all of that at once.
function pluckedStringBuffer(opts: {
  freq: number; length: number; sampleRate: number;
  harmonicAmps?: number[]; noiseLevel?: number; decayPerSample?: number; vibratoHz?: number; vibratoCents?: number;
}): Float32Array {
  const { freq, length, sampleRate, harmonicAmps = [1, 0.5, 0.33, 0.25, 0.2], noiseLevel = 0, decayPerSample = 0, vibratoHz = 0, vibratoCents = 0 } = opts;
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const vibratoMod = vibratoHz > 0 ? Math.sin((2 * Math.PI * vibratoHz * i) / sampleRate) * (vibratoCents / 1200) : 0;
    const instFreq = freq * Math.pow(2, vibratoMod);
    let sample = 0;
    for (let h = 0; h < harmonicAmps.length; h++) {
      sample += harmonicAmps[h] * Math.sin((2 * Math.PI * instFreq * (h + 1) * i) / sampleRate);
    }
    const envelope = Math.exp(-decayPerSample * i);
    sample *= envelope;
    if (noiseLevel > 0) sample += (Math.random() * 2 - 1) * noiseLevel;
    buf[i] = sample;
  }
  return buf;
}

function centsError(detectedHz: number, trueHz: number): number {
  return 1200 * Math.log2(detectedHz / trueHz);
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

// Cents-precision bar: a tuner claiming "perfect" accuracy needs sub-cent error on a clean
// signal and comfortably-under-1-cent (a listener's/luthier's practical tolerance) on a
// realistic plucked-string signal — not just "within 1Hz", which is a much looser bar at
// higher frequencies (1Hz at 330Hz is ~5 cents, nowhere near "perfect").
console.log("\n=== Cents-level precision (the real precision bar) ===");
for (const freq of [82.41, 110, 146.83, 196, 246.94, 329.63, 440]) {
  const buf = sineBuffer(freq, 4096, SAMPLE_RATE);
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  check(`${freq}Hz pure tone within 0.1 cent`, r !== null && Math.abs(cents) < 0.1, `${cents.toFixed(4)} cents off`);
}

// Realistic plucked-string timbre: fundamental + 4 decaying harmonics, no noise/decay/vibrato
// yet — isolates whether harmonic content alone confuses the fundamental estimate.
console.log("\n=== Realistic timbre (fundamental + harmonics) ===");
for (const freq of [82.41, 110, 146.83, 196, 246.94, 329.63]) {
  const buf = pluckedStringBuffer({ freq, length: 4096, sampleRate: SAMPLE_RATE, harmonicAmps: [1, 0.6, 0.4, 0.25, 0.15] });
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  check(`${freq}Hz + harmonics within 1 cent`, r !== null && Math.abs(cents) < 1, `${cents.toFixed(3)} cents off`);
}

// Weak-fundamental stress case: the classic YIN failure mode is an octave-down error when
// the 2nd harmonic is STRONGER than the fundamental (common on some guitar/mic combos).
console.log("\n=== Weak-fundamental octave-error stress test ===");
for (const freq of [82.41, 110, 146.83]) {
  const buf = pluckedStringBuffer({ freq, length: 4096, sampleRate: SAMPLE_RATE, harmonicAmps: [0.4, 1, 0.5, 0.3] });
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  const isOctaveError = r !== null && Math.abs(Math.abs(cents) - 1200) < 5;
  check(`${freq}Hz weak-fundamental: no octave error`, r !== null && Math.abs(cents) < 2 && !isOctaveError, `${cents.toFixed(3)} cents off${isOctaveError ? " (OCTAVE ERROR)" : ""}`);
}

// Noisy signal: -34dB-ish white noise floor mixed in (a realistic phone-mic self-noise level).
console.log("\n=== Noisy signal (realistic mic self-noise) ===");
for (const freq of [110, 196, 329.63]) {
  const buf = pluckedStringBuffer({ freq, length: 4096, sampleRate: SAMPLE_RATE, harmonicAmps: [1, 0.5, 0.3], noiseLevel: 0.02 });
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  check(`${freq}Hz with mic noise within 2 cents`, r !== null && Math.abs(cents) < 2, `${cents.toFixed(3)} cents off`);
}

// Decaying amplitude within the analysis window — a real pluck is already decaying by the
// time a 93ms window (4096 samples @ 44.1kHz) captures it.
console.log("\n=== Decaying amplitude within the window ===");
for (const freq of [110, 196]) {
  const buf = pluckedStringBuffer({ freq, length: 4096, sampleRate: SAMPLE_RATE, harmonicAmps: [1, 0.5, 0.3], decayPerSample: 0.0003 });
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  check(`${freq}Hz decaying envelope within 1 cent`, r !== null && Math.abs(cents) < 1, `${cents.toFixed(3)} cents off`);
}

// Slight vibrato — the instantaneous frequency sweeps a few cents within the window; the
// algorithm should land near the time-averaged center, not get thrown off entirely.
console.log("\n=== Slight vibrato ===");
for (const freq of [146.83, 220]) {
  const buf = pluckedStringBuffer({ freq, length: 4096, sampleRate: SAMPLE_RATE, harmonicAmps: [1, 0.5, 0.3], vibratoHz: 5, vibratoCents: 8 });
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  check(`${freq}Hz with light vibrato within 10 cents`, r !== null && Math.abs(cents) < 10, `${cents.toFixed(3)} cents off`);
}

// THE ACTUAL PRODUCTION BUFFER SIZE: useGuitarAudio's TIME_FFT_SIZE is 2048, not the 4096
// used above for headroom in the other tests. A smaller window means fewer periods of a low
// note to average over, so precision must be re-proven at the real size, not just a
// generous one — this is the number that actually ships.
console.log("\n=== Production buffer size (2048 samples) — realistic signal ===");
for (const freq of [82.41, 110, 146.83, 196, 246.94, 329.63]) {
  const buf = pluckedStringBuffer({ freq, length: 2048, sampleRate: SAMPLE_RATE, harmonicAmps: [1, 0.5, 0.3], noiseLevel: 0.015 });
  const r = detectPitchYin(buf, SAMPLE_RATE);
  const cents = r ? centsError(r.frequency, freq) : NaN;
  check(`${freq}Hz @ 2048 samples, realistic signal, within 2 cents`, r !== null && Math.abs(cents) < 2, `${cents.toFixed(3)} cents off`);
}

// 2) describeFrequency note naming sanity.
console.log("\n=== Pitch stabilizer ===");
{
  const s = createPitchStabilizer();
  let last: number | null = null;
  for (let i = 0; i < 6; i++) last = s.push(110); // settle on A2
  check("stabilizer settles on a steady tone", last !== null && Math.abs(last - 110) < 0.01, `${last}`);

  const glitched = s.push(110 * 1.9); // one bad frame — not a clean octave, not a confirmed jump yet
  check("single unconfirmed glitch frame doesn't change the display yet", glitched !== null && Math.abs(glitched - 110) < 0.01, `${glitched}`);
  const confirmed = s.push(110 * 1.9); // a second frame agreeing — now it's a real jump
  check("a second confirming frame commits the jump", confirmed !== null && Math.abs(confirmed - 110 * 1.9) < 0.01, `${confirmed}`);

  const s2 = createPitchStabilizer();
  for (let i = 0; i < 6; i++) s2.push(110);
  const octaveGlitch = s2.push(55.1); // one frame mistakenly detected an octave down
  check("clean octave-down glitch gets corrected, not adopted", octaveGlitch !== null && Math.abs(octaveGlitch - 110) < 1, `${octaveGlitch}`);

  const s3 = createPitchStabilizer();
  for (let i = 0; i < 6; i++) s3.push(110);
  let afterJump: number | null = null;
  for (let i = 0; i < 6; i++) afterJump = s3.push(146.83); // real note change — different string
  check("genuine note change is adopted quickly, not smeared toward the old note", afterJump !== null && Math.abs(afterJump - 146.83) < 0.5, `${afterJump}`);

  const s4 = createPitchStabilizer();
  for (let i = 0; i < 6; i++) s4.push(110);
  const afterOneSilentFrame = s4.push(null);
  check("one silent frame doesn't wipe the display instantly", afterOneSilentFrame !== null && Math.abs(afterOneSilentFrame - 110) < 1, `${afterOneSilentFrame}`);
}

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
