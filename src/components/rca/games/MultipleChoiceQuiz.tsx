"use client";

import { useState } from "react";
import { logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { FlameIcon } from "../NatureIcons";

type MCQuestion = { question: string; options: string[]; correctIndex: number };
type Phase = "idle" | "loading" | "quiz" | "done" | "error";

export default function MultipleChoiceQuiz({ subjectId, subjectName, lessonN }: { subjectId: string; subjectName: string; lessonN?: number }) {
  const progressKey = `rca-${subjectId}`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  async function start() {
    setPhase("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rca-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-mc", subjectId, lessonN }),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.questions?.length) {
        setErrorMsg(data.error || "Couldn't load a quiz — try again.");
        setPhase("error");
        return;
      }
      setQuestions(data.questions);
      setIndex(0);
      setPicked(null);
      setCorrectCount(0);
      setPhase("quiz");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Network error — try again.");
      setPhase("error");
    }
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const q = questions[index];
    if (i === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    } else {
      logWrongAnswer(progressKey, q.question.slice(0, 80), q.options[q.correctIndex], subjectName, "multiple-choice");
    }
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      saveResult(progressKey, {
        mode: "multiple-choice",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score: correctCount,
        total: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
        weakTerms: [],
        weakCategories: correctCount < questions.length ? [subjectName] : [],
      });
      setPhase("done");
    }
  }

  const q = questions[index];

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <FlameIcon size={14} />
        Multiple choice
      </h2>

      {phase === "idle" && (
        <>
          <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>5 quick questions, click the right answer — fastest way to check recall.</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#3f7ea6", color: "#fff" }}>
            Start quiz
          </button>
        </>
      )}

      {phase === "loading" && <p className="text-sm" style={{ color: "#8a9a7c" }}>Building your quiz…</p>}

      {phase === "error" && (
        <div>
          <p className="text-sm mb-3" style={{ color: "#a04a4a" }}>{errorMsg}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#3f7ea6", color: "#fff" }}>
            Try again
          </button>
        </div>
      )}

      {phase === "quiz" && q && (
        <div>
          <p className="text-xs mb-2" style={{ color: "#8a9a7c" }}>Question {index + 1} of {questions.length}</p>
          <p className="text-sm font-medium mb-3" style={{ color: "#33402c" }}>{q.question}</p>
          <div className="grid gap-2 mb-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isPicked = i === picked;
              const showState = picked !== null;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className="text-left px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    background: showState && isCorrect ? "#dcecd4" : showState && isPicked ? "#f0dede" : "#fff",
                    border: `1px solid ${showState && isCorrect ? "#8ab87a" : showState && isPicked ? "#d09a9a" : "#d9e4d3"}`,
                    color: "#2f3a2a",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <button onClick={next} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#6b8e5a", color: "#fff" }}>
              {index + 1 < questions.length ? "Next" : "Finish"}
            </button>
          )}
        </div>
      )}

      {phase === "done" && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "#2f5e7a" }}>{correctCount} / {questions.length} correct</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#3f7ea6", color: "#fff" }}>
            Run it again
          </button>
        </div>
      )}
    </div>
  );
}
