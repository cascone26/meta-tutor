"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PraxisQuestion,
  PraxisSubtest,
  PraxisProgress,
  PRAXIS_SUBTESTS,
  PRAXIS_SUBTEST_ORDER,
  PRAXIS_DEADLINE,
  QUIZ_SIZES,
  TIMER_OPTIONS,
  getRandomQuestions,
  getBySubtest,
  getSubtestCounts,
  shuffle,
  loadProgress,
  saveProgress,
  recordAnswer,
  subtestReadiness,
} from "@/lib/praxis";

type Phase = "hub" | "playing" | "results";
type Scope = PraxisSubtest | "all";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(dateISO: string): number {
  const now = new Date();
  const target = new Date(dateISO + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

interface AnswerLog {
  q: PraxisQuestion;
  chosen: number;
  correct: boolean;
}

export default function PraxisPage() {
  const [phase, setPhase] = useState<Phase>("hub");
  const [progress, setProgress] = useState<PraxisProgress>(() => loadProgress());
  const [quizSize, setQuizSize] = useState<number>(15);
  const [timer, setTimer] = useState<number>(0);

  // session state
  const [questions, setQuestions] = useState<PraxisQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [remaining, setRemaining] = useState<number>(0);

  const counts = useMemo(() => getSubtestCounts(), []);
  const days = daysUntil(PRAXIS_DEADLINE);

  // reload progress from storage on mount (in case another tab changed it)
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const startSession = useCallback(
    (scope: Scope, mode: "practice" | "review") => {
      let pool: PraxisQuestion[];
      if (mode === "review") {
        // questions answered wrong recently (Leitner box 1) or never mastered
        const weak = getBySubtest(scope).filter((q) => {
          const c = progress.cards[q.id];
          return c && c.seen > 0 && c.box <= 2;
        });
        pool = shuffle(weak.length ? weak : getBySubtest(scope)).slice(0, quizSize);
      } else {
        // prefer least-seen questions for practice
        const bank = getBySubtest(scope);
        const sorted = [...bank].sort((a, b) => {
          const ca = progress.cards[a.id]?.seen ?? 0;
          const cb = progress.cards[b.id]?.seen ?? 0;
          return ca - cb;
        });
        const leastSeen = sorted.slice(0, Math.max(quizSize * 3, quizSize));
        pool = shuffle(leastSeen).slice(0, quizSize);
        if (pool.length === 0) pool = getRandomQuestions(quizSize, scope);
      }
      if (pool.length === 0) return;
      setQuestions(pool);
      setIdx(0);
      setChosen(null);
      setLog([]);
      setRemaining(timer);
      setPhase("playing");
    },
    [progress, quizSize, timer]
  );

  const current = questions[idx];

  const submitAnswer = useCallback(
    (choice: number) => {
      if (chosen !== null || !current) return;
      const correct = choice === current.answer;
      setChosen(choice);
      setLog((l) => [...l, { q: current, chosen: choice, correct }]);
      setProgress((p) => {
        const next = recordAnswer(p, current, correct, todayISO());
        saveProgress(next);
        return next;
      });
    },
    [chosen, current]
  );

  const next = useCallback(() => {
    if (chosen === null) return;
    if (idx + 1 >= questions.length) {
      setProgress((p) => {
        const finished = { ...p, sessions: p.sessions + 1 };
        saveProgress(finished);
        return finished;
      });
      setPhase("results");
    } else {
      setIdx((i) => i + 1);
      setChosen(null);
      setRemaining(timer);
    }
  }, [chosen, idx, questions.length, timer]);

  // per-question countdown timer
  useEffect(() => {
    if (phase !== "playing" || timer === 0 || chosen !== null) return;
    if (remaining <= 0) {
      submitAnswer(-1); // time out → counts wrong
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timer, chosen, remaining, submitAnswer]);

  // keyboard: 1-4 to answer, Enter/Space to advance
  useEffect(() => {
    if (phase !== "playing") return;
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (chosen === null && current) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= current.options.length) {
          submitAnswer(n - 1);
          e.preventDefault();
        }
      } else if (chosen !== null && (e.key === "Enter" || e.key === " ")) {
        next();
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, chosen, current, submitAnswer, next]);

  // ─── HUB ──────────────────────────────────────────────────────────────────
  if (phase === "hub") {
    const sessionsSummary = `${progress.totalAnswered} answered · ${
      progress.totalAnswered
        ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
        : 0
    }% correct · ${progress.sessions} sessions`;

    return (
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
        <header style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 13, color: "var(--muted)", letterSpacing: 0.4, textTransform: "uppercase" }}>
            Praxis 7001 · Elementary Education
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: "0.35rem 0 0.5rem" }}>
            Multiple Subjects Prep
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.4rem 0.85rem",
              borderRadius: 999,
              background: days <= 30 ? "rgba(200,80,80,0.14)" : "var(--accent-light)",
              color: days <= 30 ? "#c85050" : "var(--accent)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {days > 0 ? `${days} days to the Feb 1, 2027 exam deadline` : "Deadline passed — reschedule ASAP"}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 10 }}>{sessionsSummary}</p>
        </header>

        {/* session controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            padding: "1rem 1.15rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            marginBottom: "1.5rem",
          }}
        >
          <Control label="Questions">
            {QUIZ_SIZES.map((s) => (
              <Pill key={s} active={quizSize === s} onClick={() => setQuizSize(s)}>
                {s}
              </Pill>
            ))}
          </Control>
          <Control label="Timer / question">
            {TIMER_OPTIONS.map((t) => (
              <Pill key={t} active={timer === t} onClick={() => setTimer(t)}>
                {t === 0 ? "Off" : `${t}s`}
              </Pill>
            ))}
          </Control>
        </div>

        {/* subtest cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
          {PRAXIS_SUBTEST_ORDER.map((s) => {
            const meta = PRAXIS_SUBTESTS[s];
            const r = subtestReadiness(progress, s);
            const passed = r.touched > 0 && r.scaled >= meta.passing;
            const close = r.touched > 0 && !passed && r.scaled >= meta.passing - 10;
            const barColor = passed ? "var(--success)" : close ? "#d1a13a" : "var(--accent)";
            return (
              <div
                key={s}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "1.1rem 1.15rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{meta.name}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{meta.code}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>{meta.blurb}</p>

                {/* readiness meter */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--muted)" }}>
                      {r.touched > 0 ? `Est. ${r.scaled} / need ${meta.passing}` : `Passing: ${meta.passing}`}
                    </span>
                    <span style={{ color: "var(--muted)" }}>
                      {r.touched}/{r.total} seen
                    </span>
                  </div>
                  <div style={{ height: 8, background: "var(--surface-hover)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${Math.min(100, ((r.scaled - 100) / 100) * 100)}%`,
                        background: barColor,
                        borderRadius: 999,
                        transition: "width 0.4s",
                      }}
                    />
                    {/* passing line marker */}
                    <div
                      style={{
                        position: "absolute",
                        top: -2,
                        bottom: -2,
                        left: `${((meta.passing - 100) / 100) * 100}%`,
                        width: 2,
                        background: "var(--foreground)",
                        opacity: 0.55,
                      }}
                    />
                  </div>
                  {passed && (
                    <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginTop: 5 }}>
                      On track ✓
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button onClick={() => startSession(s, "practice")} style={primaryBtn}>
                    Practice
                  </button>
                  <button onClick={() => startSession(s, "review")} style={ghostBtn}>
                    Review weak
                  </button>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{counts[s]} questions</div>
              </div>
            );
          })}
        </div>

        {/* mixed diagnostic */}
        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => startSession("all", "practice")} style={{ ...primaryBtn, padding: "0.7rem 1.4rem" }}>
            Mixed diagnostic ({counts["all"]} Q pool)
          </button>
          <button onClick={() => startSession("all", "review")} style={{ ...ghostBtn, padding: "0.7rem 1.4rem" }}>
            Review all weak spots
          </button>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 22, lineHeight: 1.5 }}>
          Readiness is a study estimate (coverage × mastery mapped to the 100–200 scale), not an official
          predicted score. The dark line on each meter marks the Kansas passing score. Questions from the
          existing exam-prep bank + a verified seed set.
        </p>
      </div>
    );
  }

  // ─── PLAYING ────────────────────────────────────────────────────────────────
  if (phase === "playing" && current) {
    const meta = PRAXIS_SUBTESTS[current.subtest];
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {meta.name} · {idx + 1}/{questions.length}
          </span>
          {timer > 0 && chosen === null && (
            <span style={{ fontSize: 13, fontWeight: 700, color: remaining <= 5 ? "#c85050" : "var(--muted)" }}>
              {remaining}s
            </span>
          )}
        </div>
        <div style={{ height: 6, background: "var(--surface-hover)", borderRadius: 999, marginBottom: 22, overflow: "hidden" }}>
          <div style={{ width: `${(idx / questions.length) * 100}%`, height: "100%", background: "var(--accent)", transition: "width 0.3s" }} />
        </div>

        {current.passage && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "0.9rem 1.05rem",
              fontSize: 15,
              lineHeight: 1.55,
              marginBottom: 16,
              color: "var(--foreground)",
            }}
          >
            {current.passage}
          </div>
        )}

        <h2 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4, margin: "0 0 18px" }}>{current.question}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.options.map((opt, i) => {
            const isChosen = chosen === i;
            const isAnswer = current.answer === i;
            let bg = "var(--surface)";
            let border = "1px solid var(--border)";
            if (chosen !== null) {
              if (isAnswer) {
                bg = "rgba(106,176,112,0.16)";
                border = "1px solid var(--success)";
              } else if (isChosen) {
                bg = "rgba(200,80,80,0.14)";
                border = "1px solid #c85050";
              }
            }
            return (
              <button
                key={i}
                onClick={() => submitAnswer(i)}
                disabled={chosen !== null}
                style={{
                  textAlign: "left",
                  padding: "0.85rem 1rem",
                  borderRadius: 11,
                  background: bg,
                  border,
                  color: "var(--foreground)",
                  fontSize: 15,
                  cursor: chosen === null ? "pointer" : "default",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  transition: "background 0.15s, border 0.15s",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "var(--surface-hover)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}
                >
                  {i + 1}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {chosen !== null && (
          <div
            style={{
              marginTop: 18,
              padding: "0.95rem 1.1rem",
              borderRadius: 12,
              background: "var(--accent-light)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6, color: chosen === current.answer ? "var(--success)" : "#c85050" }}>
              {chosen === current.answer ? "Correct" : chosen === -1 ? "Time's up" : "Not quite"}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: "var(--foreground)" }}>{current.explanation}</p>
            <button onClick={next} style={{ ...primaryBtn, marginTop: 12 }}>
              {idx + 1 >= questions.length ? "See results" : "Next"} ↵
            </button>
          </div>
        )}

        <button onClick={() => setPhase("hub")} style={{ ...ghostBtn, marginTop: 22 }}>
          Exit to hub
        </button>
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────────────────────
  const correctCount = log.filter((l) => l.correct).length;
  const pct = log.length ? Math.round((correctCount / log.length) * 100) : 0;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Session complete</h1>
      <p style={{ fontSize: 18, color: "var(--muted)", marginBottom: 20 }}>
        {correctCount}/{log.length} correct · {pct}%
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {log.map((l, i) => (
          <details
            key={i}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 11, padding: "0.75rem 0.95rem" }}
          >
            <summary style={{ cursor: "pointer", fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: l.correct ? "var(--success)" : "#c85050", fontWeight: 700 }}>
                {l.correct ? "✓" : "✗"}
              </span>
              <span style={{ flex: 1 }}>{l.q.question}</span>
            </summary>
            <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.55 }}>
              <div style={{ color: "var(--success)", marginBottom: 4 }}>
                Answer: {l.q.options[l.q.answer]}
              </div>
              {!l.correct && l.chosen >= 0 && (
                <div style={{ color: "#c85050", marginBottom: 4 }}>You chose: {l.q.options[l.chosen]}</div>
              )}
              <p style={{ margin: 0, color: "var(--muted)" }}>{l.q.explanation}</p>
            </div>
          </details>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setPhase("hub")} style={primaryBtn}>
          Back to hub
        </button>
      </div>
    </div>
  );
}

// ─── small style helpers ──────────────────────────────────────────────────────
const primaryBtn: React.CSSProperties = {
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "0.55rem 1.1rem",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  color: "var(--accent)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "0.55rem 1.1rem",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 6 }}>{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.35rem 0.7rem",
        borderRadius: 8,
        border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
        background: active ? "var(--accent-light)" : "var(--surface)",
        color: active ? "var(--accent)" : "var(--muted)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
