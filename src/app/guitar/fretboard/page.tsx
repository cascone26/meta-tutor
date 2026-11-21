"use client";

import { useState } from "react";
import { fretboardGrid, FRET_COUNT, FRET_MARKERS } from "@/lib/guitar/fretboard";
import { NOTE_NAMES } from "@/lib/guitar/notes";
import HelpTip from "@/components/guitar/HelpTip";

export default function FretboardPage() {
  const [highlightPc, setHighlightPc] = useState<number | null>(null);
  const grid = fretboardGrid();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-1 text-center flex items-center justify-center" style={{ color: "var(--g-text)" }}>
        Fretboard Note Map
        <HelpTip text="This shows the name of every note across every string, frets 0-12 (0 = open string, no finger pressing). It's a reference for learning where notes live on the neck." />
      </h1>
      <p className="text-sm mb-5 text-center" style={{ color: "var(--g-muted)" }}>Every note, frets 0–12. Tap a note name to highlight it across the whole neck.</p>

      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {NOTE_NAMES.map((n, pc) => (
          <button
            key={n}
            onClick={() => setHighlightPc(highlightPc === pc ? null : pc)}
            className="text-xs font-semibold w-9 h-9 rounded-full"
            style={{
              background: highlightPc === pc ? "var(--g-accent)" : "var(--g-surface)",
              color: highlightPc === pc ? "#fff" : "var(--g-text)",
              border: "1px solid var(--g-border)",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="g-card p-3 overflow-x-auto">
        <div style={{ minWidth: 640 }}>
          <div className="grid" style={{ gridTemplateColumns: `28px repeat(${FRET_COUNT + 1}, 1fr)` }}>
            <div />
            {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
              <div key={fret} className="text-center text-[10px] pb-1" style={{ color: "var(--g-muted)" }}>{fret}</div>
            ))}
          </div>
          {grid.map((row, ri) => (
            <div key={ri} className="grid items-center" style={{ gridTemplateColumns: `28px repeat(${FRET_COUNT + 1}, 1fr)` }}>
              <div className="text-xs font-semibold text-center" style={{ color: "var(--g-muted)" }}>{row.stringLabel}</div>
              {row.cells.map((cell) => {
                const isHighlighted = highlightPc === cell.pc;
                return (
                  <div
                    key={cell.fret}
                    className="flex items-center justify-center m-0.5 rounded-md text-[11px] font-medium"
                    style={{
                      height: 30,
                      background: isHighlighted ? "var(--g-accent)" : cell.fret === 0 ? "var(--g-surface-2)" : "var(--g-surface)",
                      color: isHighlighted ? "#fff" : cell.isNatural ? "var(--g-text)" : "var(--g-muted)",
                      border: `1px solid ${cell.fret === 0 ? "var(--g-text)" : "var(--g-border)"}`,
                      borderWidth: cell.fret === 0 ? "0 2px 0 0" : "1px",
                    }}
                  >
                    {cell.name}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="grid" style={{ gridTemplateColumns: `28px repeat(${FRET_COUNT + 1}, 1fr)` }}>
            <div />
            {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
              <div key={fret} className="flex justify-center pt-1">
                {FRET_MARKERS.includes(fret) && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--g-accent)", opacity: 0.5 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
