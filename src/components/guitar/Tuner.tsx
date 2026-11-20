"use client";

import { useEffect, useRef, useState } from "react";
import { useGuitarAudio } from "./useGuitarAudio";
import { detectPitchYin, rms, MIN_GUITAR_HZ, MAX_GUITAR_HZ, SILENCE_RMS } from "@/lib/guitar/pitch-detection";
import { describeFrequency, closestString } from "@/lib/guitar/notes";

type Reading = { freq: number; cents: number; noteName: string; octave: number; stringName: string } | null;

export default function Tuner() {
  const audio = useGuitarAudio();
  const [reading, setReading] = useState<Reading>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (audio.status !== "listening") {
      setReading(null);
      return;
    }
    const loop = () => {
      const buf = audio.getTimeDomainData();
      if (buf) {
        if (rms(buf) >= SILENCE_RMS) {
          const pitch = detectPitchYin(buf, audio.sampleRate);
          if (pitch && pitch.frequency >= MIN_GUITAR_HZ && pitch.frequency <= MAX_GUITAR_HZ) {
            const info = describeFrequency(pitch.frequency);
            const str = closestString(pitch.frequency);
            setReading({ freq: pitch.frequency, cents: info.cents, noteName: info.name, octave: info.octave, stringName: str.name });
          }
        } else {
          setReading(null);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // audio.getTimeDomainData/sampleRate are stable (useCallback/ref-backed in useGuitarAudio) —
    // depending on the whole `audio` object would re-subscribe this loop every frame, since
    // setReading() above causes a re-render (and a fresh object literal) on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.status, audio.getTimeDomainData, audio.sampleRate]);

  const cents = reading?.cents ?? 0;
  const inTune = reading !== null && Math.abs(cents) <= 5;
  const needlePct = 50 + Math.max(-50, Math.min(50, cents));

  return (
    <div className="max-w-md mx-auto px-5 py-6 text-center">
      <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>Tuner</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Standard tuning: E-A-D-G-B-e (low to high).</p>

      {audio.status === "idle" && (
        <button
          onClick={audio.start}
          className="rounded-full px-6 py-3 font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          Start Tuner (allow microphone)
        </button>
      )}

      {audio.status === "requesting" && <p style={{ color: "var(--muted)" }}>Requesting microphone access…</p>}

      {(audio.status === "error" || audio.status === "unsupported") && (
        <p className="text-sm" style={{ color: "#d88a8a" }}>{audio.error}</p>
      )}

      {audio.status === "listening" && (
        <div>
          <div
            className="rounded-2xl p-8 mb-4"
            style={{ background: "var(--surface)", border: `1px solid ${inTune ? "var(--success)" : "var(--border)"}` }}
          >
            <div className="text-6xl font-bold mb-1" style={{ color: inTune ? "var(--success)" : "var(--foreground)" }}>
              {reading ? `${reading.noteName}${reading.octave}` : "—"}
            </div>
            <div className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              {reading ? `${reading.freq.toFixed(1)} Hz · nearest string ${reading.stringName}` : "Pluck a string"}
            </div>

            <div className="relative h-2 rounded-full" style={{ background: "var(--border)" }}>
              <div className="absolute top-1/2 left-1/2 w-px h-4 -translate-x-1/2 -translate-y-1/2" style={{ background: "var(--muted)" }} />
              {reading && (
                <div
                  className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-75"
                  style={{ left: `${needlePct}%`, background: inTune ? "var(--success)" : "var(--accent)" }}
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--muted)" }}>
              <span>flat</span>
              <span>in tune</span>
              <span>sharp</span>
            </div>
            {reading && (
              <div className="text-sm mt-3 font-medium" style={{ color: inTune ? "var(--success)" : "var(--foreground)" }}>
                {inTune ? "In tune" : cents > 0 ? `${cents} cents sharp — tune down` : `${cents} cents flat — tune up`}
              </div>
            )}
          </div>
          <button onClick={audio.stop} className="text-xs underline" style={{ color: "var(--muted)" }}>Stop</button>
        </div>
      )}
    </div>
  );
}
