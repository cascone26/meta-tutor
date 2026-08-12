"use client";

import { useEffect, useState } from "react";
import { FlameIcon } from "./NatureIcons";

type Progress = {
  streak: { current: number; longest: number; activeToday: boolean };
  last14: { date: string; weekday: string; active: boolean }[];
  totalSessions: number;
  topWeakAreas: string[];
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

  if (loading) return null;
  if (!progress || progress.totalSessions === 0) {
    return (
      <div className="rounded-2xl p-5 mb-8" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3", backdropFilter: "blur(10px)" }}>
        <p className="text-sm" style={{ color: "#5c6b52" }}>
          Run your first understanding-check on any class below and this turns into a real streak + activity tracker.
        </p>
      </div>
    );
  }

  const { streak, last14, topWeakAreas } = progress;

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
