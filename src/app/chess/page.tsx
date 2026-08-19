"use client";

import { useEffect, useState } from "react";
import ChessGame from "@/components/chess/ChessGame";
import { getSubjectProgress } from "@/lib/subject-progress";
import { usePrefs } from "@/lib/chess-prefs";

const PHASES = ["opening", "middlegame", "endgame"];
const SEVERITIES = ["inaccuracy", "mistake", "blunder", "missedMate"];
const SEVERITY_LABEL: Record<string, string> = { inaccuracy: "Inaccuracies", mistake: "Mistakes", blunder: "Blunders", missedMate: "Missed mates" };
const PHASE_LABEL: Record<string, string> = { opening: "Opening", middlegame: "Middlegame", endgame: "Endgame" };

export default function ChessPage() {
  const [prefs] = usePrefs();
  const [weakAreas, setWeakAreas] = useState<{ terms: string[]; categories: string[] }>({ terms: [], categories: [] });
  const [gamesAnalyzed, setGamesAnalyzed] = useState(0);

  useEffect(() => {
    getSubjectProgress("chess").then((p) => {
      setWeakAreas(p.weakAreas);
      setGamesAnalyzed(p.history.length);
    });
  }, []);

  // weakAreas.categories mixes two dimensions (how bad + when it happened) — split them
  // so "you blunder in the opening" reads as an actual insight, not a flat tag cloud.
  const severities = weakAreas.categories.filter((c) => SEVERITIES.includes(c));
  const phases = weakAreas.categories.filter((c) => PHASES.includes(c));

  return (
    <div>
      <div className="max-w-4xl mx-auto px-5 pt-8">
        <h1 className="text-xl font-semibold mb-1">Chess</h1>
        <p className="text-sm" style={{ color: "#8fae9a" }}>
          Play against a real Stockfish engine (0-20 skill, fully adjustable), or drill tactics in Puzzle mode.
          Every move gets classified live — eval bar, move-quality tags, opening name, game review — and
          the board is yours to customize: themes, piece sets, sound, hints, clocks, and what&apos;s visible
          while you play.
        </p>
      </div>

      <ChessGame />

      {prefs.showWeakAreas && (
        <div className="max-w-4xl mx-auto px-5 pb-10">
          <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
            <h2 className="text-sm font-semibold mb-2">Recent weak areas (last 20 games)</h2>
            {gamesAnalyzed === 0 ? (
              <p className="text-sm" style={{ color: "#6f8a79" }}>No completed games yet — finish a game above to start building this.</p>
            ) : weakAreas.terms.length === 0 ? (
              <p className="text-sm" style={{ color: "#6f8a79" }}>No recurring mistakes yet — nice.</p>
            ) : (
              <>
                {phases.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs mb-1" style={{ color: "#6f8a79" }}>Where it happens</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {phases.map((p) => (
                        <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#0f1a14", color: "#8fae9a", border: "1px solid #24382c" }}>
                          {PHASE_LABEL[p] ?? p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {severities.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs mb-1" style={{ color: "#6f8a79" }}>What kind</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {severities.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#241812", color: "#d99a5c" }}>
                          {SEVERITY_LABEL[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs mb-1" style={{ color: "#6f8a79" }}>Specific moves</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {weakAreas.terms.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#0f1a14", color: "#e0e8e2", border: "1px solid #24382c" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
