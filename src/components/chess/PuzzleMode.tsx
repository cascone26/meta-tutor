"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { nextPuzzle, type Puzzle } from "@/lib/chess-puzzles";
import { playSound } from "@/lib/chess-sound";
import { getSubjectProgress, saveResult, logWrongAnswer } from "@/lib/subject-progress";
import { getBoardTheme, type ChessPrefs } from "@/lib/chess-prefs";
import { minimalPieces, neonPieces } from "./pieceSets";

export default function PuzzleMode({ prefs }: { prefs: ChessPrefs }) {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => nextPuzzle([]));
  const [solved, setSolved] = useState<string[]>([]);
  const [status, setStatus] = useState<"solving" | "correct" | "wrong">("solving");
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const gameRef = useRef(new Chess(puzzle.fen));
  const [fen, setFen] = useState(puzzle.fen);

  useEffect(() => {
    getSubjectProgress("chess-puzzles")
      .then((p) => {
        const scores = p.history.map((h) => h.score);
        if (scores.length) setBest(Math.max(...scores));
      })
      .catch(() => {}); // best-streak display — a failure just means it stays at 0, not a false claim
  }, []);

  const sideToMove = puzzle.fen.split(" ")[1] as "w" | "b";
  const theme = getBoardTheme(prefs.boardTheme);
  const pieces = prefs.pieceSet === "minimal" ? minimalPieces : prefs.pieceSet === "neon" ? neonPieces : undefined;

  function loadNext() {
    const nextSolved = solved.slice(-13); // keep the pool from going fully stale
    const p = nextPuzzle(nextSolved);
    gameRef.current = new Chess(p.fen);
    setPuzzle(p);
    setFen(p.fen);
    setStatus("solving");
  }

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
      if (!targetSquare || status !== "solving") return false;
      const [expectedFrom, expectedTo] = [puzzle.move.slice(0, 2), puzzle.move.slice(2, 4)];
      if (sourceSquare !== expectedFrom || targetSquare !== expectedTo) {
        setStatus("wrong");
        playSound("wrong", prefs.soundOn);
        logWrongAnswer("chess-puzzles", `${puzzle.theme} (${puzzle.id})`, `Correct move was ${puzzle.move}`, puzzle.theme, "puzzle");
        setStreak(0);
        return false;
      }
      try {
        gameRef.current.move({ from: sourceSquare, to: targetSquare, promotion: puzzle.move.slice(4, 5) || "q" });
      } catch {
        return false;
      }
      setFen(gameRef.current.fen());
      setStatus("correct");
      playSound(gameRef.current.isCheckmate() ? "gameEnd" : "capture", prefs.soundOn);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setSolved((prev) => [...prev, puzzle.id]);
      saveResult("chess-puzzles", {
        mode: "puzzle",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score: newStreak,
        total: newStreak,
        percentage: 100,
        weakTerms: [],
        weakCategories: [],
      });
      return true;
    },
    [status, puzzle, gameRef, streak, prefs.soundOn]
  );

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 max-w-4xl mx-auto px-5 py-6">
      <div className="w-full md:w-[420px] shrink-0" style={{ width: `min(100%, ${prefs.boardSizePct * 4.2}px)` }}>
        <Chessboard
          options={{
            position: fen,
            onPieceDrop,
            boardOrientation: sideToMove === "w" ? "white" : "black",
            darkSquareStyle: { backgroundColor: theme.dark },
            lightSquareStyle: { backgroundColor: theme.light },
            showNotation: prefs.showCoordinates,
            pieces,
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-xl p-4 mb-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold" style={{ color: "#e0e8e2" }}>Tactics trainer</h2>
            <span className="text-xs" style={{ color: "#8fae9a" }}>Streak {streak} · Best {best}</span>
          </div>
          <p className="text-xs mb-1" style={{ color: "#8fae9a" }}>
            {sideToMove === "w" ? "White" : "Black"} to move — {puzzle.theme}
          </p>

          {status === "solving" && (
            <p className="text-sm" style={{ color: "#e0e8e2" }}>Find the best move on the board.</p>
          )}
          {status === "wrong" && (
            <div>
              <p className="text-sm mb-2" style={{ color: "#e08a8a" }}>Not quite — try again, or skip to the next puzzle.</p>
              <button onClick={() => setStatus("solving")} className="px-3 py-1.5 rounded-lg text-xs mr-2" style={{ background: "#3f6b4f" }}>
                Try again
              </button>
              <button onClick={loadNext} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "#0f1a14", border: "1px solid #24382c" }}>
                Skip
              </button>
            </div>
          )}
          {status === "correct" && (
            <div>
              <p className="text-sm mb-2" style={{ color: "#7ac48a" }}>{puzzle.explain}</p>
              <button onClick={loadNext} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "#3f6b4f" }}>
                Next puzzle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
