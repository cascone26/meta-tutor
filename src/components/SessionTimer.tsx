"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { addSessionTime, getTimerState, saveTimerState, formatTime } from "@/lib/session-timer";
import { recordStudySession } from "@/lib/streaks";

export default function SessionTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Restore timer state on mount
  useEffect(() => {
    const state = getTimerState();
    setElapsed(state.elapsed);
    setRunning(state.running);
    startTimeRef.current = state.startedAt;
  }, []);

  // Timer tick
  useEffect(() => {
    if (running) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [running]);

  // Save state periodically
  useEffect(() => {
    const save = setInterval(() => {
      saveTimerState(running, elapsed, startTimeRef.current);
    }, 5000);
    return () => clearInterval(save);
  }, [running, elapsed]);

  const toggle = useCallback(() => {
    if (running) {
      // Pause
      if (intervalRef.current) clearInterval(intervalRef.current);
      addSessionTime(elapsed);
      recordStudySession();
      saveTimerState(false, elapsed, null);
      setRunning(false);
      startTimeRef.current = null;
    } else {
      // Start
      startTimeRef.current = Date.now();
      saveTimerState(true, elapsed, startTimeRef.current);
      setRunning(true);
    }
  }, [running, elapsed]);

  const reset = useCallback(() => {
    if (running && intervalRef.current) clearInterval(intervalRef.current);
    if (elapsed > 0) {
      addSessionTime(elapsed);
      recordStudySession();
    }
    setElapsed(0);
    setRunning(false);
    startTimeRef.current = null;
    saveTimerState(false, 0, null);
  }, [running, elapsed]);

  // Listen for D key to toggle dark mode (handled elsewhere) — no conflict

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{
          background: running ? "var(--accent)" : "var(--surface)",
          border: `1px solid ${running ? "var(--accent)" : "var(--border)"}`,
          color: running ? "#fff" : "var(--muted)",
        }}
        title="Session timer"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 rounded-xl p-3 shadow-lg"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: 160 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Session Timer</span>
        <button onClick={() => setMinimized(true)} className="text-xs" style={{ color: "var(--muted)" }}>-</button>
      </div>
      <p className="text-2xl font-mono font-bold text-center mb-2" style={{ color: running ? "var(--accent)" : "var(--foreground)" }}>
        {formatTime(elapsed)}
      </p>
      <div className="flex gap-1.5 justify-center">
        <button
          onClick={toggle}
          className="px-3 py-1 rounded-lg text-xs font-medium"
          style={{
            background: running ? "#c96b6b" : "var(--accent)",
            color: "#fff",
          }}
        >
          {running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
        </button>
        {elapsed > 0 && (
          <button
            onClick={reset}
            className="px-3 py-1 rounded-lg text-xs font-medium"
            style={{ background: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
