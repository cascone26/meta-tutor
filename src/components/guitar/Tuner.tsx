"use client";

import { useEffect, useRef, useState } from "react";
import { useGuitarAudio } from "./useGuitarAudio";
import { detectPitchYin, rms, MIN_GUITAR_HZ, MAX_GUITAR_HZ, SILENCE_RMS } from "@/lib/guitar/pitch-detection";
import { describeFrequency, closestString } from "@/lib/guitar/notes";
import { createPitchStabilizer } from "@/lib/guitar/pitch-stabilizer";

type Reading = { freq: number; cents: number; noteName: string; octave: number; stringName: string } | null;

const CX = 110, CY = 115, R = 92;
const TICKS = [-50, -25, 0, 25, 50];

// Classic upper-semicircle gauge math: cents -50 -> 180deg (left), 0 -> 90deg (up), +50 -> 0deg (right).
function angleFor(cents: number) {
  const clamped = Math.max(-50, Math.min(50, cents));
  return 180 - ((clamped + 50) / 100) * 180;
}
function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}
function arcPath(fromCents: number, toCents: number, radius: number) {
  const a1 = angleFor(fromCents), a2 = angleFor(toCents);
  const p1 = pointAt(a1, radius), p2 = pointAt(a2, radius);
  return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y}`;
}

export default function Tuner() {
  const audio = useGuitarAudio();
  const [reading, setReading] = useState<Reading>(null);
  const rafRef = useRef<number | null>(null);
  const stabilizerRef = useRef(createPitchStabilizer());

  useEffect(() => {
    if (audio.status !== "listening") {
      setReading(null);
      return;
    }
    stabilizerRef.current.reset();
    const loop = () => {
      const buf = audio.getTimeDomainData();
      if (buf) {
        const rawFreq = rms(buf) >= SILENCE_RMS ? detectPitchYin(buf, audio.sampleRate)?.frequency ?? null : null;
        const inRange = rawFreq !== null && rawFreq >= MIN_GUITAR_HZ && rawFreq <= MAX_GUITAR_HZ;
        const stabilized = stabilizerRef.current.push(inRange ? rawFreq : null);
        if (stabilized !== null) {
          const info = describeFrequency(stabilized);
          const str = closestString(stabilized);
          setReading({ freq: stabilized, cents: info.cents, noteName: info.name, octave: info.octave, stringName: str.name });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.status, audio.getTimeDomainData, audio.sampleRate]);

  const cents = reading?.cents ?? 0;
  const inTune = reading !== null && Math.abs(cents) <= 5;
  const needleAngle = angleFor(reading ? cents : 0);
  const needleTip = pointAt(needleAngle, R - 20);

  return (
    <div className="max-w-md mx-auto px-5 py-6 text-center">
      <p className="text-sm mb-6" style={{ color: "var(--g-muted)" }}>Standard tuning, low to high: E · A · D · G · B · e</p>

      {audio.status === "idle" && (
        <button onClick={audio.start} className="g-btn">Start Tuner (allow microphone)</button>
      )}

      {audio.status === "requesting" && <p style={{ color: "var(--g-muted)" }}>Requesting microphone access…</p>}

      {(audio.status === "error" || audio.status === "unsupported") && (
        <p className="text-sm" style={{ color: "var(--g-danger)" }}>{audio.error}</p>
      )}

      {audio.status === "listening" && (
        <div>
          <div className="g-card p-6 mb-4">
            <svg viewBox="0 0 220 150" width="100%" height="180" style={{ overflow: "visible" }}>
              <path d={arcPath(-50, 50, R)} fill="none" stroke="var(--g-border)" strokeWidth={10} strokeLinecap="round" />
              <path d={arcPath(-5, 5, R)} fill="none" stroke="var(--g-success)" strokeWidth={10} strokeLinecap="round" opacity={0.55} />
              {TICKS.map((t) => {
                const p1 = pointAt(angleFor(t), R + 8);
                const p2 = pointAt(angleFor(t), R - 4);
                return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--g-muted)" strokeWidth={2} />;
              })}
              <line
                x1={CX} y1={CY} x2={needleTip.x} y2={needleTip.y}
                stroke={inTune ? "var(--g-success)" : "var(--g-accent)"} strokeWidth={3} strokeLinecap="round"
                style={{ transition: "all 90ms linear" }}
              />
              <circle cx={CX} cy={CY} r={6} fill={inTune ? "var(--g-success)" : "var(--g-accent)"} style={{ transition: "fill 90ms linear" }} />
            </svg>

            <div className="text-6xl font-bold -mt-2 mb-1" style={{ color: inTune ? "var(--g-success)" : "var(--g-text)", transition: "color 90ms linear" }}>
              {reading ? `${reading.noteName}${reading.octave}` : "—"}
            </div>
            <div className="text-xs mb-1" style={{ color: "var(--g-muted)" }}>
              {reading ? `${reading.freq.toFixed(1)} Hz · nearest string ${reading.stringName}` : "Pluck a string"}
            </div>
            {reading && (
              <div className="text-sm font-medium" style={{ color: inTune ? "var(--g-success)" : "var(--g-text)" }}>
                {inTune ? "In tune" : cents > 0 ? `${cents} cents sharp — tune down` : `${cents} cents flat — tune up`}
              </div>
            )}
          </div>
          <button onClick={audio.stop} className="g-btn-ghost">Stop</button>
        </div>
      )}
    </div>
  );
}
