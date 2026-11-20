// Chord progressions for play-along practice. Chord progressions/names are facts, not
// copyrightable expression — these are generic skeletons (a 12-bar blues, the ubiquitous
// "four chord song" loop, a I-IV-I-V waltz), not transcriptions of any specific recording's
// melody, lyrics, or arrangement.
export type Song = {
  id: string;
  title: string;
  bpm: number;
  beatsPerMeasure: number;
  /** One chord id per measure, in order. Loops when play-along reaches the end. */
  progression: string[];
  notes: string;
};

export const SONGS: Song[] = [
  {
    id: "blues-a",
    title: "Three-Chord Blues in A",
    bpm: 80,
    beatsPerMeasure: 4,
    progression: ["A7", "A7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"],
    notes: "Standard 12-bar blues form. Once this is steady, try it at 100 and 120 BPM.",
  },
  {
    id: "campfire-progression",
    title: "Campfire Progression (G–D–Em–C)",
    bpm: 90,
    beatsPerMeasure: 4,
    progression: ["G", "D", "Em", "C", "G", "D", "Em", "C"],
    notes: "The most-reused four-chord loop in popular music. Great for strum-pattern practice.",
  },
  {
    id: "folk-waltz-d",
    title: "Folk Waltz in D",
    bpm: 100,
    beatsPerMeasure: 3,
    progression: ["D", "G", "D", "A7", "D", "G", "D", "A7"],
    notes: "3/4 time — one down-strum per beat is enough at first; add a pattern once the chord changes land clean.",
  },
];

export function songById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}
