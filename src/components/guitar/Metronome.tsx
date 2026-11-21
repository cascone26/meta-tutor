"use client";

import { useRef, useState } from "react";
import { useMetronome } from "./useMetronome";
import HelpTip from "./HelpTip";

const TIME_SIGNATURES = [2, 3, 4, 6];
const TAP_RESET_MS = 2200;
const TAP_MAX_SAMPLES = 5;

export default function Metronome({ initialBpm = 80, initialBeatsPerMeasure = 4, showTimeSignature = true }: { initialBpm?: number; initialBeatsPerMeasure?: number; showTimeSignature?: boolean }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(initialBeatsPerMeasure);
  const [running, setRunning] = useState(false);
  const tapTimesRef = useRef<number[]>([]);
  const { beatInMeasure } = useMetronome(bpm, beatsPerMeasure, running);

  function tapTempo() {
    const now = performance.now();
    const last = tapTimesRef.current[tapTimesRef.current.length - 1];
    if (last !== undefined && now - last > TAP_RESET_MS) tapTimesRef.current = [];
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > TAP_MAX_SAMPLES) tapTimesRef.current.shift();
    if (tapTimesRef.current.length < 2) return;
    const gaps = tapTimesRef.current.slice(1).map((t, i) => t - tapTimesRef.current[i]);
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    setBpm(Math.max(40, Math.min(220, Math.round(60000 / avgGap))));
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-6 text-center">
      <div className="flex justify-center gap-2 mb-5">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-75"
            style={{
              width: i === 0 ? 20 : 16,
              height: i === 0 ? 20 : 16,
              background: running && beatInMeasure === i ? (i === 0 ? "var(--g-accent)" : "var(--g-success)") : "var(--g-border)",
              transform: running && beatInMeasure === i ? "scale(1.25)" : "scale(1)",
              boxShadow: running && beatInMeasure === i ? "var(--g-shadow)" : "none",
            }}
          />
        ))}
      </div>

      <div className="text-4xl font-bold mb-1" style={{ color: "var(--g-text)" }}>{bpm}</div>
      <div className="text-xs mb-3 flex items-center justify-center" style={{ color: "var(--g-muted)" }}>
        BPM
        <HelpTip text="Beats Per Minute — how fast the metronome clicks. Lower = slower. Start slow and work up." />
      </div>
      <input
        type="range"
        min={40}
        max={200}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full mb-4"
      />

      {showTimeSignature && (
        <div className="flex justify-center gap-2 mb-5">
          {TIME_SIGNATURES.map((n) => (
            <button
              key={n}
              onClick={() => setBeatsPerMeasure(n)}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: beatsPerMeasure === n ? "var(--g-accent)" : "var(--g-surface)",
                color: beatsPerMeasure === n ? "#fff" : "var(--g-text)",
                border: "1px solid var(--g-border)",
              }}
            >
              {n}/4
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setRunning((r) => !r)} className="g-btn">
          {running ? "Stop" : "Start"}
        </button>
        <button onClick={tapTempo} className="g-btn-ghost">Tap Tempo</button>
      </div>
    </div>
  );
}
