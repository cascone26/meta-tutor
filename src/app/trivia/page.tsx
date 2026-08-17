"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_TRIVIA_CATEGORIES, TRIVIA_CATEGORIES } from "@/lib/trivia-categories";
import { TriviaUserProgress, TriviaCategory } from "@/lib/trivia-types";

export default function TriviaPage() {
  const [progress, setProgress] = useState<TriviaUserProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch("/api/trivia-progress");
        if (res.ok) {
          const data = await res.json();
          // Initialize categoryStats with all categories
          const categoryStats: Record<TriviaCategory, { answered: number; correct: number }> = {} as Record<TriviaCategory, { answered: number; correct: number }>;
          ALL_TRIVIA_CATEGORIES.forEach((cat) => {
            categoryStats[cat] = { answered: 0, correct: 0 };
          });

          setProgress({
            totalAnswered: data.progress.total_answered || 0,
            totalCorrect: data.progress.total_correct || 0,
            streak: data.progress.streak || 0,
            longestStreak: data.progress.longest_streak || 0,
            lastPlayedDate: data.progress.last_played_date,
            level: data.progress.level || 1,
            xp: data.progress.xp || 0,
            categoryStats,
            dailyStats: {},
          });
        }
      } catch (e) {
        console.error("Failed to load trivia progress:", e);
      }
      setMounted(true);
    };

    loadProgress();
  }, []);

  if (!mounted) return null;

  const accuracy =
    progress && progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#1a0f1f", color: "#f3e8ff" }}
    >
      <div className="max-w-4xl mx-auto px-5 pt-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trivia</h1>
          <p
            className="text-sm"
            style={{ color: "#d8b4fe" }}
          >
            12 categories, spaced-repetition learning, daily 5 challenge
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div
            className="rounded-lg p-4 text-center"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#f472b6" }}>
              {progress?.totalAnswered || 0}
            </p>
            <p className="text-xs mt-1" style={{ color: "#d8b4fe" }}>
              Questions Answered
            </p>
          </div>
          <div
            className="rounded-lg p-4 text-center"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#f472b6" }}>
              {accuracy}%
            </p>
            <p className="text-xs mt-1" style={{ color: "#d8b4fe" }}>
              Accuracy
            </p>
          </div>
          <div
            className="rounded-lg p-4 text-center"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#f472b6" }}>
              {progress?.streak || 0}
            </p>
            <p className="text-xs mt-1" style={{ color: "#d8b4fe" }}>
              Current Streak
            </p>
          </div>
          <div
            className="rounded-lg p-4 text-center"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#f472b6" }}>
              {progress?.level || 1}
            </p>
            <p className="text-xs mt-1" style={{ color: "#d8b4fe" }}>
              Level
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            href="/trivia/play"
            className="rounded-lg p-4 text-center font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#f472b6", color: "#1a0f1f" }}
          >
            Play Quiz
          </Link>
          <Link
            href="/trivia/review"
            className="rounded-lg p-4 text-center font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#6b21a8", color: "#f3e8ff", border: "1px solid #f472b6" }}
          >
            Review Deck
          </Link>
          <Link
            href="/trivia/daily"
            className="rounded-lg p-4 text-center font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#6b21a8", color: "#f3e8ff", border: "1px solid #f472b6" }}
          >
            Daily 5
          </Link>
          <Link
            href="/trivia/stats"
            className="rounded-lg p-4 text-center font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#6b21a8", color: "#f3e8ff", border: "1px solid #f472b6" }}
          >
            Stats
          </Link>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2
            className="text-sm font-semibold mb-3 uppercase tracking-wider"
            style={{ color: "#d8b4fe" }}
          >
            Categories
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {ALL_TRIVIA_CATEGORIES.map((cat) => {
              const catInfo = TRIVIA_CATEGORIES[cat];
              return (
                <Link
                  key={cat}
                  href={`/trivia/play?category=${cat}`}
                  className="rounded-lg p-3 text-center text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    background: "#2d1845",
                    color: catInfo.color,
                    border: `1px solid ${catInfo.color}33`,
                  }}
                >
                  {catInfo.icon} {catInfo.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
