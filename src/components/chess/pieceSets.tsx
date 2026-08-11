import type { PieceRenderObject } from "react-chessboard";

const LETTER: Record<string, string> = { P: "P", N: "N", B: "B", R: "R", Q: "Q", K: "K" };

function glyphSet(opts: {
  whiteFill: string; whiteStroke: string; whiteText: string; whiteGlow?: string;
  blackFill: string; blackStroke: string; blackText: string; blackGlow?: string;
  shape: "circle" | "square";
}): PieceRenderObject {
  const codes = ["P", "N", "B", "R", "Q", "K"];
  const out: PieceRenderObject = {};
  for (const code of codes) {
    for (const color of ["w", "b"] as const) {
      const isWhite = color === "w";
      const fill = isWhite ? opts.whiteFill : opts.blackFill;
      const stroke = isWhite ? opts.whiteStroke : opts.blackStroke;
      const text = isWhite ? opts.whiteText : opts.blackText;
      const glow = isWhite ? opts.whiteGlow : opts.blackGlow;
      out[`${color}${code}`] = (props) => (
        <svg viewBox="0 0 45 45" style={props?.svgStyle} data-square={props?.square}>
          {glow && (
            <>
              {opts.shape === "circle" ? (
                <circle cx="22.5" cy="22.5" r="19" fill="none" stroke={glow} strokeWidth="4" opacity="0.35" />
              ) : (
                <rect x="4" y="4" width="37" height="37" rx="8" fill="none" stroke={glow} strokeWidth="4" opacity="0.35" />
              )}
            </>
          )}
          {opts.shape === "circle" ? (
            <circle cx="22.5" cy="22.5" r="19" fill={fill} stroke={stroke} strokeWidth="2" />
          ) : (
            <rect x="4" y="4" width="37" height="37" rx="8" fill={fill} stroke={stroke} strokeWidth="2" />
          )}
          <text
            x="22.5"
            y="22.5"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20"
            fontWeight="700"
            fontFamily="Georgia, serif"
            fill={text}
          >
            {LETTER[code]}
          </text>
        </svg>
      );
    }
  }
  return out;
}

// "Minimal" — flat, high-legibility circular glyphs.
export const minimalPieces: PieceRenderObject = glyphSet({
  shape: "circle",
  whiteFill: "#f4f1ea", whiteStroke: "#2a2a2a", whiteText: "#2a2a2a",
  blackFill: "#2a2a2a", blackStroke: "#f4f1ea", blackText: "#f4f1ea",
});

// "Neon" — dark glass squares with a glowing outline, built for the dark board themes.
export const neonPieces: PieceRenderObject = glyphSet({
  shape: "square",
  whiteFill: "#0f1a2e", whiteStroke: "#5ce1e6", whiteText: "#5ce1e6", whiteGlow: "#5ce1e6",
  blackFill: "#1a0f2e", blackStroke: "#ff5cd6", blackText: "#ff5cd6", blackGlow: "#ff5cd6",
});
