"use client";

import { useState } from "react";
import RiemannLessonViewer from "@/components/riemann/RiemannLessonViewer";
import RiemannUnderstandingCheck from "@/components/riemann/RiemannUnderstandingCheck";
import ReviewPicker from "@/components/riemann/ReviewPicker";

export default function RiemannPage() {
  const [lessonN, setLessonN] = useState(1);

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#e6e6f0" }}>The Riemann Hypothesis</h1>
      <p className="text-sm mb-6" style={{ color: "#8b93c4" }}>
        A self-paced course from zero background to real conceptual understanding — no prior math beyond arithmetic and basic algebra required.
      </p>

      <RiemannLessonViewer onLessonChange={setLessonN} />
      <RiemannUnderstandingCheck lessonN={lessonN} />
      {lessonN > 1 && <ReviewPicker currentLessonN={lessonN - 1} />}
    </div>
  );
}
