"use client";

import { useState, useEffect } from "react";
import { getWrongAnswersList, clearWrongAnswer, type WrongAnswer } from "@/lib/wrong-answers";
import { getEffectiveGlossary } from "@/lib/custom-glossary";
import { getSRData, saveSRData, reviewTerm } from "@/lib/spaced-repetition";
import { recordStudySession } from "@/lib/streaks";

type DrillState = {
  active: boolean;
  terms: WrongAnswer[];
  current: number;
  input: string;
  answered: boolean;
  correct: boolean;
  score: number;
  done: boolean;
};

export default function JournalPage() {
  const glossary = getEffectiveGlossary();

  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [drill, setDrill] = useState<DrillState>({ active: false, terms: [], current: 0, input: "", answered: false, correct: false, score: 0, done: false });

  useEffect(() => {
    setWrongAnswers(getWrongAnswersList());
  }, []);

  function startDrill() {
    if (wrongAnswers.length === 0) return;
    const terms = [...wrongAnswers].sort((a, b) => b.count - a.count).slice(0, 15);
    // Shuffle
    for (let i = terms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [terms[i], terms[j]] = [terms[j], terms[i]];
    }
    setDrill({ active: true, terms, current: 0, input: "", answered: false, correct: false, score: 0, done: false });
  }

  function checkDrillAnswer() {
    const term = drill.terms[drill.current];
    const isCorrect = drill.input.trim().toLowerCase() === term.term.toLowerCase();

    const sr = getSRData();
    sr[term.term] = reviewTerm(sr[term.term], term.term, isCorrect ? 4 : 1);
    saveSRData(sr);

    if (isCorrect) {
      // Reduce count or clear
      if (term.count <= 1) {
        clearWrongAnswer(term.term);
      }
    }

    setDrill((d) => ({
      ...d,
      answered: true,
      correct: isCorrect,
      score: isCorrect ? d.score + 1 : d.score,
    }));
  }

  function nextDrill() {
    if (drill.current + 1 >= drill.terms.length) {
      setDrill((d) => ({ ...d, done: true }));
      recordStudySession();
      setWrongAnswers(getWrongAnswersList());
    } else {
      setDrill((d) => ({ ...d, current: d.current + 1, input: "", answered: false, correct: false }));
    }
  }

  function removeTerm(term: string) {
    clearWrongAnswer(term);
    setWrongAnswers(getWrongAnswersList());
  }

  if (drill.active && !drill.done) {
    const term = drill.terms[drill.current];
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setDrill((d) => ({ ...d, active: false }))} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              {drill.current + 1} / {drill.terms.length} &middot; {drill.score} correct
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full mb-5" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full transition-all" style={{ background: "var(--accent)", width: `${((drill.current + 1) / drill.terms.length) * 100}%` }} />
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{term.category}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error)" }}>Missed {term.count}x</span>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--foreground)", lineHeight: 1.7 }}>{term.definition}</p>
            <p className="text-xs mb-2 font-medium" style={{ color: "var(--muted)" }}>What term is this?</p>
            <div className="flex gap-2">
              <input
                value={drill.input}
                onChange={(e) => setDrill((d) => ({ ...d, input: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (drill.answered) nextDrill();
                    else checkDrillAnswer();
                  }
                }}
                disabled={drill.answered}
                placeholder="Type the term..."
                className="flex-1 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--background)",
                  border: `1px solid ${drill.answered ? (drill.correct ? "var(--success)" : "var(--error)") : "var(--border)"}`,
                  color: "var(--foreground)",
                }}
                autoFocus
              />
              {!drill.answered ? (
                <button onClick={checkDrillAnswer} disabled={!drill.input.trim()} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: drill.input.trim() ? "var(--accent)" : "var(--border)", color: drill.input.trim() ? "#fff" : "var(--muted)" }}>
                  Check
                </button>
              ) : (
                <button onClick={nextDrill} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
                  {drill.current + 1 >= drill.terms.length ? "Finish" : "Next"}
                </button>
              )}
            </div>
            {drill.answered && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: drill.correct ? "var(--success-bg)" : "var(--error-bg)" }}>
                <p className="text-sm font-medium" style={{ color: drill.correct ? "var(--success)" : "var(--error)" }}>
                  {drill.correct ? "Correct!" : `Answer: ${term.term}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (drill.done) {
    const pct = drill.terms.length > 0 ? Math.round((drill.score / drill.terms.length) * 100) : 0;
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--error)" }}>{pct}%</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{drill.score} of {drill.terms.length} correct</p>
          <div className="flex gap-2 justify-center">
            <button onClick={startDrill} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Drill again</button>
            <button onClick={() => setDrill((d) => ({ ...d, active: false, done: false }))} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}>Back to journal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Wrong Answer Journal</h1>
          {wrongAnswers.length > 0 && (
            <button onClick={startDrill} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
              Drill all ({wrongAnswers.length})
            </button>
          )}
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Every term you&apos;ve gotten wrong, sorted by how often. Drill them to clear the list.
        </p>

        {wrongAnswers.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No wrong answers yet. Go study and any mistakes will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {wrongAnswers.map((wa) => (
              <div
                key={wa.term}
                className="rounded-xl p-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{wa.term}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                        {wa.count}x wrong
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                        {wa.category}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)", lineHeight: 1.5 }}>{wa.definition}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      From: {wa.modes.join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeTerm(wa.term)}
                    className="text-xs ml-2 shrink-0"
                    style={{ color: "var(--muted)" }}
                    title="Remove from journal"
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
