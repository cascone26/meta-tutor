"use client";

import { useEffect, useState } from "react";
import { getGuitarHistory, getXpStats, getStreak } from "@/lib/guitar/progress";
import type { SubjectProgress } from "@/lib/subject-progress";

export default function GuitarProgressPanel() {
  const [history, setHistory] = useState<SubjectProgress | null>(null);
  const [loadError, setLoadError] = useState(false);
  const xpStats = getXpStats();
  const streak = getStreak();

  function load() {
    setLoadError(false);
    getGuitarHistory()
      .then(setHistory)
      .catch(() => setLoadError(true));
  }

  useEffect(load, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="XP" value={`${xpStats.xp}`} sub={`${xpStats.pct}% of path`} />
        <Stat label="Current streak" value={`${streak.currentStreak}d`} sub={`best ${streak.longestStreak}d`} />
        <Stat label="Sessions logged" value={`${history?.history.length ?? "—"}`} sub="chord drills + play-along" />
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Chords that need more reps</h2>
        {loadError ? (
          <p className="text-sm">
            <span style={{ color: "#d88a8a" }}>Couldn&apos;t load this — </span>
            <button onClick={load} className="underline" style={{ color: "#d88a8a" }}>retry</button>
          </p>
        ) : !history ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading…</p>
        ) : history.wrongAnswers.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>No recurring misses yet — nice.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {history.wrongAnswers
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((w) => (
                <span key={w.term} className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid var(--border)" }}>
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
    <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{value}</div>
      <div className="text-[11px]" style={{ color: "var(--foreground)" }}>{label}</div>
      <div className="text-[10px]" style={{ color: "var(--muted)" }}>{sub}</div>
    </div>
  );
}
