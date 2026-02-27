"use client";

import { useState, useEffect } from "react";
import { questions } from "@/lib/questions";
import { keyPoints } from "@/lib/keypoints";

type Draft = {
  questionId: number;
  answer: string;
  lastSaved: string;
};

export default function Practice({ onBack }: { onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showPoints, setShowPoints] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [practiced, setPracticed] = useState<Set<number>>(new Set());

  const question = questions[currentQ];
  const points = keyPoints[question.id] || [];

  // Load saved drafts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-drafts");
      if (saved) setDrafts(JSON.parse(saved));
      const savedPracticed = localStorage.getItem("meta-tutor-practiced");
      if (savedPracticed) setPracticed(new Set(JSON.parse(savedPracticed)));
    } catch {}
  }, []);

  // Load draft for current question
  useEffect(() => {
    const draft = drafts[question.id];
    if (draft) {
      setAnswer(draft.answer);
    } else {
      setAnswer("");
    }
    setShowPoints(false);
    setChecked(new Set());
  }, [currentQ, drafts, question.id]);

  function saveDraft() {
    const newDrafts = {
      ...drafts,
      [question.id]: {
        questionId: question.id,
        answer,
        lastSaved: new Date().toLocaleString(),
      },
    };
    setDrafts(newDrafts);
    localStorage.setItem("meta-tutor-drafts", JSON.stringify(newDrafts));
  }

  function markPracticed() {
    const next = new Set(practiced);
    next.add(question.id);
    setPracticed(next);
    localStorage.setItem("meta-tutor-practiced", JSON.stringify([...next]));
  }

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function goTo(idx: number) {
    // Auto-save current
    if (answer.trim()) saveDraft();
    setCurrentQ(idx);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {practiced.size} / {questions.length} practiced
        </span>
      </div>

      {/* Question selector */}
      <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto shrink-0">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => goTo(i)}
            className="shrink-0 w-8 h-8 rounded-full text-xs font-medium transition-all"
            style={{
              background: i === currentQ
                ? "var(--accent)"
                : practiced.has(q.id)
                ? "var(--success)"
                : drafts[q.id]
                ? "var(--accent-light)"
                : "var(--surface)",
              color: i === currentQ || practiced.has(q.id)
                ? "#fff"
                : "var(--muted)",
              border: `1px solid ${
                i === currentQ ? "transparent" : "var(--border)"
              }`,
            }}
          >
            {q.id}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: "var(--accent)" }}>
              Question {question.id}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {question.text}
            </p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {question.topics.map((t) => (
                <span
                  key={t}
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Answer area */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Your answer
              </p>
              {drafts[question.id] && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Saved {drafts[question.id].lastSaved}
                </p>
              )}
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here... Try to hit all the key points before checking."
              rows={8}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y leading-relaxed"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={saveDraft}
                disabled={!answer.trim()}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity disabled:opacity-30"
                style={{
                  background: "var(--surface)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                }}
              >
                Save draft
              </button>
              <button
                onClick={() => { setShowPoints(true); if (answer.trim()) { saveDraft(); markPracticed(); } }}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {showPoints ? "Showing key points" : "Reveal key points"}
              </button>
            </div>
          </div>

          {/* Key points checklist */}
          {showPoints && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: "var(--foreground)" }}>
                Key points to cover ({checked.size}/{points.length})
              </p>
              <div className="space-y-2">
                {points.map((point, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-2.5 cursor-pointer text-sm leading-relaxed"
                    style={{ color: checked.has(i) ? "var(--foreground)" : "var(--muted)" }}
                  >
                    <input
                      type="checkbox"
                      checked={checked.has(i)}
                      onChange={() => toggleCheck(i)}
                      className="mt-1 shrink-0 accent-[var(--accent)]"
                    />
                    <span className={checked.has(i) ? "" : ""}>{point}</span>
                  </label>
                ))}
              </div>
              {checked.size === points.length && points.length > 0 && (
                <p className="text-xs mt-3 font-medium" style={{ color: "var(--success)" }}>
                  You covered all key points!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
