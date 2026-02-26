"use client";

import { useState, useEffect } from "react";
import { glossary, categories } from "@/lib/glossary";
import { getSRData, getTermStats, getDueTerms } from "@/lib/spaced-repetition";
import { getHistory, getWeakAreas } from "@/lib/study-history";
import { getStreakData } from "@/lib/streaks";
import { getTodayStudyTime, formatTime } from "@/lib/session-timer";
import { getWrongAnswersList } from "@/lib/wrong-answers";
import Link from "next/link";

export default function ReviewPage() {
  const [dueTerms, setDueTerms] = useState<string[]>([]);
  const [srStats, setSrStats] = useState({ total: 0, due: 0, learning: 0, reviewing: 0, mastered: 0 });
  const [weakAreas, setWeakAreas] = useState<{ terms: string[]; categories: string[] }>({ terms: [], categories: [] });
  const [streak, setStreak] = useState(0);
  const [todayTime, setTodayTime] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [recentMode, setRecentMode] = useState("");

  useEffect(() => {
    const sr = getSRData();
    setSrStats(getTermStats(sr));
    setDueTerms(getDueTerms(sr));
    setWeakAreas(getWeakAreas());
    setStreak(getStreakData().currentStreak);
    setTodayTime(getTodayStudyTime());
    setWrongCount(getWrongAnswersList().length);

    const history = getHistory();
    if (history.length > 0) setRecentMode(history[0].mode);
  }, []);

  // Suggest a study mode based on state
  function getSuggestion(): { mode: string; reason: string; link: string } {
    if (dueTerms.length >= 5) {
      return { mode: "Learn", reason: `${dueTerms.length} terms are due for review`, link: "/study" };
    }
    if (wrongCount >= 3) {
      return { mode: "Wrong Answer Journal", reason: `${wrongCount} terms to drill from past mistakes`, link: "/journal" };
    }
    if (weakAreas.terms.length > 0) {
      return { mode: "Multiple Choice", reason: "Focus on your weak areas with quick quizzes", link: "/study" };
    }
    if (srStats.mastered < glossary.length * 0.5) {
      return { mode: "Learn", reason: "Work toward mastering more terms", link: "/study" };
    }
    if (recentMode === "Learn" || recentMode === "Multiple Choice") {
      return { mode: "Practice", reason: "Switch it up — try essay practice", link: "/study" };
    }
    return { mode: "Flashcards", reason: "Quick review to keep things fresh", link: "/study" };
  }

  const suggestion = getSuggestion();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Today&apos;s Review
        </h1>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Your personalized study plan for today.
        </p>

        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>{streak}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Day streak</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-bold" style={{ color: dueTerms.length > 0 ? "#c96b6b" : "#6ab070" }}>{dueTerms.length}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Due today</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{srStats.mastered}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Mastered</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{formatTime(todayTime)}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Today</p>
          </div>
        </div>

        {/* Suggested action */}
        <div
          className="rounded-xl p-5 mb-5"
          style={{ background: "var(--accent-light)", border: "1px solid var(--accent)" + "30" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Suggested for you</p>
          <h2 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>{suggestion.mode}</h2>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>{suggestion.reason}</p>
          <Link
            href={suggestion.link}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Start studying
          </Link>
        </div>

        {/* Due terms */}
        {dueTerms.length > 0 && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "#fce4ec20", border: "1px solid #c96b6b30" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm" style={{ color: "#c96b6b" }}>
                Due for review ({dueTerms.length})
              </h3>
              <Link href="/study" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                Study now
              </Link>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {dueTerms.slice(0, 20).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                  {t}
                </span>
              ))}
              {dueTerms.length > 20 && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>+{dueTerms.length - 20} more</span>
              )}
            </div>
          </div>
        )}

        {/* Weak areas */}
        {weakAreas.terms.length > 0 && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Weak spots</h3>
              <Link href="/journal" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                Drill these
              </Link>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {weakAreas.terms.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fce4ec", color: "#c96b6b" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category progress */}
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--foreground)" }}>Category progress</h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const catTerms = glossary.filter((g) => g.category === cat);
              const sr = getSRData();
              const mastered = catTerms.filter((t) => sr[t.term]?.reps >= 3).length;
              const pct = catTerms.length > 0 ? Math.round((mastered / catTerms.length) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--foreground)" }}>{cat}</span>
                    <span style={{ color: "var(--muted)" }}>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ background: pct >= 80 ? "#6ab070" : pct >= 50 ? "#d4a843" : "var(--accent)", width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
