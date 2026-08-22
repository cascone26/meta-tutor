"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BackLink from "@/components/rca/BackLink";

const STORAGE_KEY = "rca-dim-mode";

// Pragmatic dim/low-light mode for early-morning prep, scoped to the RCA
// umbrella only. Rather than rewriting every inline-styled color across the
// nature theme (dozens of components, all hand-tuned hex values), this
// applies a single CSS filter to the whole shell — real value, much smaller
// surface area to get wrong. Persisted in localStorage, no account/DB needed
// since it's a pure display preference.
export default function RcaThemeShell({ children }: { children: React.ReactNode }) {
  const [dim, setDim] = useState(false);

  useEffect(() => {
    setDim(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function toggle() {
    const next = !dim;
    setDim(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

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
        <BackLink href="/">Hub</BackLink>
        <span className="flex items-center gap-2">
          <Image src="/rca-logo.png" alt="Regina Caeli Academy" width={800} height={154} priority style={{ height: 22, width: "auto" }} />
          <span className="text-sm font-semibold tracking-wide" style={{ color: "#2f5e7a" }}>· KSC</span>
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={dim ? "Turn off dim mode" : "Turn on dim mode"}
          title={dim ? "Dim mode on" : "Dim mode off"}
          className="w-10 h-8 rounded-full flex items-center justify-center text-xs"
          style={{ background: dim ? "#33402c" : "rgba(255,255,255,0.5)", color: dim ? "#e8edc6" : "#2f5e7a", border: "1px solid #d9e4d3" }}
        >
          {dim ? "☾" : "☀"}
        </button>
      </header>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
