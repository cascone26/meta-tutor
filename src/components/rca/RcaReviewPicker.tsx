"use client";

import { useState } from "react";
import { rcaClasses } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import UnderstandingCheck from "./UnderstandingCheck";
import { LeafIcon } from "./NatureIcons";

// Cross-class spaced review — the RCA equivalent of the Riemann station's
// ReviewPicker. Pick any class + any lesson in it and re-quiz yourself,
// independent of wherever the schedule currently sits.
export default function RcaReviewPicker() {
  const classesWithContent = rcaClasses.filter((c) => c.id in rcaContent);
  const [classId, setClassId] = useState("");
  const [lessonN, setLessonN] = useState<number | null>(null);

  const cls = classesWithContent.find((c) => c.id === classId);
  const content = cls ? rcaContent[cls.id] : null;

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <LeafIcon size={14} />
        Review any class
      </h2>
      <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>
        Old lessons fade if you never revisit them — pick a class and a past lesson to re-quiz yourself.
      </p>

      <div className="flex gap-2 mb-3">
        <select
          value={classId}
          onChange={(e) => {
            setClassId(e.target.value);
            setLessonN(null);
          }}
          className="flex-1 rounded-lg px-3 py-2 text-sm"
          style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
        >
          <option value="">Pick a class…</option>
          {classesWithContent.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {content && (
          <select
            value={lessonN ?? ""}
            onChange={(e) => setLessonN(e.target.value ? Number(e.target.value) : null)}
            className="w-36 rounded-lg px-3 py-2 text-sm"
            style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
          >
            <option value="">Lesson…</option>
            {content.lessons.map((l) => (
              <option key={l.n} value={l.n}>Lesson {l.n}</option>
            ))}
          </select>
        )}
      </div>

      {cls && lessonN !== null && (
        <UnderstandingCheck key={`${cls.id}-${lessonN}`} subjectId={cls.id} subjectName={cls.name} lessonN={lessonN} />
      )}
    </div>
  );
}
