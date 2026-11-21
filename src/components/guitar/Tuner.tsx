"use client";

import { useState } from "react";
import GuidedTuner from "./GuidedTuner";
import ChromaticTuner from "./ChromaticTuner";

export default function Tuner({ onAllDone }: { onAllDone?: () => void }) {
  const [mode, setMode] = useState<"guided" | "chromatic">("guided");

  return (
    <div>
      <div className="flex justify-center gap-2 pt-6 mb-2">
        <button
          onClick={() => setMode("guided")}
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ background: mode === "guided" ? "var(--g-accent)" : "var(--g-surface)", color: mode === "guided" ? "#fff" : "var(--g-text)", border: "1px solid var(--g-border)" }}
        >
          Guided (beginner)
        </button>
        <button
          onClick={() => setMode("chromatic")}
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ background: mode === "chromatic" ? "var(--g-accent)" : "var(--g-surface)", color: mode === "chromatic" ? "#fff" : "var(--g-text)", border: "1px solid var(--g-border)" }}
        >
          Chromatic (any note)
        </button>
      </div>
      {mode === "guided" ? <GuidedTuner onAllDone={onAllDone} /> : <ChromaticTuner />}
    </div>
  );
}
