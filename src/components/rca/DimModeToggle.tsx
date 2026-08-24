"use client";

// Fixed-position dim-mode button, coordinated with CalendarPopup's own
// `top-3 right-4` offset (this sits at `right-[60px]`, a clear 12px gap to
// its left) — pulled out of RcaThemeShell's header specifically because that
// in-flow placement landed in roughly the same on-screen spot as
// CalendarPopup's fixed circle (found live, 2026-08-24: Jacob's reported
// "calendar button overlaid with night mode button").
export default function DimModeToggle({ dim, onToggle }: { dim: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dim ? "Turn off dim mode" : "Turn on dim mode"}
      title={dim ? "Dim mode on" : "Dim mode off"}
      className="fixed top-3 right-[60px] z-20 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
      style={{ width: 32, height: 32, background: dim ? "#33402c" : "#3a4a34", color: dim ? "#e8edc6" : "#fff" }}
    >
      {dim ? "☾" : "☀"}
    </button>
  );
}
