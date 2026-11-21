"use client";

import { useEffect, useRef, useState } from "react";
import { useGuitarAudio } from "./useGuitarAudio";
import { chromaFromSpectrum, scoreAgainstChord, CHORD_MATCH_PASS_THRESHOLD } from "@/lib/guitar/chord-detection";
import { chordById } from "@/lib/guitar/chords-data";
import ChordDiagram from "./ChordDiagram";
import { logChordMiss, logPracticeResult } from "@/lib/guitar/progress";

const HOLD_MS_TO_PASS = 450;
const STRUGGLE_MS_TO_LOG = 7000;

export default function ChordTrainer({
  chordIds,
  mode,
  onAllComplete,
}: {
  chordIds: string[];
  mode: string;
  onAllComplete?: () => void;
}) {
  const audio = useGuitarAudio();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState<boolean[]>(() => chordIds.map(() => false));
  const [missed, setMissed] = useState<string[]>([]);
  const heldMsRef = useRef(0);
  const struggleMsRef = useRef(0);
  const loggedMissRef = useRef(false);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const missedIdsRef = useRef<Set<string>>(new Set());
  indexRef.current = index;

  const target = chordById(chordIds[index]);

  useEffect(() => {
    heldMsRef.current = 0;
    struggleMsRef.current = 0;
    loggedMissRef.current = false;
    lastTsRef.current = null;
  }, [index]);

  useEffect(() => {
    if (audio.status !== "listening" || !target) return;

    const loop = (ts: number) => {
      const dt = lastTsRef.current === null ? 0 : ts - lastTsRef.current;
      lastTsRef.current = ts;

      const freq = audio.getFrequencyData();
      const currentTarget = chordById(chordIds[indexRef.current]);
      if (freq && currentTarget) {
        const chroma = chromaFromSpectrum(freq, audio.sampleRate, audio.fftSize);
        const sim = scoreAgainstChord(chroma, currentTarget);
        setScore(sim);

        if (sim >= CHORD_MATCH_PASS_THRESHOLD) {
          heldMsRef.current += dt;
          struggleMsRef.current = 0;
          if (heldMsRef.current >= HOLD_MS_TO_PASS) {
            setPassed((p) => {
              const next = [...p];
              next[indexRef.current] = true;
              return next;
            });
            if (indexRef.current + 1 < chordIds.length) {
              setIndex((i) => i + 1);
            } else {
              const missedIds = [...missedIdsRef.current];
              onAllComplete?.();
              logPracticeResult(mode, chordIds.length - missedIds.length, chordIds.length, missedIds);
            }
          }
        } else {
          heldMsRef.current = 0;
          struggleMsRef.current += dt;
          if (struggleMsRef.current >= STRUGGLE_MS_TO_LOG && !loggedMissRef.current) {
            loggedMissRef.current = true;
            logChordMiss(currentTarget.id, currentTarget.category, mode);
            missedIdsRef.current.add(currentTarget.id);
            setMissed([...missedIdsRef.current]);
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
  }, [audio.status, audio.getFrequencyData, audio.sampleRate, audio.fftSize, chordIds, target?.id]);

  const done = passed.every(Boolean);

  return (
    <div className="max-w-md mx-auto px-5 py-6 text-center">
      {audio.status === "idle" && (
        <button onClick={audio.start} className="g-btn">Start Practicing (allow microphone)</button>
      )}
      {audio.status === "requesting" && <p style={{ color: "var(--g-muted)" }}>Requesting microphone access…</p>}
      {(audio.status === "error" || audio.status === "unsupported") && (
        <p className="text-sm" style={{ color: "var(--g-danger)" }}>{audio.error}</p>
      )}

      {audio.status === "listening" && target && (
        <div>
          <div className="flex justify-center gap-1.5 mb-4">
            {chordIds.map((id, i) => (
              <span
                key={id}
                className="w-6 h-1.5 rounded-full"
                style={{ background: passed[i] ? "var(--g-success)" : i === index ? "var(--g-accent)" : "var(--g-border)" }}
              />
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--g-text)" }}>
            {done ? "All chords nailed" : `Play: ${target.display}`}
          </h3>

          {!done && (
            <div className="g-card p-5 mb-4 inline-block">
              <div className="flex justify-center mb-3">
                <ChordDiagram chord={target} size={1.3} />
              </div>

              <div className="relative h-2 rounded-full mb-2 overflow-hidden" style={{ background: "var(--g-border)" }}>
                <div
                  className="h-full transition-all duration-75"
                  style={{ width: `${Math.round(score * 100)}%`, background: score >= CHORD_MATCH_PASS_THRESHOLD ? "var(--g-success)" : "var(--g-accent)" }}
                />
              </div>
              <p className="text-xs" style={{ color: "var(--g-muted)" }}>
                {score >= CHORD_MATCH_PASS_THRESHOLD ? "Hold it steady…" : "Strum and hold — matching live"}
              </p>
            </div>
          )}

          {done && (
            <p className="text-sm mb-3" style={{ color: "var(--g-success)" }}>
              Nice work. {missed.length > 0 ? `${missed.length} chord(s) took a few tries — they'll show up in Progress.` : "Clean run."}
            </p>
          )}

          <div>
            <button onClick={audio.stop} className="g-btn-ghost">Stop</button>
          </div>
        </div>
      )}
    </div>
  );
}
