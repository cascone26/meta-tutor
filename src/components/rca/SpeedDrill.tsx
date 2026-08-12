"use client";

import { useEffect, useRef, useState } from "react";
import { logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { FlameIcon } from "./NatureIcons";

type Question = { question: string; answer: string };
type Phase = "idle" | "loading" | "card" | "done" | "error";

// Fast, self-graded flashcard drill — Anki-style active recall + self-assessment,
// separate from the slower AI-graded "Test my understanding". Games teach retrieval
// speed under mild time pressure; the comprehension check tests depth. Different
// research-backed mechanics, kept as different modes rather than one blended thing.
export default function SpeedDrill({ subjectId, subjectName, lessonN }: { subjectId: string; subjectName: string; lessonN?: number }) {
  const progressKey = `rca-${subjectId}`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [bestSessionStreak, setBestSessionStreak] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (phase !== "card") return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startRef.current), 100);
    return () => clearInterval(interval);
  }, [phase]);

  async function start() {
    setPhase("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rca-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", subjectId, lessonN }),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.questions?.length) {
        setErrorMsg(data.error || "Couldn't load questions — try again.");
        setPhase("error");
        return;
      }
      setQuestions(data.questions);
      setIndex(0);
      setRevealed(false);
      setCorrectCount(0);
      setSessionStreak(0);
      setBestSessionStreak(0);
      startRef.current = Date.now();
      setElapsedMs(0);
      setPhase("card");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Network error — try again.");
      setPhase("error");
    }
  }

  function rate(gotIt: boolean) {
    const q = questions[index];
    if (gotIt) {
      setCorrectCount((c) => c + 1);
      setSessionStreak((s) => {
        const next = s + 1;
        setBestSessionStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setSessionStreak(0);
      logWrongAnswer(progressKey, q.question.slice(0, 80), q.answer, subjectName, "speed-drill");
    }
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setRevealed(false);
    } else {
      finish(gotIt ? correctCount + 1 : correctCount);
    }
  }

  function finish(finalCorrect: number) {
    saveResult(progressKey, {
      mode: "speed-drill",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score: finalCorrect,
      total: questions.length,
      percentage: Math.round((finalCorrect / questions.length) * 100),
      weakTerms: [],
      weakCategories: finalCorrect < questions.length ? [subjectName] : [],
    });
    setPhase("done");
  }

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <FlameIcon size={14} />
        Speed drill
      </h2>

      {phase === "idle" && (
        <>
          <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>
            Fast flashcard round — flip, self-grade, keep the streak going. Same lesson, faster pace.
          </p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9843a", color: "#fff" }}>
            Start drill
          </button>
        </>
      )}

      {phase === "loading" && <p className="text-sm" style={{ color: "#8a9a7c" }}>Building your deck…</p>}

      {phase === "error" && (
        <div>
          <p className="text-sm mb-3" style={{ color: "#a04a4a" }}>{errorMsg}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9843a", color: "#fff" }}>
            Try again
          </button>
        </div>
      )}

      {phase === "card" && questions[index] && (
        <div>
          <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8a9a7c" }}>
            <span>Card {index + 1} of {questions.length}</span>
            <span className="font-mono">{(elapsedMs / 1000).toFixed(1)}s</span>
            {sessionStreak > 0 && <span style={{ color: "#c9843a" }}>🔥 {sessionStreak}</span>}
          </div>
          <div className="rounded-xl p-4 mb-3" style={{ background: "#fff", border: "1px solid #d9e4d3", minHeight: 90 }}>
            <p className="text-sm font-medium mb-2" style={{ color: "#33402c" }}>{questions[index].question}</p>
            {revealed && (
              <p className="text-sm pt-2" style={{ color: "#3a4a34", borderTop: "1px solid #e6e0d0" }}>
                {questions[index].answer}
              </p>
            )}
          </div>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="px-4 py-2 rounded-lg text-sm font-medium w-full" style={{ background: "#3f7ea6", color: "#fff" }}>
              Show answer
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => rate(false)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#f0dede", color: "#a04a4a" }}>
                Missed it
              </button>
              <button onClick={() => rate(true)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#dcecd4", color: "#4a6a3a" }}>
                Got it
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#2f5e7a" }}>
            {correctCount} / {questions.length} in {(elapsedMs / 1000).toFixed(1)}s
          </p>
          <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>Best streak this round: {bestSessionStreak}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9843a", color: "#fff" }}>
            Run it again
          </button>
        </div>
      )}
    </div>
  );
}
