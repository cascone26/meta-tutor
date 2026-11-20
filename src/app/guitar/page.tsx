"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "@/lib/guitar/curriculum";
import { getCompletedLessons } from "@/lib/guitar/progress";

const TILES = [
  { href: "/guitar/tuner", title: "Tuner", desc: "Live pitch detection — get in tune before you play." },
  { href: "/guitar/lessons", title: "Lessons", desc: "The full curriculum, one unlocked step at a time." },
  { href: "/guitar/chords", title: "Chord Library", desc: "Every chord shape, with a live practice mode for each." },
  { href: "/guitar/play-along", title: "Play-Along", desc: "Metronome + chord charts for real songs." },
  { href: "/guitar/progress", title: "Progress", desc: "XP, streak, and the chords that still need reps." },
];

export default function GuitarHub() {
  const [continueHref, setContinueHref] = useState<string | null>(null);

  useEffect(() => {
    const completed = getCompletedLessons();
    const next = LESSONS.find((l) => !completed.has(l.id));
    setContinueHref(next ? `/guitar/lessons/${next.id}` : null);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Guitar</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        A real-time tuner, a chord trainer that listens to you play through the mic, a structured
        curriculum, and play-along practice — the useful parts of JustinGuitar, Yousician, and
        Fender Play, built as one tool.
      </p>

      {continueHref && (
        <Link
          href={continueHref}
          className="block rounded-xl px-4 py-3 mb-5 text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          Continue your lesson →
        </Link>
      )}

      <div className="grid gap-3">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{t.title}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{t.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
