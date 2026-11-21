"use client";

import { useEffect, useRef, useState } from "react";
import { useGuitarAudio } from "./useGuitarAudio";
import { detectPitchYin, rms, MIN_GUITAR_HZ, MAX_GUITAR_HZ, SILENCE_RMS } from "@/lib/guitar/pitch-detection";
import { describeFrequency, NOTE_NAMES } from "@/lib/guitar/notes";
import { createPitchStabilizer } from "@/lib/guitar/pitch-stabilizer";
import { logPracticeResult } from "@/lib/guitar/progress";

const NATURAL_PCS = [0, 2, 4, 5, 7, 9, 11];
const HOLD_MS_TO_PASS = 400;

function randomPc(pool: number[], avoid: number | null): number {
  let pc = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1) while (pc === avoid) pc = pool[Math.floor(Math.random() * pool.length)];
  return pc;
}

export default function NoteTrainer() {
  const audio = useGuitarAudio();
  const [naturalsOnly, setNaturalsOnly] = useState(true);
  const pool = naturalsOnly ? NATURAL_PCS : [...Array(12).keys()];
  const [targetPc, setTargetPc] = useState(() => randomPc(pool, null));
  const [detected, setDetected] = useState<{ name: string; octave: number } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const holdMsRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(targetPc);
  const stabilizerRef = useRef(createPitchStabilizer());
  targetRef.current = targetPc;

  function nextTarget() {
    setTargetPc((prev) => randomPc(pool, prev));
    holdMsRef.current = 0;
  }

  useEffect(() => {
    if (audio.status !== "listening") return;
    stabilizerRef.current.reset();
    const loop = (ts: number) => {
      const dt = lastTsRef.current === null ? 0 : ts - lastTsRef.current;
      lastTsRef.current = ts;
      const buf = audio.getTimeDomainData();
      if (buf) {
        const rawFreq = rms(buf) >= SILENCE_RMS ? detectPitchYin(buf, audio.sampleRate)?.frequency ?? null : null;
        const inRange = rawFreq !== null && rawFreq >= MIN_GUITAR_HZ && rawFreq <= MAX_GUITAR_HZ;
        const stabilized = stabilizerRef.current.push(inRange ? rawFreq : null);
        if (stabilized !== null) {
          const info = describeFrequency(stabilized);
          setDetected({ name: info.name, octave: info.octave });
          const detectedPc = NOTE_NAMES.indexOf(info.name as (typeof NOTE_NAMES)[number]);
          if (detectedPc === targetRef.current) {
            holdMsRef.current += dt;
            if (holdMsRef.current >= HOLD_MS_TO_PASS) {
              setCorrectCount((c) => c + 1);
              setAttempts((a) => a + 1);
              nextTarget();
            }
          } else {
            holdMsRef.current = 0;
          }
        } else {
          setDetected(null);
          holdMsRef.current = 0;
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

  function stop() {
    if (attempts > 0) logPracticeResult("note-trainer", correctCount, attempts);
    audio.stop();
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-6 text-center">
      {audio.status === "idle" && (
        <>
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setNaturalsOnly(true)}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: naturalsOnly ? "var(--g-accent)" : "var(--g-surface)", color: naturalsOnly ? "#fff" : "var(--g-text)", border: "1px solid var(--g-border)" }}
            >
              Naturals only
            </button>
            <button
              onClick={() => setNaturalsOnly(false)}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: !naturalsOnly ? "var(--g-accent)" : "var(--g-surface)", color: !naturalsOnly ? "#fff" : "var(--g-text)", border: "1px solid var(--g-border)" }}
            >
              All 12 notes
            </button>
          </div>
          <button onClick={audio.start} className="g-btn">Start Note Trainer (allow microphone)</button>
        </>
      )}
      {audio.status === "requesting" && <p style={{ color: "var(--g-muted)" }}>Requesting microphone access…</p>}
      {(audio.status === "error" || audio.status === "unsupported") && (
        <p className="text-sm" style={{ color: "var(--g-danger)" }}>{audio.error}</p>
      )}

      {audio.status === "listening" && (
        <div>
          <p className="text-xs mb-2" style={{ color: "var(--g-muted)" }}>Find this note anywhere on the neck</p>
          <div className="g-card p-8 mb-4">
            <div className="text-7xl font-bold mb-3" style={{ color: "var(--g-accent)" }}>{NOTE_NAMES[targetPc]}</div>
            <div className="text-sm" style={{ color: "var(--g-muted)" }}>
              {detected ? `hearing ${detected.name}${detected.octave}` : "listening…"}
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--g-text)" }}>Score: {correctCount} / {attempts}</p>
          <button onClick={stop} className="g-btn-ghost">Stop</button>
        </div>
      )}
    </div>
  );
}
