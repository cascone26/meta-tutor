import { LeafIcon } from "./NatureIcons";

// Visible on every RCA page. Updated 2026-08-12: the real 2026-2027 6th Grade
// master doc (Religion/CLA+Poetry/Latin/History/Science) arrived and this app's
// content for those five was rebuilt from it. Math (Saxon) and LOE Essentials C
// are separate, per-student docs RCA hasn't sent yet, so those two are still on
// last year's placeholder pacing. Loud on purpose: this was previously only
// mentioned in code comments/PROCESS.md, which Jacob never sees.
export default function RcaStaleBanner() {
  return (
    <div
      className="flex items-start gap-2 px-4 py-2.5 text-xs"
      style={{ background: "#fdf6e3", borderBottom: "1px solid #e8dcb0", color: "#7a6a2e" }}
    >
      <LeafIcon size={13} style={{ marginTop: 1, flexShrink: 0 }} />
      <span>
        Religion, Classical Language Arts, Latin, History, and Science are on the real <strong>2026-2027</strong> pacing
        (RCA&apos;s doc arrived 2026-08-12). <strong>Saxon Math</strong> and <strong>LOE Essentials C</strong> are separate,
        per-student docs RCA hasn&apos;t sent yet — those two are still last year&apos;s placeholder; treat their dates as 2025-2026&apos;s.
      </span>
    </div>
  );
}
