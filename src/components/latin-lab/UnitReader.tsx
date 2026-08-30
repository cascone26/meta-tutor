"use client";

import { useState } from "react";
import type { LatinUnit } from "@/lib/latin-lab/units";

export default function UnitReader({ unit, onStartCheck }: { unit: LatinUnit; onStartCheck: () => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showVocab, setShowVocab] = useState(false);

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      <div className="rounded-xl p-4 mb-4" style={{ background: "#241b14", border: "1px solid #3a2d1f" }}>
        <p className="text-xs font-semibold mb-1" style={{ color: "#c17a3a" }}>Grammar focus</p>
        <p className="text-sm" style={{ color: "#f0e6d8" }}>{unit.grammarFocus.join(" · ")}</p>
        <p className="text-xs mt-2" style={{ color: "#a08b73" }}>{unit.notes}</p>
      </div>

      <div className="rounded-xl p-5 mb-4" style={{ background: "#221912", border: "1px solid #3a2d1f" }}>
        <p className="text-xs mb-3" style={{ color: "#a08b73" }}>Tap a sentence to reveal the English. Read the whole thing at least once before checking.</p>
        <div className="space-y-3">
          {unit.narrative.map((sentence, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="block w-full text-left rounded-lg px-3 py-2 transition-colors"
              style={{ background: revealed.has(i) ? "#2e2419" : "transparent" }}
            >
              <p className="text-base" style={{ color: "#f0e6d8", lineHeight: 1.8 }}>{sentence}</p>
              {revealed.has(i) && (
                <p className="text-sm mt-1" style={{ color: "#c17a3a" }}>{unit.narrativeGlossEN[i]}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowVocab((v) => !v)}
        className="text-xs mb-4 px-3 py-1.5 rounded-full"
        style={{ background: "#241b14", border: "1px solid #3a2d1f", color: "#c17a3a" }}
      >
        {showVocab ? "Hide" : "Show"} new vocabulary ({unit.newVocab.length})
      </button>

      {showVocab && (
        <div className="rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ background: "#241b14", border: "1px solid #3a2d1f" }}>
          {unit.newVocab.map((v) => (
            <div key={v.latin} className="text-sm">
              <span style={{ color: "#f0e6d8", fontWeight: 600 }}>{v.latin}</span>
              <span style={{ color: "#a08b73" }}> — {v.english}</span>
              {v.note && <span className="block text-xs" style={{ color: "#7a6852" }}>{v.note}</span>}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onStartCheck}
        className="w-full py-3 rounded-xl text-sm font-semibold"
        style={{ background: "#c17a3a", color: "#1a1410" }}
      >
        Take the comprehension check →
      </button>
    </div>
  );
}
