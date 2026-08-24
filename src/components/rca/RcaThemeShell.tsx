"use client";

import Image from "next/image";
import HeaderBackLink from "@/components/rca/HeaderBackLink";

// Pragmatic dim/low-light mode for early-morning prep, scoped to the RCA
// umbrella only. Rather than rewriting every inline-styled color across the
// nature theme (dozens of components, all hand-tuned hex values), this
// applies a single CSS filter to the whole shell — real value, much smaller
// surface area to get wrong.
//
// `dim` is now a CONTROLLED prop (owned by RcaChrome, the parent) instead of
// state local to this component — the toggle button itself moved OUT of the
// header into its own fixed-position sibling (see DimModeToggle.tsx), which
// needed to live outside this div's own DOM subtree so it can never again
// collide with CalendarPopup's `right-4` button the way the old in-header
// toggle did (found live, 2026-08-24: both landed in roughly the same
// on-screen spot — Jacob: "the calendar button is overlaid with my night
// mode button"). Two components now needed the same `dim` value in sync, so
// it moved up to a shared parent instead of living in either one alone.
export default function RcaThemeShell({ children, dim }: { children: React.ReactNode; dim: boolean }) {
  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden relative"
      style={{
        // backgroundAttachment: "local" is the actual fix here — without it, the
        // gradient is pinned to the visible viewport frame of this scrolling box
        // (CSS's default "scroll" attachment) and never visibly progresses as you
        // scroll. "local" makes it scroll WITH the content across its full height,
        // so you genuinely travel from sky-blue to earthy-green as you scroll down.
        //
        // Stops are banded on purpose, not evenly spaced — real horizons don't
        // fade sky into ground across the whole scene, sky holds its color for a
        // stretch, then there's a genuinely quick crossover band, then ground
        // holds its color. This mimics that instead of one long even blend.
        background:
          "linear-gradient(180deg, #8ec8ef 0%, #9fd0f2 20%, #a8d4f0 40%, #bfe0e6 48%, #ddeadb 54%, #e8edc6 60%, #d3dfa6 66%, #b3cc84 78%, #96b56a 90%, #82a259 100%)",
        backgroundAttachment: "local",
        color: "#33402c",
        filter: dim ? "brightness(0.72) sepia(0.1) saturate(0.85)" : undefined,
        transition: "filter 0.3s ease",
      }}
    >
      {/* Atmosphere — soft drifting cloud/foliage blur, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 340, height: 180, top: "4%", left: "8%", background: "radial-gradient(ellipse, #ffffffaa 0%, transparent 70%)", filter: "blur(30px)", animation: "drift 40s linear infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 260, height: 140, top: "9%", right: "12%", background: "radial-gradient(ellipse, #ffffff88 0%, transparent 70%)", filter: "blur(26px)", animation: "drift 55s linear infinite reverse" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 420, height: 420, bottom: "-8%", left: "-6%", background: "radial-gradient(circle, #6b8e5a3a 0%, transparent 70%)", filter: "blur(70px)", animation: "floatSlow 22s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 360, height: 360, bottom: "2%", right: "-4%", background: "radial-gradient(circle, #8a6a3a2e 0%, transparent 70%)", filter: "blur(70px)", animation: "floatSlower 26s ease-in-out infinite" }}
      />

      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10 backdrop-blur"
        style={{ borderColor: "#d9e4d3", background: "rgba(232,242,248,0.75)" }}
      >
        <HeaderBackLink />
        <span className="flex items-center gap-2">
          <Image src="/rca-logo.png" alt="Regina Caeli Academy" width={800} height={154} priority style={{ height: 22, width: "auto" }} />
          <span className="text-sm font-semibold tracking-wide" style={{ color: "#2f5e7a" }}>· KSC</span>
        </span>
        {/* Trailing slot is a plain spacer for center balance now — the dim
            toggle lives outside this shell entirely (see DimModeToggle.tsx),
            coordinated with CalendarPopup's own fixed offset instead of
            competing for this narrow flex slot. */}
        <span className="w-10" />
      </header>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
