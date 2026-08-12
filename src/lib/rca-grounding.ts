// Shared AI-grounding builder for both the lesson-prep chat (/api/rca-chat) and the
// understanding-check quiz (/api/rca-understanding) — one place that knows how to
// describe a class + its current lesson to the model.

import { getRcaClass, rcaClasses, rcaSchedule, currentLessonNumber, getNextScheduleItem } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";

export const STALE_CONTENT_NOTE =
  "IMPORTANT: The lesson content below is transcribed from RCA's 2025-2026 curriculum docs — the 2026-2027 " +
  "versions have not been issued to Jacob yet. Pacing/structure should carry over, but flag to Jacob if he " +
  "asks about specific dates, since those are last year's.";

function buildScheduleNote(): string {
  const next = getNextScheduleItem();
  if (next.kind === "event") {
    const when = next.isToday ? "TODAY" : next.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    return `SCHEDULE NOTE: This is training/setup week, not normal teaching — ${when} is "${next.label}" (${next.time}). ${next.detail} Regular Mon/Thu teaching starts ${rcaSchedule.termStart}. If Jacob asks about "today" or "next class," answer from this real event, not the generic Mon/Thu pattern.`;
  }
  return "";
}

function buildGeneralGrounding(): string {
  const list = rcaClasses.map((c) => `- ${c.name} (${c.grade}, ${c.area})`).join("\n");
  const scheduleNote = buildScheduleNote();
  return `CONTEXT: Regina Caeli Academy (KSC, Overland Park KS) — a Catholic classical homeschool hybrid. Jacob is the 6th Grade Lead plus Music 3-4 tutor, on campus ${rcaSchedule.days.join(" & ")} (his real teaching days/deadlines once the term starts) ${rcaSchedule.startTime}-${rcaSchedule.endTime}. He's not currently viewing a specific class page, so answer generally across his full teaching load unless he names a subject.\n\n${scheduleNote}\n\nHIS CLASSES:\n${list}\n\n${STALE_CONTENT_NOTE}`;
}

// `lessonNOverride` lets a caller ground on a SPECIFIC past lesson instead of
// wherever the schedule currently sits — used by the cross-class review picker,
// which re-quizzes an earlier lesson independent of today's date.
export function buildClassGrounding(subjectId: string | undefined, lessonNOverride?: number): string {
  if (!subjectId || subjectId === "general") return buildGeneralGrounding();

  const cls = getRcaClass(subjectId);
  if (!cls) return buildGeneralGrounding();

  let grounding = `CLASS: ${cls.name} (${cls.grade}, ${cls.area}) at Regina Caeli Academy — a Catholic classical homeschool hybrid. Jacob (the tutor) meets this class Mon & Thu (his real teaching days/deadlines, once the term starts) as part of his on-campus schedule.\nSUMMARY: ${cls.summary}\n`;
  const scheduleNote = buildScheduleNote();
  if (scheduleNote) grounding += `\n${scheduleNote}\n`;
  if (cls.books.length) grounding += `BOOKS: ${cls.books.join(", ")}\n`;

  const content = rcaContent[cls.id];
  if (content) {
    const n = lessonNOverride && lessonNOverride >= 1 && lessonNOverride <= content.lessons.length
      ? lessonNOverride
      : currentLessonNumber(content.lessons.length, content.totalWeeks);
    const lesson = content.lessons.find((l) => l.n === n);
    const label = lessonNOverride ? "REVIEW LESSON" : "CURRENT LESSON";
    grounding += `\n${content.overview}\n\n${label} (Lesson ${n} of ${content.lessons.length}):\n`;
    if (lesson) {
      for (const s of lesson.sections) grounding += `${s.label}: ${s.text}\n`;
      if (lesson.note) grounding += `Note: ${lesson.note}\n`;
    }
    grounding += `\n${STALE_CONTENT_NOTE}`;
  } else if (cls.lessonPlanUrl) {
    grounding += `\nFull lesson plan content hasn't been pulled into this app yet — the master doc lives at ${cls.lessonPlanUrl}. Answer from general knowledge of the subject/grade level and RCA's classical, Catholic approach, and say so if asked something only the doc would answer.\n`;
  }

  return grounding;
}
