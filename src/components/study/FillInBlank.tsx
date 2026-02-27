"use client";

import { useState, useCallback, useRef } from "react";
import { glossary, categories } from "@/lib/glossary";
import { getSRData, saveSRData, reviewTerm } from "@/lib/spaced-repetition";
import { saveResult } from "@/lib/study-history";
import { logWrongAnswer } from "@/lib/wrong-answers";
import { recordStudySession } from "@/lib/streaks";

type BlankQuestion = {
  term: string;
  definition: string;
  category: string;
  blankedText: string;
  answer: string;
};

function generateBlanks(cat: string | null): BlankQuestion[] {
  const pool = cat ? glossary.filter((g) => g.category === cat) : [...glossary];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, 15).map((g) => {
    // Blank out the term name if it appears in the definition, otherwise blank a key phrase
    const termLower = g.term.toLowerCase().replace(/[()]/g, "");
    const defLower = g.definition.toLowerCase();

    if (defLower.includes(termLower) && termLower.length > 3) {
      const idx = defLower.indexOf(termLower);
      const blanked = g.definition.slice(0, idx) + "________" + g.definition.slice(idx + termLower.length);
      return { term: g.term, definition: g.definition, category: g.category, blankedText: blanked, answer: g.term };
    }

    // Otherwise, blank the term and show the definition with a blank
    return {
      term: g.term,
      definition: g.definition,
      category: g.category,
      blankedText: `________ — ${g.definition}`,
      answer: g.term,
    };
  });
}

export default function FillInBlank({ onBack }: { onBack: () => void }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<BlankQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongTerms, setWrongTerms] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const savedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = useCallback(() => {
    const q = generateBlanks(selectedCat);
    setQuestions(q);
    setCurrent(0);
    setInput("");
    setAnswered(false);
    setScore(0);
    setWrongTerms([]);
    setDone(false);
    setStarted(true);
    savedRef.current = false;
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [selectedCat]);

  function checkAnswer() {
    if (answered) return;
    const q = questions[current];
    const isCorrect = input.trim().toLowerCase() === q.answer.toLowerCase();
    setCorrect(isCorrect);
    setAnswered(true);

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongTerms((w) => [...w, q.term]);
      logWrongAnswer(q.term, q.definition, q.category, "Fill-in-the-Blank");
    }

    // Update SR
    const sr = getSRData();
    sr[q.term] = reviewTerm(sr[q.term], q.term, isCorrect ? 4 : 1);
    saveSRData(sr);
  }

  function next() {
    if (current + 1 >= questions.length) {
      setDone(true);
      recordStudySession();
      if (!savedRef.current) {
        savedRef.current = true;
        const pct = Math.round((score / questions.length) * 100);
        saveResult({
          mode: "Fill-in-the-Blank",
          date: new Date().toLocaleDateString(),
          timestamp: Date.now(),
          score,
          total: questions.length,
          percentage: pct,
          weakTerms: wrongTerms,
          weakCategories: [...new Set(wrongTerms.map((t) => glossary.find((g) => g.term === t)?.category || ""))],
        });
      }
    } else {
      setCurrent((c) => c + 1);
      setInput("");
      setAnswered(false);
      setCorrect(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  if (!started) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Fill in the Blank</h1>
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Key terms are blanked out from definitions. Fill them in from memory.
          </p>
          <div className="flex gap-1.5 flex-wrap mb-5">
            <button
              onClick={() => setSelectedCat(null)}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: !selectedCat ? "var(--accent)" : "var(--surface)",
                color: !selectedCat ? "#fff" : "var(--muted)",
                border: `1px solid ${!selectedCat ? "var(--accent)" : "var(--border)"}`,
              }}
            >All</button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: selectedCat === cat ? "var(--accent)" : "var(--surface)",
                  color: selectedCat === cat ? "#fff" : "var(--muted)",
                  border: `1px solid ${selectedCat === cat ? "var(--accent)" : "var(--border)"}`,
                }}
              >{cat}</button>
            ))}
          </div>
          <button
            onClick={start}
            className="px-5 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--accent)", color: "#fff" }}
          >Start</button>
        </div>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--error)" }}>
            {pct}%
          </h2>
          <p className="text-sm mb-1" style={{ color: "var(--foreground)" }}>
            {score} of {questions.length} correct
          </p>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            {pct >= 90 ? "Excellent recall!" : pct >= 70 ? "Good work — keep drilling the ones you missed." : "Keep studying — you'll get there."}
          </p>
          {wrongTerms.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--error)" }}>Missed terms:</p>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {wrongTerms.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
              Play again
            </button>
            <button onClick={onBack} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              Back to study
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            {current + 1} / {questions.length} &middot; {score} correct
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-5" style={{ background: "var(--border)" }}>
          <div className="h-full rounded-full transition-all" style={{ background: "var(--accent)", width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-xs px-2 py-0.5 rounded-full mb-3 inline-block" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
            {q.category}
          </span>
          <p className="text-sm mb-4" style={{ color: "var(--foreground)", lineHeight: 1.7 }}>
            {q.blankedText}
          </p>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (answered) next();
                  else checkAnswer();
                }
              }}
              placeholder="Type the missing term..."
              disabled={answered}
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{
                background: "var(--background)",
                border: `1px solid ${answered ? (correct ? "var(--success)" : "var(--error)") : "var(--border)"}`,
                color: "var(--foreground)",
              }}
            />
            {!answered ? (
              <button
                onClick={checkAnswer}
                disabled={!input.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: input.trim() ? "var(--accent)" : "var(--border)", color: input.trim() ? "#fff" : "var(--muted)" }}
              >
                Check
              </button>
            ) : (
              <button
                onClick={next}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {current + 1 >= questions.length ? "Finish" : "Next"}
              </button>
            )}
          </div>

          {answered && (
            <div className="mt-3 p-3 rounded-lg" style={{ background: correct ? "var(--success-bg)" : "var(--error-bg)" }}>
              <p className="text-sm font-medium" style={{ color: correct ? "var(--success)" : "var(--error)" }}>
                {correct ? "Correct!" : `The answer was: ${q.answer}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
