"use client";

import type { SubjectContent } from "@/lib/rca-content/types";
import { todaysLessonNumber } from "@/lib/rca-content/types";
import { currentLessonNumber, isPacingCurrent } from "@/lib/rca";
import { useRcaPacingOffsets } from "@/lib/rca-pacing-client";

// The lesson-number + key-points block on /rca/today, as its own client island
// so it can apply the same persisted pacing offset LessonViewer uses (see
// /api/rca-pacing) — otherwise a correction made on a class's detail page
// wouldn't be reflected on the whiteboard-cram day view, which defeats the
// point of correcting it in the first place.
export default function PacedLesson({ classId, content, weekday }: { classId: string; content: SubjectContent; weekday: string }) {
  const total = content.lessons.length;
  const rawEstimate = todaysLessonNumber(content, currentLessonNumber(total, content.totalWeeks), weekday);
  const { offsets } = useRcaPacingOffsets();
  const n = Math.min(total, Math.max(1, rawEstimate + (offsets[classId] ?? 0)));
  const lesson = content.lessons.find((l) => l.n === n);
  const stale = !isPacingCurrent(content.totalWeeks ?? total);

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
    </>
  );
}
