import { rcaClasses, currentLessonNumber, CLT_TESTING_WEEK, centralToday } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { todaysLessonNumber } from "@/lib/rca-content/types";

// Assessments (Test/Investigation/Homework Check) and one-off coordination notes
// (May Crowning, Field Day) already exist as real dated content inside each
// subject's lessons — they just weren't surfaced anywhere ahead of time, so
// Jacob got zero lead time to prep for them or coordinate with other tutors.
// This scans forward from today's estimated lesson and pulls them out.
const KEYWORD_RE = /\b(test|investigation|homework check|crowning|field day)\b/i;
const LOOKAHEAD_LESSONS = 6; // ~3 weeks for twice-weekly subjects

export type UpcomingHit = {
  classId: string;
  className: string;
  lessonN: number;
  lessonsAway: number;
  snippet: string;
};

function firstMatch(text: string): string | null {
  const m = KEYWORD_RE.exec(text);
  if (!m) return null;
  // Trim to a readable sentence-ish snippet around the match rather than the whole block.
  const sentences = text.split(/(?<=[.!?])\s+/);
  const hit = sentences.find((s) => KEYWORD_RE.test(s));
  return (hit || text).trim();
}

export function getUpcomingHighlights(today: Date = centralToday()): UpcomingHit[] {
  const hits: UpcomingHit[] = [];

  for (const cls of rcaClasses) {
    const content = rcaContent[cls.id];
    if (!content) continue;
    const total = content.lessons.length;
    const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
    const estimate = todaysLessonNumber(content, currentLessonNumber(total, content.totalWeeks, today), weekday);

    for (let n = estimate; n <= Math.min(total, estimate + LOOKAHEAD_LESSONS); n++) {
      const lesson = content.lessons.find((l) => l.n === n);
      if (!lesson) continue;
      const texts = [lesson.note, ...lesson.sections.map((s) => s.text)].filter(Boolean) as string[];
      for (const t of texts) {
        const snippet = firstMatch(t);
        if (snippet) {
          hits.push({ classId: cls.id, className: cls.name, lessonN: n, lessonsAway: n - estimate, snippet });
          break; // one hit per lesson is enough — avoid duplicate noise from note + section both matching
        }
      }
    }
  }

  return hits.sort((a, b) => a.lessonsAway - b.lessonsAway);
}

// Block strings are "H:MM – H:MM AM/PM" (none of RCA's real blocks cross the
// noon boundary) — parsed to sort classes chronologically, since array order
// in rca.ts isn't guaranteed to match real time order. Shared by /rca/today,
// /rca/week, and /rca/substitute so they can't drift from each other.
export function blockStartMinutes(block?: string): number {
  if (!block) return 9999;
  const time = block.match(/^(\d{1,2}):(\d{2})/);
  const period = block.match(/\b(AM|PM)\b/);
  if (!time) return 9999;
  let h = parseInt(time[1], 10);
  const min = parseInt(time[2], 10);
  if (period?.[1] === "PM" && h !== 12) h += 12;
  if (period?.[1] === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

const GRADABLE_RE = /\b(test|investigation|homework check)\b/i;

export type GradableItem = { key: string; lessonN: number; label: string };

// Full-year scan (not just the upcoming window) of every Test/Investigation/
// Homework Check mention in a subject's real content, for the grading
// checklist. `key` is stable across renders/sessions (subjectId + lesson +
// index within lesson) so persisted checkbox state doesn't drift if content
// is re-fetched.
export function getGradableItems(subjectId: string): GradableItem[] {
  const content = rcaContent[subjectId];
  if (!content) return [];
  const items: GradableItem[] = [];

  for (const lesson of content.lessons) {
    const texts = [lesson.note, ...lesson.sections.map((s) => s.text)].filter(Boolean) as string[];
    let idx = 0;
    for (const t of texts) {
      const sentences = t.split(/(?<=[.!?])\s+/).filter((s) => GRADABLE_RE.test(s));
      for (const s of sentences) {
        items.push({ key: `${subjectId}#${lesson.n}#${idx}`, lessonN: lesson.n, label: s.trim() });
        idx++;
      }
    }
  }
  return items;
}

// "if time allows" / "if time" phrasing marks genuinely optional/compressible
// content in RCA's own docs (confirmed present in Saxon 7/6 — 7 real instances,
// not invented). If pacing shows Jacob behind, this points at the nearest one
// forward so there's an actual answer to "what can I skip," not just "you're
// behind."
export function nextFlexibleLesson(subjectId: string, fromLessonN: number): { lessonN: number; label: string } | null {
  const content = rcaContent[subjectId];
  if (!content) return null;
  for (const lesson of content.lessons) {
    if (lesson.n < fromLessonN) continue;
    for (const s of lesson.sections) {
      if (/if time allows|if time\b/i.test(s.text)) {
        return { lessonN: lesson.n, label: s.text };
      }
    }
  }
  return null;
}

export type CltHeadsUp = { daysAway: number; start: string; end: string } | null;

// CLT_TESTING_WEEK is real, dated data that's been sitting unused in rca.ts —
// only worth surfacing once it's close enough to matter (within ~6 weeks), not
// on every page load all year.
export function getCltHeadsUp(today: Date = centralToday()): CltHeadsUp {
  const start = new Date(CLT_TESTING_WEEK.start + "T00:00:00");
  const daysAway = Math.round((start.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (daysAway < 0 || daysAway > 42) return null;
  return { daysAway, start: CLT_TESTING_WEEK.start, end: CLT_TESTING_WEEK.end };
}
