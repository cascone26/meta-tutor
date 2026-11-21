import { STANDARD_TUNING } from "@/lib/guitar/notes";

// Drawn as a small headstock-and-neck sketch, strings left (thick, low E) to right (thin,
// high e) — thickness tapers visually so "thickest string" is something a total beginner can
// actually match against the real instrument without knowing any note names yet.
const ORDERED = [...STANDARD_TUNING].sort((a, b) => b.string - a.string); // string6..string1
const W = 280, H = 90;

export default function StringDiagram({ activeString }: { activeString: number }) {
  const gap = W / (ORDERED.length + 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Guitar strings, thickest to thinnest">
      {ORDERED.map((s, i) => {
        const x = gap * (i + 1);
        const isActive = s.string === activeString;
        const thickness = 1.5 + (ORDERED.length - 1 - i) * 0.9; // thickest on the left
        return (
          <g key={s.string}>
            <line
              x1={x} y1={14} x2={x} y2={H - 10}
              stroke={isActive ? "var(--g-accent)" : "var(--g-muted)"}
              strokeWidth={thickness}
              opacity={isActive ? 1 : 0.45}
              strokeLinecap="round"
            />
            <circle cx={x} cy={8} r={isActive ? 7 : 5} fill={isActive ? "var(--g-accent)" : "var(--g-border)"} />
            {isActive && (
              <text x={x} y={11} fontSize="8" fontWeight={700} textAnchor="middle" fill="#fff">{s.string}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
