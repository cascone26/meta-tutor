"use client";

import { useState, useEffect, useCallback } from "react";
import { glossary } from "@/lib/glossary";
import { categories } from "@/lib/glossary";

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

function generateQuestions(cat: string | null): Question[] {
  const pool = cat ? glossary.filter((g) => g.category === cat) : glossary;
  if (pool.length < 4) return [];

  return shuffle(pool).map((item) => {
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
  const [category, setCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = useCallback((cat: string | null) => {
    setCategory(cat);
    setQuestions(generateQuestions(cat));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setShowResult(false);
  }, []);

  useEffect(() => {
    startQuiz(null);
  }, [startQuiz]);

  const question = questions[index];
  const isComplete = index >= questions.length && questions.length > 0;

  function pick(option: string) {
    if (selected) return;
    setSelected(option);
    setAnswered(answered + 1);
    if (option === question.correct) {
      setScore(score + 1);
    }
  }

  function next() {
    setIndex(index + 1);
    setSelected(null);
    setShowResult(false);
  }

  if (isComplete) {
    const pct = Math.round((score / questions.length) * 100);
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
            Quiz Complete!
          </h2>
          <p className="text-4xl font-bold mb-1" style={{ color: pct >= 80 ? "#6ab070" : pct >= 60 ? "#d4a843" : "#c96b6b" }}>
            {pct}%
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {score} out of {questions.length} correct
          </p>
          <div className="flex gap-3">
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
          <span style={{ color: "#6ab070" }}>{score} correct</span>
        </div>
      </div>

      {/* Category filter */}
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
                  bg = "#e8f5e9";
                  border = "#6ab070";
                  color = "#2d5a30";
                } else if (isPicked && !isCorrect) {
                  bg = "#fce4ec";
                  border = "#c96b6b";
                  color = "#8b3a3a";
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
