"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEffectiveGlossary, getEffectiveCategories } from "@/lib/custom-glossary";
import { getSRData, saveSRData, reviewTerm } from "@/lib/spaced-repetition";
import { saveResult } from "@/lib/study-history";
import { logWrongAnswer } from "@/lib/wrong-answers";
import { recordStudySession } from "@/lib/streaks";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Question = {
  term: string;
  correct: string;
  options: string[];
  category: string;
};

function generateQuestions(cat: string | null, shuffled: boolean): Question[] {
  const glossary = getEffectiveGlossary();
  const pool = cat ? glossary.filter((g) => g.category === cat) : glossary;
  if (pool.length < 4) return [];

  const ordered = shuffled ? shuffle(pool) : [...pool];
  return ordered.map((item) => {
    const wrong = shuffle(pool.filter((g) => g.term !== item.term))
      .slice(0, 3)
      .map((g) => g.definition);
    const options = shuffle([item.definition, ...wrong]);
    return {
      term: item.term,
      correct: item.definition,
      options,
      category: item.category,
    };
  });
}

export default function MultipleChoice({ onBack }: { onBack: () => void }) {
  const glossary = getEffectiveGlossary();
  const categories = getEffectiveCategories();

  const [category, setCategory] = useState<string | null>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).category ?? null : null; } catch { return null; }
  });
  const [shuffled, setShuffled] = useState<boolean>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).shuffled ?? true : true; } catch { return true; }
  });
  const [questions, setQuestions] = useState<Question[]>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).questions ?? [] : []; } catch { return []; }
  });
  const [index, setIndex] = useState<number>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).index ?? 0 : 0; } catch { return 0; }
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).score ?? 0 : 0; } catch { return 0; }
  });
  const [answered, setAnswered] = useState<number>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).answered ?? 0 : 0; } catch { return 0; }
  });
  const [showResult, setShowResult] = useState(false);
  const [wrongTerms, setWrongTerms] = useState<{ term: string; category: string }[]>(() => {
    try { const s = localStorage.getItem("meta-tutor-mc-progress"); return s ? JSON.parse(s).wrongTerms ?? [] : []; } catch { return []; }
  });
  const savedRef = useRef(false);

  // Save progress whenever it changes
  useEffect(() => {
    if (questions.length === 0) return;
    try {
      localStorage.setItem("meta-tutor-mc-progress", JSON.stringify({ category, shuffled, questions, index, score, answered, wrongTerms }));
    } catch {}
  }, [category, shuffled, questions, index, score, answered, wrongTerms]);

  const startQuiz = useCallback((cat: string | null, sh: boolean = shuffled) => {
    try { localStorage.removeItem("meta-tutor-mc-progress"); } catch {}
    setCategory(cat);
    setQuestions(generateQuestions(cat, sh));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setShowResult(false);
    setWrongTerms([]);
    savedRef.current = false;
  }, []);

  useEffect(() => {
    if (questions.length > 0) return; // restored from storage
    startQuiz(null, true);
  }, [startQuiz]); // eslint-disable-line react-hooks/exhaustive-deps

  const question = questions[index];
  const isComplete = index >= questions.length && questions.length > 0;

  function pick(option: string) {
    if (selected) return;
    setSelected(option);
    setAnswered(answered + 1);
    if (option === question.correct) {
      setScore(score + 1);
    } else {
      setWrongTerms((prev) => [...prev, { term: question.term, category: question.category }]);
      const g = glossary.find((x) => x.term === question.term);
      if (g) logWrongAnswer(g.term, g.definition, g.category, "Multiple Choice");
    }
  }

  function next() {
    setIndex(index + 1);
    setSelected(null);
    setShowResult(false);
  }

  if (isComplete) {
    const pct = Math.round((score / questions.length) * 100);
    const uniqueWrongTerms = [...new Set(wrongTerms.map((w) => w.term))];
    const uniqueWrongCats = [...new Set(wrongTerms.map((w) => w.category))];

    // Save results once
    if (!savedRef.current) {
      savedRef.current = true;
      recordStudySession();
      saveResult({
        mode: "Multiple Choice",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score,
        total: questions.length,
        percentage: pct,
        weakTerms: uniqueWrongTerms,
        weakCategories: uniqueWrongCats,
      });

      // Update SR data
      const srData = getSRData();
      const wrongSet = new Set(uniqueWrongTerms);
      for (const q of questions) {
        const quality = wrongSet.has(q.term) ? 1 : 4;
        srData[q.term] = reviewTerm(srData[q.term], q.term, quality);
      }
      saveSRData(srData);
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-md mx-auto text-center py-8">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Quiz Complete!
            </h2>
            <p className="text-4xl font-bold mb-1" style={{ color: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--error)" }}>
              {pct}%
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              {score} out of {questions.length} correct
            </p>

            {/* Feedback */}
            {pct >= 90 ? (
              <div className="rounded-xl p-4 mb-4 text-left" style={{ background: "var(--success-bg)", border: "1px solid #c8e6c9" }}>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--success-text)" }}>Excellent!</p>
                <p className="text-xs" style={{ color: "var(--success-text)" }}>Outstanding performance. Try filtering to a specific category for focused review.</p>
              </div>
            ) : pct >= 70 ? (
              <div className="rounded-xl p-4 mb-4 text-left" style={{ background: "var(--warning-bg)", border: "1px solid #ffecb3" }}>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--warning-text)" }}>Good job!</p>
                <p className="text-xs" style={{ color: "var(--warning-text)" }}>Solid foundation. Review the missed terms below to improve further.</p>
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-4 text-left" style={{ background: "var(--error-bg)", border: "1px solid #f8bbd0" }}>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--error-text)" }}>Keep going!</p>
                <p className="text-xs" style={{ color: "var(--error-text)" }}>Try Learn mode for a more guided approach, or filter to one category at a time.</p>
              </div>
            )}

            {uniqueWrongTerms.length > 0 && (
              <div className="rounded-xl p-4 mb-4 text-left" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Missed terms:</p>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueWrongTerms.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error-text)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startQuiz(category)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Try again
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
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
          <span>{index + 1}/{questions.length}</span>
          <span style={{ color: "var(--success)" }}>{score} correct</span>
        </div>
      </div>

      {/* Category filter + order toggle */}
      <div className="flex gap-2 flex-wrap px-4 pb-3 shrink-0">
        <button
          onClick={() => startQuiz(null)}
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            background: !category ? "var(--accent)" : "var(--surface)",
            color: !category ? "#fff" : "var(--muted)",
            border: `1px solid ${!category ? "transparent" : "var(--border)"}`,
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => startQuiz(cat)}
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: category === cat ? "var(--accent)" : "var(--surface)",
              color: category === cat ? "#fff" : "var(--muted)",
              border: `1px solid ${category === cat ? "transparent" : "var(--border)"}`,
            }}
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto flex rounded-full overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <button
            onClick={() => { setShuffled(true); startQuiz(category, true); }}
            className="text-xs px-2.5 py-1 font-medium"
            style={{
              background: shuffled ? "var(--accent)" : "var(--surface)",
              color: shuffled ? "#fff" : "var(--muted)",
            }}
          >
            Shuffle
          </button>
          <button
            onClick={() => { setShuffled(false); startQuiz(category, false); }}
            className="text-xs px-2.5 py-1 font-medium"
            style={{
              background: !shuffled ? "var(--accent)" : "var(--surface)",
              color: !shuffled ? "#fff" : "var(--muted)",
            }}
          >
            In Order
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-xl mx-auto">
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full mb-5" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                background: "var(--accent)",
                width: `${((index + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              What is the definition of:
            </p>
            <p className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
              {question.term}
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded-full mt-2 inline-block"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            >
              {question.category}
            </span>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const isCorrect = option === question.correct;
              const isPicked = selected === option;
              const showAnswer = selected !== null;

              let bg = "var(--surface)";
              let border = "var(--border)";
              let color = "var(--foreground)";

              if (showAnswer) {
                if (isCorrect) {
                  bg = "var(--success-bg)";
                  border = "var(--success)";
                  color = "var(--success-text)";
                } else if (isPicked && !isCorrect) {
                  bg = "var(--error-bg)";
                  border = "var(--error)";
                  color = "var(--error-text)";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => pick(option)}
                  disabled={selected !== null}
                  className="w-full text-left rounded-xl p-4 text-sm leading-relaxed transition-all"
                  style={{
                    background: bg,
                    border: `2px solid ${border}`,
                    color,
                  }}
                >
                  <span className="font-medium mr-2" style={{ color: "var(--muted)" }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {selected && (
            <div className="flex justify-center mt-4">
              <button
                onClick={next}
                className="px-6 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {index < questions.length - 1 ? "Next question" : "See results"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
