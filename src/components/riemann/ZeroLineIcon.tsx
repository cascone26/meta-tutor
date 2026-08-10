// A dot centered on a vertical line — the critical line Re(s) = 1/2 with a zero sitting
// on it. Hand-drawn, not an emoji, matching the RCA station's icon convention.
export function ZeroLineIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
