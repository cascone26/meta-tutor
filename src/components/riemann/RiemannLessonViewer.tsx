"use client";

import { useState, useEffect } from "react";
import { riemannContent } from "@/lib/riemann-content";

const PROGRESS_KEY = "riemann-lesson-progress";
const NOTES_KEY_PREFIX = "riemann-notes-";
export const EXPLAIN_DIFFERENTLY_EVENT = "riemann-explain-differently";

// Self-paced, unlike RCA's LessonViewer — no weekly-teaching-schedule interpolation.
// Picks up wherever Jacob last left off, persisted in localStorage.
export default function RiemannLessonViewer({ onLessonChange }: { onLessonChange?: (n: number) => void }) {
  const total = riemannContent.lessons.length;
  const [n, setN] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [notes, setNotes] = useState("");

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

  // Confusion journal — active capture ("still don't get X") beats passive reading,
  // and it's the cheapest possible way to close the "I recognized it, I didn't
  // generate it" gap self-study is most vulnerable to. Private, per-lesson, local.
  useEffect(() => {
    setNotes(localStorage.getItem(NOTES_KEY_PREFIX + n) ?? "");
  }, [n]);

  function updateNotes(value: string) {
    setNotes(value);
    if (value.trim()) localStorage.setItem(NOTES_KEY_PREFIX + n, value);
    else localStorage.removeItem(NOTES_KEY_PREFIX + n);
  }

  function explainDifferently() {
    window.dispatchEvent(new CustomEvent(EXPLAIN_DIFFERENTLY_EVENT, { detail: { lessonN: n } }));
  }

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
        <div className="text-sm space-y-3 mb-4" style={{ color: "#cdd2ec" }}>
          {lesson.sections.map((s) => (
            <p key={s.label}>
              <span className="font-semibold" style={{ color: "#e6e6f0" }}>{s.label}: </span>
              {s.text}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={explainDifferently}
        className="text-xs px-3 py-1.5 rounded-lg mb-4"
        style={{ background: "#232c52", color: "#e0c07a", border: "1px solid #2a3358" }}
      >
        Explain this a different way
      </button>

      <div style={{ borderTop: "1px solid #2a3358" }} className="pt-3">
        <p className="text-xs mb-1.5" style={{ color: "#8b93c4" }}>Still confused about something? Write it down — private, just for you.</p>
        <textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder="e.g. still don't get why the sum diverges for Re(s) ≤ 1…"
          rows={2}
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ background: "#141a2e", border: "1px solid #2a3358", color: "#e6e6f0" }}
        />
      </div>
    </div>
  );
}
