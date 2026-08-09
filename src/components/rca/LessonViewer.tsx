"use client";

import { useState } from "react";
import type { SubjectContent } from "@/lib/rca-content/types";
import { currentLessonNumber } from "@/lib/rca";

export default function LessonViewer({ content }: { content: SubjectContent }) {
  const total = content.lessons.length;
  const [n, setN] = useState(() => currentLessonNumber(total, content.totalWeeks));
  const lesson = content.lessons.find((l) => l.n === n);

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>{content.overview}</p>

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
        <button
          onClick={() => setN((v) => Math.min(total, v + 1))}
          disabled={n >= total}
          className="text-sm px-2 py-1 rounded disabled:opacity-30"
          style={{ color: "#3f7ea6" }}
        >
          Next →
        </button>
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
