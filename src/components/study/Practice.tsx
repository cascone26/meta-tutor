"use client";

import { useState, useEffect, useRef } from "react";
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
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const question = questions[currentQ];
  const points = keyPoints[question.id] || [];

  // Load saved drafts on mount only
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-drafts");
      const savedPracticed = localStorage.getItem("meta-tutor-practiced");
      const parsedDrafts = saved ? JSON.parse(saved) : {};
      if (saved) setDrafts(parsedDrafts);
      if (savedPracticed) setPracticed(new Set(JSON.parse(savedPracticed)));
      // Load draft for initial question
      if (parsedDrafts[questions[0].id]) setAnswer(parsedDrafts[questions[0].id].answer);
    } catch {}
  }, []);

  // Reset view when changing questions — does NOT depend on drafts
  useEffect(() => {
    setShowPoints(false);
    setChecked(new Set());
    setAiFeedback("");
    setLoadingFeedback(false);
    // Load draft for this question from current drafts state
    setAnswer((prev) => {
      try {
        const saved = localStorage.getItem("meta-tutor-drafts");
        const parsed = saved ? JSON.parse(saved) : {};
        return parsed[questions[currentQ].id]?.answer ?? "";
      } catch { return prev; }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ]);

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
    if (answer.trim()) saveDraft();
    setCurrentQ(idx);
  }

  async function getAiFeedback() {
    if (!answer.trim() || loadingFeedback) return;
    setLoadingFeedback(true);
    setAiFeedback("");

    const prompt = `You are grading a student's essay answer for a Thomistic Metaphysics course.

QUESTION:
${question.text}

KEY POINTS that should be covered:
${points.map((p, i) => `${i + 1}. ${p}`).join("\n")}

STUDENT'S ANSWER:
${answer}

Please:
1. Identify which key points the student covered well
2. Identify what was missing or underdeveloped
3. Note any errors or misunderstandings
4. Give an overall assessment (Excellent / Good / Needs Work)
5. Offer 1-2 specific suggestions for improvement

Be honest but encouraging. Ground feedback in the course material.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          mode: "study",
          userNotes: [],
          sources: [],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let feedback = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                feedback += parsed.text;
                setAiFeedback(feedback);
              }
            } catch {}
          }
        }
      }
    } catch {
      setAiFeedback("Failed to get feedback. Please try again.");
    } finally {
      setLoadingFeedback(false);
    }
  }

  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (aiFeedback) feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [aiFeedback]);

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
                ? "#6ab070"
                : drafts[q.id]
                ? "var(--accent-light)"
                : "var(--surface)",
              color: i === currentQ || practiced.has(q.id) ? "#fff" : "var(--muted)",
              border: `1px solid ${i === currentQ ? "transparent" : "var(--border)"}`,
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
          <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--accent)" }}>Question {question.id}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{question.text}</p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {question.topics.map((t) => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Answer area */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Your answer</p>
              {drafts[question.id] && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>Saved {drafts[question.id].lastSaved}</p>
              )}
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here... Try to hit all the key points before checking."
              rows={8}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y leading-relaxed"
              style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                onClick={saveDraft}
                disabled={!answer.trim()}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity disabled:opacity-30"
                style={{ background: "var(--surface)", color: "var(--accent)", border: "1px solid var(--border)" }}
              >
                Save draft
              </button>
              <button
                onClick={() => { setShowPoints(true); if (answer.trim()) { saveDraft(); markPracticed(); } }}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {showPoints ? "Showing key points" : "Reveal key points"}
              </button>
              <button
                onClick={getAiFeedback}
                disabled={!answer.trim() || loadingFeedback}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity disabled:opacity-40"
                style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                {loadingFeedback ? "Grading..." : "Get AI feedback"}
              </button>
            </div>
          </div>

          {/* Key points checklist */}
          {showPoints && (
            <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "var(--foreground)" }}>
                Key points to cover ({checked.size}/{points.length})
              </p>
              {points.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted)" }}>No key points defined for this question yet.</p>
              ) : (
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
                      <span>{point}</span>
                    </label>
                  ))}
                </div>
              )}
              {checked.size === points.length && points.length > 0 && (
                <p className="text-xs mt-3 font-medium" style={{ color: "#6ab070" }}>You covered all key points!</p>
              )}
            </div>
          )}

          {/* AI Feedback */}
          {(aiFeedback || loadingFeedback) && (
            <div ref={feedbackRef} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "var(--foreground)" }}>AI Feedback</p>
              {loadingFeedback && !aiFeedback ? (
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "300ms" }} />
                </div>
              ) : (
                <div
                  className="prose text-sm leading-relaxed"
                  style={{ color: "var(--foreground)" }}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(aiFeedback) }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
