// Polyphonic chord recognition via chroma (pitch-class) matching. This is the "good enough
// for personal practice" tier, not Yousician's proprietary engine — it answers "does what I
// just strummed look like the target chord," which is the only question a practice tool
// actually needs to answer.
import { ChordShape, chordPitchClassCounts } from "./chords-data";

export type Chroma = Float32Array; // length 12, index 0 = C

const MIN_HZ = 70;
const MAX_HZ = 5000; // include a couple of harmonics past the fretted range — sharpens chroma

/** Build a 12-bin chroma vector from an AnalyserNode's dB magnitude spectrum. */
export function chromaFromSpectrum(dbMagnitudes: Float32Array, sampleRate: number, fftSize: number): Chroma {
  const chroma = new Float32Array(12);
  const binHz = sampleRate / fftSize;
  for (let i = 0; i < dbMagnitudes.length; i++) {
    const freq = i * binHz;
    if (freq < MIN_HZ || freq > MAX_HZ) continue;
    const db = dbMagnitudes[i];
    if (!isFinite(db) || db < -90) continue; // AnalyserNode floor — treat as silence
    const linear = Math.pow(10, db / 20);
    const midi = 69 + 12 * Math.log2(freq / 440);
    const pc = ((Math.round(midi) % 12) + 12) % 12;
    chroma[pc] += linear;
  }
  const max = Math.max(...chroma);
  if (max > 0) for (let i = 0; i < 12; i++) chroma[i] /= max;
  return chroma;
}

// Template weight = how many strings sound that pitch class (not a flat on/off set) so a
// shape that doubles its root (most open chords do) is matched against a chroma shape that
// also naturally has more energy there — see chordPitchClassCounts for why this matters.
function chordTemplate(shape: ChordShape): Chroma {
  const counts = chordPitchClassCounts(shape.frets);
  const template = new Float32Array(12);
  counts.forEach((count, pc) => {
    template[pc] = count;
  });
  const max = Math.max(...template);
  if (max > 0) for (let i = 0; i < 12; i++) template[i] /= max;
  return template;
}

function cosineSimilarity(a: Chroma, b: Chroma): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < 12; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Similarity specifically against one target chord — what the chord trainer actually wants. */
export function scoreAgainstChord(chroma: Chroma, shape: ChordShape): number {
  return cosineSimilarity(chroma, chordTemplate(shape));
}

export const CHORD_MATCH_PASS_THRESHOLD = 0.72;
