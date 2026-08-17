// Generic lesson-content schema shared by every RCA subject module, so one
// LessonViewer component + one grounding path in /api/rca-chat works for all of
// them instead of hand-special-casing each subject.

export type LessonSection = { label: string; text: string };

export type Lesson = {
  n: number;
  sections: LessonSection[];
  note?: string;
};

export type SubjectContent = {
  overview: string;
  lessons: Lesson[];
  /** How many RCA teaching weeks these lessons are paced across, if not 1 lesson/week
   * (e.g. Saxon 7/6 is 120 lessons over ~33 weeks). Defaults to lessons.length. */
  totalWeeks?: number;
};

// Moved here from LessonViewer.tsx (2026-08-17) so /rca/today can reuse the
// exact same weekday-matching logic instead of trusting currentLessonNumber's
// raw week-proportional estimate, which picks a lesson correct for "roughly
// how far into the week we are" but not necessarily for TODAY's specific
// weekday. Found live: on literally the first day of term (Monday) Saxon's
// estimate came back as "Lesson 4" — whose own text read "Week 1: Thursday —
// teach new concepts" — right week, wrong day, which would have put the
// wrong lesson on a whiteboard-cram page meant to be trusted at a glance.
//
// Some subjects (Saxon 7/6) pace one lesson PER CALENDAR WEEKDAY (matching
// Saxon's real daily-homework structure), so lesson N doesn't line up with
// Jacob's actual Mon/Thu in-center days at all. Others bundle a whole week's
// Mon+Thu content into ONE lesson entry (e.g. LOE has both a "Monday" and a
// "Thursday" section on the SAME entry) — there's no single weekday to seek,
// every lesson already IS a work day. Distinguish the two by how many
// distinct weekdays show up on the entry: exactly one means single-day
// (Saxon); zero or two+ means a full-week bundle — never skip those.
export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function lessonWeekday(lesson: Lesson): string | null {
  const found = new Set<string>();
  for (const s of lesson.sections) {
    if (WEEKDAYS.includes(s.label)) found.add(s.label);
    const lead = s.text.split(" — ")[0];
    if (WEEKDAYS.includes(lead)) found.add(lead);
  }
  return found.size === 1 ? [...found][0] : null;
}

// Given a subject's proportional currentLessonNumber() estimate, find the
// lesson that actually matches TODAY's specific weekday, searching nearby
// (±6) if the estimate landed on the wrong day within the right week. Falls
// straight through for bundled-week subjects (lessonWeekday returns null —
// there's no "wrong day" to correct) and any estimate that's already right.
export function todaysLessonNumber(content: SubjectContent, estimate: number, todayWeekday: string): number {
  const est = content.lessons.find((l) => l.n === estimate);
  if (!est) return estimate;
  const wd = lessonWeekday(est);
  if (wd === null || wd === todayWeekday) return estimate;
  for (let offset = 1; offset <= 6; offset++) {
    for (const n of [estimate - offset, estimate + offset]) {
      const l = content.lessons.find((x) => x.n === n);
      if (l && lessonWeekday(l) === todayWeekday) return n;
    }
  }
  return estimate;
}
