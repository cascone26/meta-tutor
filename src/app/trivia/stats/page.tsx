"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TriviaUserProgress, TriviaCategory } from "@/lib/trivia-types";
import { TRIVIA_CATEGORIES, ALL_TRIVIA_CATEGORIES } from "@/lib/trivia-categories";

export default function TriviaStatsPage() {
  // Initialize categoryStats with all categories
  const initCategoryStats = (): Record<TriviaCategory, { answered: number; correct: number }> => {
    const stats = {} as Record<TriviaCategory, { answered: number; correct: number }>;
    ALL_TRIVIA_CATEGORIES.forEach((cat) => {
      stats[cat] = { answered: 0, correct: 0 };
    });
    return stats;
  };

  const [progress, setProgress] = useState<TriviaUserProgress>({
    totalAnswered: 0,
    totalCorrect: 0,
    streak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    categoryStats: initCategoryStats(),
    dailyStats: {},
    level: 1,
    xp: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch("/api/trivia-progress");
        if (res.ok) {
          const data = await res.json();
          // Build category stats from API response
          const categoryStats = initCategoryStats();
          (data.categoryStats || []).forEach(
            (stat: { category: string; answered: number; correct: number }) => {
              const cat = stat.category as TriviaCategory;
              categoryStats[cat] = {
                answered: stat.answered,
                correct: stat.correct,
              };
            }
          );

          setProgress({
            totalAnswered: data.progress.total_answered || 0,
            totalCorrect: data.progress.total_correct || 0,
            streak: data.progress.streak || 0,
            longestStreak: data.progress.longest_streak || 0,
            lastPlayedDate: data.progress.last_played_date,
            categoryStats,
            dailyStats: {},
            level: data.progress.level || 1,
            xp: data.progress.xp || 0,
          });
        }
      } catch (e) {
        console.error("Failed to load trivia stats:", e);
      }
      setMounted(true);
    };

    loadProgress();
  }, []);

  if (!mounted) return null;

  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  // daily data for last 14 days
  const dailyData: {
    date: string;
    label: string;
    answered: number;
    accuracy: number;
  }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dailyData.push({
      date: dateStr,
      label,
      answered: Math.floor(Math.random() * 50), // placeholder
      accuracy: Math.floor(Math.random() * 100),
    });
  }

  // category performance
  const categoryData = ALL_TRIVIA_CATEGORIES
    .map((cat) => ({
      key: cat,
      ...TRIVIA_CATEGORIES[cat],
      ...progress.categoryStats[cat],
      accuracy:
        progress.categoryStats[cat].answered > 0
          ? Math.round(
              (progress.categoryStats[cat].correct /
                progress.categoryStats[cat].answered) *
                100
            )
          : null,
    }))
    .sort((a, b) => (b.answered || 0) - (a.answered || 0));

  function getBarColor(acc: number | null) {
    if (!acc) return "#6b21a8";
    if (acc >= 70) return "#10b981";
    if (acc >= 50) return "#f59e0b";
    return "#ef4444";
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#1a0f1f", color: "#f3e8ff" }}
    >
      <div className="max-w-4xl mx-auto px-5 pt-8 pb-10 space-y-5">
        <h1
          className="text-2xl font-bold text-center"
          style={{ color: "#f472b6" }}
        >
          Stats
        </h1>

        {/* Overview */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: progress.totalAnswered,
              label: "Total Questions",
              color: "#f3e8ff",
            },
            {
              value: `${accuracy}%`,
              label: "Accuracy",
              color:
                accuracy >= 70 ? "#10b981" : accuracy >= 50 ? "#f59e0b" : "#ef4444",
            },
            { value: progress.streak, label: "Current Streak", color: "#f3e8ff" },
            { value: progress.level, label: "Level", color: "#f472b6" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-lg p-4 text-center"
              style={{
                background: "#2d1845",
                borderColor: "#6b21a8",
                border: "1px solid",
              }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "#d8b4fe" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        <div
          className="rounded-lg p-4"
          style={{
            background: "#2d1845",
            borderColor: "#6b21a8",
            border: "1px solid",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest" style={{ color: "#d8b4fe" }}>
              Last 14 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dailyData} barCategoryGap="15%">
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#a78bfa" }}
                tickLine={false}
                axisLine={false}
                interval={1}
                tickFormatter={(val: string) => val.split(" ")[1] || val}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1a0f1f",
                  border: "1px solid #6b21a8",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#f3e8ff",
                }}
              />
              <Bar
                dataKey="answered"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              >
                {dailyData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.answered === 0
                        ? "#6b21a8"
                        : getBarColor(entry.accuracy)
                    }
                    opacity={entry.answered === 0 ? 0.3 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div
          className="rounded-lg p-4"
          style={{
            background: "#2d1845",
            borderColor: "#6b21a8",
            border: "1px solid",
          }}
        >
          <span className="text-xs uppercase tracking-widest" style={{ color: "#d8b4fe" }}>
            Categories
          </span>
          <div className="space-y-3 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm">
                    {cat.icon} {cat.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {cat.accuracy !== null ? (
                      <span className="text-xs font-mono" style={{ color: getBarColor(cat.accuracy) }}>
                        {cat.accuracy}%
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "#a78bfa" }}>
                        —
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${((cat.answered || 0) / Math.max(...categoryData.map(c => c.answered || 0), 1)) * 100}%`,
                      background: getBarColor(cat.accuracy),
                    }}
                  />
                </div>
                <div className="text-xs mt-1" style={{ color: "#a78bfa" }}>
                  {cat.answered || 0} answered
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
