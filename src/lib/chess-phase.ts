// Game-phase classification (opening/middlegame/endgame), so weak-area tracking can say
// *when* in the game mistakes happen, not just how bad they were. Standard heuristic:
// opening = early plies with most non-pawn material still on; endgame = queens off (or
// very little total material left); everything else is middlegame.
import { Chess, type PieceSymbol } from "chess.js";

export type GamePhase = "opening" | "middlegame" | "endgame";

const VALUE: Record<PieceSymbol, number> = { p: 0, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function getGamePhase(fen: string, ply: number): GamePhase {
  if (ply < 10) return "opening";

  const game = new Chess(fen);
  let queens = 0;
  let nonPawnMaterial = 0; // excludes queens, counted separately
  for (const row of game.board()) {
    for (const sq of row) {
      if (!sq) continue;
      if (sq.type === "q") queens++;
      else nonPawnMaterial += VALUE[sq.type];
    }
  }

  // No queens, or only minor pieces/rooks left in small numbers -> endgame.
  if (queens === 0 && nonPawnMaterial <= 14) return "endgame";
  if (queens > 0 && nonPawnMaterial <= 6) return "endgame"; // queen(s) + almost nothing else

  return ply < 20 ? "opening" : "middlegame";
}

export const PHASE_LABEL: Record<GamePhase, string> = {
  opening: "Opening",
  middlegame: "Middlegame",
  endgame: "Endgame",
};
