import type { Chess, PieceSymbol } from "chess.js";

const VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const START_COUNTS: Record<PieceSymbol, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };

export type MaterialInfo = {
  captured: { w: PieceSymbol[]; b: PieceSymbol[] }; // pieces each side has captured (opponent's pieces removed)
  diff: number; // positive = White ahead in material
};

export function getMaterial(game: Chess): MaterialInfo {
  const onBoard: Record<"w" | "b", Record<PieceSymbol, number>> = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
  };
  for (const row of game.board()) {
    for (const sq of row) {
      if (sq) onBoard[sq.color][sq.type]++;
    }
  }

  const captured: { w: PieceSymbol[]; b: PieceSymbol[] } = { w: [], b: [] };
  let diff = 0;
  (Object.keys(START_COUNTS) as PieceSymbol[]).forEach((type) => {
    if (type === "k") return;
    const whiteMissing = START_COUNTS[type] - onBoard.w[type]; // captured BY black
    const blackMissing = START_COUNTS[type] - onBoard.b[type]; // captured BY white
    for (let i = 0; i < blackMissing; i++) captured.w.push(type);
    for (let i = 0; i < whiteMissing; i++) captured.b.push(type);
    diff += (blackMissing - whiteMissing) * VALUE[type];
  });

  return { captured, diff };
}
