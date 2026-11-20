import { ChordShape, simplifiedFingers } from "@/lib/guitar/chords-data";

// Strings drawn left (low E, string 6) to right (high e, string 1) — standard diagram
// orientation for a right-handed player looking at the fretboard head-on.
const STRINGS = 6;
const FRETS_SHOWN = 4;
const W = 140, H = 160, MARGIN_X = 18, MARGIN_TOP = 26, MARGIN_BOTTOM = 10;

export default function ChordDiagram({ chord, size = 1 }: { chord: ChordShape; size?: number }) {
  const fingers = simplifiedFingers(chord.frets);
  const fretted = chord.frets.filter((f): f is number => typeof f === "number" && f > 0);
  const minFret = fretted.length ? Math.min(...fretted) : 1;
  const baseFret = minFret > 2 ? minFret : 1; // shift the window up for shapes like F if ever played higher
  const stringGap = (W - 2 * MARGIN_X) / (STRINGS - 1);
  const fretGap = (H - MARGIN_TOP - MARGIN_BOTTOM) / FRETS_SHOWN;

  const isBarre = chord.category === "barre";

  return (
    <svg width={W * size} height={H * size} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${chord.display} chord diagram`}>
      {/* nut or fret-0 line */}
      <rect x={MARGIN_X} y={MARGIN_TOP} width={W - 2 * MARGIN_X} height={baseFret === 1 ? 3 : 1} fill="var(--foreground)" />
      {baseFret > 1 && (
        <text x={MARGIN_X - 10} y={MARGIN_TOP + fretGap * 0.7} fontSize="9" fill="var(--muted)">{baseFret}fr</text>
      )}

      {/* fret lines */}
      {Array.from({ length: FRETS_SHOWN + 1 }).map((_, i) => (
        <line key={i} x1={MARGIN_X} x2={W - MARGIN_X} y1={MARGIN_TOP + i * fretGap} y2={MARGIN_TOP + i * fretGap} stroke="var(--border)" strokeWidth={1} />
      ))}
      {/* strings */}
      {Array.from({ length: STRINGS }).map((_, i) => (
        <line key={i} x1={MARGIN_X + i * stringGap} x2={MARGIN_X + i * stringGap} y1={MARGIN_TOP} y2={H - MARGIN_BOTTOM} stroke="var(--border)" strokeWidth={1} />
      ))}

      {/* barre bar for full-barre shapes */}
      {isBarre && (() => {
        const fret1Positions = chord.frets.map((f, i) => (f === 1 ? i : -1)).filter((i) => i >= 0);
        if (fret1Positions.length < 2) return null;
        const x1 = MARGIN_X + Math.min(...fret1Positions) * stringGap;
        const x2 = MARGIN_X + Math.max(...fret1Positions) * stringGap;
        const y = MARGIN_TOP + 0.5 * fretGap;
        return <rect x={x1 - 6} y={y - 5} width={x2 - x1 + 12} height={10} rx={5} fill="var(--accent)" opacity={0.85} />;
      })()}

      {/* open / muted markers above the nut */}
      {chord.frets.map((f, i) => {
        const x = MARGIN_X + i * stringGap;
        const y = MARGIN_TOP - 10;
        if (f === "x") return <text key={i} x={x} y={y} fontSize="11" textAnchor="middle" fill="var(--muted)">×</text>;
        if (f === 0) return <circle key={i} cx={x} cy={y - 3} r={3.5} fill="none" stroke="var(--foreground)" strokeWidth={1.3} />;
        return null;
      })}

      {/* fretted dots */}
      {chord.frets.map((f, i) => {
        if (typeof f !== "number" || f === 0) return null;
        const displayFret = f - (baseFret - 1);
        if (displayFret < 1 || displayFret > FRETS_SHOWN) return null;
        if (isBarre && f === 1) return null; // covered by the barre bar
        const x = MARGIN_X + i * stringGap;
        const y = MARGIN_TOP + (displayFret - 0.5) * fretGap;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={7} fill="var(--accent)" />
            {fingers[i] && <text x={x} y={y + 3} fontSize="8" textAnchor="middle" fill="#fff">{fingers[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}
