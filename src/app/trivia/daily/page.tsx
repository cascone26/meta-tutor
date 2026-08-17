"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TriviaQuestion } from "@/lib/trivia-types";
import { getFullQuestionBank } from "@/lib/trivia-questions";
import { TRIVIA_CATEGORIES } from "@/lib/trivia-categories";

const DAILY_SIZE = 5;

interface DailyData {
  date: string;
  questionIds: string[];
  completed: boolean;
  correct: number;
}

function getDailyQuestions(): TriviaQuestion[] {
  const today = new Date().toISOString().split("T")[0];

  let seed = 0;
  for (let i = 0; i < today.length; i++)
    seed = ((seed << 5) - seed) + today.charCodeAt(i);
  seed = Math.abs(seed);

  const pool = [...getFullQuestionBank()];
  const selected: TriviaQuestion[] = [];
  const usedCategories = new Set<string>();

  for (let i = 0; i < DAILY_SIZE && pool.length > 0; i++) {
    const availablePool = pool.filter(
      (q) => !usedCategories.has(q.category)
    );
    const pickFrom =
      availablePool.length >= DAILY_SIZE - i ? availablePool : pool;

    const idx = (seed + i * 7919) % pickFrom.length;
    const q = pickFrom[idx];
    selected.push(q);
    usedCategories.add(q.category);
    pool.splice(pool.indexOf(q), 1);
  }

  return selected;
}

export default function TriviaDaily() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [phase, setPhase] = useState<"loading" | "playing" | "done" | "already">(
    "loading"
  );
  const [dailyHistory, setDailyHistory] = useState<DailyData[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    try {
      const raw = localStorage.getItem("mt_trivia_daily");
      const history: DailyData[] = raw ? JSON.parse(raw) : [];
      setDailyHistory(history);

      const todayData = history.find((d) => d.date === today);
      if (todayData?.completed) {
        setPhase("already");
        setSessionCorrect(todayData.correct);
        return;
      }
    } catch {}

    const qs = getDailyQuestions();
    setQuestions(qs);
    setPhase("playing");
  }, []);

  function handleAnswer(option: string) {
    if (selectedOption) return;
    setSelectedOption(option);
  }

  function handleNext() {
    if (!selectedOption) return;

    const correct = selectedOption === questions[currentIndex].answer;
    const newCorrect = sessionCorrect + (correct ? 1 : 0);

    if (currentIndex + 1 >= questions.length) {
      const today = new Date().toISOString().split("T")[0];

      try {
        const raw = localStorage.getItem("mt_trivia_daily");
        const history: DailyData[] = raw ? JSON.parse(raw) : [];
        history.push({
          date: today,
          questionIds: questions.map((q) => q.id),
          completed: true,
          correct: newCorrect,
        });
        if (history.length > 30) history.splice(0, history.length - 30);
        localStorage.setItem("mt_trivia_daily", JSON.stringify(history));
        setDailyHistory(history);
      } catch {}

      setSessionCorrect(newCorrect);
      setPhase("done");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSessionCorrect(newCorrect);
    }
  }

  if (phase === "loading") {
    return (
      <div
        className="min-h-screen"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        Loading...
      </div>
    );
  }

  if (phase === "already") {
    return (
      <div
        className="min-h-screen flex flex-col justify-center"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="text-center space-y-4 px-5">
          <p className="text-4xl">✓</p>
          <h1 className="text-xl font-bold">Daily Challenge Complete</h1>
          <p className="text-2xl font-bold" style={{ color: "#f472b6" }}>
            {sessionCorrect}/5
          </p>
          <p className="text-sm" style={{ color: "#d8b4fe" }}>
            Come back tomorrow for a new challenge!
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/trivia/play"
              className="py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90"
              style={{ background: "#f472b6", color: "#1a0f1f" }}
            >
              Practice More
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

  if (phase === "done") {
    const accuracy = Math.round((sessionCorrect / DAILY_SIZE) * 100);
    return (
      <div
        className="min-h-screen flex flex-col justify-center"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="text-center space-y-4 px-5">
          <p className="text-4xl">✓</p>
          <h1 className="text-xl font-bold" style={{ color: "#f472b6" }}>
            Daily 5 Complete
          </h1>
          <p className="text-3xl font-bold">{sessionCorrect}/5</p>
          <p className="text-sm" style={{ color: "#d8b4fe" }}>
            {accuracy}% Accuracy
          </p>
          <p className="text-xs" style={{ color: "#a78bfa" }}>
            Come back tomorrow for a new challenge!
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/trivia/play"
              className="py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90"
              style={{ background: "#f472b6", color: "#1a0f1f" }}
            >
              Play More
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

  if (phase === "playing" && currentIndex < questions.length) {
    const q = questions[currentIndex];
    const catInfo = TRIVIA_CATEGORIES[q.category];

    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div
          className="h-1 w-full overflow-hidden"
          style={{ background: "#2d1845" }}
        >
          <div
            className="h-full transition-all"
            style={{
              background: "#f472b6",
              width: `${((currentIndex + 1) / DAILY_SIZE) * 100}%`,
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
                Daily 5 — {catInfo.icon} {catInfo.label}
              </div>
              <h2 className="text-2xl font-bold mb-2">{q.question}</h2>
              <div
                className="text-sm"
                style={{ color: "#d8b4fe" }}
              >
                {currentIndex + 1} of {DAILY_SIZE}
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

            {/* Explanation */}
            {selectedOption && (
              <div
                className="rounded-lg p-4 mb-6"
                style={{
                  background: "#2d1845",
                  borderColor: "#6b21a8",
                  border: "1px solid",
                }}
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
                Next {currentIndex + 1 === DAILY_SIZE ? "→ Results" : "→"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
