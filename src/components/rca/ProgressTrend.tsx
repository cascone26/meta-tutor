"use client";

import { useEffect, useState } from "react";
import { rcaClasses } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { getSubjectProgress, type SubjectProgress } from "@/lib/subject-progress";

type Row = { classId: string; name: string; progress: SubjectProgress };

export default function ProgressTrend() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setRows(null);
    const withContent = rcaClasses.filter((c) => rcaContent[c.id]);
    Promise.all(withContent.map((c) => getSubjectProgress(`rca-${c.id}`).then((progress) => ({ classId: c.id, name: c.name, progress }))))
      .then((all) => setRows(all.filter((r) => r.progress.history.length > 0)))
      .catch(() => setError(true));
  }

  useEffect(load, []);

  if (error) {
    return (
      <p className="text-sm rounded-xl p-4" style={{ background: "#fdf0f0", border: "1px solid #e0c0c0", color: "#a04a4a" }}>
        Couldn&apos;t load your progress trend — <button onClick={load} className="underline font-medium">retry</button>.
      </p>
    );
  }

  if (rows === null) {
    return <p className="text-sm" style={{ color: "#8a9a7c" }}>Loading…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm rounded-xl p-4" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3", color: "#8a9a7c" }}>
        No "test my understanding" checks run yet — once you do a few, they'll show up here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map(({ classId, name, progress }) => {
        const recent = progress.history.slice(0, 10);
        const avgPct = Math.round(recent.reduce((s, h) => s + h.percentage, 0) / recent.length);
        const last = progress.history[0];

        return (
          <div key={classId} className="rounded-2xl p-4" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-bold" style={{ color: "#33402c" }}>{name}</h3>
              <span className="text-xs" style={{ color: "#8a9a7c" }}>
                {progress.history.length} check{progress.history.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#e8e4d5" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${avgPct}%`, background: avgPct >= 75 ? "#6b8e5a" : avgPct >= 50 ? "#c9843a" : "#a04a4a" }}
                />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#33402c" }}>{avgPct}%</span>
            </div>

            {last && (
              <p className="text-xs" style={{ color: "#8a9a7c" }}>
                Last check: {new Date(last.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {last.score}/{last.total}
              </p>
            )}

            {progress.weakAreas.terms.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e8e4d5" }}>
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#6b8e5a" }}>
                  Recently missed
                </p>
                <ul className="text-xs space-y-1">
                  {progress.weakAreas.terms.slice(0, 3).map((t) => (
                    <li key={t} style={{ color: "#3a4a34" }}>— {t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
