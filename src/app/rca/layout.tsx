import RcaAssistant from "@/components/rca/RcaAssistant";
import CalendarPopup from "@/components/rca/CalendarPopup";
import RcaChrome from "@/components/rca/RcaChrome";
// RcaNotesLoader (not RcaNotes directly) — RcaNotes imports isomorphic-dompurify, which
// constructs a JSDOM instance at module-evaluation time. Next.js still SSRs "use client"
// components by default, and a lazy require() guard didn't stop Turbopack from eagerly
// evaluating the module as part of this layout's server chunk anyway (found live
// 2026-08-31 — see the comment in src/lib/sanitize-markdown.ts for the full story, and
// why that file dropped DOMPurify entirely instead; RcaNotes sanitizes arbitrary
// contentEditable HTML, not our own generated tags, so it genuinely needs DOMPurify and
// can't take the same regex-based fix). next/dynamic's ssr:false is the real fix, but it's
// only allowed from a Client Component — this (server) layout can't call it directly, so
// RcaNotesLoader wraps that for us.
import RcaNotes from "@/components/rca/RcaNotesLoader";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RcaChrome>{children}</RcaChrome>
      {/* Rendered OUTSIDE the dim-mode shell on purpose — that div applies a CSS
          filter when dim mode is on, and `filter` creates a new containing block
          for `position: fixed` descendants, which would break these floating
          panels' fixed-to-viewport positioning. DimModeToggle itself is inside
          RcaChrome but NOT inside the filtered div (see RcaThemeShell), so it's
          unaffected. */}
      <RcaAssistant />
      <RcaNotes />
      <CalendarPopup />
    </>
  );
}
