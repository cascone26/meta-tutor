// Hand-built tactics puzzle bank — every FEN + solution move in here has been
// programmatically verified with chess.js (legal move, and for every "mate in 1"
// entry, isCheckmate() confirmed true after the move) before shipping.
export type Puzzle = {
  id: string;
  theme: string;
  difficulty: 1 | 2 | 3;
  fen: string;
  move: string; // UCI, e.g. "e1e8" or "b7b8q"
  explain: string;
};

export const PUZZLES: Puzzle[] = [
  { id: "m1-backrank", theme: "Back-rank mate", difficulty: 1,
    fen: "6k1/5ppp/8/8/8/8/6P1/4R1K1 w - - 0 1", move: "e1e8",
    explain: "The rook swings to the back rank. Black's own pawns block every escape square, and the rook covers the rest — checkmate." },
  { id: "m1-battery", theme: "Queen + bishop battery", difficulty: 2,
    fen: "6k1/5p1p/8/8/8/2B5/8/6QK w - - 0 1", move: "g1g7",
    explain: "The queen delivers mate on g7, protected by the bishop on the long diagonal — the king has nowhere to run and can't capture." },
  { id: "m1-ladder", theme: "Ladder mate", difficulty: 1,
    fen: "7k/R7/8/8/8/8/8/1R2K3 w - - 0 1", move: "b1b8",
    explain: "One rook already seals the 7th rank; the second marches down and mates on the 8th — the classic ladder (staircase) mate." },
  { id: "m1-smothered", theme: "Smothered mate", difficulty: 3,
    fen: "6rk/6pp/8/4N3/8/8/8/4K3 w - - 0 1", move: "e5f7",
    explain: "Nf7# — the knight forks king and rook with check, and the king can't move because its own rook and pawns box it in completely." },
  { id: "m1-rook-box", theme: "Rook + king mate", difficulty: 1,
    fen: "k7/8/1K6/8/8/8/8/7R w - - 0 1", move: "h1h8",
    explain: "The white king already controls every square around Black's king except the back rank — the rook seals that and it's mate. The core K+R vs K mating pattern." },
  { id: "fork-knight-1", theme: "Knight fork", difficulty: 2,
    fen: "r3k2r/8/8/3N4/8/8/8/4K3 w kq - 0 1", move: "d5c7",
    explain: "The knight jumps to c7, forking the king on e8 and the rook on a8 — Black can't save both." },
  { id: "fork-knight-2", theme: "Knight fork", difficulty: 2,
    fen: "5rk1/8/8/4N3/8/8/8/6K1 w - - 0 1", move: "e5f7",
    explain: "Nf7+ forks the king and the rook on f8 — the king must move, and the knight collects the rook next." },
  { id: "fork-pawn", theme: "Pawn fork", difficulty: 1,
    fen: "8/8/3k4/8/2n1b3/3P4/8/3K4 w - - 0 1", move: "d3d4",
    explain: "One pawn push attacks both minor pieces at once — Black can only save one." },
  { id: "pin-win-piece", theme: "Pin", difficulty: 2,
    fen: "4k3/8/8/8/4q3/8/8/4RK2 w - - 0 1", move: "e1e4",
    explain: "The rook takes the queen — it was pinned to the king along the e-file and couldn't have been defended by moving off it." },
  { id: "skewer-rook", theme: "Skewer", difficulty: 2,
    fen: "6k1/8/8/8/8/8/6K1/r6R w - - 0 1", move: "h1a1",
    explain: "Rxa1 wins the rook outright — nothing was defending it and it had nowhere to go." },
  { id: "remove-defender", theme: "Remove the defender", difficulty: 3,
    fen: "3r2k1/8/8/8/8/8/5Q2/6K1 w - - 0 1", move: "f2f8",
    explain: "Qf8+ forces the trade of queen for rook on a favorable square, then mops up — the defender of the back rank is gone." },
  { id: "deflection-mate", theme: "Deflection", difficulty: 3,
    fen: "6k1/6p1/7p/8/8/8/6PP/3Q2K1 w - - 0 1", move: "d1d8",
    explain: "Qd8+ forces the king into a mating net — Black has no way to interpose that doesn't lose immediately." },
  { id: "promote-under", theme: "Promotion", difficulty: 1,
    fen: "8/1P6/8/8/8/2k5/8/2K5 w - - 0 1", move: "b7b8q",
    explain: "Simple promotion to a queen — with the kings this far apart, straight promotion is cleanest and winning." },
  { id: "opposition", theme: "King opposition", difficulty: 2,
    fen: "8/8/4k3/4P3/4K3/8/8/8 w - - 0 1", move: "e4d4",
    explain: "Stepping to the side takes the opposition — the only way to escort the pawn home against best defense." },
];

export function nextPuzzle(excludeIds: string[]): Puzzle {
  const pool = PUZZLES.filter((p) => !excludeIds.includes(p.id));
  const from = pool.length > 0 ? pool : PUZZLES;
  return from[Math.floor(Math.random() * from.length)];
}
