"use client";

import { useState } from "react";
import { riemannContent } from "@/lib/riemann-content";
import RiemannUnderstandingCheck from "./RiemannUnderstandingCheck";

// Spaced resurfacing — lets Jacob re-quiz ANY earlier lesson independent of where he
// currently is, instead of a concept only being tested once and then never again.
// Reuses RiemannUnderstandingCheck as-is (it already takes lessonN); the `key` forces
// a clean remount whenever the picked lesson changes.
export default function ReviewPicker({ currentLessonN }: { currentLessonN: number }) {
  const [reviewN, setReviewN] = useState<number | null>(null);
  const total = riemannContent.lessons.length;

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#1c2440", border: "1px solid #2a3358" }}>
      <h2 className="text-sm font-semibold mb-2" style={{ color: "#e0c07a" }}>Review an earlier lesson</h2>
      <p className="text-xs mb-3" style={{ color: "#8b93c4" }}>
        Old concepts fade if you never revisit them — pick any lesson you've already done and re-quiz yourself on it.
      </p>
      <select
        value={reviewN ?? ""}
        onChange={(e) => setReviewN(e.target.value ? Number(e.target.value) : null)}
        className="w-full rounded-lg px-3 py-2 text-sm mb-3"
        style={{ background: "#141a2e", border: "1px solid #2a3358", color: "#e6e6f0" }}
      >
        <option value="">Pick a lesson to review…</option>
        {Array.from({ length: total }, (_, i) => i + 1)
          .filter((n) => n <= currentLessonN)
          .map((n) => (
            <option key={n} value={n}>
              Lesson {n}
            </option>
          ))}
      </select>

      {reviewN !== null && <RiemannUnderstandingCheck key={reviewN} lessonN={reviewN} />}
    </div>
  );
}
