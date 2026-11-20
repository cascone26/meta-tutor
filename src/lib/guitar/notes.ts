// Note-naming + frequency math shared by the tuner and chord detector. A4 = 440Hz,
// 12-tone equal temperament, pitch class 0 = C (matches standard chroma convention).

export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export type NoteName = (typeof NOTE_NAMES)[number];

const A4 = 440;
const A4_MIDI = 69;

export function frequencyToMidi(freq: number): number {
  return 69 + 12 * Math.log2(freq / A4);
}

export function midiToFrequency(midi: number): number {
  return A4 * Math.pow(2, (midi - A4_MIDI) / 12);
}

export function pitchClassOf(midi: number): number {
  return ((Math.round(midi) % 12) + 12) % 12;
}

export type NoteInfo = {
  name: NoteName;
  octave: number;
  midi: number;
  /** Signed cents offset from the nearest equal-tempered semitone, [-50, 50]. */
  cents: number;
};

export function describeFrequency(freq: number): NoteInfo {
  const exactMidi = frequencyToMidi(freq);
  const nearestMidi = Math.round(exactMidi);
  const cents = Math.round((exactMidi - nearestMidi) * 100);
  const name = NOTE_NAMES[pitchClassOf(nearestMidi)];
  const octave = Math.floor(nearestMidi / 12) - 1;
  return { name, octave, midi: nearestMidi, cents };
}

// Standard tuning, low to high (string 6 -> string 1).
export const STANDARD_TUNING = [
  { string: 6, name: "E2", midi: 40 },
  { string: 5, name: "A2", midi: 45 },
  { string: 4, name: "D3", midi: 50 },
  { string: 3, name: "G3", midi: 55 },
  { string: 2, name: "B3", midi: 59 },
  { string: 1, name: "E4", midi: 64 },
] as const;

export function closestString(freq: number) {
  const midi = frequencyToMidi(freq);
  let best: (typeof STANDARD_TUNING)[number] = STANDARD_TUNING[0];
  let bestDist = Infinity;
  for (const s of STANDARD_TUNING) {
    const d = Math.abs(s.midi - midi);
    if (d < bestDist) {
      bestDist = d;
      best = s;
    }
  }
  return best;
}
