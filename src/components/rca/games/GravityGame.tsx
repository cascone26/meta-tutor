"use client";

import { useEffect, useRef, useState } from "react";
import { fetchShortCards, looseMatch, type ShortCard } from "@/lib/rca-short-cards";
import { logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { FlameIcon } from "../NatureIcons";

type Phase = "idle" | "loading" | "playing" | "done" | "error";
const FALL_MS = 9000;

export default function GravityGame({ subjectId, subjectName, lessonN }: { subjectId: string; subjectName: string; lessonN?: number }) {
  const progressKey = `rca-${subjectId}`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cards, setCards] = useState<ShortCard[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"hit" | "miss" | null>(null);
  const scoreRef = useRef(0); // avoids the stale-closure trap of reading `score` inside a setTimeout callback
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "playing" && !feedback) inputRef.current?.focus();
  }, [phase, index, feedback]);

  async function start() {
    setPhase("loading");
    setErrorMsg("");
    const { cards: loaded, error } = await fetchShortCards(subjectId, lessonN);
    if (error || loaded.length === 0) {
      setErrorMsg(error || "Couldn't load cards.");
      setPhase("error");
      return;
    }
    setCards(loaded);
    setIndex(0);
    setInput("");
    setScore(0);
    scoreRef.current = 0;
    setFeedback(null);
    setPhase("playing");
  }

  function advance(finalCardCount: number) {
    setFeedback(null);
    setInput("");
    setIndex((i) => {
      const next = i + 1;
      if (next >= finalCardCount) {
        finish(finalCardCount);
        return i;
      }
      return next;
    });
  }

  function finish(total: number) {
    saveResult(progressKey, {
      mode: "gravity",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score: scoreRef.current,
      total,
      percentage: Math.round((scoreRef.current / total) * 100),
      weakTerms: [],
      weakCategories: scoreRef.current < total ? [subjectName] : [],
    });
    setPhase("done");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback) return;
    const card = cards[index];
    if (looseMatch(input, card.answer)) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setFeedback("hit");
    } else {
      logWrongAnswer(progressKey, card.term, card.answer, subjectName, "gravity");
      setFeedback("miss");
    }
    setTimeout(() => advance(cards.length), 500);
  }

  function onFall() {
    if (feedback) return;
    const card = cards[index];
    logWrongAnswer(progressKey, card.term, card.answer, subjectName, "gravity");
    setFeedback("miss");
    setTimeout(() => advance(cards.length), 400);
  }

  const card = cards[index];

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <FlameIcon size={14} />
        Gravity
      </h2>

      {phase === "idle" && (
        <>
          <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>Type the answer before the term hits the ground — {(FALL_MS / 1000).toFixed(0)}s per card.</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#a04a4a", color: "#fff" }}>
            Start
          </button>
        </>
      )}

      {phase === "loading" && <p className="text-sm" style={{ color: "#8a9a7c" }}>Loading terms…</p>}

      {phase === "error" && (
        <div>
          <p className="text-sm mb-3" style={{ color: "#a04a4a" }}>{errorMsg}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#a04a4a", color: "#fff" }}>
            Try again
          </button>
        </div>
      )}

      {phase === "playing" && card && (
        <div>
          <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8a9a7c" }}>
            <span>Term {index + 1} of {cards.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="relative rounded-xl mb-3 overflow-hidden" style={{ height: 220, background: "#0f1a14" }}>
            <div
              key={index}
              onAnimationEnd={onFall}
              className="absolute left-0 right-0 flex justify-center"
              style={{ top: 0, animation: feedback ? "none" : `fallDown ${FALL_MS}ms linear forwards` }}
            >
              <span
                className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{
                  background: feedback === "hit" ? "#5a8a4a" : feedback === "miss" ? "#a04a4a" : "#e8f0ea",
                  color: feedback ? "#fff" : "#0f1a14",
                }}
              >
                {card.term}
              </span>
            </div>
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!feedback}
              placeholder="Type the answer…"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
            />
            <button type="submit" disabled={!!feedback} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "#3f7ea6", color: "#fff" }}>
              Go
            </button>
          </form>
          {feedback === "miss" && <p className="text-xs mt-2" style={{ color: "#a04a4a" }}>Answer: {card.answer}</p>}
        </div>
      )}

      {phase === "done" && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "#2f5e7a" }}>{score} / {cards.length} hit</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#a04a4a", color: "#fff" }}>
            Run it again
          </button>
        </div>
      )}
    </div>
  );
}
