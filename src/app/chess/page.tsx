"use client";

import { useEffect, useState } from "react";
import ChessGame from "@/components/chess/ChessGame";
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
    <div>
      <div className="max-w-4xl mx-auto px-5 pt-8">
        <h1 className="text-xl font-semibold mb-1">Chess</h1>
        <p className="text-sm" style={{ color: "#8fae9a" }}>
          Play against a real Stockfish engine (0-20 skill, fully adjustable), or drill tactics in Puzzle mode.
          Every move gets classified live — eval bar, move-quality tags, opening name, game review — and
          the board is yours to customize: themes, piece sets, sound, hints, clocks.
        </p>
      </div>

      <ChessGame />

      <div className="max-w-4xl mx-auto px-5 pb-10">
        <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
          <h2 className="text-sm font-semibold mb-2">Recent weak areas (last 20 games)</h2>
          {gamesAnalyzed === 0 ? (
            <p className="text-sm" style={{ color: "#6f8a79" }}>No completed games yet — finish a game above to start building this.</p>
          ) : (
            <div className="flex gap-1.5 flex-wrap">
              {weakAreas.terms.length === 0 ? (
                <p className="text-sm" style={{ color: "#6f8a79" }}>No recurring mistakes yet — nice.</p>
              ) : (
                weakAreas.terms.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#241812", color: "#d99a5c" }}>
                    {t}
                  </span>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
