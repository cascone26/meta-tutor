"use client";

import type { SubjectContent } from "@/lib/rca-content/types";
import { todaysLessonNumber } from "@/lib/rca-content/types";
import { currentLessonNumber, isPacingCurrent, centralToday } from "@/lib/rca";
import { useRcaPacingOffsets } from "@/lib/rca-pacing-client";
import { getTeacherWatchFor } from "@/lib/rca-content/teacher-watchfor";

// The lesson-number + key-points block on /rca/today, as its own client island
// so it can apply the same persisted pacing offset LessonViewer uses (see
// /api/rca-pacing) — otherwise a correction made on a class's detail page
// wouldn't be reflected on the whiteboard-cram day view, which defeats the
// point of correcting it in the first place.
export default function PacedLesson({ classId, content, weekday, date }: { classId: string; content: SubjectContent; weekday: string; date?: Date }) {
  const total = content.lessons.length;
  // Must estimate against THIS card's own date, not implicit "real today" —
  // on a multi-day view (e.g. /rca/week showing both Monday and Thursday
  // cards) every card used to fall back to centralToday() regardless of
  // which day it represented, so a card for a few days out could land on
  // last week's pacing (found 2026-09-20: Sunday-rendered Monday card showed
  // the prior week's lesson instead of the upcoming week's). See LessonViewer's
  // referenceDate for the same fix applied to the single-lesson viewer.
  const rawEstimate = todaysLessonNumber(content, currentLessonNumber(total, content.totalWeeks, date ?? centralToday()), weekday);
  const { offsets } = useRcaPacingOffsets();
  const n = Math.min(total, Math.max(1, rawEstimate + (offsets[classId] ?? 0)));
  const lesson = content.lessons.find((l) => l.n === n);
  const stale = !isPacingCurrent(content.totalWeeks ?? total);
  const watch = getTeacherWatchFor(classId, n);

  return (
    <>
      {stale && (
        <p className="text-xs rounded-lg px-2.5 py-1.5 mb-3" style={{ background: "#fbeee0", color: "#8a5a2a" }}>
          Documented pacing has run out — showing the last lesson on file, not necessarily today&apos;s real plan.
        </p>
      )}
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b8e5a" }}>
        Lesson {n} of {total} — key points
      </p>
      {lesson ? (
        <div className="rounded-xl p-3 space-y-2" style={{ background: "#fff", border: "1px solid #e8e4d5" }}>
          {lesson.note && (
            <p className="text-xs font-semibold" style={{ color: "#8a6a45" }}>{lesson.note}</p>
          )}
          {/* Same fix as LessonViewer.tsx: some subjects give every section
              in a lesson the SAME label (real React duplicate-key warning,
              found live 2026-08-24), with the day baked into the text
              itself. Index-based key always; drop the redundant repeated
              label and surface the real day when it's there instead. */}
          {lesson.sections.map((s, i) => {
            const dayMatch = s.text.match(/^([A-Za-z]+)\s+—\s+(.*)$/);
            const allSameLabel = lesson.sections.length > 1 && lesson.sections.every((x) => x.label === lesson.sections[0].label);
            const lineLabel = dayMatch && allSameLabel ? dayMatch[1] : s.label;
            const lineText = dayMatch && allSameLabel ? dayMatch[2] : s.text;
            return (
              <p key={`${i}-${s.label}`} className="text-sm" style={{ color: "#3a4a34" }}>
                <span className="font-semibold" style={{ color: "#33402c" }}>{lineLabel}: </span>
                {lineText}
              </p>
            );
          })}
        </div>
      ) : (
        <p className="text-sm" style={{ color: "#8a9a7c" }}>No lesson content for lesson {n}.</p>
      )}
      {watch && (
        <div className="rounded-xl p-3 mt-2 print:border print:border-solid" style={{ background: "#fdf6ee", border: "1px solid #ecd9bf" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#a97b3a" }}>
            Watch for — {watch.title}
          </p>
          <p className="text-sm" style={{ color: "#6b532b" }}>{watch.watchFor}</p>
        </div>
      )}
    </>
  );
}
