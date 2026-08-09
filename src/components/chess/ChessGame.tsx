"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { createEngine, type ChessEngine } from "@/lib/chess-engine";
import { saveResult, logWrongAnswer } from "@/lib/subject-progress";

type Phase = "opening" | "middlegame" | "endgame";
type Severity = "blunder" | "mistake";

type Mistake = {
  moveNumber: number;
  san: string;
  phase: Phase;
  centipawnLoss: number;
  severity: Severity;
};

const SKILL_LEVELS: { label: string; value: number }[] = [
  { label: "Beginner", value: 2 },
  { label: "Intermediate", value: 10 },
  { label: "Strong", value: 18 },
];

function phaseForMove(moveNumber: number): Phase {
  if (moveNumber <= 10) return "opening";
  if (moveNumber <= 30) return "middlegame";
  return "endgame";
}

export default function ChessGame() {
  const gameRef = useRef(new Chess());
  const engineRef = useRef<ChessEngine | null>(null);

  const [fen, setFen] = useState(gameRef.current.fen());
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [skillLevel, setSkillLevel] = useState(10);
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState<"playing" | "over">("playing");
  const [resultText, setResultText] = useState("");
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    engineRef.current = createEngine();
    return () => {
      engineRef.current?.terminate();
      engineRef.current = null;
    };
  }, []);

  const checkGameOver = useCallback((): boolean => {
    const game = gameRef.current;
    if (!game.isGameOver()) return false;
    let text = "Game over";
    if (game.isCheckmate()) text = `Checkmate — ${game.turn() === "w" ? "Black" : "White"} wins`;
    else if (game.isStalemate()) text = "Draw by stalemate";
    else if (game.isThreefoldRepetition()) text = "Draw by repetition";
    else if (game.isInsufficientMaterial()) text = "Draw — insufficient material";
    else if (game.isDraw()) text = "Draw";
    setResultText(text);
    setStatus("over");
    return true;
  }, []);

  const analyzeMove = useCallback(async (fenBefore: string, fenAfter: string, san: string, moveNumber: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    try {
      const [evalBefore, evalAfterOpp] = await Promise.all([engine.evaluate(fenBefore, 12), engine.evaluate(fenAfter, 12)]);
      if (evalBefore === null || evalAfterOpp === null) return;
      const evalAfterMine = -evalAfterOpp;
      const centipawnLoss = evalBefore - evalAfterMine;

      let severity: Severity | null = null;
      if (centipawnLoss >= 200) severity = "blunder";
      else if (centipawnLoss >= 90) severity = "mistake";

      if (severity) {
        const phase = phaseForMove(moveNumber);
        const mistake: Mistake = { moveNumber, san, phase, centipawnLoss, severity };
        setMistakes((prev) => [...prev, mistake]);
        logWrongAnswer(
          "chess",
          `${severity === "blunder" ? "Blunder" : "Mistake"}: ${san} (move ${moveNumber})`,
          `Played ${san} on move ${moveNumber} in the ${phase}, losing roughly ${centipawnLoss} centipawns of evaluation compared to the engine's best continuation.`,
          phase,
          "play"
        );
      }
    } catch (e) {
      console.error("Move analysis failed:", e);
    }
  }, []);

  const maybeBotMove = useCallback(async () => {
    const game = gameRef.current;
    const engine = engineRef.current;
    if (!engine || game.isGameOver() || game.turn() === playerColor) return;
    setThinking(true);
    try {
      const best = await engine.getBestMove(game.fen(), { skillLevel, movetimeMs: 700 });
      if (best) {
        game.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best.slice(4, 5) || "q" });
        setFen(game.fen());
      }
    } finally {
      setThinking(false);
      checkGameOver();
    }
  }, [playerColor, skillLevel, checkGameOver]);

  // Fires after every fen change (player move OR bot move). No-ops if it isn't the bot's turn.
  useEffect(() => {
    if (status === "playing") maybeBotMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, status]);

  // Log the game's summary once, when it ends.
  useEffect(() => {
    if (status !== "over" || saved) return;
    setSaved(true);
    const blunders = mistakes.filter((m) => m.severity === "blunder").length;
    const errors = mistakes.length;
    const percentage = Math.max(0, Math.round(100 - blunders * 15 - (errors - blunders) * 7));
    saveResult("chess", {
      mode: "play",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score: Math.max(0, 10 - errors),
      total: 10,
      percentage,
      weakTerms: mistakes.map((m) => `${m.san} (move ${m.moveNumber})`),
      weakCategories: Array.from(new Set(mistakes.map((m) => m.phase))),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
      const game = gameRef.current;
      if (!targetSquare || status !== "playing" || thinking || game.turn() !== playerColor) return false;

      const fenBefore = game.fen();
      let move;
      try {
        move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      } catch {
        return false;
      }
      const fenAfter = game.fen();
      const moveNumber = game.moveNumber();
      setFen(fenAfter);
      analyzeMove(fenBefore, fenAfter, move.san, moveNumber);
      checkGameOver();
      return true;
    },
    [playerColor, status, thinking, analyzeMove, checkGameOver]
  );

  function resign() {
    setResultText(`Resigned — ${playerColor === "w" ? "Black" : "White"} wins`);
    setStatus("over");
  }

  function newGame() {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setStatus("playing");
    setResultText("");
    setMistakes([]);
    setSaved(false);
  }

  function switchColor(color: "w" | "b") {
    setPlayerColor(color);
    newGame();
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto px-5 py-6">
      <div className="w-full md:w-[420px] shrink-0">
        <Chessboard
          options={{
            position: fen,
            onPieceDrop,
            boardOrientation: playerColor === "w" ? "white" : "black",
            allowDragging: status === "playing" && !thinking && gameRef.current.turn() === playerColor,
            darkSquareStyle: { backgroundColor: "#3f6b4f" },
            lightSquareStyle: { backgroundColor: "#e8f0ea" },
          }}
        />
        <div className="flex items-center justify-between mt-3 text-sm" style={{ color: "#8fae9a" }}>
          <span>{status === "over" ? resultText : thinking ? "Thinking…" : gameRef.current.turn() === playerColor ? "Your move" : "Bot's move"}</span>
          <div className="flex gap-2">
            {status === "playing" && (
              <button onClick={resign} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "#182620", border: "1px solid #24382c" }}>
                Resign
              </button>
            )}
            <button onClick={newGame} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "#182620", border: "1px solid #24382c" }}>
              New game
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-xl p-4 mb-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
          <h2 className="text-sm font-semibold mb-3">Setup</h2>
          <div className="mb-3">
            <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Play as</p>
            <div className="flex gap-1.5">
              {(["w", "b"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => switchColor(c)}
                  className="px-3 py-1 rounded-lg text-xs"
                  style={{
                    background: playerColor === c ? "#3f6b4f" : "#0f1a14",
                    border: "1px solid #24382c",
                  }}
                >
                  {c === "w" ? "White" : "Black"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Bot strength</p>
            <div className="flex gap-1.5">
              {SKILL_LEVELS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSkillLevel(s.value)}
                  className="px-3 py-1 rounded-lg text-xs"
                  style={{
                    background: skillLevel === s.value ? "#3f6b4f" : "#0f1a14",
                    border: "1px solid #24382c",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
          <h2 className="text-sm font-semibold mb-2">This game</h2>
          {mistakes.length === 0 ? (
            <p className="text-sm" style={{ color: "#6f8a79" }}>No mistakes flagged yet — engine checks every move you make.</p>
          ) : (
            <div className="space-y-1.5">
              {mistakes.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>
                    {m.san} <span style={{ color: "#6f8a79" }}>(move {m.moveNumber}, {m.phase})</span>
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: m.severity === "blunder" ? "#3a1a1a" : "#3a2a14",
                      color: m.severity === "blunder" ? "#e08a8a" : "#e0b06a",
                    }}
                  >
                    {m.severity} (-{m.centipawnLoss}cp)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
