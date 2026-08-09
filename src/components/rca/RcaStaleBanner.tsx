import { LeafIcon } from "./NatureIcons";

// Visible on every RCA page — content is transcribed from RCA's 2025-2026 docs since
// 2026-2027's haven't been issued. Loud on purpose: this was previously only mentioned
// in code comments/PROCESS.md, which Jacob never sees.
export default function RcaStaleBanner() {
  return (
    <div
      className="flex items-start gap-2 px-4 py-2.5 text-xs"
      style={{ background: "#fdf6e3", borderBottom: "1px solid #e8dcb0", color: "#7a6a2e" }}
    >
      <LeafIcon size={13} style={{ marginTop: 1, flexShrink: 0 }} />
      <span>
        Curriculum content below is transcribed from RCA&apos;s <strong>2025-2026</strong> lesson plans —
        2026-2027&apos;s haven&apos;t been sent yet. Pacing/structure should carry over; treat specific dates as last year&apos;s.
      </span>
    </div>
  );
}
