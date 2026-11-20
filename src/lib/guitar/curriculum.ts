// Linear curriculum — one path, each lesson unlocks the next on completion. Deliberately a
// single chain rather than a branching tree: for one learner going at their own pace, a clear
// next-step beats a skill-graph UI to navigate.
export type PracticeType = "read" | "tuning" | "chord-drill" | "transition" | "strum" | "play-along";

export type Module = { id: string; title: string; description: string };

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  objectives: string[];
  chordIds?: string[];
  songId?: string;
  practiceType: PracticeType;
  xp: number;
  /** A named further resource — intentionally just the site's home page, never a deep-linked
   *  video URL we can't verify still resolves. */
  resource?: { label: string; url: string };
};

export const MODULES: Module[] = [
  { id: "fundamentals", title: "Fundamentals", description: "Holding the guitar, tuning, reading chord diagrams." },
  { id: "open-chords", title: "Open Chords", description: "The eight chords that unlock most songs ever written." },
  { id: "seventh-chords", title: "Seventh Chords", description: "Bluesier, jazzier color chords built on the open shapes." },
  { id: "strumming-rhythm", title: "Strumming & Rhythm", description: "Timing and strum patterns — where most beginners actually get stuck." },
  { id: "barre-power", title: "Barre & Power Chords", description: "Moveable shapes — the first real jump in difficulty." },
  { id: "songs", title: "Play-Along Songs", description: "Put it together over a metronome and a real chord progression." },
];

const JUSTINGUITAR = { label: "JustinGuitar", url: "https://www.justinguitar.com" };
const GUITARTRICKS = { label: "GuitarTricks", url: "https://www.guitartricks.com" };
const FENDERPLAY = { label: "Fender Play", url: "https://www.fender.com/play" };

const RAW_LESSONS: Omit<Lesson, "id">[] = [
  { moduleId: "fundamentals", title: "Meet Your Guitar", summary: "Parts of the guitar, how to hold it, which hand does what.", objectives: ["Name the parts: headstock, nut, frets, bridge, soundhole/pickups", "Find a comfortable seated position", "Know fretting hand vs. strumming hand"], practiceType: "read", xp: 10, resource: JUSTINGUITAR },
  { moduleId: "fundamentals", title: "Tune Up", summary: "Standard tuning is E-A-D-G-B-e, low to high. Use the Tuner before every session.", objectives: ["Use the Tuner tool to get all 6 strings in tune", "Recognize sharp vs. flat on the cents meter"], practiceType: "tuning", xp: 10 },
  { moduleId: "fundamentals", title: "Reading Chord Diagrams", summary: "Vertical lines are strings, horizontal lines are frets, dots are where fingers go, X means don't play that string.", objectives: ["Read a diagram in the Chord Library", "Identify open vs. muted strings"], practiceType: "read", xp: 10 },
  { moduleId: "fundamentals", title: "Your First Chord: E minor", summary: "Two fingers, no stretch — the easiest full chord on the guitar.", objectives: ["Fret Em cleanly", "Strum all 6 strings and get a clean ring on each"], chordIds: ["Em"], practiceType: "chord-drill", xp: 15 },

  { moduleId: "open-chords", title: "A Minor", summary: "One finger moves from Em's shape to get Am.", objectives: ["Fret Am cleanly"], chordIds: ["Am"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "open-chords", title: "Em ↔ Am Switch Drill", summary: "The first transition — train your hand to move between two shapes without looking.", objectives: ["Switch Em to Am and back 10 times without buzzing"], chordIds: ["Em", "Am"], practiceType: "transition", xp: 20 },
  { moduleId: "open-chords", title: "E Major", summary: "Add one finger to Em.", objectives: ["Fret E cleanly"], chordIds: ["E"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "open-chords", title: "A Major", summary: "Three fingers in a row on the same fret.", objectives: ["Fret A cleanly without touching the low E string"], chordIds: ["A"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "open-chords", title: "D Major", summary: "A compact triangle shape on the top three strings.", objectives: ["Fret D cleanly", "Mute the low E and A strings"], chordIds: ["D"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "open-chords", title: "D Minor", summary: "One finger moves from D to get its minor cousin.", objectives: ["Fret Dm cleanly"], chordIds: ["Dm"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "open-chords", title: "G Major", summary: "The stretchy one — most beginners' least favorite open chord.", objectives: ["Fret G cleanly without muting the open strings in the middle"], chordIds: ["G"], practiceType: "chord-drill", xp: 20, resource: GUITARTRICKS },
  { moduleId: "open-chords", title: "C Major", summary: "A common trouble spot: keep the low E string muted.", objectives: ["Fret C cleanly", "Avoid hitting the low E string when strumming"], chordIds: ["C"], practiceType: "chord-drill", xp: 20 },
  { moduleId: "open-chords", title: "Cadd9 — the Easier C", summary: "Swap one finger and C gets a lot easier to switch into.", objectives: ["Fret Cadd9 cleanly"], chordIds: ["Cadd9"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "open-chords", title: "Four-Chord Switch Drill: G–C–D–Em", summary: "The progression behind more songs than any other four chords.", objectives: ["Loop G-C-D-Em at a steady tempo without stopping"], chordIds: ["G", "C", "D", "Em"], practiceType: "transition", xp: 25 },

  { moduleId: "seventh-chords", title: "E7", summary: "Lift one finger off E major.", objectives: ["Fret E7 cleanly"], chordIds: ["E7"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "seventh-chords", title: "A7", summary: "Lift one finger off A major.", objectives: ["Fret A7 cleanly"], chordIds: ["A7"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "seventh-chords", title: "D7", summary: "A diamond shape on the top four strings.", objectives: ["Fret D7 cleanly"], chordIds: ["D7"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "seventh-chords", title: "G7", summary: "One finger change from G major.", objectives: ["Fret G7 cleanly"], chordIds: ["G7"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "seventh-chords", title: "C7", summary: "Add the 7th to C major.", objectives: ["Fret C7 cleanly"], chordIds: ["C7"], practiceType: "chord-drill", xp: 15 },
  { moduleId: "seventh-chords", title: "B7", summary: "The trickiest open shape so far — small fingers, tight spacing.", objectives: ["Fret B7 cleanly"], chordIds: ["B7"], practiceType: "chord-drill", xp: 20 },

  { moduleId: "strumming-rhythm", title: "Down Strums & Keeping Time", summary: "Lock a single down-strum per beat to a metronome before adding any pattern.", objectives: ["Hold a steady down-strum at 70 BPM for 1 minute"], practiceType: "strum", xp: 20 },
  { moduleId: "strumming-rhythm", title: "The Down-Up Pattern", summary: "Keep your strumming hand moving on every beat, up-strums included, even when you don't hit all the strings.", objectives: ["Play steady down-up 8th notes at 80 BPM"], practiceType: "strum", xp: 20, resource: FENDERPLAY },
  { moduleId: "strumming-rhythm", title: "Classic Pop Strum: D DU UDU", summary: "The single most common strum pattern in popular music.", objectives: ["Play D-DU-UDU cleanly over a held chord at 90 BPM"], practiceType: "strum", xp: 25 },

  { moduleId: "barre-power", title: "Power Chords: E5 & A5", summary: "Two-finger, root-plus-fifth shapes — no major/minor quality, pure rock rhythm.", objectives: ["Fret E5 and A5 cleanly", "Mute the unused strings"], chordIds: ["E5", "A5"], practiceType: "chord-drill", xp: 20 },
  { moduleId: "barre-power", title: "F Major: Your First Barre Chord", summary: "One finger flattens across all six strings. This is the real jump in difficulty — expect it to take longer than anything before it.", objectives: ["Get a clean barre with at least the top 2 strings ringing", "Work toward all 6 strings ringing clean"], chordIds: ["F"], practiceType: "chord-drill", xp: 30 },

  { moduleId: "songs", title: "Play-Along: Three-Chord Blues in A", summary: "A 12-bar blues using A7, D7, and E7 — the chord-only skeleton under thousands of blues and rock songs.", objectives: ["Follow the 12-bar form without losing the beat", "Land each chord change on the downbeat"], songId: "blues-a", practiceType: "play-along", xp: 30 },
  { moduleId: "songs", title: "Play-Along: Campfire Progression (G–D–Em–C)", summary: "The 'four chord song' progression, looped over a metronome.", objectives: ["Loop the progression cleanly for 4+ rounds", "Keep a steady strum pattern through every change"], songId: "campfire-progression", practiceType: "play-along", xp: 30 },
  { moduleId: "songs", title: "Play-Along: Folk Waltz in D", summary: "3/4 time — a different feel from everything before it.", objectives: ["Feel the 3/4 pulse instead of 4/4", "Switch chords on beat 1 of each measure"], songId: "folk-waltz-d", practiceType: "play-along", xp: 30, resource: GUITARTRICKS },
];

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const LESSONS: Lesson[] = RAW_LESSONS.map((l) => ({ id: slugify(l.title), ...l }));

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function lessonsByModule(moduleId: string): Lesson[] {
  return LESSONS.filter((l) => l.moduleId === moduleId);
}

/** Linear chain: a lesson's prerequisite is simply the lesson before it. First lesson has none. */
export function prereqOf(lessonId: string): string | null {
  const i = LESSONS.findIndex((l) => l.id === lessonId);
  return i <= 0 ? null : LESSONS[i - 1].id;
}

export function nextLesson(lessonId: string): Lesson | null {
  const i = LESSONS.findIndex((l) => l.id === lessonId);
  return i === -1 || i === LESSONS.length - 1 ? null : LESSONS[i + 1];
}

export const TOTAL_XP = LESSONS.reduce((sum, l) => sum + l.xp, 0);
