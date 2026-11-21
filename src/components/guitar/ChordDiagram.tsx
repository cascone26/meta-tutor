import { ChordShape, simplifiedFingers } from "@/lib/guitar/chords-data";

// Strings drawn left (low E, string 6) to right (high e, string 1) — standard diagram
// orientation for a right-handed player looking at the fretboard head-on.
const STRINGS = 6;
const FRETS_SHOWN = 4;
const W = 140, H = 164, MARGIN_X = 18, MARGIN_TOP = 30, MARGIN_BOTTOM = 10;

export default function ChordDiagram({ chord, size = 1 }: { chord: ChordShape; size?: number }) {
  const uid = chord.id.replace(/[^a-zA-Z0-9]/g, "");
  const fingers = simplifiedFingers(chord.frets);
  const fretted = chord.frets.filter((f): f is number => typeof f === "number" && f > 0);
  const minFret = fretted.length ? Math.min(...fretted) : 1;
  const baseFret = minFret > 2 ? minFret : 1;
  const stringGap = (W - 2 * MARGIN_X) / (STRINGS - 1);
  const fretGap = (H - MARGIN_TOP - MARGIN_BOTTOM) / FRETS_SHOWN;

  const isBarre = chord.category === "barre";

  return (
    <svg width={W * size} height={H * size} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${chord.display} chord diagram`}>
      <defs>
        <linearGradient id={`fb-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--g-surface-2)" />
          <stop offset="100%" stopColor="var(--g-surface)" />
        </linearGradient>
        <radialGradient id={`dot-${uid}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="var(--g-accent-dark)" />
          <stop offset="100%" stopColor="var(--g-accent)" />
        </radialGradient>
      </defs>

      <rect x={MARGIN_X - 10} y={MARGIN_TOP - 2} width={W - 2 * MARGIN_X + 20} height={H - MARGIN_TOP - MARGIN_BOTTOM + 4} rx={8} fill={`url(#fb-${uid})`} stroke="var(--g-border)" strokeWidth={1} />

      <rect x={MARGIN_X} y={MARGIN_TOP} width={W - 2 * MARGIN_X} height={baseFret === 1 ? 3.5 : 1.2} rx={baseFret === 1 ? 1.5 : 0} fill="var(--g-text)" opacity={baseFret === 1 ? 0.85 : 0.35} />
      {baseFret > 1 && (
        <text x={MARGIN_X - 9} y={MARGIN_TOP + fretGap * 0.7} fontSize="9" fill="var(--g-muted)">{baseFret}fr</text>
      )}

      {Array.from({ length: FRETS_SHOWN }).map((_, i) => (
        <line key={i} x1={MARGIN_X} x2={W - MARGIN_X} y1={MARGIN_TOP + (i + 1) * fretGap} y2={MARGIN_TOP + (i + 1) * fretGap} stroke="var(--g-border)" strokeWidth={1} />
      ))}
      {Array.from({ length: STRINGS }).map((_, i) => (
        <line key={i} x1={MARGIN_X + i * stringGap} x2={MARGIN_X + i * stringGap} y1={MARGIN_TOP} y2={H - MARGIN_BOTTOM} stroke="var(--g-border)" strokeWidth={1} />
      ))}

      {isBarre && (() => {
        const fret1Positions = chord.frets.map((f, i) => (f === 1 ? i : -1)).filter((i) => i >= 0);
        if (fret1Positions.length < 2) return null;
        const x1 = MARGIN_X + Math.min(...fret1Positions) * stringGap;
        const x2 = MARGIN_X + Math.max(...fret1Positions) * stringGap;
        const y = MARGIN_TOP + 0.5 * fretGap;
        return <rect x={x1 - 6} y={y - 5} width={x2 - x1 + 12} height={10} rx={5} fill={`url(#dot-${uid})`} />;
      })()}

      {chord.frets.map((f, i) => {
        const x = MARGIN_X + i * stringGap;
        const y = MARGIN_TOP - 12;
        if (f === "x") return <text key={i} x={x} y={y + 5} fontSize="11" textAnchor="middle" fill="var(--g-danger)" opacity={0.75}>×</text>;
        if (f === 0) return <circle key={i} cx={x} cy={y} r={3.5} fill="none" stroke="var(--g-success)" strokeWidth={1.4} opacity={0.85} />;
        return null;
      })}

      {chord.frets.map((f, i) => {
        if (typeof f !== "number" || f === 0) return null;
        const displayFret = f - (baseFret - 1);
        if (displayFret < 1 || displayFret > FRETS_SHOWN) return null;
        if (isBarre && f === 1) return null;
        const x = MARGIN_X + i * stringGap;
        const y = MARGIN_TOP + (displayFret - 0.5) * fretGap;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={7.5} fill={`url(#dot-${uid})`} />
            {fingers[i] && <text x={x} y={y + 3} fontSize="8" fontWeight={600} textAnchor="middle" fill="#fff">{fingers[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}
