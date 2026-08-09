// Shared AI-grounding builder for both the lesson-prep chat (/api/rca-chat) and the
// understanding-check quiz (/api/rca-understanding) — one place that knows how to
// describe a class + its current lesson to the model.

import { getRcaClass, rcaClasses, rcaSchedule, currentLessonNumber } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";

export const STALE_CONTENT_NOTE =
  "IMPORTANT: The lesson content below is transcribed from RCA's 2025-2026 curriculum docs — the 2026-2027 " +
  "versions have not been issued to Jacob yet. Pacing/structure should carry over, but flag to Jacob if he " +
  "asks about specific dates, since those are last year's.";

function buildGeneralGrounding(): string {
  const list = rcaClasses.map((c) => `- ${c.name} (${c.grade}, ${c.area})`).join("\n");
  return `CONTEXT: Regina Caeli Academy (KSC, Overland Park KS) — a Catholic classical homeschool hybrid. Jacob is the 6th Grade Lead plus Music 3-4 tutor, on campus ${rcaSchedule.days.join(" & ")} (his real teaching days/deadlines) ${rcaSchedule.startTime}-${rcaSchedule.endTime}. He's not currently viewing a specific class page, so answer generally across his full teaching load unless he names a subject.\n\nHIS CLASSES:\n${list}\n\n${STALE_CONTENT_NOTE}`;
}

export function buildClassGrounding(subjectId: string | undefined): string {
  if (!subjectId || subjectId === "general") return buildGeneralGrounding();

  const cls = getRcaClass(subjectId);
  if (!cls) return buildGeneralGrounding();

  let grounding = `CLASS: ${cls.name} (${cls.grade}, ${cls.area}) at Regina Caeli Academy — a Catholic classical homeschool hybrid. Jacob (the tutor) meets this class Mon & Thu (his real teaching days/deadlines) as part of his on-campus schedule.\nSUMMARY: ${cls.summary}\n`;
  if (cls.books.length) grounding += `BOOKS: ${cls.books.join(", ")}\n`;

  const content = rcaContent[cls.id];
  if (content) {
    const n = currentLessonNumber(content.lessons.length, content.totalWeeks);
    const lesson = content.lessons.find((l) => l.n === n);
    grounding += `\n${content.overview}\n\nCURRENT LESSON (Lesson ${n} of ${content.lessons.length}):\n`;
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
