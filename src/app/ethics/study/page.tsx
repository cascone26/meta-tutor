"use client";

import { useState, useCallback } from "react";
import { ethicsQuestions, ethicsTopics, type TFQuestion } from "@/lib/ethics-questions";

type Phase = "quiz" | "results";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EthicsStudyPage() {
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [queue, setQueue] = useState<TFQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [phase, setPhase] = useState<Phase>("quiz");
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const filteredQuestions = topicFilter
    ? ethicsQuestions.filter((q) => q.topic === topicFilter)
    : ethicsQuestions;

  function startQuiz(retryMissed?: TFQuestion[]) {
    const pool = retryMissed ?? filteredQuestions;
    setQueue(shuffle(pool));
    setCurrent(0);
    setAnswers({});
    setPhase("quiz");
    setStarted(true);
    setRevealed(false);
  }

  const currentQ = queue[current];

  const handleAnswer = useCallback((answer: boolean) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));
    setRevealed(true);
  }, [currentQ, revealed]);

  function next() {
    if (current + 1 >= queue.length) {
      setPhase("results");
    } else {
      setCurrent((c) => c + 1);
      setRevealed(false);
    }
  }

  const correct = queue.filter((q) => answers[q.id] === q.answer);
  const incorrect = queue.filter((q) => q.id in answers && answers[q.id] !== q.answer);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "var(--accent-light)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--accent)" }}>
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Ethics T/F Practice
        </h1>
        <p className="text-sm mb-6 max-w-md" style={{ color: "var(--muted)" }}>
          {filteredQuestions.length} questions{topicFilter ? ` on "${topicFilter}"` : " across all topics"}. Answer True or False for each statement.
        </p>

        {/* Topic filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-lg">
          <button
            onClick={() => setTopicFilter(null)}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{
              background: topicFilter === null ? "var(--accent)" : "var(--surface)",
              color: topicFilter === null ? "#fff" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            All Topics
          </button>
          {ethicsTopics.map((t) => (
            <button
              key={t}
              onClick={() => setTopicFilter(topicFilter === t ? null : t)}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                background: topicFilter === t ? "var(--accent)" : "var(--surface)",
                color: topicFilter === t ? "#fff" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => startQuiz()}
          className="px-8 py-3 rounded-xl font-semibold text-sm"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Start ({filteredQuestions.length} questions)
        </button>
      </div>
    );
  }

  if (phase === "results") {
    const score = correct.length;
    const total = queue.length;
    const pct = Math.round((score / total) * 100);

    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--error)" }}
        >
          <span className="text-2xl font-bold text-white">{pct}%</span>
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          {pct >= 80 ? "Great work!" : pct >= 60 ? "Getting there!" : "Keep studying!"}
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          {score} / {total} correct
        </p>

        {incorrect.length > 0 && (
          <div className="w-full max-w-lg mb-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
              Missed ({incorrect.length})
            </p>
            <div className="space-y-2">
              {incorrect.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl text-sm"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>{q.statement}</p>
                  <p className="text-xs mb-1" style={{ color: q.answer ? "var(--success)" : "var(--error)" }}>
                    Answer: {q.answer ? "TRUE" : "FALSE"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {incorrect.length > 0 && (
            <button
              onClick={() => startQuiz(incorrect)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Retry Missed ({incorrect.length})
            </button>
          )}
          <button
            onClick={() => startQuiz()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          >
            New Round
          </button>
          <button
            onClick={() => setStarted(false)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
          >
            Change Topic
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase
  const isCorrect = revealed && answers[currentQ.id] === currentQ.answer;
  const isWrong = revealed && answers[currentQ.id] !== currentQ.answer;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="px-4 pt-4 shrink-0">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted)" }}>
            <span>{current + 1} / {queue.length}</span>
            <span style={{ color: "var(--accent)" }}>{currentQ.topic}</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${((current + 1) / queue.length) * 100}%`, background: "var(--accent)" }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl">
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{
              background: "var(--surface)",
              border: `2px solid ${revealed ? (isCorrect ? "var(--success)" : "var(--error)") : "var(--border)"}`,
            }}
          >
            <p className="text-lg leading-relaxed font-medium" style={{ color: "var(--foreground)" }}>
              {currentQ.statement}
            </p>
          </div>

          {/* Answer buttons */}
          {!revealed ? (
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-4 rounded-xl text-lg font-bold transition-all"
                style={{ background: "var(--surface)", color: "var(--success)", border: "2px solid var(--success)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--success)", e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)", e.currentTarget.style.color = "var(--success)")}
              >
                TRUE
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-4 rounded-xl text-lg font-bold transition-all"
                style={{ background: "var(--surface)", color: "var(--error)", border: "2px solid var(--error)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--error)", e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)", e.currentTarget.style.color = "var(--error)")}
              >
                FALSE
              </button>
            </div>
          ) : (
            <div>
              <div
                className="rounded-xl p-4 mb-4 text-sm"
                style={{
                  background: isCorrect ? "rgba(var(--success-rgb, 34,197,94), 0.1)" : "rgba(var(--error-rgb, 239,68,68), 0.1)",
                  border: `1px solid ${isCorrect ? "var(--success)" : "var(--error)"}`,
                }}
              >
                <p className="font-semibold mb-1" style={{ color: isCorrect ? "var(--success)" : "var(--error)" }}>
                  {isCorrect ? "Correct!" : `Wrong — Answer is ${currentQ.answer ? "TRUE" : "FALSE"}`}
                </p>
                <p style={{ color: "var(--foreground)" }}>{currentQ.explanation}</p>
              </div>
              <button
                onClick={next}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {current + 1 >= queue.length ? "See Results" : "Next →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Score counter */}
      <div
        className="shrink-0 px-4 py-3 border-t flex justify-center gap-6 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <span style={{ color: "var(--success)" }}>✓ {correct.length}</span>
        <span style={{ color: "var(--muted)" }}>{queue.length - Object.keys(answers).length} left</span>
        <span style={{ color: "var(--error)" }}>✗ {incorrect.length}</span>
      </div>
    </div>
  );
}
