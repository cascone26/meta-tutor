// Curated from real git history (`git log -- src/lib/rca-content/ src/lib/rca.ts`) —
// hand-grouped into a readable narrative rather than one entry per commit. Static
// data, not a runtime git call (the deployed app has no .git checkout to read).
// Update this by hand after a meaningful content-refresh session; it doesn't need
// to be exhaustive, just accurate.

export type ChangelogEntry = { date: string; summary: string };

export const rcaChangelog: ChangelogEntry[] = [
  { date: "2026-08-09", summary: "RCA teacher hub built: schedule, all classes, Music 3-4 lesson viewer, AI prep assistant." },
  { date: "2026-08-12", summary: "Fixed a schedule bug claiming staff-training week was normal teaching days. Religion, CLA, Latin, History, Science rebuilt on real 2026-2027 curriculum." },
  { date: "2026-08-13", summary: "Saxon 7/6 and LOE Essentials C rebuilt from real docs. Real block times/rooms added. Calendar view added." },
  { date: "2026-08-16", summary: "Stale pacing now flagged instead of silently shown as current; term-end handled so the schedule stops guessing forever." },
  { date: "2026-08-17", summary: "/rca/today built (whiteboard-cram reference page). All 7 core subjects rebuilt with real per-lesson content. Missing bring-materials (Catechism, BAW, Behold and See) filled in." },
  { date: "2026-08-20", summary: "Real RCA closure dates and term end pulled from the actual center calendar (previously partly estimated)." },
  { date: "2026-08-21", summary: "Baltimore Catechism + Gospel of Mark + Gospel of Luke added in full. Materials Hub given real legitimate-source links for every book. Specials schedule fixed (PE 5-6 moved Mon→Thu). Music 3-4 rebuilt — was running the wrong curriculum year (Year B instead of Year A) since 8/9." },
  { date: "2026-08-21", summary: "Pacing self-correction, upcoming-events surfacing (tests/investigations/HW checks/CLT week), print view, and /rca/week planning page added." },
];
