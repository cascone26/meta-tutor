"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getEffectiveGlossary } from "@/lib/custom-glossary";
import { questions } from "@/lib/questions";
import { saveResult } from "@/lib/study-history";
import { logWrongAnswer } from "@/lib/wrong-answers";
import { recordStudySession } from "@/lib/streaks";

type ExamQuestion =
  | { type: "mc"; term: string; definition: string; category: string; correct: string; options: string[] }
  | { type: "essay"; id: number; text: string; topics: string[] };

function generateExam(): ExamQuestion[] {
  const glossary = getEffectiveGlossary();
  const exam: ExamQuestion[] = [];

  // 10 MC questions from glossary
  const shuffledGlossary = [...glossary].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(10, shuffledGlossary.length); i++) {
    const g = shuffledGlossary[i];
    const wrongDefs = glossary
      .filter((x) => x.term !== g.term)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => x.definition);
    const options = [g.definition, ...wrongDefs].sort(() => Math.random() - 0.5);
    exam.push({ type: "mc", term: g.term, definition: g.definition, category: g.category, correct: g.definition, options });
  }

  // 3 essay questions
  const shuffledQ = [...questions].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(3, shuffledQ.length); i++) {
    exam.push({ type: "essay", id: shuffledQ[i].id, text: shuffledQ[i].text, topics: shuffledQ[i].topics });
  }

  return exam;
}

export default function TimedExam({ onBack }: { onBack: () => void }) {
  const [started, setStarted] = useState(false);
  const [exam, setExam] = useState<ExamQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(75 * 60); // 75 minutes
  const [done, setDone] = useState(false);
  const [mcScore, setMcScore] = useState(0);
  const [wrongTerms, setWrongTerms] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedRef = useRef(false);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDone(true);
    recordStudySession();

    // Score MC questions
    let correct = 0;
    const wrong: string[] = [];
    exam.forEach((q, i) => {
      if (q.type === "mc") {
        if (answers[i] === q.correct) {
          correct++;
        } else {
          wrong.push(q.term);
          logWrongAnswer(q.term, q.definition, q.category, "Timed Exam");
        }
      }
    });
    setMcScore(correct);
    setWrongTerms(wrong);

    const mcTotal = exam.filter((q) => q.type === "mc").length;
    if (!savedRef.current) {
      savedRef.current = true;
      saveResult({
        mode: "Timed Exam",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score: correct,
        total: mcTotal,
        percentage: mcTotal > 0 ? Math.round((correct / mcTotal) * 100) : 0,
        weakTerms: wrong,
        weakCategories: [...new Set(wrong.map((t) => getEffectiveGlossary().find((g) => g.term === t)?.category || ""))],
      });
    }
  }, [exam, answers]);

  useEffect(() => {
    if (started && !done) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            finishExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [started, done, finishExam]);

  function start() {
    const e = generateExam();
    setExam(e);
    setCurrent(0);
    setAnswers({});
    setTimeLeft(75 * 60);
    setDone(false);
    setStarted(true);
    savedRef.current = false;
  }

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!started) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Timed Exam</h1>
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Simulate real exam conditions. 1 hour 15 minutes. 10 multiple choice + 3 essay questions. No AI, no glossary.
          </p>
          <div className="rounded-xl p-5 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Exam rules:</h3>
            <ul className="text-xs space-y-1" style={{ color: "var(--muted)" }}>
              <li>- 1 hour 15 minute time limit</li>
              <li>- 10 multiple choice questions (auto-graded)</li>
              <li>- 3 essay questions (self-graded)</li>
              <li>- No access to glossary, notes, or AI chat</li>
              <li>- You can navigate between questions</li>
              <li>- Timer stops when you submit</li>
            </ul>
          </div>
          <button onClick={start} className="px-5 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const mcTotal = exam.filter((q) => q.type === "mc").length;
    const pct = mcTotal > 0 ? Math.round((mcScore / mcTotal) * 100) : 0;
    const essayAnswers = exam.map((q, i) => q.type === "essay" ? { question: q.text, answer: answers[i] || "(no answer)" } : null).filter(Boolean);
    const timeUsed = 75 * 60 - timeLeft;

    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-xl font-semibold mb-4" style={{ color: "var(--foreground)" }}>Exam Results</h1>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-2xl font-bold" style={{ color: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--error)" }}>{pct}%</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>MC Score</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{mcScore}/{mcTotal}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Correct</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{formatTimer(timeUsed)}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Time used</p>
            </div>
          </div>

          {wrongTerms.length > 0 && (
            <div className="rounded-xl p-4 mb-4" style={{ background: "var(--error-bg)", border: "1px solid #c96b6b30" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--error)" }}>Missed MC terms:</p>
              <div className="flex gap-1.5 flex-wrap">
                {wrongTerms.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {essayAnswers.length > 0 && (
            <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Your essay answers (self-review):</h3>
              {essayAnswers.map((ea, i) => (
                <div key={i} className="mb-3 pb-3" style={{ borderBottom: i < essayAnswers.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--accent)" }}>Q{i + 1}:</p>
                  <p className="text-xs mb-1" style={{ color: "var(--foreground)" }}>{ea!.question.slice(0, 150)}...</p>
                  <p className="text-xs" style={{ color: "var(--muted)", whiteSpace: "pre-wrap" }}>{ea!.answer}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
              Retake
            </button>
            <button onClick={onBack} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              Back to study
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = exam[current];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Question {current + 1} of {exam.length}
          </span>
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-mono font-bold px-3 py-1 rounded-lg"
              style={{
                background: timeLeft < 300 ? "var(--error-bg)" : "var(--surface)",
                color: timeLeft < 300 ? "var(--error)" : "var(--foreground)",
                border: `1px solid ${timeLeft < 300 ? "var(--error-border)" : "var(--border)"}`,
              }}
            >
              {formatTimer(timeLeft)}
            </span>
            <button
              onClick={finishExam}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "var(--error)", color: "#fff" }}
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-4" style={{ background: "var(--border)" }}>
          <div className="h-full rounded-full transition-all" style={{ background: "var(--accent)", width: `${((current + 1) / exam.length) * 100}%` }} />
        </div>

        {/* Question nav */}
        <div className="flex gap-1 flex-wrap mb-4">
          {exam.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-7 h-7 rounded-md text-xs font-medium"
              style={{
                background: i === current ? "var(--accent)" : answers[i] ? "var(--accent-light)" : "var(--surface)",
                color: i === current ? "#fff" : answers[i] ? "var(--accent)" : "var(--muted)",
                border: `1px solid ${i === current ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question content */}
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {q.type === "mc" && (
            <>
              <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                Multiple Choice
              </span>
              <p className="text-sm font-medium mb-4" style={{ color: "var(--foreground)" }}>
                What is the definition of <strong>{q.term}</strong>?
              </p>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers((a) => ({ ...a, [current]: opt }))}
                    className="w-full text-left rounded-lg p-3 text-sm transition-all"
                    style={{
                      background: answers[current] === opt ? "var(--accent-light)" : "var(--background)",
                      border: `1px solid ${answers[current] === opt ? "var(--accent)" : "var(--border)"}`,
                      color: "var(--foreground)",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {q.type === "essay" && (
            <>
              <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>
                Essay
              </span>
              <p className="text-sm mb-4" style={{ color: "var(--foreground)", lineHeight: 1.7 }}>
                {q.text}
              </p>
              <textarea
                value={answers[current] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [current]: e.target.value }))}
                placeholder="Write your answer..."
                rows={8}
                className="w-full rounded-lg p-3 text-sm resize-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
              <div className="text-right mt-1">
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {(answers[current] || "").split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--surface)", color: current === 0 ? "var(--border)" : "var(--foreground)", border: "1px solid var(--border)" }}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(exam.length - 1, c + 1))}
            disabled={current === exam.length - 1}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--surface)", color: current === exam.length - 1 ? "var(--border)" : "var(--foreground)", border: "1px solid var(--border)" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
