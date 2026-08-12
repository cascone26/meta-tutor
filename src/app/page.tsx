"use client";

import Link from "next/link";
import { subjects, umbrellas } from "@/lib/subjects";

export default function HubPage() {
  return (
    <div
      className="h-full overflow-y-auto relative flex items-center justify-center px-4 py-14"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, #1c1f2e 0%, #0a0a0d 55%, #060607 100%)", color: "#eceae6" }}
    >
      {/* Ambient floating glow orbs — the "movement" layer, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 420, height: 420, top: "-8%", left: "6%",
          background: "radial-gradient(circle, #3f6b4f66 0%, transparent 70%)",
          filter: "blur(60px)", animation: "floatSlow 14s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 380, height: 380, bottom: "-6%", right: "8%",
          background: "radial-gradient(circle, #7c6b9a5c 0%, transparent 70%)",
          filter: "blur(60px)", animation: "floatSlower 18s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 320, height: 320, top: "35%", right: "22%",
          background: "radial-gradient(circle, #c9a24d44 0%, transparent 70%)",
          filter: "blur(70px)", animation: "floatSlow 20s ease-in-out infinite reverse",
        }}
      />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10" style={{ animation: "fadeUpIn 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: "#6f7a8f" }}>
            Meta Tutor
          </p>
          <h1
            className="text-4xl font-bold mb-3 tracking-tight"
            style={{
              background: "linear-gradient(90deg, #eceae6 0%, #cbd6e6 45%, #b8c8dc 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Where to today?
          </h1>
          <p className="text-sm" style={{ color: "#8a90a3" }}>
            Pick a subject. Each one tracks your progress and tells you what to work on.
          </p>
        </div>

        {umbrellas.length > 0 && (
          <div className="grid gap-3 mb-5">
            {umbrellas.map((u, i) => (
              <Link
                key={u.id}
                href={u.href}
                className="group relative flex items-center justify-between rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${u.accent}22 0%, rgba(255,255,255,0.03) 100%)`,
                  border: `1px solid ${u.accent}55`,
                  backdropFilter: "blur(16px)",
                  animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
                  animationDelay: `${100 + i * 90}ms`,
                  boxShadow: `0 0 0 rgba(0,0,0,0)`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 12px 40px -8px ${u.accent}55`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125"
                    style={{ background: u.accentDark, boxShadow: `0 0 14px ${u.accent}` }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{u.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
                        style={{ background: `${u.accent}33`, color: u.accentDark }}
                      >
                        Umbrella
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#9aa0b3" }}>{u.tagline}</p>
                  </div>
                </div>
                <span
                  className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: u.accentDark }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-3">
          {subjects.map((s, i) => (
            <Link
              key={s.id}
              href={s.href}
              className="group relative flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
                animationDelay: `${100 + (umbrellas.length + i) * 90}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${s.accent}88`;
                e.currentTarget.style.boxShadow = `0 12px 32px -10px ${s.accent}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125"
                  style={{ background: s.accentDark, boxShadow: `0 0 10px ${s.accent}` }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{s.name}</span>
                    {s.status === "building" && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#8a8580" }}
                      >
                        Building
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#8a90a3" }}>{s.tagline}</p>
                </div>
              </div>
              <span
                className="text-sm opacity-40 group-hover:opacity-90 transition-all duration-300 group-hover:translate-x-1"
                style={{ color: s.accentDark }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
