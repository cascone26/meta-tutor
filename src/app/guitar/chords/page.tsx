"use client";

import { useState } from "react";
import { CHORDS, ChordShape } from "@/lib/guitar/chords-data";
import ChordDiagram from "@/components/guitar/ChordDiagram";
import ChordTrainer from "@/components/guitar/ChordTrainer";
import { ShuffleIcon } from "@/components/guitar/GuitarIcons";
import HelpTip from "@/components/guitar/HelpTip";

const CATEGORY_LABEL: Record<string, string> = { open: "Open Chords", seventh: "Seventh Chords", barre: "Barre Chords", power: "Power Chords" };
const CATEGORY_TIP: Record<string, string> = {
  seventh: "A bluesier, more unresolved-sounding variation of the main chord — same family, extra color.",
  barre: "One finger presses down multiple strings at once instead of one finger per string. Harder, usually learned after open chords.",
  power: "Just two notes (no major/minor quality) — the backbone of rock rhythm guitar, and simpler than a full chord.",
};

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ChordsPage() {
  const [practicing, setPracticing] = useState<string[] | null>(null);

  if (practicing) {
    return <ChordTrainer chordIds={practicing} mode="chord-library" />;
  }

  const byCategory = CHORDS.reduce<Record<string, ChordShape[]>>((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-xl font-semibold mb-1 flex items-center" style={{ color: "var(--g-text)" }}>
        Chord Library
        <HelpTip text="Each picture is a chord diagram — vertical lines are strings, horizontal lines are frets, dots show where to press. An o above a string means play it open; an × means skip that string." />
      </h1>
      <p className="text-sm mb-4" style={{ color: "var(--g-muted)" }}>Tap a chord to practice it with live mic feedback.</p>

      <button onClick={() => setPracticing(shuffled(CHORDS.map((c) => c.id)))} className="g-btn mb-6">
        <ShuffleIcon size={16} /> Shuffle Quiz — all {CHORDS.length} chords
      </button>

      {Object.entries(byCategory).map(([cat, chords]) => (
        <div key={cat} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold flex items-center" style={{ color: "var(--g-text)" }}>
              {CATEGORY_LABEL[cat] ?? cat}
              {CATEGORY_TIP[cat] && <HelpTip text={CATEGORY_TIP[cat]} />}
            </h2>
            <button
              onClick={() => setPracticing(shuffled(chords.map((c) => c.id)))}
              className="g-btn-ghost"
              style={{ padding: "0.35rem 0.8rem", fontSize: "0.7rem" }}
            >
              <ShuffleIcon size={13} /> Shuffle
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {chords.map((c) => (
              <button
                key={c.id}
                onClick={() => setPracticing([c.id])}
                className="g-card p-3 text-center transition-transform hover:-translate-y-0.5"
              >
                <ChordDiagram chord={c} size={0.85} />
                <div className="text-xs font-medium mt-1" style={{ color: "var(--g-text)" }}>{c.display}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
