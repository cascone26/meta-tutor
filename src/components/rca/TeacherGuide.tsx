"use client";

import { useState } from "react";
import { rcaContent } from "@/lib/rca-content";
import { getCatechismLessonsForWeekText } from "@/lib/rca-content/baltimore-catechism-guide";
import { LeafIcon } from "@/components/rca/NatureIcons";

// Teacher's guide for going over Discussion Questions / True-or-False in
// class — Jacob, 2026-08-24: "for baltimore catechism, also a teachers guide
// for the discussion questions and t/f sections and all that would be really
// helpful for going over those in class." Answers start hidden (a real
// teacher's-guide answer key, not a worksheet) — tap to reveal per item.
//
// Sources from baltimore-catechism-guide.ts, NOT the app's other
// baltimore-catechism.ts (a real, verbatim, public-domain "Baltimore
// Catechism No. 2" reference already used by /rca/religion-6/catechism) —
// found live 2026-08-24 that No. 2's numbering does NOT match RCA's own
// pacing citations: RCA's religion-6.ts explicitly says "Lesson 15 #195 —
// The Ten Commandments," but that file's own Q195 is "What is contrition, or
// sorrow for sin?" (real text, just a different edition's numbering — No. 2
// is the 1885 first edition; RCA's citations match the 1949 "No. 3"
// Confraternity edition instead, confirmed against a real hosted copy at
// drbo.org, whose Lesson 15/Q188-197 content is exactly the Two Great
// Commandments/Ten Commandments/works of mercy RCA describes). Using the
// wrong edition's verbatim text under RCA's own citations would be exactly
// the "catechism questions arent the right ones" bug relocated, not fixed —
// so this stays on the edition that's actually been verified to match, and
// the No. 2 reference page remains a good general full-book resource, just
// not the source for precise weekly cross-referencing.
//
// `lessonN` here is the RCA teaching-WEEK index (matches whatever week
// LessonViewer is showing), not a Baltimore Catechism lesson number — those
// drift apart after week ~16 (see extractCatechismLessonNumbers).
export default function TeacherGuide({ subjectId, lessonN }: { subjectId: string; lessonN: number }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (subjectId !== "religion-6") {
    return (
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
        <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
          <LeafIcon size={14} />
          Teacher&apos;s guide
        </h2>
        <p className="text-xs" style={{ color: "#8a9a7c" }}>
          Not built for this subject yet — currently covers Religion 6&apos;s Baltimore Catechism discussion
          questions and True/False review.
        </p>
      </div>
    );
  }

  const weekLesson = rcaContent["religion-6"]?.lessons.find((l) => l.n === lessonN);
  const weekText = weekLesson ? weekLesson.sections.map((s) => s.text).join(" ") : "";
  const guides = getCatechismLessonsForWeekText(weekText);

  if (guides.length === 0) {
    return (
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
        <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
          <LeafIcon size={14} />
          Teacher&apos;s guide
        </h2>
        <p className="text-xs" style={{ color: "#8a9a7c" }}>No guide content for this week (a Gospel-discussion week, no new catechism lesson referenced).</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <LeafIcon size={14} />
        Teacher&apos;s guide
      </h2>
      {guides.map((guide, gi) => (
        <div key={guide.n} className={gi > 0 ? "mt-5 pt-4" : ""} style={gi > 0 ? { borderTop: "1px solid #e6e0d0" } : undefined}>
          <p className="text-sm font-semibold mb-0.5" style={{ color: "#33402c" }}>Lesson {guide.n} — {guide.title}</p>

          <h3 className="text-xs font-semibold uppercase tracking-wide mt-3 mb-1.5" style={{ color: "#6b8e5a" }}>Discussion questions</h3>
          <ol className="text-sm space-y-1.5 mb-4 list-decimal list-inside" style={{ color: "#3a4a34" }}>
            {guide.discussionQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>

          <h3 className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6b8e5a" }}>True or False</h3>
          <div className="space-y-1.5 mb-4">
            {guide.trueFalse.map((tf, i) => {
              const id = `tf-${guide.n}-${i}`;
              const isRevealed = revealed.has(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-2"
                  style={{ background: "#fff", border: "1px solid #e6e0d0", color: "#33402c" }}
                >
                  <span>{tf.statement}</span>
                  <span
                    className="text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full"
                    style={{
                      background: !isRevealed ? "#eef2e2" : tf.answer ? "#dcecd4" : "#f0dede",
                      color: !isRevealed ? "#8a9a7c" : tf.answer ? "#4a6a3a" : "#a04a4a",
                    }}
                  >
                    {isRevealed ? (tf.answer ? "True" : "False") : "Reveal"}
                  </span>
                </button>
              );
            })}
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6b8e5a" }}>Topic reference</h3>
          <div className="space-y-2">
            {guide.topics.map((t) => (
              <div key={t.qRange} className="text-sm rounded-lg px-3 py-2" style={{ background: "#fff", border: "1px solid #e6e0d0" }}>
                <p className="font-semibold" style={{ color: "#33402c" }}>Q{t.qRange} — {t.topic}</p>
                <p className="text-xs mt-0.5" style={{ color: "#5c6b52" }}>{t.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
