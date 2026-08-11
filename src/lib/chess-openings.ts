// Opening-name lookup by SAN move-sequence prefix. Every sequence here has been
// verified as a legal move sequence with chess.js before shipping. Not exhaustive —
// covers the openings a club player will actually run into — but every match is real.
export type Opening = { name: string; moves: string[] };

export const OPENINGS: Opening[] = [
  { name: "Italian Game", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"] },
  { name: "Ruy Lopez (Spanish Opening)", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"] },
  { name: "Ruy Lopez, Berlin Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"] },
  { name: "Sicilian Defense", moves: ["e4", "c5"] },
  { name: "Sicilian Defense, Najdorf Variation", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"] },
  { name: "Sicilian Defense, Dragon Variation", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"] },
  { name: "French Defense", moves: ["e4", "e6"] },
  { name: "Caro-Kann Defense", moves: ["e4", "c6"] },
  { name: "Scandinavian Defense", moves: ["e4", "d5"] },
  { name: "Pirc Defense", moves: ["e4", "d6"] },
  { name: "Alekhine's Defense", moves: ["e4", "Nf6"] },
  { name: "King's Gambit", moves: ["e4", "e5", "f4"] },
  { name: "Scotch Game", moves: ["e4", "e5", "Nf3", "Nc6", "d4"] },
  { name: "Vienna Game", moves: ["e4", "e5", "Nc3"] },
  { name: "Petrov's Defense (Russian Game)", moves: ["e4", "e5", "Nf3", "Nf6"] },
  { name: "Four Knights Game", moves: ["e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6"] },
  { name: "Philidor Defense", moves: ["e4", "e5", "Nf3", "d6"] },
  { name: "Bishop's Opening", moves: ["e4", "e5", "Bc4"] },
  { name: "Queen's Gambit", moves: ["d4", "d5", "c4"] },
  { name: "Queen's Gambit Declined", moves: ["d4", "d5", "c4", "e6"] },
  { name: "Queen's Gambit Accepted", moves: ["d4", "d5", "c4", "dxc4"] },
  { name: "Slav Defense", moves: ["d4", "d5", "c4", "c6"] },
  { name: "King's Indian Defense", moves: ["d4", "Nf6", "c4", "g6"] },
  { name: "Grünfeld Defense", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "d5"] },
  { name: "Nimzo-Indian Defense", moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"] },
  { name: "Queen's Indian Defense", moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"] },
  { name: "Bogo-Indian Defense", moves: ["d4", "Nf6", "c4", "e6", "Nf3", "Bb4+"] },
  { name: "Dutch Defense", moves: ["d4", "f5"] },
  { name: "Benoni Defense", moves: ["d4", "Nf6", "c4", "c5"] },
  { name: "Catalan Opening", moves: ["d4", "Nf6", "c4", "e6", "g3"] },
  { name: "London System", moves: ["d4", "d5", "Bf4"] },
  { name: "Trompowsky Attack", moves: ["d4", "Nf6", "Bg5"] },
  { name: "English Opening", moves: ["c4"] },
  { name: "English Opening, Reversed Sicilian", moves: ["c4", "e5"] },
  { name: "Réti Opening", moves: ["Nf3", "d5", "c4"] },
  { name: "Bird's Opening", moves: ["f4"] },
  { name: "King's Indian Attack", moves: ["Nf3", "d5", "g3"] },
];

// Strips check/mate suffixes for matching robustness, except for the handful of
// entries whose canonical SAN itself includes "+" (e.g. Bogo-Indian) — compare as-is
// for those, stripped for everything else, by trying both.
function sameSan(a: string, b: string): boolean {
  return a === b || a.replace(/[+#]$/, "") === b.replace(/[+#]$/, "");
}

export function getOpeningName(sanHistory: string[]): string | null {
  let best: Opening | null = null;
  for (const o of OPENINGS) {
    if (o.moves.length > sanHistory.length) continue;
    const matches = o.moves.every((san, i) => sameSan(san, sanHistory[i]));
    if (matches && (!best || o.moves.length > best.moves.length)) best = o;
  }
  return best?.name ?? null;
}
