// Chord progressions for play-along practice + chord-sheet reading. Chord progressions/names
// are facts, not copyrightable expression — every entry here is a generic skeleton (a 12-bar
// blues, a I-IV-V, a four-chord loop), titled descriptively rather than naming any real
// recording, same convention as the original three songs this file started with.
export type Difficulty = "beginner" | "easy" | "intermediate";

export type SongSection = { label: string; chords: string[] };

export type Song = {
  id: string;
  title: string;
  difficulty: Difficulty;
  key: string;
  bpm: number;
  beatsPerMeasure: number;
  sections: SongSection[];
  /** One chord id per measure, in order — derived from sections, never hand-duplicated.
   *  Loops when play-along reaches the end. */
  progression: string[];
  notes: string;
};

function song(input: Omit<Song, "progression">): Song {
  return { ...input, progression: input.sections.flatMap((s) => s.chords) };
}

export const SONGS: Song[] = [
  song({
    id: "blues-a",
    title: "Three-Chord Blues in A",
    difficulty: "easy",
    key: "A",
    bpm: 80,
    beatsPerMeasure: 4,
    sections: [{ label: "12-Bar Blues", chords: ["A7", "A7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"] }],
    notes: "Standard 12-bar blues form. Once this is steady, try it at 100 and 120 BPM.",
  }),
  song({
    id: "campfire-progression",
    title: "Campfire Progression (G–D–Em–C)",
    difficulty: "beginner",
    key: "G",
    bpm: 90,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["G", "D", "Em", "C", "G", "D", "Em", "C"] }],
    notes: "The most-reused four-chord loop in popular music. Great for strum-pattern practice.",
  }),
  song({
    id: "folk-waltz-d",
    title: "Folk Waltz in D",
    difficulty: "easy",
    key: "D",
    bpm: 100,
    beatsPerMeasure: 3,
    sections: [{ label: "Loop", chords: ["D", "G", "D", "A7", "D", "G", "D", "A7"] }],
    notes: "3/4 time — one down-strum per beat is enough at first; add a pattern once the chord changes land clean.",
  }),
  song({
    id: "two-chord-vamp-em",
    title: "Two-Chord Vamp in E minor",
    difficulty: "beginner",
    key: "Em",
    bpm: 85,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["Em", "D", "Em", "D"] }],
    notes: "The simplest possible loop — just two chords. Perfect first play-along before anything else.",
  }),
  song({
    id: "three-chord-waltz-g",
    title: "Three-Chord Country Waltz in G",
    difficulty: "beginner",
    key: "G",
    bpm: 95,
    beatsPerMeasure: 3,
    sections: [
      { label: "Verse", chords: ["G", "G", "C", "D"] },
      { label: "Chorus", chords: ["G", "C", "G", "D"] },
    ],
    notes: "3/4 time with the three most common open chords.",
  }),
  song({
    id: "minor-ballad-am",
    title: "Minor-Key Ballad in A minor",
    difficulty: "beginner",
    key: "Am",
    bpm: 72,
    beatsPerMeasure: 4,
    sections: [
      { label: "Verse", chords: ["Am", "G", "C", "G"] },
      { label: "Chorus", chords: ["F", "C", "G", "Am"] },
    ],
    notes: "Verse stays in open chords; the chorus introduces the F barre chord — skip it and loop just the verse if you're not there yet.",
  }),
  song({
    id: "island-groove-d",
    title: "Island Groove in D",
    difficulty: "beginner",
    key: "D",
    bpm: 100,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["D", "A", "G", "A"] }],
    notes: "Classic I-V-IV-V — try an island/reggae skank (muted upstrokes) once the changes are clean.",
  }),
  song({
    id: "one-four-five-a",
    title: "Simple I–IV–V in A",
    difficulty: "beginner",
    key: "A",
    bpm: 110,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["A", "A", "D", "E"] }],
    notes: "The most common chord relationship in music, in its simplest open-chord form.",
  }),
  song({
    id: "one-four-five-e",
    title: "Simple I–IV–V in E (with a 7th)",
    difficulty: "easy",
    key: "E",
    bpm: 115,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["E", "E", "A", "B7"] }],
    notes: "Same I-IV-V idea as the A version, but the V chord is a dominant 7th — good B7 practice.",
  }),
  song({
    id: "circle-progression-c",
    title: "Circle Progression in C",
    difficulty: "easy",
    key: "C",
    bpm: 90,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["C", "Am", "Dm", "G"] }],
    notes: "A descending-fifths feel using only open chords — no barre needed.",
  }),
  song({
    id: "reggae-skank-am",
    title: "Reggae Skank in A minor",
    difficulty: "easy",
    key: "Am",
    bpm: 85,
    beatsPerMeasure: 4,
    sections: [
      { label: "Verse", chords: ["Am", "G", "C", "Em"] },
      { label: "Chorus", chords: ["C", "G", "Am", "Am"] },
    ],
    notes: "Try short, muted upstrokes on beats 2 and 4 once the chord changes are solid.",
  }),
  song({
    id: "blues-shuffle-e",
    title: "12-Bar Blues Shuffle in E",
    difficulty: "easy",
    key: "E",
    bpm: 95,
    beatsPerMeasure: 4,
    sections: [{ label: "12-Bar Blues", chords: ["E", "E", "E", "E", "A", "A", "E", "E", "B7", "A", "E", "B7"] }],
    notes: "Same 12-bar form as the A blues, transposed to E — a different fingering feel entirely.",
  }),
  song({
    id: "seventh-turnaround-c",
    title: "Seventh-Chord Turnaround in C",
    difficulty: "intermediate",
    key: "C",
    bpm: 100,
    beatsPerMeasure: 4,
    sections: [{ label: "Turnaround", chords: ["C", "A7", "D7", "G7"] }],
    notes: "A classic jazz/swing turnaround using nothing but dominant 7th chords — real chord-change speed practice.",
  }),
  song({
    id: "power-chord-riff-e",
    title: "Power Chord Rock Riff in E",
    difficulty: "easy",
    key: "E",
    bpm: 120,
    beatsPerMeasure: 4,
    sections: [{ label: "Riff", chords: ["E5", "E5", "A5", "E5"] }],
    notes: "Palm-mute the power chords for a tighter, punchier rock rhythm.",
  }),
  song({
    id: "barre-workout-g",
    title: "Barre Chord Workout in G",
    difficulty: "intermediate",
    key: "G",
    bpm: 85,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["G", "C", "D", "F"] }],
    notes: "Built specifically to drill switching from open chords into the F barre and back.",
  }),
  song({
    id: "minor-blues-am",
    title: "Minor Blues in A minor",
    difficulty: "intermediate",
    key: "Am",
    bpm: 90,
    beatsPerMeasure: 4,
    sections: [{ label: "12-Bar Minor Blues", chords: ["Am", "Am", "Am", "Am", "Dm", "Dm", "Am", "Am", "E7", "Dm", "Am", "E7"] }],
    notes: "The minor-key cousin of the A blues — same 12-bar shape, darker sound.",
  }),
  song({
    id: "fingerstyle-loop-c",
    title: "Fingerstyle Practice Loop in C",
    difficulty: "intermediate",
    key: "C",
    bpm: 75,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["C", "G", "Am", "F"] }],
    notes: "A slower tempo built for picking individual strings instead of strumming — try a simple thumb-alternating bass pattern.",
  }),
  song({
    id: "rockabilly-shuffle-a",
    title: "Rockabilly Shuffle in A",
    difficulty: "intermediate",
    key: "A",
    bpm: 140,
    beatsPerMeasure: 4,
    sections: [{ label: "Loop", chords: ["A", "D", "A", "E"] }],
    notes: "Up-tempo I-IV-I-V — a real test of fast, clean chord changes.",
  }),
];

export function songById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}

export function songsByDifficulty(difficulty: Difficulty): Song[] {
  return SONGS.filter((s) => s.difficulty === difficulty);
}
