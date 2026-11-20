"use client";

import { useState } from "react";
import { CHORDS } from "@/lib/guitar/chords-data";
import ChordDiagram from "@/components/guitar/ChordDiagram";
import ChordTrainer from "@/components/guitar/ChordTrainer";

const CATEGORY_LABEL: Record<string, string> = { open: "Open Chords", seventh: "Seventh Chords", barre: "Barre Chords", power: "Power Chords" };

export default function ChordsPage() {
  const [practicing, setPracticing] = useState<string | null>(null);

  if (practicing) {
    return (
      <div>
        <div className="max-w-md mx-auto px-5 pt-4">
          <button onClick={() => setPracticing(null)} className="text-xs underline" style={{ color: "var(--muted)" }}>← back to library</button>
        </div>
        <ChordTrainer chordIds={[practicing]} mode="chord-library" />
      </div>
    );
  }

  const byCategory = CHORDS.reduce<Record<string, typeof CHORDS>>((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Chord Library</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Tap a chord to practice it with live mic feedback.</p>

      {Object.entries(byCategory).map(([cat, chords]) => (
        <div key={cat} className="mb-6">
          <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>{CATEGORY_LABEL[cat] ?? cat}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {chords.map((c) => (
              <button
                key={c.id}
                onClick={() => setPracticing(c.id)}
                className="rounded-xl p-3 text-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <ChordDiagram chord={c} size={0.85} />
                <div className="text-xs font-medium mt-1" style={{ color: "var(--foreground)" }}>{c.display}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
