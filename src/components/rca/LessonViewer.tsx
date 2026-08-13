"use client";

import { useState } from "react";
import type { SubjectContent } from "@/lib/rca-content/types";
import { currentLessonNumber } from "@/lib/rca";

// Double-chevron — same stroke style as the rest of the icon set, used for
// the "skip to next day of work" jump so it reads as distinct from the
// single-lesson Prev/Next step at a glance, not just a relabeled button.
function DoubleChevronIcon({ size = 14, flip }: { size?: number; flip?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M6 5l6 7-6 7" />
      <path d="M13 5l6 7-6 7" />
    </svg>
  );
}

export default function LessonViewer({ content }: { content: SubjectContent }) {
  const total = content.lessons.length;
  const [n, setN] = useState(() => currentLessonNumber(total, content.totalWeeks));
  const lesson = content.lessons.find((l) => l.n === n);
  // The overview is a real paragraph (pacing, tests, breaks) — worth having in
  // full, but showing all of it by default reads as a wall of text sitting
  // between the header and the actual lesson nav. Collapsed to 2 lines with
  // a toggle keeps it scannable without losing anything.
  const [overviewOpen, setOverviewOpen] = useState(false);

  // RCA meets 2x/week (Mon & Thu, per rcaSchedule.days) — a "day of work" is
  // roughly one week's worth of lessons split across those two sessions, not
  // a single lesson. Mirrors currentLessonNumber()'s own default (1 lesson/
  // week when totalWeeks isn't set) so the jump size stays consistent with
  // how "today's lesson" is computed elsewhere in this station.
  const effectiveWeeks = content.totalWeeks ?? total;
  const lessonsPerDay = Math.max(1, Math.round(total / effectiveWeeks / 2));

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <div className="mb-3">
        <p className={`text-xs ${overviewOpen ? "" : "line-clamp-2"}`} style={{ color: "#8a9a7c" }}>{content.overview}</p>
        <button
          type="button"
          onClick={() => setOverviewOpen((v) => !v)}
          className="text-[11px] font-semibold mt-1"
          style={{ color: "#3f7ea6" }}
        >
          {overviewOpen ? "Show less ↑" : "Show more ↓"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setN((v) => Math.max(1, v - 1))}
          disabled={n <= 1}
          className="text-sm px-2 py-1 rounded disabled:opacity-30"
          style={{ color: "#3f7ea6" }}
        >
          ← Prev
        </button>
        <span className="text-sm font-semibold" style={{ color: "#33402c" }}>Lesson {n} of {total}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setN((v) => Math.min(total, v + 1))}
            disabled={n >= total}
            className="text-sm px-2 py-1 rounded disabled:opacity-30"
            style={{ color: "#3f7ea6" }}
          >
            Next →
          </button>
          <button
            onClick={() => setN((v) => Math.min(total, v + lessonsPerDay))}
            disabled={n >= total}
            title={`Skip ahead ~${lessonsPerDay} lesson${lessonsPerDay === 1 ? "" : "s"} to the next work day (Mon/Thu)`}
            className="flex items-center gap-0.5 text-xs px-2 py-1 rounded-full disabled:opacity-30"
            style={{ color: "#fff", background: "#3f7ea6" }}
          >
            Next work day <DoubleChevronIcon size={13} />
          </button>
        </div>
      </div>

      {lesson && (
        <div className="text-sm space-y-2" style={{ color: "#3a4a34" }}>
          {lesson.note && (
            <p className="text-xs font-semibold" style={{ color: "#8a6a45" }}>{lesson.note}</p>
          )}
          {lesson.sections.map((s) => (
            <p key={s.label}>
              <span className="font-semibold" style={{ color: "#33402c" }}>{s.label}: </span>
              {s.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
