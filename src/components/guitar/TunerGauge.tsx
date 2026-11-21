const CX = 110, CY = 115, R = 92;
const TICKS = [-50, -25, 0, 25, 50];

// Classic upper-semicircle gauge math: cents -50 -> 180deg (left), 0 -> 90deg (up), +50 -> 0deg (right).
function angleFor(cents: number) {
  const clamped = Math.max(-50, Math.min(50, cents));
  return 180 - ((clamped + 50) / 100) * 180;
}
function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}
function arcPath(fromCents: number, toCents: number, radius: number) {
  const a1 = angleFor(fromCents), a2 = angleFor(toCents);
  const p1 = pointAt(a1, radius), p2 = pointAt(a2, radius);
  return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y}`;
}

/** Shared radial tuner dial — used by both the chromatic tuner and the guided string-by-string
 *  flow, so the gauge math only lives in one place. `cents` is null while nothing is detected
 *  (needle parks at center, dimmed). */
export default function TunerGauge({ cents, inTune }: { cents: number | null; inTune: boolean }) {
  const needleAngle = angleFor(cents ?? 0);
  const needleTip = pointAt(needleAngle, R - 20);

  return (
    <svg viewBox="0 0 220 150" width="100%" height="180" style={{ overflow: "visible" }}>
      <path d={arcPath(-50, 50, R)} fill="none" stroke="var(--g-border)" strokeWidth={10} strokeLinecap="round" />
      <path d={arcPath(-5, 5, R)} fill="none" stroke="var(--g-success)" strokeWidth={10} strokeLinecap="round" opacity={0.55} />
      {TICKS.map((t) => {
        const p1 = pointAt(angleFor(t), R + 8);
        const p2 = pointAt(angleFor(t), R - 4);
        return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--g-muted)" strokeWidth={2} />;
      })}
      <line
        x1={CX} y1={CY} x2={needleTip.x} y2={needleTip.y}
        stroke={cents === null ? "var(--g-border)" : inTune ? "var(--g-success)" : "var(--g-accent)"}
        strokeWidth={3} strokeLinecap="round"
        style={{ transition: "all 90ms linear" }}
      />
      <circle cx={CX} cy={CY} r={6} fill={cents === null ? "var(--g-border)" : inTune ? "var(--g-success)" : "var(--g-accent)"} style={{ transition: "fill 90ms linear" }} />
    </svg>
  );
}
