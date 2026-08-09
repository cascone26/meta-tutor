"use client";

import { useEffect, useState } from "react";
import { getSubjectProgress } from "@/lib/subject-progress";

export default function ChessPage() {
  const [weakAreas, setWeakAreas] = useState<{ terms: string[]; categories: string[] }>({ terms: [], categories: [] });
  const [gamesAnalyzed, setGamesAnalyzed] = useState(0);

  useEffect(() => {
    getSubjectProgress("chess").then((p) => {
      setWeakAreas(p.weakAreas);
      setGamesAnalyzed(p.history.length);
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <h1 className="text-xl font-semibold mb-1">Chess</h1>
      <p className="text-sm mb-8" style={{ color: "#8fae9a" }}>
        Play, get engine-analyzed, and see exactly what you keep getting wrong.
      </p>

      <div className="rounded-xl p-4 mb-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
        <h2 className="text-sm font-semibold mb-1">Coming next</h2>
        <ul className="text-sm space-y-1.5 mt-2" style={{ color: "#a8c2b0" }}>
          <li>&mdash; Embedded board + bot opponent, play directly here</li>
          <li>&mdash; Every game analyzed by Stockfish for blunders/inaccuracies by phase</li>
          <li>&mdash; Weakness patterns synthesized in plain language ("you keep hanging pieces after move 20")</li>
        </ul>
      </div>

      <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
        <h2 className="text-sm font-semibold mb-2">Your weak areas</h2>
        {gamesAnalyzed === 0 ? (
          <p className="text-sm" style={{ color: "#6f8a79" }}>No games analyzed yet.</p>
        ) : (
          <div className="flex gap-1.5 flex-wrap">
            {weakAreas.terms.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#241812", color: "#d99a5c" }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
