// Shared AI-grounding builder for both the lesson-prep chat (/api/rca-chat) and the
// understanding-check quiz (/api/rca-understanding) — one place that knows how to
// describe a class + its current lesson to the model.

import { getRcaClass, rcaClasses, rcaSchedule, currentLessonNumber, isPacingCurrent, getNextScheduleItem, centralToday } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { todaysLessonNumber } from "@/lib/rca-content/types";
import { getCatechismLessonsForWeekText } from "@/lib/rca-content/baltimore-catechism-guide";
import { phonograms } from "@/lib/rca-content/phonogram-sounds";
import { latinNouns, sumConjugation, amoConjugation, latinAdjectives, latinNumbers, pronunciationRules } from "@/lib/rca-content/latin-core";

// Real per-subject reference content, keyed to the SAME week/lesson text
// already resolved below — this is what actually fixes generated quiz/
// flashcard content being wrong (Jacob, 2026-08-24: "baltimore catechism
// questions arent the right ones... latin is ok but needs to be better").
// Before this, buildClassGrounding only ever handed the model a terse
// pacing line like "Lesson 15 #188-189, 191-192, & 197" with zero
// indication of what those questions ARE — the model had no choice but to
// guess/hallucinate plausible-sounding content. Now it gets the real thing:
// the actual public-domain Baltimore Catechism No. 2 text (already built,
// see baltimore-catechism.ts), the real phonogram sounds (phonogram-
// sounds.ts), and the real Latin vocab/pronunciation (latin-core.ts) — all
// content that already existed in the app for reference pages/Sound Studio
// but was never actually fed to the AI generator.
function buildSubjectReferenceBlock(subjectId: string, weekText: string): string {
  if (subjectId === "religion-6") {
    // Deliberately NOT baltimore-catechism.ts's "No. 2" edition — its
    // numbering doesn't match RCA's own citations (found live 2026-08-24:
    // RCA says "Lesson 15 #195 — The Ten Commandments," but No. 2's real
    // Q195 is about contrition, a different edition's numbering). This uses
    // the edition actually verified to match (see baltimore-catechism-
    // guide.ts's own header comment for the full story).
    const guides = getCatechismLessonsForWeekText(weekText);
    if (guides.length === 0) return "";
    const blocks = guides
      .map((guide) => `Lesson ${guide.n} — "${guide.title}":\n${guide.topics.map((t) => `- (Q${t.qRange}) ${t.topic}: ${t.content}`).join("\n")}`)
      .join("\n\n");
    return `\nREAL BALTIMORE CATECHISM CONTENT for the lesson(s) actually referenced this week — ground every generated question/answer in THIS, not a guess:\n${blocks}\n`;
  }
  if (subjectId === "first-form-latin-6") {
    const vocab = latinNouns.slice(0, 10).map((v) => `${v.latin} = ${v.english}`).join(", ");
    const numbers = latinNumbers.map((v) => `${v.latin} = ${v.english}`).join(", ");
    const sum = sumConjugation.map((v) => `${v.latin} = ${v.english}`).join(", ");
    const amo = amoConjugation.map((v) => `${v.latin} = ${v.english}`).join(", ");
    const adj = latinAdjectives.slice(0, 6).map((v) => `${v.latin} = ${v.english}`).join(", ");
    const pron = pronunciationRules.slice(0, 5).map((r) => `${r.letter}: ${r.ecclesiastical}`).join("; ");
    return `\nREAL LATIN CONTENT (ecclesiastical pronunciation, what RCA teaches) — ground every generated question in THIS real vocab/grammar, not invented forms:\nNouns: ${vocab}\nsum (to be): ${sum}\namo (to love): ${amo}\nAdjectives: ${adj}\nNumbers 1-10: ${numbers}\nPronunciation notes: ${pron}\n`;
  }
  if (subjectId === "loe-essentials-c") {
    const sample = phonograms.slice(0, 15).map((p) => `${p.spelling} = ${p.sounds.map((s) => `${s.ipa} (${s.keyword})${s.note ? ` [${s.note}]` : ""}`).join(" / ")}`).join("\n");
    return `\nREAL PHONOGRAM SOUNDS (LOE) — every phonogram can say MULTIPLE sounds, always in this fixed order; get the count and order right (e.g. "i" has 3 real sounds, not 2):\n${sample}\n`;
  }
  return "";
}

const CURRENT_CONTENT_NOTE =
  "This class's lesson content below is from RCA's real 2026-2027 curriculum doc (arrived 2026-08-12), not a placeholder — dates/pacing are this year's.";

function buildScheduleNote(): string {
  const next = getNextScheduleItem();
  if (next.kind === "event") {
    const when = next.isToday ? "TODAY" : next.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
    // Pre-term events (training/setup days) mean there's no regular teaching
    // pattern yet at all. Events DURING the term (e.g. the monthly Lead Tutor
    // Staff Meeting) only replace ONE day — saying "this is training/setup
    // week" for those was actively wrong mid-year and made the assistant tell
    // Jacob a completely normal teaching day was a training week (found
    // 2026-08-30).
    if (next.date < termStart) {
      return `SCHEDULE NOTE: This is training/setup week, not normal teaching — ${when} is "${next.label}" (${next.time}). ${next.detail} Regular Mon/Thu teaching starts ${rcaSchedule.termStart}. If Jacob asks about "today" or "next class," answer from this real event, not the generic Mon/Thu pattern.`;
    }
    return `SCHEDULE NOTE: ${when} is "${next.label}" (${next.time}) — this REPLACES Jacob's normal teaching on that one day only; regular Mon/Thu teaching continues on every other day, before and after it. ${next.detail} If Jacob asks about "today" or "next class" and the date in question is ${when}, answer from this real event. Otherwise (any other day, including "tomorrow" if it isn't ${when}), the normal Mon/Thu class pattern still applies — do not describe the whole week as training/setup.`;
  }
  if (next.kind === "closure") {
    // Added when getNextScheduleItem() gained this variant (2026-08-13) —
    // without this branch, a closure day silently fell through to "", so
    // the assistant had zero signal that today's actually a break and
    // could wrongly imply Jacob is teaching when he's not.
    const estimatedNote = next.estimated ? " (estimated — RCA's real 2026-2027 academic calendar hasn't been confirmed yet, so treat the exact dates as reasoned, not certain)" : "";
    return `SCHEDULE NOTE: Today is "${next.label}" — RCA is closed, no class${estimatedNote}. If Jacob asks about "today" or "next class," tell him it's a closure day, not a normal Mon/Thu teaching day.`;
  }
  if (next.kind === "term-ended") {
    return `SCHEDULE NOTE: The 2026-2027 term ended ${rcaSchedule.termEnd} — there is no "next teaching day" to compute. If Jacob asks about today or next class, tell him the school year is over rather than guessing a Mon/Thu date.`;
  }
  if (next.kind === "teaching") {
    // A plain normal teaching day with nothing overriding it — spell out
    // exactly which classes meet that day (rcaClasses is already ordered by
    // block time) instead of leaving the model to infer/filter the full
    // class list itself by day, which is where "what's tomorrow" answers
    // used to go vague or wrong.
    const when = next.isToday ? "TODAY" : next.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    const weekday = next.date.toLocaleDateString("en-US", { weekday: "long" }) as "Monday" | "Thursday";
    const classList = rcaClasses
      .filter((c) => (c.days ?? rcaSchedule.days).includes(weekday))
      .map((c) => `- ${c.name}${c.block ? ` — ${c.block}` : ""}${c.room ? `, ${c.room}` : ""}`)
      .join("\n");
    return `SCHEDULE NOTE: ${when} is a normal teaching day (${weekday}), nothing overrides it. In order, Jacob teaches:\n${classList}\nIf Jacob asks about "today"/"tomorrow"/"next class" and it lands on ${when}, use this real list — don't guess which classes meet that day.`;
  }
  return "";
}

// The model has no innate sense of "today" — without this line it has to
// infer "tomorrow"/"this week" purely from the schedule note's event dates,
// which caused it to mistake a staff meeting days away for literally
// "tomorrow" (found 2026-08-30). Always compute this fresh, never cached.
function todayDateLine(): string {
  const now = centralToday();
  const formatted = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return `TODAY'S REAL DATE: ${formatted}. "Tomorrow" always means ${tomorrowFormatted} — compute "today"/"tomorrow"/"this week" from THIS real date, never from whatever date the schedule note below happens to mention.`;
}

function buildGeneralGrounding(): string {
  const list = rcaClasses
    .map((c) => `- ${c.name} (${c.grade}, ${c.area})${c.block ? ` — ${(c.days ?? rcaSchedule.days).join("/")}, ${c.block}${c.room ? `, ${c.room}` : ""}` : ""}`)
    .join("\n");
  const scheduleNote = buildScheduleNote();
  return `${todayDateLine()}\n\nCONTEXT: Regina Caeli Academy (KSC, Overland Park KS) — a Catholic classical homeschool hybrid. Jacob is the 6th Grade Lead plus Music 3-4 tutor, on campus ${rcaSchedule.days.join(" & ")} (his real teaching days/deadlines once the term starts) ${rcaSchedule.startTime}-${rcaSchedule.endTime}. He's not currently viewing a specific class page, so answer generally across his full teaching load unless he names a subject.\n\n${scheduleNote}\n\nHIS CLASSES:\n${list}\n\n${CURRENT_CONTENT_NOTE}`;
}

// `lessonNOverride` lets a caller ground on a SPECIFIC past lesson instead of
// wherever the schedule currently sits — used by the cross-class review picker,
// which re-quizzes an earlier lesson independent of today's date.
export function buildClassGrounding(subjectId: string | undefined, lessonNOverride?: number): string {
  if (!subjectId || subjectId === "general") return buildGeneralGrounding();

  const cls = getRcaClass(subjectId);
  if (!cls) return buildGeneralGrounding();

  const meetDays = (cls.days ?? rcaSchedule.days).join(" & ");
  let grounding = `${todayDateLine()}\n\nCLASS: ${cls.name} (${cls.grade}, ${cls.area}) at Regina Caeli Academy — a Catholic classical homeschool hybrid. Jacob (the tutor) meets this class ${meetDays}${cls.block ? `, ${cls.block}` : ""}${cls.room ? ` in ${cls.room}` : ""} as part of his on-campus schedule.\nSUMMARY: ${cls.summary}\n`;
  const scheduleNote = buildScheduleNote();
  if (scheduleNote) grounding += `\n${scheduleNote}\n`;
  if (cls.books.length) grounding += `BOOKS: ${cls.books.join(", ")}\n`;

  const content = rcaContent[cls.id];
  if (content) {
    // Same weekday-correction as LessonViewer/rca/today — currentLessonNumber's
    // raw estimate can land on the right week but the wrong day for subjects
    // like Saxon that pace one lesson per calendar day, which would have had
    // the AI assistant confidently teaching from the wrong day's lesson.
    const n = lessonNOverride && lessonNOverride >= 1 && lessonNOverride <= content.lessons.length
      ? lessonNOverride
      : todaysLessonNumber(content, currentLessonNumber(content.lessons.length, content.totalWeeks), centralToday().toLocaleDateString("en-US", { weekday: "long" }));
    const lesson = content.lessons.find((l) => l.n === n);
    const label = lessonNOverride ? "REVIEW LESSON" : "CURRENT LESSON";
    grounding += `\n${content.overview}\n\n${label} (Lesson ${n} of ${content.lessons.length}):\n`;
    if (lesson) {
      for (const s of lesson.sections) grounding += `${s.label}: ${s.text}\n`;
      if (lesson.note) grounding += `Note: ${lesson.note}\n`;
    }
    const weekText = lesson ? lesson.sections.map((s) => s.text).join(" ") : "";
    grounding += buildSubjectReferenceBlock(cls.id, weekText);
    const pacingWeeks = content.totalWeeks ?? content.lessons.length;
    if (!lessonNOverride && !isPacingCurrent(pacingWeeks)) {
      grounding += `\nPACING NOTE: This subject's documented pacing only covers the first ${pacingWeeks} weeks of the term — the "CURRENT LESSON" above is actually just the LAST one available, not necessarily what's really being taught this week. If Jacob asks what's happening "this week" or "today," say the real weekly plan isn't loaded yet rather than presenting this lesson as current.\n`;
    }
    grounding += `\n${CURRENT_CONTENT_NOTE}`;
  } else if (cls.lessonPlanUrl) {
    grounding += `\nFull lesson plan content hasn't been pulled into this app yet — the master doc lives at ${cls.lessonPlanUrl}. Answer from general knowledge of the subject/grade level and RCA's classical, Catholic approach, and say so if asked something only the doc would answer.\n`;
  }

  return grounding;
}
