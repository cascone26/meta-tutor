"use client";

import { useState, useEffect } from "react";
import { getSubjectProgress, logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { LeafIcon } from "./NatureIcons";

type Question = { question: string; answer: string };
type Evaluated = Question & { userAnswer: string; result: "correct" | "partial" | "incorrect"; feedback: string };

const RESULT_COLOR: Record<string, string> = {
  correct: "#5a7a4a",
  partial: "#8a6a2e",
  incorrect: "#a04a4a",
};

export default function UnderstandingCheck({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const progressKey = `rca-${subjectId}`;

  const [phase, setPhase] = useState<"idle" | "loading" | "quiz" | "evaluating" | "result" | "done">("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluated, setEvaluated] = useState<Evaluated[]>([]);
  const [weakAreas, setWeakAreas] = useState<{ terms: string[]; categories: string[] }>({ terms: [], categories: [] });
  const [sessionsLogged, setSessionsLogged] = useState(0);

  useEffect(() => {
    getSubjectProgress(progressKey).then((p) => {
      setWeakAreas(p.weakAreas);
      setSessionsLogged(p.history.length);
    });
  }, [progressKey]);

  async function start() {
    setPhase("loading");
    try {
      const res = await fetch("/api/rca-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", subjectId }),
      });
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        setPhase("idle");
        return;
      }
      setQuestions(data.questions);
      setIndex(0);
      setEvaluated([]);
      setAnswer("");
      setPhase("quiz");
    } catch {
      setPhase("idle");
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setPhase("evaluating");
    const q = questions[index];
    try {
      const res = await fetch("/api/rca-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate", subjectId, question: q.question, correctAnswer: q.answer, userAnswer: answer }),
      });
      const data = await res.json();
      const result: Evaluated = { ...q, userAnswer: answer, result: data.result || "partial", feedback: data.feedback || "" };
      setEvaluated((prev) => [...prev, result]);

      if (result.result !== "correct") {
        logWrongAnswer(progressKey, q.question.slice(0, 80), q.answer, subjectName, "understanding-check");
      }
      setPhase("result");
    } catch {
      setPhase("quiz");
    }
  }

  function next() {
    setAnswer("");
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPhase("quiz");
    } else {
      finish();
    }
  }

  function finish() {
    const score = evaluated.filter((e) => e.result === "correct").length;
    const total = evaluated.length;
    saveResult(progressKey, {
      mode: "understanding-check",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score,
      total,
      percentage: total ? Math.round((score / total) * 100) : 0,
      weakTerms: evaluated.filter((e) => e.result !== "correct").map((e) => e.question.slice(0, 80)),
      weakCategories: evaluated.some((e) => e.result !== "correct") ? [subjectName] : [],
    });
    setPhase("done");
  }

  const showResult = phase === "result";
  const lastResult = evaluated[evaluated.length - 1];

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <LeafIcon size={14} />
        Test my understanding
      </h2>

      {phase === "idle" && (
        <>
          <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>
            4 questions on this week&apos;s lesson — checks whether you actually understand it well enough to teach it.
          </p>
          <button
            onClick={start}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#6b8e5a", color: "#fff" }}
          >
            Start check
          </button>
        </>
      )}

      {phase === "loading" && <p className="text-sm" style={{ color: "#8a9a7c" }}>Generating questions from this week&apos;s lesson…</p>}

      {(phase === "quiz" || phase === "evaluating" || phase === "result") && questions[index] && (
        <div>
          <p className="text-xs mb-2" style={{ color: "#8a9a7c" }}>Question {index + 1} of {questions.length}</p>
          <p className="text-sm mb-3" style={{ color: "#33402c" }}>{questions[index].question}</p>

          {!showResult && (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer…"
                rows={3}
                className="w-full rounded-lg px-3 py-2 text-sm mb-2"
                style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
                disabled={phase === "evaluating"}
              />
              <button
                onClick={submitAnswer}
                disabled={phase === "evaluating" || !answer.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{ background: "#3f7ea6", color: "#fff" }}
              >
                {phase === "evaluating" ? "Checking…" : "Submit"}
              </button>
            </>
          )}

          {showResult && lastResult && (
            <div className="mt-2">
              <p className="text-sm font-semibold mb-1" style={{ color: RESULT_COLOR[lastResult.result] }}>
                {lastResult.result === "correct" ? "Correct" : lastResult.result === "partial" ? "Partially right" : "Not quite"}
              </p>
              <p className="text-sm mb-2" style={{ color: "#3a4a34" }}>{lastResult.feedback}</p>
              {lastResult.result !== "correct" && (
                <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>Correct answer: {lastResult.answer}</p>
              )}
              <button onClick={next} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#6b8e5a", color: "#fff" }}>
                {index + 1 < questions.length ? "Next question" : "Finish"}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "#2f5e7a" }}>
            {evaluated.filter((e) => e.result === "correct").length} / {evaluated.length} correct
          </p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#6b8e5a", color: "#fff" }}>
            Run another check
          </button>
        </div>
      )}

      {(weakAreas.terms.length > 0 || sessionsLogged > 0) && phase === "idle" && (
        <div className="mt-4 pt-3" style={{ borderTop: "1px solid #e6e0d0" }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#8a6a2e" }}>Recent gaps</p>
          <div className="flex gap-1.5 flex-wrap">
            {weakAreas.terms.slice(0, 6).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fdf0e0", color: "#8a6a2e" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
