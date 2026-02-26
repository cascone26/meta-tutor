"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const mainTabs = [
  {
    href: "/",
    label: "Chat",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
  {
    href: "/study",
    label: "Study",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>,
  },
  {
    href: "/glossary",
    label: "Glossary",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
  },
  {
    href: "/dashboard",
    label: "Progress",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18M7 16l4-4 4 4 6-6" /></svg>,
  },
];

const moreTabs = [
  { href: "/notes", label: "Notes" },
  { href: "/sources", label: "Sources" },
  { href: "/compare", label: "Compare" },
  { href: "/map", label: "Map" },
  { href: "/faith", label: "Faith" },
];

const PRAYER = `Creator of all things,
true Source of light and wisdom,
origin of all being,
graciously let a ray of Your light penetrate
the darkness of my understanding.

Take from me the double darkness
in which I have been born,
an obscurity of sin and ignorance.

Give me a keen understanding,
a retentive memory, and
the ability to grasp things correctly and fundamentally.

Grant me the talent of being exact in my explanations
and the ability to express myself
with thoroughness and charm.

Point out the beginning,
direct the progress,
and help in the completion.

I ask this through Jesus Christ our Lord.

Amen.`;

export default function Nav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = moreTabs.some((t) => pathname.startsWith(t.href));

  // ─── Dark mode ─────────────────────────────────────────────────────────────
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("meta-tutor-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      setDark(false);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("meta-tutor-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("meta-tutor-theme", "light");
    }
  }

  // Keyboard shortcut: D
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.key === "d" || e.key === "D") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
          toggleDark();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ─── Prayer modal ──────────────────────────────────────────────────────────
  const [prayerOpen, setPrayerOpen] = useState(false);

  useEffect(() => {
    const disabled = localStorage.getItem("meta-tutor-show-prayer") === "false";
    const shownThisSession = sessionStorage.getItem("meta-tutor-prayer-shown");
    if (!disabled && !shownThisSession) {
      setPrayerOpen(true);
      sessionStorage.setItem("meta-tutor-prayer-shown", "true");
    }
  }, []);

  function dismissPrayer(permanent: boolean) {
    setPrayerOpen(false);
    if (permanent) localStorage.setItem("meta-tutor-show-prayer", "false");
  }

  return (
    <>
      {/* Prayer modal */}
      {prayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div
            className="max-w-sm w-full rounded-2xl p-6 shadow-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "var(--accent)" }}>
              Prayer of St. Thomas Aquinas
            </p>
            <p
              className="text-sm leading-relaxed whitespace-pre-line text-center mb-6"
              style={{ color: "var(--foreground)", fontStyle: "italic" }}
            >
              {PRAYER}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => dismissPrayer(false)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Begin
              </button>
              <button
                onClick={() => dismissPrayer(true)}
                className="w-full py-2 rounded-xl text-xs"
                style={{ color: "var(--muted)", background: "transparent" }}
              >
                Don&apos;t show again
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        className="flex items-center justify-around md:justify-center md:gap-1 px-2 py-2 border-b shrink-0 relative"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {mainTabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
            style={{
              background: isMoreActive ? "var(--accent-light)" : "transparent",
              color: isMoreActive ? "var(--accent)" : "var(--muted)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
            More
          </button>
          {moreOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1 z-50 rounded-xl py-1 min-w-[140px] shadow-lg"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {moreTabs.map((tab) => {
                  const active = pathname.startsWith(tab.href);
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{
                        color: active ? "var(--accent)" : "var(--foreground)",
                        background: active ? "var(--accent-light)" : "transparent",
                      }}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Dark / light toggle */}
        <button
          onClick={toggleDark}
          title={dark ? "Switch to light mode (D)" : "Switch to dark mode (D)"}
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
          style={{ color: "var(--muted)" }}
        >
          {dark ? (
            /* Sun icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            /* Moon icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          <span className="hidden md:inline">{dark ? "Light" : "Dark"}</span>
        </button>
      </nav>
    </>
  );
}
