"use client";

import { useEffect, useRef, useState } from "react";
import { useGuitarAudio } from "./useGuitarAudio";
import { detectPitchYin, rms, MIN_GUITAR_HZ, MAX_GUITAR_HZ, SILENCE_RMS } from "@/lib/guitar/pitch-detection";
import { describeFrequency, closestString } from "@/lib/guitar/notes";
import { createPitchStabilizer } from "@/lib/guitar/pitch-stabilizer";
import TunerGauge from "./TunerGauge";

type Reading = { freq: number; cents: number; noteName: string; octave: number; stringName: string } | null;

/** Detects whatever note is played, any string/fret — for checking intonation up the neck,
 *  alternate tunings, or anyone who already knows their note names. The default experience
 *  for a beginner is GuidedTuner; this is the "advanced" mode. */
export default function ChromaticTuner() {
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

  return (
    <div className="max-w-md mx-auto px-5 py-6 text-center">
      <p className="text-sm mb-6" style={{ color: "var(--g-muted)" }}>Detects any note, any string or fret. Standard tuning: E · A · D · G · B · e</p>

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
            <TunerGauge cents={reading ? cents : null} inTune={inTune} />

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
