"use client";

import { useState, useEffect } from "react";
import { getSubjectProgress, logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { ZeroLineIcon } from "./ZeroLineIcon";

const PROGRESS_KEY = "riemann";

type Question = { question: string; answer: string };
type Evaluated = Question & { userAnswer: string; result: "correct" | "partial" | "incorrect"; feedback: string };

const RESULT_COLOR: Record<string, string> = {
  correct: "#7ac48a",
  partial: "#e0c07a",
  incorrect: "#e08a8a",
};

export default function RiemannUnderstandingCheck({ lessonN }: { lessonN: number }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "quiz" | "evaluating" | "result" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluated, setEvaluated] = useState<Evaluated[]>([]);
  const [weakAreas, setWeakAreas] = useState<{ terms: string[]; categories: string[] }>({ terms: [], categories: [] });
  const [sessionsLogged, setSessionsLogged] = useState(0);

  useEffect(() => {
    getSubjectProgress(PROGRESS_KEY)
      .then((p) => {
        setWeakAreas(p.weakAreas);
        setSessionsLogged(p.history.length);
      })
      .catch(() => {}); // secondary "past weak areas" widget — a failure just means it stays hidden, not a false claim
  }, []);

  useEffect(() => {
    setPhase("idle");
  }, [lessonN]);

  async function start() {
    setPhase("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/riemann-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", lessonN }),
      });
      if (!res.ok) {
        setErrorMsg(`Request failed (${res.status}). ${res.status === 401 ? "You may need to log in again." : "Try again in a moment."}`);
        setPhase("error");
        return;
      }
      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
        setPhase("error");
        return;
      }
      if (!data.questions || data.questions.length === 0) {
        setErrorMsg("The assistant didn't return any questions — try again.");
        setPhase("error");
        return;
      }
      setQuestions(data.questions);
      setIndex(0);
      setEvaluated([]);
      setAnswer("");
      setPhase("quiz");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Network error — try again.");
      setPhase("error");
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setPhase("evaluating");
    const q = questions[index];
    try {
      const res = await fetch("/api/riemann-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate", question: q.question, correctAnswer: q.answer, userAnswer: answer }),
      });
      const data = await res.json();
      const result: Evaluated = { ...q, userAnswer: answer, result: data.result || "partial", feedback: data.feedback || "" };
      setEvaluated((prev) => [...prev, result]);

      if (result.result !== "correct") {
        logWrongAnswer(PROGRESS_KEY, q.question.slice(0, 80), q.answer, `Lesson ${lessonN}`, "understanding-check");
      }
      setPhase("result");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Network error grading your answer — try again.");
      setPhase("error");
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
    saveResult(PROGRESS_KEY, {
      mode: "understanding-check",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score,
      total,
      percentage: total ? Math.round((score / total) * 100) : 0,
      weakTerms: evaluated.filter((e) => e.result !== "correct").map((e) => e.question.slice(0, 80)),
      weakCategories: evaluated.some((e) => e.result !== "correct") ? [`Lesson ${lessonN}`] : [],
    });
    setPhase("done");
  }

  const showResult = phase === "result";
  const lastResult = evaluated[evaluated.length - 1];

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#1c2440", border: "1px solid #2a3358" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#e0c07a" }}>
        <ZeroLineIcon size={14} />
        Test my understanding
      </h2>

      {phase === "idle" && (
        <>
          <p className="text-xs mb-3" style={{ color: "#8b93c4" }}>
            4 questions on this lesson — checks whether it actually landed before you move on.
          </p>
          <button
            onClick={start}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#c9a24d", color: "#141a2e" }}
          >
            Start check
          </button>
        </>
      )}

      {phase === "loading" && <p className="text-sm" style={{ color: "#8b93c4" }}>Generating questions from this lesson…</p>}

      {phase === "error" && (
        <div>
          <p className="text-sm mb-3" style={{ color: "#e08a8a" }}>{errorMsg}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9a24d", color: "#141a2e" }}>
            Try again
          </button>
        </div>
      )}

      {(phase === "quiz" || phase === "evaluating" || phase === "result") && questions[index] && (
        <div>
          <p className="text-xs mb-2" style={{ color: "#8b93c4" }}>Question {index + 1} of {questions.length}</p>
          <p className="text-sm mb-3" style={{ color: "#e6e6f0" }}>{questions[index].question}</p>

          {!showResult && (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer…"
                rows={3}
                className="w-full rounded-lg px-3 py-2 text-sm mb-2"
                style={{ background: "#141a2e", border: "1px solid #2a3358", color: "#e6e6f0" }}
                disabled={phase === "evaluating"}
              />
              <button
                onClick={submitAnswer}
                disabled={phase === "evaluating" || !answer.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{ background: "#4a5a9a", color: "#fff" }}
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
              <p className="text-sm mb-2" style={{ color: "#cdd2ec" }}>{lastResult.feedback}</p>
              {lastResult.result !== "correct" && (
                <p className="text-xs mb-3" style={{ color: "#8b93c4" }}>Correct answer: {lastResult.answer}</p>
              )}
              <button onClick={next} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9a24d", color: "#141a2e" }}>
                {index + 1 < questions.length ? "Next question" : "Finish"}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "#e0c07a" }}>
            {evaluated.filter((e) => e.result === "correct").length} / {evaluated.length} correct
          </p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9a24d", color: "#141a2e" }}>
            Run another check
          </button>
        </div>
      )}

      {(weakAreas.terms.length > 0 || sessionsLogged > 0) && phase === "idle" && (
        <div className="mt-4 pt-3" style={{ borderTop: "1px solid #2a3358" }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#e0c07a" }}>Recent gaps</p>
          <div className="flex gap-1.5 flex-wrap">
            {weakAreas.terms.slice(0, 6).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#2a3358", color: "#cdd2ec" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
