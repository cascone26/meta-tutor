"use client";

import { useState, useEffect, useRef } from "react";
import { glossary } from "@/lib/glossary";
import { saveResult } from "@/lib/study-history";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = {
  id: string;
  text: string;
  pairId: string;
  type: "term" | "def";
};

export default function Match({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [roundSize, setRoundSize] = useState(6);
  const [wrongCount, setWrongCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-match-best");
      if (saved) setBestTime(parseInt(saved));
    } catch {}
  }, []);

  function startGame(size: number) {
    const picked = shuffle(glossary).slice(0, size);
    const termCards: Card[] = picked.map((g) => ({
      id: `term-${g.term}`,
      text: g.term,
      pairId: g.term,
      type: "term",
    }));
    const defCards: Card[] = picked.map((g) => ({
      id: `def-${g.term}`,
      text: g.definition.length > 60 ? g.definition.slice(0, 60) + "..." : g.definition,
      pairId: g.term,
      type: "def",
    }));
    setCards(shuffle([...termCards, ...defCards]));
    setMatched(new Set());
    setSelected(null);
    setWrong(null);
    setTime(0);
    setComplete(false);
    setStarted(true);
    setRoundSize(size);
    setWrongCount(0);
    savedRef.current = false;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function selectCard(card: Card) {
    if (matched.has(card.pairId) || wrong) return;

    if (!selected) {
      setSelected(card.id);
      return;
    }

    if (selected === card.id) {
      setSelected(null);
      return;
    }

    const first = cards.find((c) => c.id === selected)!;

    if (first.pairId === card.pairId && first.type !== card.type) {
      // Match!
      const newMatched = new Set(matched);
      newMatched.add(card.pairId);
      setMatched(newMatched);
      setSelected(null);

      if (newMatched.size === roundSize) {
        setComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);
        if (!bestTime || time < bestTime) {
          setBestTime(time);
          localStorage.setItem("meta-tutor-match-best", time.toString());
        }
      }
    } else {
      // Wrong
      setWrong(card.id);
      setWrongCount((c) => c + 1);
      setTimeout(() => {
        setSelected(null);
        setWrong(null);
      }, 600);
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (!started) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Match Terms & Definitions
          </h2>
          <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--muted)" }}>
            Match each term to its definition as fast as you can.
            {bestTime !== null && ` Your best time: ${formatTime(bestTime)}`}
          </p>
          <div className="flex gap-3">
            {[6, 10, 15].map((size) => (
              <button
                key={size}
                onClick={() => startGame(size)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {size} pairs
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (complete) {
    const totalAttempts = roundSize + wrongCount;
    const pct = Math.round((roundSize / totalAttempts) * 100);

    // Save once
    if (!savedRef.current) {
      savedRef.current = true;
      saveResult({
        mode: "Match",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score: roundSize,
        total: totalAttempts,
        percentage: pct,
        weakTerms: [],
        weakCategories: [],
      });
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            All matched!
          </h2>
          <p className="text-2xl font-bold mb-1" style={{ color: "var(--accent)" }}>
            {formatTime(time)}
          </p>
          <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>
            {bestTime === time ? "New best time!" : bestTime !== null ? `Best: ${formatTime(bestTime)}` : ""}
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            {wrongCount === 0 ? "Perfect — no wrong matches!" : `${wrongCount} wrong ${wrongCount === 1 ? "match" : "matches"}`}
          </p>

          {wrongCount === 0 ? (
            <div className="rounded-xl p-3 mb-4 max-w-xs" style={{ background: "#e8f5e9", border: "1px solid #c8e6c9" }}>
              <p className="text-xs" style={{ color: "#2d5a30" }}>Flawless! Try a bigger set or beat your time.</p>
            </div>
          ) : wrongCount <= 3 ? (
            <div className="rounded-xl p-3 mb-4 max-w-xs" style={{ background: "#fff8e1", border: "1px solid #ffecb3" }}>
              <p className="text-xs" style={{ color: "#8d6e0f" }}>Good job! A few mix-ups — use Flashcards to review tricky definitions.</p>
            </div>
          ) : (
            <div className="rounded-xl p-3 mb-4 max-w-xs" style={{ background: "#fce4ec", border: "1px solid #f8bbd0" }}>
              <p className="text-xs" style={{ color: "#8b3a3a" }}>Try studying with Learn mode first to build familiarity, then come back.</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => startGame(roundSize)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Play again
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              Back to study
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
          <span>{matched.size}/{roundSize} matched</span>
          <span className="font-mono">{formatTime(time)}</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-3xl mx-auto">
          {cards.map((card) => {
            const isMatched = matched.has(card.pairId);
            const isSelected = selected === card.id;
            const isWrong = wrong === card.id || (wrong && selected === card.id);

            return (
              <button
                key={card.id}
                onClick={() => selectCard(card)}
                disabled={isMatched}
                className="rounded-xl p-3 text-left transition-all"
                style={{
                  minHeight: "80px",
                  background: isMatched
                    ? "#e8f5e9"
                    : isWrong
                    ? "#fce4ec"
                    : isSelected
                    ? "var(--accent-light)"
                    : "var(--surface)",
                  border: `2px solid ${
                    isMatched
                      ? "#6ab070"
                      : isWrong
                      ? "#c96b6b"
                      : isSelected
                      ? "var(--accent)"
                      : "var(--border)"
                  }`,
                  opacity: isMatched ? 0.5 : 1,
                }}
              >
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  {card.type === "term" ? "Term" : "Definition"}
                </p>
                <p
                  className="text-xs leading-relaxed font-medium"
                  style={{
                    color: "var(--foreground)",
                    fontSize: card.type === "term" ? "0.8125rem" : "0.6875rem",
                  }}
                >
                  {card.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
