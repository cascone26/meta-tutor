import { STANDARD_TUNING } from "./notes";

// Fret arrays are low-to-high: [string6(E) , string5(A), string4(D), string3(G), string2(B), string1(e)].
// "x" = muted/not played, 0 = open. These are the standard textbook open-chord shapes.
export type FretValue = number | "x";

export type ChordShape = {
  id: string;
  display: string;
  category: "open" | "barre" | "power" | "seventh";
  frets: FretValue[];
  difficulty: 1 | 2 | 3;
};

export const CHORDS: ChordShape[] = [
  { id: "Em", display: "E minor", category: "open", frets: [0, 2, 2, 0, 0, 0], difficulty: 1 },
  { id: "E", display: "E major", category: "open", frets: [0, 2, 2, 1, 0, 0], difficulty: 1 },
  { id: "Am", display: "A minor", category: "open", frets: ["x", 0, 2, 2, 1, 0], difficulty: 1 },
  { id: "A", display: "A major", category: "open", frets: ["x", 0, 2, 2, 2, 0], difficulty: 1 },
  { id: "D", display: "D major", category: "open", frets: ["x", "x", 0, 2, 3, 2], difficulty: 1 },
  { id: "Dm", display: "D minor", category: "open", frets: ["x", "x", 0, 2, 3, 1], difficulty: 1 },
  { id: "G", display: "G major", category: "open", frets: [3, 2, 0, 0, 0, 3], difficulty: 2 },
  { id: "C", display: "C major", category: "open", frets: ["x", 3, 2, 0, 1, 0], difficulty: 2 },
  { id: "Cadd9", display: "C add9", category: "open", frets: ["x", 3, 2, 0, 3, 0], difficulty: 2 },
  { id: "E7", display: "E7", category: "seventh", frets: [0, 2, 0, 1, 0, 0], difficulty: 1 },
  { id: "A7", display: "A7", category: "seventh", frets: ["x", 0, 2, 0, 2, 0], difficulty: 1 },
  { id: "D7", display: "D7", category: "seventh", frets: ["x", "x", 0, 2, 1, 2], difficulty: 2 },
  { id: "G7", display: "G7", category: "seventh", frets: [3, 2, 0, 0, 0, 1], difficulty: 2 },
  { id: "C7", display: "C7", category: "seventh", frets: ["x", 3, 2, 3, 1, 0], difficulty: 2 },
  { id: "B7", display: "B7", category: "seventh", frets: ["x", 2, 1, 2, 0, 2], difficulty: 2 },
  { id: "F", display: "F major (full barre)", category: "barre", frets: [1, 3, 3, 2, 1, 1], difficulty: 3 },
  { id: "E5", display: "E5 (power chord)", category: "power", frets: [0, 2, 2, "x", "x", "x"], difficulty: 1 },
  { id: "A5", display: "A5 (power chord)", category: "power", frets: ["x", 0, 2, 2, "x", "x"], difficulty: 1 },
];

export function chordById(id: string): ChordShape | undefined {
  return CHORDS.find((c) => c.id === id);
}

/** Simplified left-to-right finger assignment (1=index..4=pinky) — not canonical classical
 *  fingering for every shape, just a consistent, always-correct-relative-to-itself guide. */
export function simplifiedFingers(frets: FretValue[]): (number | null)[] {
  let n = 0;
  return frets.map((f) => {
    if (typeof f !== "number" || f === 0) return null;
    n++;
    return Math.min(n, 4);
  });
}

/** How many of the 6 strings sound each pitch class — e.g. open E major doubles the root E
 *  across 3 strings. The chord detector's template is built from this, not a flat on/off set,
 *  because a real (or synthetic-test) strum's chroma amplitude scales with how many strings
 *  actually produce each note — a flat template systematically mismatches any shape with a
 *  doubled root (most open chords), which was verified as a real false-match bug (B7
 *  misidentified as D, E5 as C7) before this fix via scripts/mt-guitar-dsp-test.ts. */
export function chordPitchClassCounts(frets: FretValue[]): Map<number, number> {
  const counts = new Map<number, number>();
  frets.forEach((f, i) => {
    if (f === "x") return;
    const openMidi = STANDARD_TUNING[i].midi;
    const pc = ((openMidi + f) % 12 + 12) % 12;
    counts.set(pc, (counts.get(pc) ?? 0) + 1);
  });
  return counts;
}
