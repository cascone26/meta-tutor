// Static, plain-English help content — no AI/API calls, just answers written once. Keyed by
// route so the bottom Help sheet always shows what's relevant to whatever page you're on.
export type HelpEntry = { q: string; a: string };

export const HELP_CONTENT: Record<string, HelpEntry[]> = {
  "/guitar": [
    { q: "Where do I start?", a: "Start with Lessons — it's a step-by-step path from your very first chord onward. Everything else (Tuner, Chord Library, Metronome, Play-Along) is there whenever you want to practice something specific on its own." },
    { q: "What's XP and the streak?", a: "XP adds up as you complete lessons — it's just a progress score. The streak counts how many days in a row you've practiced anything at all." },
    { q: "What's \"Today's chord\"?", a: "A different chord is featured each day as a quick warm-up — tap it to jump straight into practicing that one chord." },
  ],
  "/guitar/tuner": [
    { q: "What's \"Guided\" vs \"Chromatic\"?", a: "Guided walks you through all 6 strings one at a time and tells you exactly what to do — start here if you're new. Chromatic just shows whatever note it hears, for anyone who already knows note names and wants to check any string or fret." },
    { q: "What does \"cents\" mean?", a: "A cent is 1/100th of the distance between two notes. 0 cents = perfectly in tune. ±5 cents or less is close enough to call it in tune." },
    { q: "It says I'm hearing the wrong string — what do I do?", a: "Check the diagram on screen — it highlights exactly which string to pluck. If it says it heard a different one, you're probably plucking a neighboring string by accident." },
    { q: "Which way do I turn the tuning peg?", a: "\"Tighten\" raises the pitch (makes it higher/sharper). \"Loosen\" lowers it (makes it lower/flatter). Turn a little at a time and re-pluck — a little turn changes the pitch a lot." },
    { q: "Why isn't it hearing anything?", a: "Make sure you allowed microphone access, that you're in a reasonably quiet room, and that you're plucking one string firmly and letting it ring (not muting it right away)." },
  ],
  "/guitar/chords": [
    { q: "What is a chord diagram?", a: "It's a picture of part of the guitar neck from the front. The vertical lines are strings, the horizontal lines are frets. Dots show where to press down with your fingers." },
    { q: "What do the numbers on the dots mean?", a: "They're a suggested finger to use: 1 = index, 2 = middle, 3 = ring, 4 = pinky." },
    { q: "What do the × and o above the diagram mean?", a: "An o means play that string open (don't press any fret). An × means don't play that string at all — skip it when strumming." },
    { q: "What's a \"barre\" chord?", a: "A chord where one finger presses down multiple strings at once (shown as a bar across the diagram), instead of one finger per string. These take more hand strength and are usually learned after open chords." },
    { q: "What's the difference between major, minor, and 7th chords?", a: "They're different \"flavors\" of the same chord family. Major tends to sound bright/happy, minor sounds darker/sadder, and adding a 7th gives it a bluesier, more unresolved sound." },
    { q: "What's a power chord?", a: "A simple two-note shape (just the root and the 5th) with no major/minor quality — the backbone of rock rhythm guitar. Easier to play than a full chord." },
    { q: "What's the Shuffle Quiz?", a: "It picks chords from the library in random order and has you play each one, using your mic to check — good for testing yourself once you've learned several chords." },
  ],
  "/guitar/lessons": [
    { q: "What does \"locked\" mean?", a: "Lessons unlock in order — finish the one before it to open the next. This keeps you from skipping ahead of skills you actually need." },
    { q: "What's the number next to each unlocked lesson?", a: "That's the XP you'll earn for completing it — just a way to see your progress add up." },
    { q: "What if I'm stuck on a lesson?", a: "Every lesson that needs the mic has a live meter showing how close you are — if a chord or exercise is genuinely too hard right now, come back to it later; the rest of the path will still be there." },
  ],
  "/guitar/play-along": [
    { q: "What's BPM?", a: "Beats Per Minute — how fast the metronome clicks. Lower = slower. Start slow and work up." },
    { q: "What's the difference between \"Play\" and \"Chord Sheet\"?", a: "Play runs a live metronome and shows you the current/next chord in real time. Chord Sheet is just something to read — the whole song's chords laid out by section, no metronome running." },
    { q: "What do Beginner / Easy / Intermediate mean?", a: "A rough difficulty based on how many chords are used and whether any of them are barre chords or fast changes." },
    { q: "What's 4/4 vs 3/4 time?", a: "It's how many beats are in each measure. 4/4 (four beats) is by far the most common feel in popular music. 3/4 is a waltz feel — one-two-three, one-two-three." },
  ],
  "/guitar/metronome": [
    { q: "What's a metronome for?", a: "It clicks at a steady tempo so you can practice keeping time instead of speeding up or slowing down without noticing — one of the most useful practice tools there is." },
    { q: "What's Tap Tempo?", a: "Tap the button a few times in the rhythm you want, and it works out the BPM for you — handy if you have a tempo in your head but don't know the number." },
    { q: "What do 2/4, 3/4, 4/4, 6/4 mean?", a: "The time signature — how many beats are in each measure before it repeats. 4/4 is the most common; 3/4 is a waltz feel." },
  ],
  "/guitar/fretboard": [
    { q: "What is this for?", a: "It shows the name of every note across every string, frets 0 through 12 — a reference for learning where notes actually live on the neck." },
    { q: "What do the numbers along the top mean?", a: "Fret numbers. 0 means the open string (no finger pressing anywhere)." },
    { q: "What are the small dots below some frets?", a: "Those match the position markers (inlays) on a real guitar neck — frets 3, 5, 7, 9, and 12 — handy for finding your place without counting every fret." },
    { q: "What does tapping a note name do?", a: "It highlights every spot on the whole neck where that same note appears — useful for seeing how one note repeats across different strings." },
  ],
  "/guitar/note-trainer": [
    { q: "What's \"Naturals only\" vs \"All 12 notes\"?", a: "Naturals only uses just the 7 \"white key\" notes (no sharps/flats) — easier, good for starting out. All 12 notes includes the sharps too, for a harder version." },
    { q: "What's a sharp (#)?", a: "A note raised by one fret/semitone from a natural note — e.g. C# is one fret higher than C." },
    { q: "Why doesn't it matter which octave I play the note in?", a: "It's checking the note name only (any C counts as C), so you can find it anywhere on the neck, not just one specific spot." },
  ],
  "/guitar/progress": [
    { q: "What's a badge?", a: "A milestone for something specific you've done — like finishing every open-chord lesson, or hitting a 7-day streak. They're all based on things you've actually completed, nothing to manually track." },
    { q: "What's the 30-day grid?", a: "Each filled-in square is a day you practiced something — any lesson, drill, or play-along counts." },
    { q: "What's \"chords that need more reps\"?", a: "Chords you've missed most often during practice — a built-in \"what to drill next\" list." },
  ],
};

const DEFAULT_LESSON_HELP: HelpEntry[] = [
  { q: "What does \"locked\" mean?", a: "Lessons unlock in order — finish the one before it to open the next." },
  { q: "What if the mic isn't picking me up?", a: "Make sure you allowed microphone access and you're plucking firmly in a reasonably quiet room." },
  { q: "What happens when I finish this lesson?", a: "You'll see a checkmark, earn its XP, and the next lesson unlocks automatically." },
];

/** Looks up help content for a pathname, with a sensible fallback for dynamic routes
 *  (e.g. every /guitar/lessons/<slug> gets the same general lesson-help set). */
export function helpForPath(pathname: string): HelpEntry[] {
  if (HELP_CONTENT[pathname]) return HELP_CONTENT[pathname];
  if (pathname.startsWith("/guitar/lessons/")) return DEFAULT_LESSON_HELP;
  return HELP_CONTENT["/guitar"];
}
