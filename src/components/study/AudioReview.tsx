"use client";

import { useState, useRef, useEffect } from "react";
import { getEffectiveGlossary, getEffectiveCategories } from "@/lib/custom-glossary";
import { recordStudySession } from "@/lib/streaks";

export default function AudioReview({ onBack }: { onBack: () => void }) {
  const glossary = getEffectiveGlossary();
  const categories = getEffectiveCategories();

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [delay, setDelay] = useState(2); // seconds between term and definition
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pool = selectedCat ? glossary.filter((g) => g.category === selectedCat) : [...glossary];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function speak(text: string, onEnd?: () => void) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = speed;
    utter.onend = () => { if (onEnd) onEnd(); };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function playTerm(index: number) {
    if (index >= pool.length) {
      setPlaying(false);
      return;
    }

    setCurrent(index);
    setPlaying(true);
    recordStudySession();
    const term = pool[index];

    // Speak term name
    speak(term.term, () => {
      // Pause, then speak definition
      timeoutRef.current = setTimeout(() => {
        speak(term.definition, () => {
          // After definition, auto-advance if enabled
          if (autoPlay) {
            timeoutRef.current = setTimeout(() => {
              playTerm(index + 1);
            }, delay * 1000);
          } else {
            setPlaying(false);
          }
        });
      }, delay * 1000);
    });
  }

  function stop() {
    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPlaying(false);
    setPaused(false);
  }

  function togglePause() {
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function next() {
    stop();
    playTerm(Math.min(current + 1, pool.length - 1));
  }

  function prev() {
    stop();
    playTerm(Math.max(current - 1, 0));
  }

  const currentTerm = pool[current];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => { stop(); onBack(); }} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Audio Review</h1>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Listen to terms and definitions. Study while walking, driving, or doing dishes.
        </p>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          <button onClick={() => { stop(); setSelectedCat(null); setCurrent(0); }} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: !selectedCat ? "var(--accent)" : "var(--surface)", color: !selectedCat ? "#fff" : "var(--muted)", border: `1px solid ${!selectedCat ? "var(--accent)" : "var(--border)"}` }}>All ({glossary.length})</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => { stop(); setSelectedCat(cat); setCurrent(0); }} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: selectedCat === cat ? "var(--accent)" : "var(--surface)", color: selectedCat === cat ? "#fff" : "var(--muted)", border: `1px solid ${selectedCat === cat ? "var(--accent)" : "var(--border)"}` }}>
              {cat} ({glossary.filter((g) => g.category === cat).length})
            </button>
          ))}
        </div>

        {/* Settings */}
        <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Speed:</span>
              {[0.75, 1, 1.25, 1.5].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className="text-xs px-2 py-0.5 rounded" style={{ background: speed === s ? "var(--accent-light)" : "transparent", color: speed === s ? "var(--accent)" : "var(--muted)" }}>{s}x</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Pause:</span>
              {[1, 2, 3, 5].map((d) => (
                <button key={d} onClick={() => setDelay(d)} className="text-xs px-2 py-0.5 rounded" style={{ background: delay === d ? "var(--accent-light)" : "transparent", color: delay === d ? "var(--accent)" : "var(--muted)" }}>{d}s</button>
              ))}
            </div>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />
              <span className="text-xs" style={{ color: "var(--foreground)" }}>Auto-advance</span>
            </label>
          </div>
        </div>

        {/* Now playing */}
        <div className="rounded-xl p-5 mb-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {currentTerm && (
            <>
              <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                {currentTerm.category}
              </span>
              <h2 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>{currentTerm.term}</h2>
              <p className="text-sm mb-4" style={{ color: "var(--muted)", lineHeight: 1.6 }}>{currentTerm.definition}</p>
            </>
          )}

          <div className="flex items-center justify-center gap-3">
            <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 20L9 12l10-8v16zM5 19V5" /></svg>
            </button>

            {!playing ? (
              <button onClick={() => playTerm(current)} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--accent)", color: "#fff" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </button>
            ) : (
              <button onClick={paused ? togglePause : togglePause} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: paused ? "var(--accent)" : "var(--warning)", color: "#fff" }}>
                {paused ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                )}
              </button>
            )}

            <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4l10 8-10 8V4zM19 5v14" /></svg>
            </button>

            {playing && (
              <button onClick={stop} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--error-bg)", border: "1px solid #c96b6b40", color: "var(--error)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" /></svg>
              </button>
            )}
          </div>

          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            {current + 1} of {pool.length}
          </p>
        </div>

        {/* Quick list */}
        <div className="space-y-1">
          {pool.map((g, i) => (
            <button
              key={g.term}
              onClick={() => { stop(); playTerm(i); }}
              className="w-full text-left rounded-lg px-3 py-2 text-xs flex items-center justify-between"
              style={{
                background: i === current ? "var(--accent-light)" : "transparent",
                color: i === current ? "var(--accent)" : "var(--foreground)",
              }}
            >
              <span>{g.term}</span>
              <span style={{ color: "var(--muted)" }}>{g.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
