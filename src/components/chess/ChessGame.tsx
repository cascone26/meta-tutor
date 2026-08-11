"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess, validateFen, type Square, type PieceSymbol } from "chess.js";
import { Chessboard } from "react-chessboard";
import { createEngine, type ChessEngine, type EngineEval } from "@/lib/chess-engine";
import { classifyMove, accuracyFromClasses, type MoveClass } from "@/lib/chess-classify";
import { getOpeningName } from "@/lib/chess-openings";
import { getMaterial } from "@/lib/chess-material";
import { playSound } from "@/lib/chess-sound";
import { usePrefs, getBoardTheme } from "@/lib/chess-prefs";
import { saveResult, logWrongAnswer } from "@/lib/subject-progress";
import EvalBar from "./EvalBar";
import MoveList, { type MoveEntry } from "./MoveList";
import PromotionDialog from "./PromotionDialog";
import SettingsPanel from "./SettingsPanel";
import GameReview from "./GameReview";
import PuzzleMode from "./PuzzleMode";
import { minimalPieces, neonPieces } from "./pieceSets";

const SKILL_PRESETS: { label: string; value: number }[] = [
  { label: "Beginner", value: 1 },
  { label: "Casual", value: 6 },
  { label: "Intermediate", value: 11 },
  { label: "Strong", value: 16 },
  { label: "Master", value: 20 },
];

const TIME_CONTROLS: { label: string; initialSec: number | null; incrementSec: number }[] = [
  { label: "Unlimited", initialSec: null, incrementSec: 0 },
  { label: "Bullet 1+0", initialSec: 60, incrementSec: 0 },
  { label: "Blitz 3+2", initialSec: 180, incrementSec: 2 },
  { label: "Blitz 5+0", initialSec: 300, incrementSec: 0 },
  { label: "Rapid 10+5", initialSec: 600, incrementSec: 5 },
];

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type SquareStyles = Record<string, React.CSSProperties>;

const BAD_TIERS: MoveClass[] = ["inaccuracy", "mistake", "blunder", "missedMate"];

function fmtClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function ChessGame() {
  const [mode, setMode] = useState<"play" | "puzzles">("play");
  const [prefs, updatePrefs] = usePrefs();

  const gameRef = useRef(new Chess());
  const engineRef = useRef<ChessEngine | null>(null);

  const [fen, setFen] = useState(gameRef.current.fen());
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [skillLevel, setSkillLevel] = useState(11);
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState<"playing" | "over">("playing");
  const [resultText, setResultText] = useState("");
  const [moves, setMoves] = useState<MoveEntry[]>([]);
  const [moveClasses, setMoveClasses] = useState<Record<number, MoveClass>>({});
  const [liveEval, setLiveEval] = useState<{ eval: EngineEval; sideToMove: "w" | "b" } | null>(null);
  const [hintArrow, setHintArrow] = useState<{ from: string; to: string } | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [promotionPending, setPromotionPending] = useState<{ from: string; to: string; color: "w" | "b" } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [fenInput, setFenInput] = useState("");
  const [fenError, setFenError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [timeControlIdx, setTimeControlIdx] = useState(0);
  const [whiteMs, setWhiteMs] = useState<number | null>(null);
  const [blackMs, setBlackMs] = useState<number | null>(null);

  useEffect(() => {
    engineRef.current = createEngine();
    return () => {
      engineRef.current?.terminate();
      engineRef.current = null;
    };
  }, []);

  // Clock ticking — only while a timed game is in progress.
  useEffect(() => {
    const tc = TIME_CONTROLS[timeControlIdx];
    if (tc.initialSec === null || status !== "playing") return;
    const interval = setInterval(() => {
      const turn = gameRef.current.turn();
      if (turn === "w") {
        setWhiteMs((v) => {
          const next = (v ?? 0) - 100;
          if (next <= 0) {
            setStatus("over");
            setResultText("White flagged — Black wins on time");
          }
          return next;
        });
      } else {
        setBlackMs((v) => {
          const next = (v ?? 0) - 100;
          if (next <= 0) {
            setStatus("over");
            setResultText("Black flagged — White wins on time");
          }
          return next;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [timeControlIdx, status]);

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
    playSound("gameEnd", prefs.soundOn);
    return true;
  }, [prefs.soundOn]);

  const analyzeMove = useCallback(
    async (fenBefore: string, fenAfter: string, ply: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      try {
        const [evalBefore, evalAfterOpp] = await Promise.all([engine.evaluate(fenBefore, 12), engine.evaluate(fenAfter, 12)]);
        if (evalBefore === null || evalAfterOpp === null) return;

        const opponentColor = fenAfter.split(" ")[1] as "w" | "b";
        setLiveEval({ eval: evalAfterOpp, sideToMove: opponentColor });

        const { cls } = classifyMove(evalBefore, evalAfterOpp);
        setMoveClasses((prev) => ({ ...prev, [ply]: cls }));

        if (BAD_TIERS.includes(cls)) {
          const san = gameRef.current.history()[ply];
          const moveNumber = Math.floor(ply / 2) + 1;
          logWrongAnswer(
            "chess",
            `${cls === "missedMate" ? "Missed mate" : cls}: ${san} (move ${moveNumber})`,
            `Played ${san} on move ${moveNumber}.`,
            cls,
            "play"
          );
        }
      } catch (e) {
        console.error("Move analysis failed:", e);
      }
    },
    []
  );

  const maybeBotMove = useCallback(async () => {
    const game = gameRef.current;
    const engine = engineRef.current;
    if (!engine || game.isGameOver() || game.turn() === playerColor) return;
    setThinking(true);
    setHintArrow(null);
    try {
      const best = await engine.getBestMove(game.fen(), { skillLevel, movetimeMs: 300 + skillLevel * 60 });
      if (best) {
        const move = game.move({ from: best.move.slice(0, 2), to: best.move.slice(2, 4), promotion: best.move.slice(4, 5) || "q" });
        const newFen = game.fen();
        setFen(newFen);
        setMoves((prev) => [...prev, { san: move.san }]);
        playSound(move.captured ? "capture" : move.san.includes("O-O") ? "castle" : "move", prefs.soundOn);
        const evalNow = await engine.evaluate(newFen, 10);
        if (evalNow) setLiveEval({ eval: evalNow, sideToMove: newFen.split(" ")[1] as "w" | "b" });
        if (TIME_CONTROLS[timeControlIdx].incrementSec && game.turn() === playerColor) {
          const inc = TIME_CONTROLS[timeControlIdx].incrementSec * 1000;
          if (game.turn() === "w") setBlackMs((v) => (v !== null ? v + inc : v));
          else setWhiteMs((v) => (v !== null ? v + inc : v));
        }
      }
    } finally {
      setThinking(false);
      checkGameOver();
    }
  }, [playerColor, skillLevel, checkGameOver, prefs.soundOn, timeControlIdx]);

  // Fires after every fen change (player move OR bot move). No-ops if it isn't the bot's turn.
  useEffect(() => {
    if (status === "playing") maybeBotMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, status]);

  // Log the game's summary once, when it ends.
  useEffect(() => {
    if (status !== "over" || saved) return;
    setSaved(true);
    const classes = Object.values(moveClasses);
    const accuracy = accuracyFromClasses(classes);
    const bad = classes.filter((c) => BAD_TIERS.includes(c)).length;
    saveResult("chess", {
      mode: "play",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score: Math.max(0, classes.length - bad),
      total: Math.max(1, classes.length),
      percentage: accuracy,
      weakTerms: moves.filter((_, i) => moveClasses[i] && BAD_TIERS.includes(moveClasses[i])).map((m) => m.san),
      weakCategories: Array.from(new Set(classes.filter((c) => BAD_TIERS.includes(c)))),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const finalizeMove = useCallback(
    (from: string, to: string, promotion?: "q" | "r" | "b" | "n") => {
      const game = gameRef.current;
      const fenBefore = game.fen();
      let move;
      try {
        move = game.move({ from, to, promotion: promotion || "q" });
      } catch {
        return false;
      }
      const fenAfter = game.fen();
      const ply = game.history().length - 1;
      setFen(fenAfter);
      setMoves((prev) => [...prev, { san: move.san }]);
      setSelectedSquare(null);
      setHintArrow(null);
      playSound(
        game.isCheckmate() || game.isGameOver()
          ? "gameEnd"
          : game.inCheck()
          ? "check"
          : move.captured
          ? "capture"
          : move.isKingsideCastle() || move.isQueensideCastle()
          ? "castle"
          : move.promotion
          ? "promote"
          : "move",
        prefs.soundOn
      );
      if (TIME_CONTROLS[timeControlIdx].incrementSec) {
        const inc = TIME_CONTROLS[timeControlIdx].incrementSec * 1000;
        if (playerColor === "w") setWhiteMs((v) => (v !== null ? v + inc : v));
        else setBlackMs((v) => (v !== null ? v + inc : v));
      }
      analyzeMove(fenBefore, fenAfter, ply);
      checkGameOver();
      return true;
    },
    [analyzeMove, checkGameOver, prefs.soundOn, timeControlIdx, playerColor]
  );

  const attemptMove = useCallback(
    (from: string, to: string): boolean => {
      const game = gameRef.current;
      if (status !== "playing" || thinking || game.turn() !== playerColor) return false;
      const piece = game.get(from as Square);
      const isPromotion = !!piece && piece.type === "p" && ((piece.color === "w" && to[1] === "8") || (piece.color === "b" && to[1] === "1"));
      if (isPromotion && !prefs.autoQueen) {
        setPromotionPending({ from, to, color: piece!.color });
        return true;
      }
      return finalizeMove(from, to, isPromotion ? "q" : undefined);
    },
    [status, thinking, playerColor, prefs.autoQueen, finalizeMove]
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
      if (!targetSquare) return false;
      return attemptMove(sourceSquare, targetSquare);
    },
    [attemptMove]
  );

  const onSquareClick = useCallback(
    ({ square }: { square: string; piece: unknown }) => {
      const game = gameRef.current;
      if (status !== "playing" || thinking || game.turn() !== playerColor) return;
      const piece = game.get(square as Square);

      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        return;
      }
      if (selectedSquare) {
        const moved = attemptMove(selectedSquare, square);
        if (!moved) setSelectedSquare(null);
      }
    },
    [status, thinking, playerColor, selectedSquare, attemptMove]
  );

  function resign() {
    setResultText(`Resigned — ${playerColor === "w" ? "Black" : "White"} wins`);
    setStatus("over");
    playSound("gameEnd", prefs.soundOn);
  }

  function offerDraw() {
    // A bot with no draw-acceptance model of its own — treat as a straightforward
    // agreed draw, since there's no opponent to actually decline it.
    setResultText("Draw agreed");
    setStatus("over");
    playSound("gameEnd", prefs.soundOn);
  }

  function newGame(fromFen?: string) {
    gameRef.current = fromFen ? new Chess(fromFen) : new Chess();
    setFen(gameRef.current.fen());
    setStatus("playing");
    setResultText("");
    setMoves([]);
    setMoveClasses({});
    setLiveEval(null);
    setHintArrow(null);
    setSelectedSquare(null);
    setSaved(false);
    setFenError(null);
    const tc = TIME_CONTROLS[timeControlIdx];
    setWhiteMs(tc.initialSec !== null ? tc.initialSec * 1000 : null);
    setBlackMs(tc.initialSec !== null ? tc.initialSec * 1000 : null);
  }

  function switchColor(color: "w" | "b") {
    setPlayerColor(color);
    newGame();
  }

  function loadFen() {
    const check = validateFen(fenInput.trim());
    if (!check.ok) {
      setFenError("That FEN isn't valid — double-check it and try again.");
      return;
    }
    newGame(fenInput.trim());
    setFenInput("");
  }

  function copyPgn() {
    navigator.clipboard.writeText(gameRef.current.pgn());
  }

  function copyFen() {
    navigator.clipboard.writeText(gameRef.current.fen());
  }

  async function requestHint() {
    const engine = engineRef.current;
    if (!engine || status !== "playing") return;
    setHintLoading(true);
    try {
      const best = await engine.getBestMove(gameRef.current.fen(), { skillLevel: 20, movetimeMs: 900 });
      if (best) setHintArrow({ from: best.move.slice(0, 2), to: best.move.slice(2, 4) });
    } finally {
      setHintLoading(false);
    }
  }

  function pickPromotion(piece: "q" | "r" | "b" | "n") {
    if (!promotionPending) return;
    const { from, to } = promotionPending;
    setPromotionPending(null);
    finalizeMove(from, to, piece);
  }

  const theme = getBoardTheme(prefs.boardTheme);
  const pieces = prefs.pieceSet === "minimal" ? minimalPieces : prefs.pieceSet === "neon" ? neonPieces : undefined;
  const material = getMaterial(gameRef.current);
  const sideToMove = gameRef.current.turn();
  const openingName = getOpeningName(gameRef.current.history());

  const squareStyles: SquareStyles = {};
  if (gameRef.current.inCheck()) {
    const kingSquare = gameRef.current
      .board()
      .flat()
      .find((sq) => sq && sq.type === "k" && sq.color === sideToMove)?.square;
    if (kingSquare) squareStyles[kingSquare] = { background: `radial-gradient(circle, ${theme.check}aa 40%, transparent 70%)` };
  }
  if (prefs.showLastMove && gameRef.current.history({ verbose: true }).length > 0) {
    const last = gameRef.current.history({ verbose: true }).at(-1)!;
    squareStyles[last.from] = { ...squareStyles[last.from], backgroundColor: `${theme.highlight}55` };
    squareStyles[last.to] = { ...squareStyles[last.to], backgroundColor: `${theme.highlight}55` };
  }
  if (selectedSquare) {
    squareStyles[selectedSquare] = { ...squareStyles[selectedSquare], backgroundColor: `${theme.highlight}77` };
    if (prefs.showLegalMoves) {
      const legal = gameRef.current.moves({ square: selectedSquare as Square, verbose: true });
      for (const m of legal) {
        squareStyles[m.to] = {
          ...squareStyles[m.to],
          background: m.captured
            ? "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.35) 62%, transparent 68%)"
            : "radial-gradient(circle, rgba(0,0,0,0.28) 20%, transparent 24%)",
        };
      }
    }
  }

  const accuracy = accuracyFromClasses(Object.values(moveClasses));
  const classCounts = Object.values(moveClasses).reduce<Partial<Record<MoveClass, number>>>((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  if (mode === "puzzles") {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-5 pt-2 flex gap-2">
          <button onClick={() => setMode("play")} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: "#182620", border: "1px solid #24382c" }}>
            ← Back to Play
          </button>
        </div>
        <PuzzleMode prefs={prefs} />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-5 pt-2 flex gap-2">
        <button onClick={() => setMode("play")} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: "#3f6b4f" }}>
          Play
        </button>
        <button onClick={() => setMode("puzzles")} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: "#182620", border: "1px solid #24382c" }}>
          Puzzles
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto px-5 py-6">
        <EvalBar evaluation={liveEval?.eval ?? null} sideToMove={liveEval?.sideToMove ?? sideToMove} />

        <div className="w-full md:w-[420px] shrink-0" style={{ maxWidth: `${prefs.boardSizePct}%` }}>
          {(whiteMs !== null || blackMs !== null) && (
            <div className="flex justify-between text-sm mb-1.5 font-mono" style={{ color: "#8fae9a" }}>
              <span>{playerColor === "w" ? "You" : "Bot"}: {fmtClock(playerColor === "w" ? whiteMs ?? 0 : blackMs ?? 0)}</span>
              <span>{playerColor === "w" ? "Bot" : "You"}: {fmtClock(playerColor === "w" ? blackMs ?? 0 : whiteMs ?? 0)}</span>
            </div>
          )}
          <Chessboard
            options={{
              position: fen,
              onPieceDrop,
              onSquareClick,
              boardOrientation: playerColor === "w" ? "white" : "black",
              allowDragging: status === "playing" && !thinking && gameRef.current.turn() === playerColor,
              darkSquareStyle: { backgroundColor: theme.dark },
              lightSquareStyle: { backgroundColor: theme.light },
              showNotation: prefs.showCoordinates,
              squareStyles,
              pieces,
              arrows: hintArrow ? [{ startSquare: hintArrow.from, endSquare: hintArrow.to, color: "#e0c07acc" }] : [],
            }}
          />
          <div className="flex items-center justify-between mt-3 text-sm" style={{ color: "#8fae9a" }}>
            <span>{status === "over" ? resultText : thinking ? "Thinking…" : gameRef.current.turn() === playerColor ? "Your move" : "Bot's move"}</span>
            <div className="flex gap-2">
              {status === "playing" && (
                <>
                  <button onClick={requestHint} disabled={hintLoading} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "#182620", border: "1px solid #24382c" }}>
                    {hintLoading ? "…" : "Hint"}
                  </button>
                  <button onClick={offerDraw} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "#182620", border: "1px solid #24382c" }}>
                    Draw
                  </button>
                  <button onClick={resign} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "#182620", border: "1px solid #24382c" }}>
                    Resign
                  </button>
                </>
              )}
              <button onClick={() => newGame()} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "#182620", border: "1px solid #24382c" }}>
                New game
              </button>
            </div>
          </div>

          {(material.captured.w.length > 0 || material.captured.b.length > 0) && (
            <div className="flex justify-between mt-2 text-xs" style={{ color: "#8fae9a" }}>
              <span>{material.captured.w.map(pieceGlyph).join(" ")} {material.diff > 0 ? `+${material.diff}` : ""}</span>
              <span>{material.captured.b.map(pieceGlyph).join(" ")} {material.diff < 0 ? `+${-material.diff}` : ""}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {status === "over" && (
            <GameReview data={{ resultText, accuracy, openingName, counts: classCounts }} />
          )}

          <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "#e0e8e2" }}>Setup</h2>
            <div className="mb-3">
              <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Play as</p>
              <div className="flex gap-1.5">
                {(["w", "b"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => switchColor(c)}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{ background: playerColor === c ? "#3f6b4f" : "#0f1a14", border: "1px solid #24382c" }}
                  >
                    {c === "w" ? "White" : "Black"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Bot strength — {skillLevel}/20</p>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {SKILL_PRESETS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSkillLevel(s.value)}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{ background: skillLevel === s.value ? "#3f6b4f" : "#0f1a14", border: "1px solid #24382c" }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <input type="range" min={0} max={20} value={skillLevel} onChange={(e) => setSkillLevel(Number(e.target.value))} className="w-full" />
            </div>

            <div className="mb-3">
              <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Time control</p>
              <div className="flex gap-1.5 flex-wrap">
                {TIME_CONTROLS.map((tc, i) => (
                  <button
                    key={tc.label}
                    onClick={() => setTimeControlIdx(i)}
                    className="px-2.5 py-1 rounded-lg text-xs"
                    style={{ background: timeControlIdx === i ? "#3f6b4f" : "#0f1a14", border: "1px solid #24382c" }}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Set up a position (FEN)</p>
              <div className="flex gap-1.5">
                <input
                  value={fenInput}
                  onChange={(e) => setFenInput(e.target.value)}
                  placeholder={START_FEN}
                  className="flex-1 min-w-0 rounded-lg px-2 py-1 text-xs"
                  style={{ background: "#0f1a14", border: "1px solid #24382c", color: "#e0e8e2" }}
                />
                <button onClick={loadFen} className="px-2.5 py-1 rounded-lg text-xs shrink-0" style={{ background: "#3f6b4f" }}>
                  Load
                </button>
              </div>
              {fenError && <p className="text-xs mt-1" style={{ color: "#e08a8a" }}>{fenError}</p>}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold" style={{ color: "#e0e8e2" }}>Moves {openingName && `· ${openingName}`}</h2>
              <div className="flex gap-1.5">
                <button onClick={copyPgn} className="text-xs px-2 py-0.5 rounded" style={{ color: "#8fae9a" }}>Copy PGN</button>
                <button onClick={copyFen} className="text-xs px-2 py-0.5 rounded" style={{ color: "#8fae9a" }}>Copy FEN</button>
              </div>
            </div>
            <MoveList moves={moves.map((m, i) => ({ ...m, cls: moveClasses[i] }))} />
          </div>

          <SettingsPanel prefs={prefs} update={updatePrefs} />
        </div>
      </div>

      {promotionPending && <PromotionDialog color={promotionPending.color} onPick={pickPromotion} />}
    </div>
  );
}

function pieceGlyph(p: PieceSymbol): string {
  return { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" }[p];
}
