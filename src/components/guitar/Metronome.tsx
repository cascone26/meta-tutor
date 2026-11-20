"use client";

import { useState } from "react";
import { useMetronome } from "./useMetronome";

export default function Metronome({ beatsPerMeasure = 4, initialBpm = 80 }: { beatsPerMeasure?: number; initialBpm?: number }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [running, setRunning] = useState(false);
  const { beatInMeasure } = useMetronome(bpm, beatsPerMeasure, running);

  return (
    <div className="max-w-sm mx-auto px-5 py-6 text-center">
      <div className="flex justify-center gap-2 mb-5">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full transition-all duration-75"
            style={{
              background: running && beatInMeasure === i ? (i === 0 ? "var(--accent)" : "var(--success)") : "var(--border)",
              transform: running && beatInMeasure === i ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      <div className="text-3xl font-bold mb-1" style={{ color: "var(--foreground)" }}>{bpm} BPM</div>
      <input
        type="range"
        min={40}
        max={180}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full mb-4"
      />

      <button
        onClick={() => setRunning((r) => !r)}
        className="rounded-full px-6 py-3 font-medium text-white"
        style={{ background: running ? "#b8793a" : "var(--accent)" }}
      >
        {running ? "Stop" : "Start Metronome"}
      </button>
    </div>
  );
}
