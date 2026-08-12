"use client";

import { useEffect, useState } from "react";
import { FlameIcon } from "./NatureIcons";

type ModeStat = { mode: string; label: string; count: number; avgPercentage: number };

type Progress = {
  streak: { current: number; longest: number; activeToday: boolean };
  last14: { date: string; weekday: string; active: boolean }[];
  totalSessions: number;
  topWeakAreas: string[];
  modeStats: ModeStat[];
};

// The "tracking, streaks, days" dashboard — aggregates across ALL RCA classes
// (Saxon, Latin, Religion, everything), not per-class. This is the research-backed
// habit-formation layer: a visible streak + a 14-day activity strip is the same
// mechanic Duolingo/Anki use to keep spaced practice from silently lapsing.
export default function RcaDashboard() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rca-progress")
      .then((r) => (r.ok ? r.json() : null))
      .then(setProgress)
      .finally(() => setLoading(false));
  }, []);

  // No placeholder box for the empty state anymore — DailyVerse (rendered
  // just above this on the page) already fills that "first thing you see"
  // slot, so an empty streak card here would just be redundant filler.
  if (loading || !progress || progress.totalSessions === 0) return null;

  const { streak, last14, topWeakAreas, modeStats } = progress;
  const bestMode = modeStats.length > 1 ? [...modeStats].sort((a, b) => b.avgPercentage - a.avgPercentage)[0] : null;

  return (
    <div
      className="rounded-2xl p-5 mb-8"
      style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3", backdropFilter: "blur(10px)", boxShadow: "0 8px 30px -12px rgba(63,126,166,0.2)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FlameIcon size={22} style={{ color: streak.current > 0 ? "#c9843a" : "#8a9a7c" }} />
          <div>
            <p className="text-lg font-bold leading-tight" style={{ color: "#33402c" }}>
              {streak.current} day{streak.current === 1 ? "" : "s"}
            </p>
            <p className="text-[11px]" style={{ color: "#8a9a7c" }}>
              {streak.current === 0 ? "start today" : streak.activeToday ? "streak — nice" : "keep it going today"}
            </p>
          </div>
        </div>
        {streak.longest > streak.current && (
          <p className="text-xs" style={{ color: "#8a9a7c" }}>Best: {streak.longest} days</p>
        )}
      </div>

      <div className="flex gap-1.5 mb-4">
        {last14.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-md"
              style={{ height: 20, background: d.active ? "#6b8e5a" : "rgba(107,142,90,0.15)" }}
            />
            <span className="text-[9px]" style={{ color: "#8a9a7c" }}>{d.weekday}</span>
          </div>
        ))}
      </div>

      {modeStats.length > 0 && (
        <div style={{ borderTop: "1px solid #e6e0d0" }} className="pt-3 mb-3">
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#2f5e7a" }}>
            What you&apos;re actually using
            {bestMode && <span style={{ color: "#8a9a7c", fontWeight: 400 }}> — {bestMode.label} is working best ({bestMode.avgPercentage}%)</span>}
          </p>
          <div className="space-y-1">
            {modeStats.map((m) => (
              <div key={m.mode} className="flex items-center gap-2 text-xs">
                <span className="w-28 shrink-0" style={{ color: "#3a4a34" }}>{m.label}</span>
                <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: "rgba(107,142,90,0.15)" }}>
                  <div style={{ width: `${m.avgPercentage}%`, height: "100%", background: m.mode === bestMode?.mode ? "#c9843a" : "#6b8e5a" }} />
                </div>
                <span style={{ color: "#8a9a7c", width: 60, textAlign: "right" }}>{m.count}× · {m.avgPercentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topWeakAreas.length > 0 && (
        <div style={{ borderTop: "1px solid #e6e0d0" }} className="pt-3">
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#8a6a2e" }}>Recurring gaps, across every class</p>
          <div className="flex gap-1.5 flex-wrap">
            {topWeakAreas.map((a) => (
              <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fdf0e0", color: "#8a6a2e" }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
