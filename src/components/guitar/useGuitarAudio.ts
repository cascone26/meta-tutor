"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GuitarAudioStatus = "idle" | "requesting" | "listening" | "error" | "unsupported";

export type GuitarAudioHandle = {
  status: GuitarAudioStatus;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  getTimeDomainData: () => Float32Array<ArrayBuffer> | null;
  getFrequencyData: () => Float32Array<ArrayBuffer> | null;
  sampleRate: number;
  /** fftSize behind getFrequencyData() — chromaFromSpectrum needs this for its bin math. */
  fftSize: number;
};

// Time-domain buffer for YIN: 2048 samples covers 2+ periods of the lowest open string
// (~82Hz) with room to spare, and keeps YIN's O(n^2) inner loop cheap enough for 60fps.
const TIME_FFT_SIZE = 2048;

// Frequency-domain buffer for chroma: a SEPARATE, much larger AnalyserNode. This matters —
// at 4096 (~10.8Hz/bin), a single bin is already wider than a semitone below ~230Hz (one
// semitone at low E, 82Hz, is ~4.8Hz), so low guitar notes were landing in the wrong
// pitch-class bin and chord detection silently misidentified chords (B7 as D, E5 as C7 —
// caught by scripts/mt-guitar-dsp-test.ts, not by eye). 32768 (~1.35Hz/bin) resolves every
// open-string note correctly; the extra bins cost nothing since chroma binning is O(bins),
// not O(bins^2) like YIN.
const FREQ_FFT_SIZE = 32768;

/** Mic access + two AnalyserNodes off one source (time-domain tuned for fast pitch tracking,
 *  frequency-domain tuned for chroma resolution) — pulled on demand so callers drive their
 *  own requestAnimationFrame loop at whatever rate they need. */
export function useGuitarAudio(): GuitarAudioHandle {
  const [status, setStatus] = useState<GuitarAudioStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const timeAnalyserRef = useRef<AnalyserNode | null>(null);
  const freqAnalyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeBufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const freqBufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const [sampleRate, setSampleRate] = useState(44100);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close().catch(() => {});
    }
    ctxRef.current = null;
    timeAnalyserRef.current = null;
    freqAnalyserRef.current = null;
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setError("Microphone access isn't available in this browser.");
      return;
    }
    setStatus("requesting");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const AudioCtxCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxCtor();
      const source = ctx.createMediaStreamSource(stream);

      const timeAnalyser = ctx.createAnalyser();
      timeAnalyser.fftSize = TIME_FFT_SIZE;
      timeAnalyser.smoothingTimeConstant = 0;

      const freqAnalyser = ctx.createAnalyser();
      freqAnalyser.fftSize = FREQ_FFT_SIZE;
      freqAnalyser.smoothingTimeConstant = 0;

      source.connect(timeAnalyser);
      source.connect(freqAnalyser);

      streamRef.current = stream;
      ctxRef.current = ctx;
      timeAnalyserRef.current = timeAnalyser;
      freqAnalyserRef.current = freqAnalyser;
      setSampleRate(ctx.sampleRate);
      timeBufRef.current = new Float32Array(timeAnalyser.fftSize);
      freqBufRef.current = new Float32Array(freqAnalyser.frequencyBinCount);
      setStatus("listening");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Microphone access was denied.");
    }
  }, []);

  useEffect(() => stop, [stop]);

  const getTimeDomainData = useCallback(() => {
    if (!timeAnalyserRef.current || !timeBufRef.current) return null;
    timeAnalyserRef.current.getFloatTimeDomainData(timeBufRef.current);
    return timeBufRef.current;
  }, []);

  const getFrequencyData = useCallback(() => {
    if (!freqAnalyserRef.current || !freqBufRef.current) return null;
    freqAnalyserRef.current.getFloatFrequencyData(freqBufRef.current);
    return freqBufRef.current;
  }, []);

  return {
    status,
    error,
    start,
    stop,
    getTimeDomainData,
    getFrequencyData,
    sampleRate,
    fftSize: FREQ_FFT_SIZE,
  };
}
