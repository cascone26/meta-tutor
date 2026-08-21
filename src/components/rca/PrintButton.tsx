"use client";

// Jacob's own words on why this page exists: sometimes he's copying today's key
// points onto the physical classroom whiteboard before kids arrive, or wants a
// paper cheat-sheet since the center is a no-laptop-in-class environment. This
// triggers the browser's native print dialog against print:* Tailwind classes
// already on the page (nav/back-link/full-page-links hidden, content full-width).
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-xs px-3 py-1.5 rounded-full border shrink-0"
      style={{ borderColor: "#bcd6e6", color: "#2f5e7a", background: "rgba(255,255,255,0.55)" }}
    >
      Print →
    </button>
  );
}
