"use client";

import { useState } from "react";
import type { SubjectContent } from "@/lib/rca-content/types";
import { lessonWeekday, todaysLessonNumber } from "@/lib/rca-content/types";
import { currentLessonNumber, isPacingCurrent } from "@/lib/rca";
import { ChevronIcon } from "@/components/rca/NatureIcons";

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
  // currentLessonNumber()'s raw estimate can land on the right WEEK but the
  // wrong DAY for weekday-tagged subjects (Saxon-style) — found live on the
  // actual first day of term, where Saxon's initial lesson opened to the
  // Thursday entry while today was Monday. todaysLessonNumber corrects it;
  // it's a no-op for bundled-week subjects where there's no day to correct.
  const [n, setN] = useState(() => {
    const estimate = currentLessonNumber(total, content.totalWeeks);
    const todayWeekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return todaysLessonNumber(content, estimate, todayWeekday);
  });
  const lesson = content.lessons.find((l) => l.n === n);
  // Real 2026-2027 pacing was only pulled for the first `content.totalWeeks`
  // weeks of the term (doc access for the back half 401s as of 2026-08-16).
  // Past that point currentLessonNumber() clamps to the last lesson forever
  // — flag it so "Lesson N" doesn't silently read as this week's real plan.
  const pacingStale = !isPacingCurrent(content.totalWeeks ?? total);
  // The overview is a real paragraph (pacing, tests, breaks) — worth having in
  // full, but showing all of it by default reads as a wall of text sitting
  // between the header and the actual lesson nav. Collapsed to 2 lines with
  // a toggle keeps it scannable without losing anything.
  const [overviewOpen, setOverviewOpen] = useState(false);

  // Find the next lesson that's actually tagged Monday or Thursday (Jacob's
  // real in-center days). If this subject's lessons don't carry weekday tags
  // at all (each lesson already bundles a full Mon+Thu week), just advance
  // one lesson — that IS the next work day for those subjects.
  function nextWorkDayN(from: number): number {
    for (let i = from + 1; i <= total; i++) {
      const l = content.lessons.find((x) => x.n === i);
      if (!l) continue;
      const wd = lessonWeekday(l);
      if (wd === null || wd === "Monday" || wd === "Thursday") return i;
    }
    return total;
  }

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

      {pacingStale && (
        <p className="text-[11px] rounded-lg px-2.5 py-1.5 mb-3" style={{ background: "#fbeee0", color: "#8a5a2a" }}>
          Documented pacing only covers the first {content.totalWeeks} weeks of the term — the lesson below
          is the last one available, not necessarily what&apos;s actually happening this week.
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setN((v) => Math.max(1, v - 1))}
          disabled={n <= 1}
          className="group flex items-center gap-1 text-sm font-medium pl-1.5 pr-2.5 py-1 rounded-full border transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none"
          style={{ color: "#2f5e7a", borderColor: "#d3e2ea", background: "#fff" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3f7ea6"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(63,126,166,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d3e2ea"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <ChevronIcon size={12} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
          Prev
        </button>
        <span className="text-sm font-semibold" style={{ color: "#33402c" }}>Lesson {n} of {total}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setN((v) => Math.min(total, v + 1))}
            disabled={n >= total}
            className="group flex items-center gap-1 text-sm font-medium pl-2.5 pr-1.5 py-1 rounded-full border transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none"
            style={{ color: "#2f5e7a", borderColor: "#d3e2ea", background: "#fff" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3f7ea6"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(63,126,166,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d3e2ea"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Next
            <ChevronIcon size={12} flip className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => setN((v) => nextWorkDayN(v))}
            disabled={n >= total}
            title="Jump to the next lesson that actually falls on a Monday or Thursday (your real in-center days)"
            className="flex items-center gap-0.5 text-xs font-semibold px-2.5 py-1.5 rounded-full disabled:opacity-30 transition-all duration-150"
            style={{ color: "#fff", background: "#3f7ea6", boxShadow: "0 1px 3px rgba(63,126,166,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#356e93"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(63,126,166,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#3f7ea6"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(63,126,166,0.35)"; }}
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
