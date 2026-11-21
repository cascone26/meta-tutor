"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  BackIcon, HomeIcon, TunerIcon, LessonsIcon, ChordsIcon, PlayAlongIcon, ProgressIcon,
  MetronomeIcon, FretboardIcon, NoteTrainerIcon, MenuIcon, CloseIcon, SunIcon, MoonIcon,
} from "./GuitarIcons";

const NAV_ITEMS = [
  { href: "/guitar", label: "Home", icon: HomeIcon },
  { href: "/guitar/lessons", label: "Lessons", icon: LessonsIcon },
  { href: "/guitar/chords", label: "Chord Library", icon: ChordsIcon },
  { href: "/guitar/tuner", label: "Tuner", icon: TunerIcon },
  { href: "/guitar/note-trainer", label: "Note Trainer", icon: NoteTrainerIcon },
  { href: "/guitar/metronome", label: "Metronome", icon: MetronomeIcon },
  { href: "/guitar/play-along", label: "Play-Along", icon: PlayAlongIcon },
  { href: "/guitar/fretboard", label: "Fretboard Map", icon: FretboardIcon },
  { href: "/guitar/progress", label: "Progress", icon: ProgressIcon },
];

const TITLES: Record<string, string> = {
  "/guitar": "Guitar",
  "/guitar/lessons": "Lessons",
  "/guitar/chords": "Chord Library",
  "/guitar/tuner": "Tuner",
  "/guitar/note-trainer": "Note Trainer",
  "/guitar/metronome": "Metronome",
  "/guitar/play-along": "Play-Along",
  "/guitar/fretboard": "Fretboard Map",
  "/guitar/progress": "Progress",
};

export default function GuitarNav({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/guitar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("meta-tutor-theme", next ? "dark" : "light");
    } catch {}
  }

  const isHome = pathname === "/guitar";
  const resolvedTitle = title ?? TITLES[pathname] ?? (pathname.startsWith("/guitar/lessons/") ? "Lesson" : "Guitar");

  return (
    <>
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ background: "var(--g-nav-bg)", borderBottom: "1px solid var(--g-border)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isHome ? (
              <Link href="/" aria-label="Back to Meta Tutor" className="g-icon-btn">
                <BackIcon size={18} />
              </Link>
            ) : (
              <button onClick={() => router.back()} aria-label="Back" className="g-icon-btn">
                <BackIcon size={18} />
              </button>
            )}
            <span className="font-semibold text-sm truncate" style={{ color: "var(--g-text)" }}>{resolvedTitle}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {mounted && (
              <button onClick={toggleTheme} aria-label="Toggle theme" className="g-icon-btn">
                {dark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              </button>
            )}
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="g-icon-btn">
              <MenuIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end"
          style={{ background: "rgba(20,14,8,0.45)", animation: "fadeUpIn 0.18s ease both" }}
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="w-72 max-w-[85vw] h-full p-4 overflow-y-auto"
            style={{ background: "var(--g-surface)", borderLeft: "1px solid var(--g-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--g-muted)" }}>Guitar</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="g-icon-btn">
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                    style={{
                      background: active ? "var(--g-accent-wash)" : "transparent",
                      color: active ? "var(--g-accent-dark)" : "var(--g-text)",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
