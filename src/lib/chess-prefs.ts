"use client";

import { useEffect, useState } from "react";

export type BoardTheme = { id: string; name: string; light: string; dark: string; highlight: string; check: string };

export const BOARD_THEMES: BoardTheme[] = [
  { id: "forest", name: "Forest", light: "#e8f0ea", dark: "#3f6b4f", highlight: "#f6f27a", check: "#e08a8a" },
  { id: "wood", name: "Wood", light: "#f0d9b5", dark: "#b58863", highlight: "#f7ec74", check: "#e0755a" },
  { id: "ocean", name: "Ocean", light: "#e6f0f6", dark: "#3f6d8a", highlight: "#f6e27a", check: "#e08a8a" },
  { id: "slate", name: "Slate", light: "#e4e6ec", dark: "#5a6270", highlight: "#f2d97a", check: "#e08a8a" },
  { id: "purple", name: "Amethyst", light: "#ece4f6", dark: "#6b4f8a", highlight: "#f6d97a", check: "#e08aaa" },
  { id: "contrast", name: "High contrast", light: "#ffffff", dark: "#1a1a1a", highlight: "#ffcc00", check: "#ff4d4d" },
];

export type PieceSetId = "classic" | "minimal" | "neon";
export const PIECE_SETS: { id: PieceSetId; name: string }[] = [
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "neon", name: "Neon" },
];

export type ChessPrefs = {
  boardTheme: string;
  pieceSet: PieceSetId;
  soundOn: boolean;
  showCoordinates: boolean;
  showLegalMoves: boolean;
  showLastMove: boolean;
  autoQueen: boolean;
  boardSizePct: number; // 60-100, % of the default container width
  // Display toggles — declutter the board while playing. Separate from the
  // board/piece cosmetics above since these hide whole panels, not restyle them.
  showEvalBar: boolean;
  showMaterialDiff: boolean;
  showMoveList: boolean;
  showWeakAreas: boolean;
  autoOfferCoach: boolean;
};

export const DEFAULT_PREFS: ChessPrefs = {
  boardTheme: "forest",
  pieceSet: "classic",
  soundOn: true,
  showCoordinates: true,
  showLegalMoves: true,
  showLastMove: true,
  autoQueen: false,
  boardSizePct: 100,
  showEvalBar: true,
  showMaterialDiff: true,
  showMoveList: true,
  showWeakAreas: true,
  autoOfferCoach: true,
};

const KEY = "chess-prefs";

export function usePrefs(): [ChessPrefs, (patch: Partial<ChessPrefs>) => void] {
  const [prefs, setPrefs] = useState<ChessPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {
      // ignore corrupt storage
    }
  }, []);

  function update(patch: Partial<ChessPrefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return [prefs, update];
}

export function getBoardTheme(id: string): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === id) ?? BOARD_THEMES[0];
}
