"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { LeafIcon } from "@/components/rca/NatureIcons";

type Item = { key: string; lesson: number; itemType: string; prompt: string; direction?: string };
type Stats = { tracked: number; due: number; mastered: number; learning: number };
type Mode = "adaptive" | "jit" | "quiz";

export default function LatinDrillPage() {
  const [mode, setMode] = useState<Mode>("adaptive");
  const [lesson, setLesson] = useState<number | null>(null);
  const [lessons, setLessons] = useState<number[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [queue, setQueue] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ correct: boolean; near: boolean; expected: string } | null>(null);
  const [tally, setTally] = useState({ right: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = queue[idx];

  const loadBatch = useCallback(async (m: Mode, l: number | null) => {
    setLoading(true);
    setResult(null);
    setAnswer("");
    const qs = new URLSearchParams({ mode: m, limit: "15" });
    if (l != null) qs.set("lesson", String(l));
    const r = await fetch(`/api/ff-latin-drill?${qs}`);
    const d = await r.json();
    setStats(d.stats);
    setTotal(d.total);
    setLessons(d.lessons || []);
    setQueue(d.items || []);
    setIdx(0);
    setTally({ right: 0, done: 0 });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBatch("adaptive", null);
  }, [loadBatch]);

  useEffect(() => {
    if (current && !result) inputRef.current?.focus();
  }, [current, result]);

  async function submit() {
    if (!current || result) return;
    const r = await fetch("/api/ff-latin-drill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: current.key, answer: answer.trim() }),
    });
    const d = await r.json();
    setResult(d);
    setTally((t) => ({ right: t.right + (d.correct ? 1 : 0), done: t.done + 1 }));
  }

  function next() {
    setResult(null);
    setAnswer("");
    setIdx((i) => i + 1);
  }

  function pick(m: Mode, l: number | null) {
    setMode(m);
    setLesson(l);
    loadBatch(m, l);
  }

  const sessionDone = !loading && queue.length > 0 && idx >= queue.length;
  const emptyQueue = !loading && queue.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-5 py-8">
        <div className="mt-2 mb-5" style={{ animation: "fadeUpIn 0.5s ease both" }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <LeafIcon size={22} style={{ color: "#6b8e5a" }} />
            Latin drill
          </h1>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            Type the answer cold. It remembers what you miss and brings it back until you own it.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex gap-2 mb-4 text-xs">
            <Chip label={`${stats.tracked}/${total} seen`} />
            <Chip label={`${stats.mastered} mastered`} tone="good" />
            <Chip label={`${stats.due} due`} tone={stats.due > 0 ? "warn" : undefined} />
          </div>
        )}

        {/* Mode picker */}
        <div className="flex flex-wrap gap-2 mb-6">
          <ModeBtn active={mode === "adaptive"} onClick={() => pick("adaptive", null)}>Adaptive mix</ModeBtn>
          <ModeBtn active={mode === "jit"} onClick={() => pick("jit", lesson ?? lessons[0] ?? 1)}>Prep next class</ModeBtn>
          <div className="flex items-center gap-1">
            <ModeBtn active={mode === "quiz"} onClick={() => pick("quiz", lesson ?? lessons[0] ?? 1)}>Quiz lesson</ModeBtn>
            {(mode === "quiz" || mode === "jit") && (
              <select
                value={lesson ?? ""}
                onChange={(e) => pick(mode, parseInt(e.target.value, 10))}
                className="rounded-lg px-2 py-1.5 text-xs"
                style={{ border: "1px solid #cdd8c4", background: "#fff", color: "#33402c" }}
              >
                {lessons.map((l) => <option key={l} value={l}>L{l}</option>)}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: "#8a9a7c" }}>Loading…</p>
        ) : emptyQueue ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(107,142,90,0.1)", border: "1px solid #d9e4d3" }}>
            <p className="text-sm" style={{ color: "#4a6b3a" }}>
              Nothing due here right now — you&apos;re current. Try another mode or check back later.
            </p>
          </div>
        ) : sessionDone ? (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}>
            <p className="text-lg font-bold mb-1" style={{ color: "#33402c" }}>
              {tally.right} / {tally.done} correct
            </p>
            <p className="text-sm mb-4" style={{ color: "#5c6b52" }}>
              {tally.right === tally.done ? "Clean sweep. That stuff is yours." : "The misses are queued to come back on your forgetting curve."}
            </p>
            <button onClick={() => pick(mode, lesson)} className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: "#6b8e5a", color: "#fff" }}>
              Keep going →
            </button>
          </div>
        ) : current ? (
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #e8e4d5", boxShadow: "0 6px 20px -12px rgba(63,126,166,0.25)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b8e5a" }}>
                {current.itemType} · L{current.lesson}
              </span>
              <span className="text-xs" style={{ color: "#8a9a7c" }}>{idx + 1} / {queue.length}</span>
            </div>
            <p className="text-xl font-bold mb-1" style={{ color: "#33402c" }}>{current.prompt}</p>
            {current.direction && <p className="text-xs mb-4" style={{ color: "#8a9a7c" }}>{current.direction}</p>}

            <input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { result ? next() : submit(); } }}
              disabled={!!result}
              placeholder="type the Latin…"
              className="w-full rounded-xl px-4 py-3 text-lg mb-3"
              style={{ border: "1px solid #cdd8c4", background: result ? "#f7f7f2" : "#fff", color: "#33402c" }}
            />

            {result ? (
              <div>
                <div
                  className="rounded-xl px-4 py-3 mb-3"
                  style={{
                    background: result.correct ? "rgba(107,142,90,0.12)" : result.near ? "#fdf6ee" : "rgba(160,74,74,0.08)",
                    border: `1px solid ${result.correct ? "rgba(107,142,90,0.3)" : result.near ? "#ecd9bf" : "rgba(160,74,74,0.2)"}`,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: result.correct ? "#4a6b3a" : result.near ? "#a97b3a" : "#a04a4a" }}>
                    {result.correct ? "Correct" : result.near ? "So close — a letter off" : "Not quite"}
                  </p>
                  {!result.correct && (
                    <p className="text-base mt-1" style={{ color: "#33402c" }}>
                      Answer: <span className="font-bold">{result.expected}</span>
                    </p>
                  )}
                </div>
                <button onClick={next} className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold" style={{ background: "#6b8e5a", color: "#fff" }}>
                  Next →
                </button>
              </div>
            ) : (
              <button onClick={submit} className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold" style={{ background: "#3f7ea6", color: "#fff" }}>
                Check
              </button>
            )}
          </div>
        ) : null}

        <div className="mt-6 text-center">
          <Link href="/rca/first-form-latin-6" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            ← Back to First Form Latin
          </Link>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, tone }: { label: string; tone?: "good" | "warn" }) {
  const c = tone === "good" ? { bg: "rgba(107,142,90,0.12)", fg: "#4a6b3a" }
    : tone === "warn" ? { bg: "#fdf6ee", fg: "#a97b3a" }
    : { bg: "rgba(63,126,166,0.1)", fg: "#2f5e7a" };
  return <span className="rounded-full px-2.5 py-1 font-semibold" style={{ background: c.bg, color: c.fg }}>{label}</span>;
}

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
      style={{
        background: active ? "#6b8e5a" : "rgba(107,142,90,0.1)",
        color: active ? "#fff" : "#4a6b3a",
        border: active ? "1px solid #6b8e5a" : "1px solid rgba(107,142,90,0.25)",
      }}
    >
      {children}
    </button>
  );
}
