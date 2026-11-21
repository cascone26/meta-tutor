"use client";

import { useEffect, useRef, useState } from "react";
import { useGuitarAudio } from "./useGuitarAudio";
import { detectPitchYin, rms, MIN_GUITAR_HZ, MAX_GUITAR_HZ, SILENCE_RMS } from "@/lib/guitar/pitch-detection";
import { createPitchStabilizer } from "@/lib/guitar/pitch-stabilizer";
import { STANDARD_TUNING, centsFromTarget, closestString } from "@/lib/guitar/notes";
import TunerGauge from "./TunerGauge";
import StringDiagram from "./StringDiagram";
import { CheckIcon } from "./GuitarIcons";

// Low to high — the order every beginner tuning guide uses: start with the thick string.
const SEQUENCE = STANDARD_TUNING;
const FRIENDLY: Record<number, string> = { 6: "Low E", 5: "A", 4: "D", 3: "G", 2: "B", 1: "High E" };
const POSITION_NOTE: Record<number, string> = {
  6: "the thickest string",
  5: "2nd-thickest string",
  4: "middle string",
  3: "middle string",
  2: "2nd-thinnest string",
  1: "the thinnest string",
};

const IN_TUNE_CENTS = 5;
const HOLD_MS_TO_CONFIRM = 700;
const ADVANCE_DELAY_MS = 900;

type Reading = { cents: number; matchesExpected: true } | { matchesExpected: false; heardString: number } | null;

export default function GuidedTuner({ onAllDone }: { onAllDone?: () => void }) {
  const audio = useGuitarAudio();
  const [stepIndex, setStepIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<boolean[]>(() => SEQUENCE.map(() => false));
  const [reading, setReading] = useState<Reading>(null);
  const [justConfirmedStep, setJustConfirmedStep] = useState<number | null>(null);
  const holdMsRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const stabilizerRef = useRef(createPitchStabilizer());
  const advanceLockRef = useRef(false);
  stepRef.current = stepIndex;

  const allDone = confirmed.every(Boolean);
  const target = SEQUENCE[stepIndex];

  function goToStep(i: number) {
    setStepIndex(Math.max(0, Math.min(SEQUENCE.length - 1, i)));
    holdMsRef.current = 0;
    advanceLockRef.current = false;
    setJustConfirmedStep(null);
    stabilizerRef.current.reset();
  }

  function restart() {
    setConfirmed(SEQUENCE.map(() => false));
    goToStep(0);
  }

  useEffect(() => {
    if (audio.status !== "listening") return;
    stabilizerRef.current.reset();
    const loop = (ts: number) => {
      const dt = lastTsRef.current === null ? 0 : ts - lastTsRef.current;
      lastTsRef.current = ts;
      const buf = audio.getTimeDomainData();
      if (buf && !advanceLockRef.current) {
        const rawFreq = rms(buf) >= SILENCE_RMS ? detectPitchYin(buf, audio.sampleRate)?.frequency ?? null : null;
        const inRange = rawFreq !== null && rawFreq >= MIN_GUITAR_HZ && rawFreq <= MAX_GUITAR_HZ;
        const stabilized = stabilizerRef.current.push(inRange ? rawFreq : null);

        if (stabilized === null) {
          setReading(null);
          holdMsRef.current = 0;
        } else {
          const nearest = closestString(stabilized);
          const currentTarget = SEQUENCE[stepRef.current];
          if (nearest.string === currentTarget.string) {
            const cents = centsFromTarget(stabilized, currentTarget.midi);
            setReading({ cents, matchesExpected: true });
            if (Math.abs(cents) <= IN_TUNE_CENTS) {
              holdMsRef.current += dt;
              if (holdMsRef.current >= HOLD_MS_TO_CONFIRM) {
                advanceLockRef.current = true;
                const confirmedIdx = stepRef.current;
                setConfirmed((c) => {
                  const next = [...c];
                  next[confirmedIdx] = true;
                  return next;
                });
                setJustConfirmedStep(confirmedIdx);
                setTimeout(() => {
                  if (confirmedIdx < SEQUENCE.length - 1) {
                    goToStep(confirmedIdx + 1);
                  } else {
                    advanceLockRef.current = false;
                    onAllDone?.();
                  }
                }, ADVANCE_DELAY_MS);
              }
            } else {
              holdMsRef.current = 0;
            }
          } else {
            setReading({ matchesExpected: false, heardString: nearest.string });
            holdMsRef.current = 0;
          }
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

  const cents = reading?.matchesExpected ? reading.cents : null;
  const inTune = cents !== null && Math.abs(cents) <= IN_TUNE_CENTS;
  const showingConfirmed = justConfirmedStep === stepIndex;

  return (
    <div className="max-w-sm mx-auto px-5 py-6 text-center">
      {audio.status === "idle" && (
        <div>
          <p className="text-sm mb-4" style={{ color: "var(--g-muted)" }}>
            We&apos;ll go one string at a time, thickest to thinnest. Pluck one string, let it ring,
            and don&apos;t touch the others — we&apos;ll tell you exactly what to do.
          </p>
          <button onClick={audio.start} className="g-btn">Start Guided Tuning (allow microphone)</button>
        </div>
      )}
      {audio.status === "requesting" && <p style={{ color: "var(--g-muted)" }}>Requesting microphone access…</p>}
      {(audio.status === "error" || audio.status === "unsupported") && (
        <p className="text-sm" style={{ color: "var(--g-danger)" }}>{audio.error}</p>
      )}

      {audio.status === "listening" && (
        <div>
          <div className="flex justify-center gap-2 mb-4">
            {SEQUENCE.map((s, i) => (
              <button
                key={s.string}
                onClick={() => goToStep(i)}
                aria-label={`Jump to string ${s.string}`}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: confirmed[i] ? "var(--g-success)" : i === stepIndex ? "var(--g-accent)" : "var(--g-border)",
                  color: confirmed[i] || i === stepIndex ? "#fff" : "var(--g-muted)",
                }}
              >
                {confirmed[i] ? <CheckIcon size={11} /> : s.string}
              </button>
            ))}
          </div>

          {!allDone ? (
            <div className="g-card p-6">
              <p className="text-xs mb-3" style={{ color: "var(--g-muted)" }}>
                String {target.string} of 6 — {POSITION_NOTE[target.string]}
              </p>
              <div className="mb-4">
                <StringDiagram activeString={target.string} />
              </div>

              <div className="text-5xl font-bold mb-3" style={{ color: inTune ? "var(--g-success)" : "var(--g-accent)" }}>
                {FRIENDLY[target.string]}
              </div>

              <TunerGauge cents={cents} inTune={inTune} />

              <div className="mt-2 min-h-[48px] flex items-center justify-center">
                {showingConfirmed ? (
                  <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--g-success)" }}>
                    <CheckIcon size={16} /> Nailed it! {stepIndex < SEQUENCE.length - 1 ? "Next string…" : "All done…"}
                  </p>
                ) : reading === null ? (
                  <p className="text-sm" style={{ color: "var(--g-muted)" }}>Pluck the highlighted string and let it ring</p>
                ) : !reading.matchesExpected ? (
                  <p className="text-sm" style={{ color: "var(--g-danger)" }}>
                    That sounds like string {reading.heardString} ({FRIENDLY[reading.heardString]}). Try string {target.string} instead — it&apos;s highlighted above.
                  </p>
                ) : inTune ? (
                  <p className="text-sm font-medium" style={{ color: "var(--g-success)" }}>In tune — hold steady…</p>
                ) : (
                  <p className="text-sm font-medium" style={{ color: "var(--g-text)" }}>
                    {cents! > 0
                      ? `A little sharp — loosen the string slightly (${Math.abs(cents!)}¢)`
                      : `A little flat — tighten the string slightly (${Math.abs(cents!)}¢)`}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 mt-3">
                <button onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0} className="g-btn-ghost" style={{ opacity: stepIndex === 0 ? 0.4 : 1 }}>
                  ← Previous
                </button>
                <button onClick={() => goToStep(stepIndex + 1)} disabled={stepIndex === SEQUENCE.length - 1} className="g-btn-ghost" style={{ opacity: stepIndex === SEQUENCE.length - 1 ? 0.4 : 1 }}>
                  Skip →
                </button>
              </div>
            </div>
          ) : (
            <div className="g-card p-8">
              <p className="text-2xl font-bold mb-2" style={{ color: "var(--g-success)" }}>🎉 All 6 strings tuned!</p>
              <p className="text-sm mb-4" style={{ color: "var(--g-muted)" }}>Your guitar is ready to play.</p>
              <button onClick={restart} className="g-btn-ghost">Tune again</button>
            </div>
          )}

          <button onClick={audio.stop} className="g-btn-ghost mt-4">Stop</button>
        </div>
      )}
    </div>
  );
}
