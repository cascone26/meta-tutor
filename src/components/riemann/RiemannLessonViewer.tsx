"use client";

import { useState, useEffect } from "react";
import { riemannContent } from "@/lib/riemann-content";

const PROGRESS_KEY = "riemann-lesson-progress";

// Self-paced, unlike RCA's LessonViewer — no weekly-teaching-schedule interpolation.
// Picks up wherever Jacob last left off, persisted in localStorage.
export default function RiemannLessonViewer({ onLessonChange }: { onLessonChange?: (n: number) => void }) {
  const total = riemannContent.lessons.length;
  const [n, setN] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem(PROGRESS_KEY));
    if (saved >= 1 && saved <= total) setN(saved);
    setHydrated(true);
  }, [total]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PROGRESS_KEY, String(n));
    onLessonChange?.(n);
  }, [n, hydrated, onLessonChange]);

  const lesson = riemannContent.lessons.find((l) => l.n === n);

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#1c2440", border: "1px solid #2a3358" }}>
      <p className="text-xs mb-3" style={{ color: "#8b93c4" }}>{riemannContent.overview}</p>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setN((v) => Math.max(1, v - 1))}
          disabled={n <= 1}
          className="text-sm px-2 py-1 rounded disabled:opacity-30"
          style={{ color: "#e0c07a" }}
        >
          ← Prev
        </button>
        <span className="text-sm font-semibold" style={{ color: "#e6e6f0" }}>Lesson {n} of {total}</span>
        <button
          onClick={() => setN((v) => Math.min(total, v + 1))}
          disabled={n >= total}
          className="text-sm px-2 py-1 rounded disabled:opacity-30"
          style={{ color: "#e0c07a" }}
        >
          Next →
        </button>
      </div>

      {lesson && (
        <div className="text-sm space-y-3" style={{ color: "#cdd2ec" }}>
          {lesson.sections.map((s) => (
            <p key={s.label}>
              <span className="font-semibold" style={{ color: "#e6e6f0" }}>{s.label}: </span>
              {s.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
