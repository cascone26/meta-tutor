import { rcaClasses, currentLessonNumber, CLT_TESTING_WEEK } from "@/lib/rca";
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

export function getUpcomingHighlights(today: Date = new Date()): UpcomingHit[] {
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

export type CltHeadsUp = { daysAway: number; start: string; end: string } | null;

// CLT_TESTING_WEEK is real, dated data that's been sitting unused in rca.ts —
// only worth surfacing once it's close enough to matter (within ~6 weeks), not
// on every page load all year.
export function getCltHeadsUp(today: Date = new Date()): CltHeadsUp {
  const start = new Date(CLT_TESTING_WEEK.start + "T00:00:00");
  const daysAway = Math.round((start.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (daysAway < 0 || daysAway > 42) return null;
  return { daysAway, start: CLT_TESTING_WEEK.start, end: CLT_TESTING_WEEK.end };
}
