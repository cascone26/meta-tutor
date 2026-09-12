// One canonical resolver: given a class + the lesson number showing on the
// whiteboard-cram view, return the single "watch for" note Jacob's own physical
// Teacher's Guide flags for that lesson — the one thing most worth remembering
// before he stands up to teach it. Both /rca/today (PacedLesson) and the
// teaching-morning brief (scripts/preclass-brief.mjs → /api/preclass-brief) pull
// from here so the two never drift.
//
// Only the two subjects that have real per-lesson guide content wired in today
// (First Form Latin, Saxon 7/6 — see latin-teacher-guide.ts / saxon-teacher-guide.ts)
// resolve to anything; every other class returns null and simply shows nothing
// extra, exactly as before. This is deliberately additive.
import { latinTeacherGuide } from "./latin-teacher-guide";
import { saxonTeacherGuide } from "./saxon-teacher-guide";

export type WatchFor = {
  title: string;
  watchFor: string;
};

export function getTeacherWatchFor(classId: string, lessonN: number): WatchFor | null {
  if (classId === "first-form-latin-6") {
    const g = latinTeacherGuide.find((x) => x.n === lessonN);
    return g ? { title: g.title, watchFor: g.watchFor } : null;
  }
  if (classId === "saxon-76") {
    // Saxon guide keys are strings ("19", "20", "Investigation 2") and only the
    // genuinely non-trivial lessons are covered — a plain lesson number matches
    // its own key; Investigations never collide with a lesson number.
    const g = saxonTeacherGuide.find((x) => x.key === String(lessonN));
    return g ? { title: g.title, watchFor: g.watchFor } : null;
  }
  return null;
}
