"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TriviaQuestion,
  XP_BY_DIFFICULTY,
  QUIZ_SIZES,
  TIMER_OPTIONS,
} from "@/lib/trivia-types";
import { TRIVIA_CATEGORIES } from "@/lib/trivia-categories";
import {
  getRandomQuestions,
  getCategoryCounts,
} from "@/lib/trivia-questions";

function TriviaPlayContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [phase, setPhase] = useState<"setup" | "playing" | "results">("setup");
  const [quizSize, setQuizSize] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<
    Record<string, { total: number; available: number }>
  >({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setCategoryCounts(getCategoryCounts());
  }, []);

  const startQuiz = useCallback(
    (cat: string) => {
      let qs = getRandomQuestions(quizSize, cat, []);
      if (qs.length === 0) qs = getRandomQuestions(quizSize, cat, []);
      setQuestions(qs);
      setCurrentIndex(0);
      setSessionCorrect(0);
      setSessionXP(0);
      setSelectedOption(null);
      setPhase("playing");
    },
    [quizSize]
  );

  function handleAnswer(option: string) {
    if (selectedOption) return;
    setSelectedOption(option);
  }

  function handleNext() {
    if (!selectedOption || currentIndex >= questions.length) return;

    const q = questions[currentIndex];
    const correct = selectedOption === q.answer;
    const xp = XP_BY_DIFFICULTY[q.difficulty];

    setSessionXP((prev) => prev + (correct ? xp.correct : xp.wrong));
    if (correct) setSessionCorrect((prev) => prev + 1);

    if (currentIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  }

  if (phase === "setup") {
    return (
      <div
        className="min-h-screen"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="max-w-2xl mx-auto px-5 pt-8 pb-10 space-y-5">
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: "#f472b6" }}
          >
            Choose Mode
          </h1>

          {/* Quiz Size */}
          <div
            className="rounded-lg p-4"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: "#d8b4fe" }}>
              Questions
            </span>
            <div className="flex gap-2 mt-3">
              {QUIZ_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setQuizSize(size)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all`}
                  style={{
                    background:
                      quizSize === size ? "#f472b6" : "#1a0f1f",
                    color: quizSize === size ? "#1a0f1f" : "#f3e8ff",
                    border:
                      quizSize === size ? "none" : "1px solid #f472b6",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div
            className="rounded-lg p-4"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: "#d8b4fe" }}>
              Timer
            </span>
            <div className="flex gap-2 mt-3">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimerSeconds(t)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all`}
                  style={{
                    background:
                      timerSeconds === t ? "#f472b6" : "#1a0f1f",
                    color: timerSeconds === t ? "#1a0f1f" : "#f3e8ff",
                    border:
                      timerSeconds === t ? "none" : "1px solid #f472b6",
                  }}
                >
                  {t === 0 ? "Off" : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Start Quiz */}
          <button
            onClick={() => startQuiz(categoryParam)}
            className="w-full rounded-lg p-6 text-left font-bold transition-opacity hover:opacity-90"
            style={{ background: "#f472b6", color: "#1a0f1f" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg block">Start Quiz</span>
                <span className="text-sm opacity-70 block mt-1">
                  {quizSize} questions
                  {timerSeconds > 0 ? ` — ${timerSeconds}s timer` : ""}
                </span>
              </div>
              <span className="text-xs opacity-70">
                {categoryCounts[categoryParam]?.total || 0} total
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (phase === "playing" && currentIndex < questions.length) {
    const q = questions[currentIndex];
    const catInfo = TRIVIA_CATEGORIES[q.category];

    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        {/* Progress bar */}
        <div
          className="h-1 w-full overflow-hidden"
          style={{ background: "#2d1845" }}
        >
          <div
            className="h-full transition-all"
            style={{
              background: "#f472b6",
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 py-10">
          <div className="max-w-2xl mx-auto w-full">
            {/* Question */}
            <div className="mb-8">
              <div
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: catInfo.color }}
              >
                {catInfo.icon} {catInfo.label} — {q.difficulty}
              </div>
              <h2 className="text-2xl font-bold mb-2">{q.question}</h2>
              <div
                className="text-sm"
                style={{ color: "#d8b4fe" }}
              >
                {currentIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {q.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === q.answer;
                const showResult = selectedOption !== null;

                let bgColor = "#2d1845";
                let borderColor = "#6b21a8";

                if (showResult) {
                  if (isCorrect) {
                    bgColor = "#065f46";
                    borderColor = "#10b981";
                  } else if (isSelected && !isCorrect) {
                    bgColor = "#7f1d1d";
                    borderColor = "#ef4444";
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                    className="w-full p-4 rounded-lg text-left transition-all font-medium disabled:cursor-default"
                    style={{
                      background: bgColor,
                      color: "#f3e8ff",
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation (shown after answer) */}
            {selectedOption && (
              <div
                className="rounded-lg p-4 mb-6"
                style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
              >
                <p className="text-sm" style={{ color: "#d8b4fe" }}>
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {selectedOption && (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-lg font-bold transition-opacity hover:opacity-90"
                style={{ background: "#f472b6", color: "#1a0f1f" }}
              >
                Next {currentIndex + 1 === questions.length ? "→ Results" : "→"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const accuracy = Math.round(
      (sessionCorrect / questions.length) * 100
    );

    return (
      <div
        className="min-h-screen flex flex-col justify-center"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="max-w-2xl mx-auto w-full px-5 text-center space-y-6">
          <div>
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: "#f472b6" }}
            >
              {sessionCorrect}/{questions.length}
            </div>
            <div className="text-sm" style={{ color: "#d8b4fe" }}>
              {accuracy}% Correct
            </div>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <div className="text-3xl font-bold" style={{ color: "#f472b6" }}>
              +{sessionXP} XP
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/trivia/play"
              className="py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90"
              style={{ background: "#f472b6", color: "#1a0f1f" }}
            >
              Play Again
            </Link>
            <Link
              href="/trivia"
              className="py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90"
              style={{
                background: "#6b21a8",
                color: "#f3e8ff",
                border: "1px solid #f472b6",
              }}
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function TriviaPlayPage() {
  return (
    <Suspense fallback={<div style={{ background: "#1a0f1f" }}>Loading...</div>}>
      <TriviaPlayContent />
    </Suspense>
  );
}
