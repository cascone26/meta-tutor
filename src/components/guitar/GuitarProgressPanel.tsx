"use client";

import { useEffect, useState } from "react";
import { getGuitarHistory, getXpStats, getStreak, getBadges, getCompletedLessons, getPracticeDates } from "@/lib/guitar/progress";
import type { SubjectProgress } from "@/lib/subject-progress";
import { TrophyIcon, FlameIcon, LockIcon } from "./GuitarIcons";

function last30Days(): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = 29; i >= 0; i--) {
    const day = new Date(d);
    day.setDate(d.getDate() - i);
    days.push(day.toISOString().split("T")[0]);
  }
  return days;
}

export default function GuitarProgressPanel() {
  const [history, setHistory] = useState<SubjectProgress | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [xpStats, setXpStats] = useState({ xp: 0, totalXp: 0, pct: 0 });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, lastPracticeDate: "" });
  const [badges, setBadges] = useState<ReturnType<typeof getBadges>>([]);
  const [practiceDates, setPracticeDates] = useState<Set<string>>(new Set());

  function load() {
    setLoadError(false);
    getGuitarHistory().then(setHistory).catch(() => setLoadError(true));
  }

  useEffect(() => {
    setXpStats(getXpStats());
    const s = getStreak();
    setStreak(s);
    setBadges(getBadges(getCompletedLessons(), s));
    setPracticeDates(new Set(getPracticeDates()));
    setMounted(true);
    load();
  }, []);

  const days = last30Days();
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="XP" value={`${xpStats.xp}`} sub={`${xpStats.pct}% of path`} />
        <Stat label="Current streak" value={`${streak.currentStreak}d`} sub={`best ${streak.longestStreak}d`} />
        <Stat label="Sessions logged" value={`${history?.history.length ?? "—"}`} sub="chord drills + songs" />
      </div>

      <div className="g-card p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FlameIcon size={16} className="shrink-0" />
          <h2 className="text-sm font-semibold" style={{ color: "var(--g-text)" }}>Last 30 days</h2>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {mounted && days.map((d) => (
            <div
              key={d}
              title={d}
              className="aspect-square rounded-[4px]"
              style={{ background: practiceDates.has(d) ? "var(--g-accent)" : "var(--g-border)" }}
            />
          ))}
        </div>
      </div>

      <div className="g-card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrophyIcon size={16} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--g-text)" }}>Badges</h2>
          </div>
          <span className="text-xs" style={{ color: "var(--g-muted)" }}>{earnedCount} / {badges.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className="rounded-xl px-3 py-2.5"
              style={{
                background: b.earned ? "var(--g-accent-wash)" : "var(--g-surface-2)",
                border: `1px solid ${b.earned ? "var(--g-accent)" : "var(--g-border)"}`,
                opacity: b.earned ? 1 : 0.6,
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                {b.earned ? <TrophyIcon size={13} /> : <LockIcon size={12} />}
                <span className="text-xs font-semibold" style={{ color: "var(--g-text)" }}>{b.name}</span>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: "var(--g-muted)" }}>{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="g-card p-4">
        <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--g-text)" }}>Chords that need more reps</h2>
        {loadError ? (
          <p className="text-sm">
            <span style={{ color: "var(--g-danger)" }}>Couldn&apos;t load this — </span>
            <button onClick={load} className="underline" style={{ color: "var(--g-danger)" }}>retry</button>
          </p>
        ) : !history ? (
          <p className="text-sm" style={{ color: "var(--g-muted)" }}>Loading…</p>
        ) : history.wrongAnswers.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--g-muted)" }}>No recurring misses yet — nice.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {history.wrongAnswers
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((w) => (
                <span key={w.term} className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--g-accent-wash)", color: "var(--g-accent-dark)", border: "1px solid var(--g-border)" }}>
                  {w.term} ×{w.count}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="g-card p-3 text-center">
      <div className="text-xl font-bold" style={{ color: "var(--g-accent)" }}>{value}</div>
      <div className="text-[11px]" style={{ color: "var(--g-text)" }}>{label}</div>
      <div className="text-[10px]" style={{ color: "var(--g-muted)" }}>{sub}</div>
    </div>
  );
}
