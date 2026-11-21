"use client";

import { useEffect, useRef, useState } from "react";
import { Song } from "@/lib/guitar/songs";
import { useMetronome } from "./useMetronome";
import { useGuitarAudio } from "./useGuitarAudio";
import { chromaFromSpectrum, scoreAgainstChord } from "@/lib/guitar/chord-detection";
import { chordById } from "@/lib/guitar/chords-data";
import ChordDiagram from "./ChordDiagram";

export default function PlayAlong({ song, onComplete }: { song: Song; onComplete?: () => void }) {
  const [running, setRunning] = useState(false);
  const [measureIdx, setMeasureIdx] = useState(0);
  const [loops, setLoops] = useState(0);
  const prevMeasureRef = useRef(0);
  const audio = useGuitarAudio();
  const [liveScore, setLiveScore] = useState(0);
  const rafRef = useRef<number | null>(null);

  const { beatInMeasure } = useMetronome(song.bpm, song.beatsPerMeasure, running, (beat, measure) => {
    const wrapped = measure % song.progression.length;
    setMeasureIdx(wrapped);
    if (wrapped === 0 && measure !== prevMeasureRef.current && measure > 0) {
      setLoops((l) => l + 1);
    }
    prevMeasureRef.current = measure;
  });

  const currentChordId = song.progression[measureIdx];
  const nextChordId = song.progression[(measureIdx + 1) % song.progression.length];
  const current = chordById(currentChordId);
  const next = chordById(nextChordId);

  // Optional live feedback: how close the mic input is to the current target chord.
  useEffect(() => {
    if (audio.status !== "listening" || !current) return;
    const loop = () => {
      const freq = audio.getFrequencyData();
      if (freq) {
        const chroma = chromaFromSpectrum(freq, audio.sampleRate, audio.fftSize);
        setLiveScore(scoreAgainstChord(chroma, current));
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.status, audio.getFrequencyData, audio.sampleRate, audio.fftSize, current?.id]);

  return (
    <div className="max-w-md mx-auto px-5 py-6 text-center">
      <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--g-text)" }}>{song.title}</h3>
      <p className="text-xs mb-4" style={{ color: "var(--g-muted)" }}>{song.bpm} BPM · {song.beatsPerMeasure}/4 time · {song.notes}</p>

      <div className="g-card p-5">
        <div className="flex justify-center gap-1.5 mb-5">
          {Array.from({ length: song.beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full transition-all duration-75"
              style={{ background: running && beatInMeasure === i ? "var(--g-accent)" : "var(--g-border)" }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "var(--g-muted)" }}>Now</p>
            {current && <ChordDiagram chord={current} size={1.1} />}
            <p className="text-sm font-semibold mt-1" style={{ color: "var(--g-text)" }}>{current?.display}</p>
          </div>
          <div style={{ opacity: 0.5 }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "var(--g-muted)" }}>Next</p>
            {next && <ChordDiagram chord={next} size={0.85} />}
            <p className="text-xs mt-1" style={{ color: "var(--g-muted)" }}>{next?.display}</p>
          </div>
        </div>

        {audio.status === "listening" && (
          <div className="relative h-1.5 rounded-full mb-4 overflow-hidden max-w-[200px] mx-auto" style={{ background: "var(--g-border)" }}>
            <div className="h-full transition-all duration-100" style={{ width: `${Math.round(liveScore * 100)}%`, background: "var(--g-success)" }} />
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mb-1">
          <button onClick={() => setRunning((r) => !r)} className="g-btn">
            {running ? "Stop" : "Start"}
          </button>
          {audio.status === "idle" && (
            <button onClick={audio.start} className="g-btn-ghost">+ live feedback</button>
          )}
        </div>
      </div>

      <p className="text-xs mt-3 mb-3" style={{ color: "var(--g-muted)" }}>Loops completed: {loops}</p>

      {onComplete && (
        <button onClick={onComplete} className="g-btn-ghost">
          Mark this song practiced ✓
        </button>
      )}
    </div>
  );
}
