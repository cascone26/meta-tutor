"use client";

import { useEffect, useRef, useState } from "react";

const SCHEDULE_AHEAD_SEC = 0.1;
const LOOKAHEAD_MS = 25;

/** Standard Web-Audio lookahead-scheduler metronome (sample-accurate clicks; the onBeat
 *  callback for UI sync is timer-based and only needs to be close, not sample-accurate). */
export function useMetronome(bpm: number, beatsPerMeasure: number, running: boolean, onBeat?: (beatInMeasure: number, measureIndex: number) => void) {
  const [beatInMeasure, setBeatInMeasure] = useState(0);
  const [measureIndex, setMeasureIndex] = useState(0);
  const onBeatRef = useRef(onBeat);
  onBeatRef.current = onBeat;

  useEffect(() => {
    if (!running) {
      setBeatInMeasure(0);
      setMeasureIndex(0);
      return;
    }

    const AudioCtxCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtxCtor();
    let nextNoteTime = ctx.currentTime + 0.05;
    let beatNumber = 0;
    let timeoutId: number;
    const pendingUi: number[] = [];

    function click(time: number, isDownbeat: boolean) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = isDownbeat ? 1500 : 1000;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.35, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.06);
    }

    function scheduler() {
      while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
        const beatIdx = beatNumber % beatsPerMeasure;
        const mIdx = Math.floor(beatNumber / beatsPerMeasure);
        click(nextNoteTime, beatIdx === 0);
        const delayMs = Math.max(0, (nextNoteTime - ctx.currentTime) * 1000);
        const id = window.setTimeout(() => {
          setBeatInMeasure(beatIdx);
          setMeasureIndex(mIdx);
          onBeatRef.current?.(beatIdx, mIdx);
        }, delayMs);
        pendingUi.push(id);
        nextNoteTime += 60 / bpm;
        beatNumber++;
      }
      timeoutId = window.setTimeout(scheduler, LOOKAHEAD_MS);
    }
    scheduler();

    return () => {
      clearTimeout(timeoutId);
      pendingUi.forEach((id) => clearTimeout(id));
      ctx.close().catch(() => {});
    };
  }, [running, bpm, beatsPerMeasure]);

  return { beatInMeasure, measureIndex };
}
