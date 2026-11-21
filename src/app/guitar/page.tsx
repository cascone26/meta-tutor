"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "@/lib/guitar/curriculum";
import { getCompletedLessons, getXpStats, getStreak } from "@/lib/guitar/progress";
import { dailyChallenge } from "@/lib/guitar/daily";
import {
  TunerIcon, LessonsIcon, ChordsIcon, PlayAlongIcon, ProgressIcon, MetronomeIcon,
  FretboardIcon, NoteTrainerIcon, DailyIcon, FlameIcon,
} from "@/components/guitar/GuitarIcons";

const TILES = [
  { href: "/guitar/lessons", title: "Lessons", desc: "27-step curriculum, one unlocked step at a time.", icon: LessonsIcon },
  { href: "/guitar/chords", title: "Chord Library", desc: "Every shape, live mic practice + shuffle quiz.", icon: ChordsIcon },
  { href: "/guitar/tuner", title: "Tuner", desc: "Live pitch detection — get in tune before you play.", icon: TunerIcon },
  { href: "/guitar/note-trainer", title: "Note Trainer", desc: "Find notes on the fretboard by ear.", icon: NoteTrainerIcon },
  { href: "/guitar/metronome", title: "Metronome", desc: "Tap tempo, adjustable time signature.", icon: MetronomeIcon },
  { href: "/guitar/play-along", title: "Play-Along", desc: "Metronome + chord charts for real songs.", icon: PlayAlongIcon },
  { href: "/guitar/fretboard", title: "Fretboard Map", desc: "Every note, every string, frets 0–12.", icon: FretboardIcon },
  { href: "/guitar/progress", title: "Progress", desc: "XP, streak, badges, and weak chords.", icon: ProgressIcon },
];

export default function GuitarHub() {
  const [continueHref, setContinueHref] = useState<string | null>(null);
  const [xpStats, setXpStats] = useState({ xp: 0, totalXp: 0, pct: 0 });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, lastPracticeDate: "" });
  const [mounted, setMounted] = useState(false);
  const challenge = dailyChallenge();

  useEffect(() => {
    const completed = getCompletedLessons();
    const next = LESSONS.find((l) => !completed.has(l.id));
    setContinueHref(next ? `/guitar/lessons/${next.id}` : null);
    setXpStats(getXpStats());
    setStreak(getStreak());
    setMounted(true);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--g-muted)" }}>Meta Tutor</p>
        <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--g-text)" }}>Guitar</h1>
        <p className="text-sm mb-6" style={{ color: "var(--g-muted)" }}>
          A live mic tuner and chord trainer, a real curriculum, and play-along practice — the useful
          parts of JustinGuitar, Yousician, and Fender Play, built as one instrument-practice app.
        </p>
      </div>

      {mounted && (
        <div className="flex gap-3 mb-5" style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 80ms both" }}>
          <div className="g-card flex-1 px-4 py-3 flex items-center gap-2.5">
            <span className="shrink-0" style={{ color: streak.currentStreak > 0 ? "var(--g-accent)" : "var(--g-muted)" }}>
              <FlameIcon size={20} />
            </span>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--g-text)" }}>{streak.currentStreak} day{streak.currentStreak === 1 ? "" : "s"}</div>
              <div className="text-[11px]" style={{ color: "var(--g-muted)" }}>current streak</div>
            </div>
          </div>
          <div className="g-card flex-1 px-4 py-3">
            <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--g-muted)" }}>
              <span>{xpStats.xp} XP</span>
              <span>{xpStats.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--g-border)" }}>
              <div className="h-full rounded-full" style={{ width: `${xpStats.pct}%`, background: "linear-gradient(90deg, var(--g-accent), var(--g-accent-dark))" }} />
            </div>
          </div>
        </div>
      )}

      {continueHref && (
        <Link
          href={continueHref}
          className="g-btn w-full mb-3"
          style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 120ms both" }}
        >
          Continue your lesson →
        </Link>
      )}

      <Link
        href="/guitar/chords"
        className="g-card flex items-center gap-3 px-4 py-3 mb-6"
        style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 160ms both" }}
      >
        <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--g-accent-wash)", color: "var(--g-accent-dark)" }}>
          <DailyIcon size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--g-muted)" }}>Today&apos;s chord</div>
          <div className="text-sm font-semibold truncate" style={{ color: "var(--g-text)" }}>{challenge.chord.display} — give it 10 clean strums</div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        {TILES.map((t, i) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="g-card px-4 py-4 transition-transform hover:-translate-y-0.5"
              style={{ animation: `fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) ${180 + i * 50}ms both` }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2.5" style={{ background: "var(--g-accent-wash)", color: "var(--g-accent-dark)" }}>
                <Icon size={18} />
              </div>
              <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--g-text)" }}>{t.title}</div>
              <div className="text-xs leading-snug" style={{ color: "var(--g-muted)" }}>{t.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
