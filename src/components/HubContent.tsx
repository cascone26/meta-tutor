"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subjects, umbrellas } from "@/lib/subjects";

type ThemeId = "dark" | "light";

const THEMES: Record<ThemeId, {
  pageBg: string; text: string; eyebrow: string; muted: string; headlineGradient: string;
  cardBg: string; cardBorder: string; badgeBg: string; badgeText: string;
  toggleBg: string; toggleBorder: string; toggleIcon: string;
  orb1: string; orb2: string; orb3: string;
}> = {
  dark: {
    pageBg: "radial-gradient(ellipse 120% 80% at 50% -10%, #1c1f2e 0%, #0a0a0d 55%, #060607 100%)",
    text: "#eceae6", eyebrow: "#6f7a8f", muted: "#8a90a3",
    headlineGradient: "linear-gradient(90deg, #eceae6 0%, #cbd6e6 45%, #b8c8dc 100%)",
    cardBg: "rgba(255,255,255,0.035)", cardBorder: "rgba(255,255,255,0.08)",
    badgeBg: "rgba(255,255,255,0.06)", badgeText: "#8a8580",
    toggleBg: "rgba(255,255,255,0.06)", toggleBorder: "rgba(255,255,255,0.12)", toggleIcon: "#e0c07a",
    orb1: "#3f6b4f66", orb2: "#7c6b9a5c", orb3: "#c9a24d44",
  },
  light: {
    pageBg: "radial-gradient(ellipse 120% 80% at 50% -10%, #eef4fb 0%, #f6f4ee 55%, #fbfaf6 100%)",
    text: "#2b2e36", eyebrow: "#8a8f9c", muted: "#5f6570",
    headlineGradient: "linear-gradient(90deg, #2b2e36 0%, #46536b 45%, #55647a 100%)",
    cardBg: "rgba(255,255,255,0.72)", cardBorder: "rgba(30,32,40,0.09)",
    badgeBg: "rgba(30,32,40,0.06)", badgeText: "#6b7280",
    toggleBg: "rgba(30,32,40,0.05)", toggleBorder: "rgba(30,32,40,0.1)", toggleIcon: "#c9843a",
    orb1: "#3f6b4f2e", orb2: "#7c6b9a28", orb3: "#c9a24d2e",
  },
};

const THEME_KEY = "hub-theme";

export default function HubContent({ firstName }: { firstName: string | null }) {
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [greeting, setGreeting] = useState("Welcome back");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") setTheme(saved);
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  const t = THEMES[theme];
  const visibleSubjects = subjects.filter((s) => !s.hiddenFromHub);

  return (
    <div
      className="h-full overflow-y-auto relative flex items-center justify-center px-4 py-14"
      style={{ background: t.pageBg, color: t.text, transition: "background 0.4s ease, color 0.4s ease" }}
    >
      {/* Ambient floating glow orbs — the "movement" layer, purely decorative */}
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 420, height: 420, top: "-8%", left: "6%", background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)`, filter: "blur(60px)", animation: "floatSlow 14s ease-in-out infinite" }} />
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 380, height: 380, bottom: "-6%", right: "8%", background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`, filter: "blur(60px)", animation: "floatSlower 18s ease-in-out infinite" }} />
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 320, height: 320, top: "35%", right: "22%", background: `radial-gradient(circle, ${t.orb3} 0%, transparent 70%)`, filter: "blur(70px)", animation: "floatSlow 20s ease-in-out infinite reverse" }} />

      <button
        onClick={toggleTheme}
        aria-label="Toggle light/dark theme"
        className="fixed top-5 right-5 z-20 flex items-center justify-center rounded-full transition-transform hover:scale-110"
        style={{ width: 40, height: 40, background: t.toggleBg, border: `1px solid ${t.toggleBorder}` }}
      >
        {theme === "dark" ? <MoonIcon color={t.toggleIcon} /> : <SunIcon color={t.toggleIcon} />}
      </button>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8" style={{ animation: "fadeUpIn 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: t.eyebrow }}>
            Meta Tutor
          </p>
          <h1
            className="text-4xl font-bold mb-3 tracking-tight"
            style={{
              backgroundImage: t.headlineGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {mounted && firstName ? `${greeting}, ${firstName}.` : "Where to today?"}
          </h1>
          <p className="text-sm" style={{ color: t.muted }}>
            {mounted && firstName ? "Where to today?" : "Pick a subject. Each one tracks your progress and tells you what to work on."}
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
                  background: `linear-gradient(135deg, ${u.accent}22 0%, ${t.cardBg} 100%)`,
                  border: `1px solid ${u.accent}55`,
                  backdropFilter: "blur(16px)",
                  animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
                  animationDelay: `${140 + i * 90}ms`,
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
                    <p className="text-xs mt-1" style={{ color: t.muted }}>{u.tagline}</p>
                  </div>
                </div>
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1" style={{ color: u.accentDark }}>
                  →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-3">
          {visibleSubjects.map((s, i) => (
            <Link
              key={s.id}
              href={s.href}
              className="group relative flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                backdropFilter: "blur(12px)",
                animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
                animationDelay: `${140 + (umbrellas.length + i) * 90}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${s.accent}88`;
                e.currentTarget.style.boxShadow = `0 12px 32px -10px ${s.accent}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t.cardBorder;
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
                        style={{ background: t.badgeBg, color: t.badgeText }}
                      >
                        Building
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: t.muted }}>{s.tagline}</p>
                </div>
              </div>
              <span className="text-sm opacity-40 group-hover:opacity-90 transition-all duration-300 group-hover:translate-x-1" style={{ color: s.accentDark }}>
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  );
}

function SunIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}
