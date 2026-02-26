"use client";

import { useState, useRef } from "react";
import { glossary, categories } from "@/lib/glossary";
import { getSRData, saveSRData, reviewTerm } from "@/lib/spaced-repetition";
import { saveResult } from "@/lib/study-history";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudyTerm = {
  term: string;
  definition: string;
  category: string;
};

type Settings = {
  answerWith: "definitions" | "terms";
  shuffleOrder: boolean;
  categories: string[];
};

type Phase = "settings" | "mc" | "typed" | "round-summary" | "done";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

const BATCH_SIZE = 7;

const defaultSettings: Settings = {
  answerWith: "definitions",
  shuffleOrder: true,
  categories: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Learn({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const s = localStorage.getItem("meta-tutor-learn-settings");
      return s ? JSON.parse(s) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [phase, setPhase] = useState<Phase>("settings");

  // Term pools
  const [allTerms, setAllTerms] = useState<StudyTerm[]>([]);
  const [remainingTerms, setRemainingTerms] = useState<StudyTerm[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<StudyTerm[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);

  // MC state
  const [mcOptions, setMcOptions] = useState<string[]>([]);
  const [selectedMc, setSelectedMc] = useState<string | null>(null);

  // Typed state
  const [typedAnswer, setTypedAnswer] = useState("");
  const [typedSubmitted, setTypedSubmitted] = useState(false);
  const [typedCorrect, setTypedCorrect] = useState(false);
  // typedResults is passed as arg to advanceTyped() to avoid stale-closure bugs
  const [typedResults, setTypedResults] = useState<boolean[]>([]);

  // Summary / Done stats
  const [roundStats, setRoundStats] = useState({ correct: 0, total: 0 });
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [allWrongTerms, setAllWrongTerms] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const savedRef = useRef(false);

  // ─── Settings ───────────────────────────────────────────────────────────────

  function saveSettings(s: Settings) {
    setSettings(s);
    try {
      localStorage.setItem("meta-tutor-learn-settings", JSON.stringify(s));
    } catch {}
  }

  // ─── MC helpers ─────────────────────────────────────────────────────────────

  function buildMcOptions(term: StudyTerm, pool: StudyTerm[], s: Settings): string[] {
    const correctAnswer = s.answerWith === "definitions" ? term.definition : term.term;
    const wrongPool = pool
      .filter((t) => t.term !== term.term)
      .map((t) => (s.answerWith === "definitions" ? t.definition : t.term));
    const wrongs = shuffle(wrongPool).slice(0, 3);
    return shuffle([correctAnswer, ...wrongs]);
  }

  function getPrompt(t: StudyTerm): string {
    return settings.answerWith === "definitions" ? t.term : t.definition;
  }

  function getAnswer(t: StudyTerm): string {
    return settings.answerWith === "definitions" ? t.definition : t.term;
  }

  // ─── Start ──────────────────────────────────────────────────────────────────

  function startLearning() {
    const pool =
      settings.categories.length > 0
        ? glossary.filter((g) => settings.categories.includes(g.category))
        : glossary;

    const ordered: StudyTerm[] = (settings.shuffleOrder ? shuffle(pool) : pool).map((g) => ({
      term: g.term,
      definition: g.definition,
      category: g.category,
    }));

    const batch = ordered.slice(0, BATCH_SIZE);

    setAllTerms(ordered);
    setRemainingTerms(ordered);
    setMasteredCount(0);
    setCurrentBatch(batch);
    setBatchIndex(0);
    setTotalCorrect(0);
    setTotalAttempts(0);
    setAllWrongTerms([]);
    setTypedResults([]);
    savedRef.current = false;

    if (ordered.length >= 4) {
      // Enter MC phase
      setMcOptions(buildMcOptions(batch[0], ordered, settings));
      setSelectedMc(null);
      setPhase("mc");
    } else {
      // Skip MC — not enough terms for 4 options
      setTypedAnswer("");
      setTypedSubmitted(false);
      setTypedCorrect(false);
      setPhase("typed");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // ─── MC Phase ───────────────────────────────────────────────────────────────

  function handleMcSelect(option: string) {
    if (selectedMc !== null) return;
    setSelectedMc(option);
  }

  function advanceMc() {
    const nextIndex = batchIndex + 1;
    if (nextIndex < currentBatch.length) {
      // Next MC term in batch
      setBatchIndex(nextIndex);
      setMcOptions(buildMcOptions(currentBatch[nextIndex], allTerms, settings));
      setSelectedMc(null);
    } else {
      // MC phase done → start typed phase for same batch
      setBatchIndex(0);
      setTypedAnswer("");
      setTypedSubmitted(false);
      setTypedCorrect(false);
      setTypedResults([]);
      setPhase("typed");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // ─── Typed Phase ────────────────────────────────────────────────────────────

  function handleTypedSubmit() {
    if (typedSubmitted) return;
    const term = currentBatch[batchIndex];
    const correct = normalize(typedAnswer) === normalize(getAnswer(term));
    setTypedCorrect(correct);
    setTypedSubmitted(true);
    // Build new array immediately — pass to advanceTyped to avoid closure bug
    const newResults = [...typedResults, correct];
    setTypedResults(newResults);
  }

  function handleDontKnow() {
    setTypedAnswer("");
    setTypedCorrect(false);
    setTypedSubmitted(true);
    const newResults = [...typedResults, false];
    setTypedResults(newResults);
  }

  function handleOverride() {
    // Flip last entry to true (user was actually right)
    const newResults = [...typedResults];
    newResults[newResults.length - 1] = true;
    setTypedResults(newResults);
    setTypedCorrect(true);
  }

  // results is passed as argument to capture the latest value, not stale closure
  function advanceTyped(results: boolean[]) {
    const nextIndex = batchIndex + 1;
    if (nextIndex < currentBatch.length) {
      // Next typed term in batch
      setBatchIndex(nextIndex);
      setTypedAnswer("");
      setTypedSubmitted(false);
      setTypedCorrect(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Typed phase done — compute round summary
      const correct = results.filter(Boolean).length;
      const total = results.length;

      const masteredThisRound = currentBatch.filter((_, i) => results[i] === true);
      const failedThisRound = currentBatch.filter((_, i) => !results[i]);

      // Remove mastered terms from remaining pool
      const newRemaining = remainingTerms.filter(
        (t) => !masteredThisRound.some((m) => m.term === t.term)
      );

      const newWrongTerms = [...allWrongTerms, ...failedThisRound.map((t) => t.term)];
      const newTotalCorrect = totalCorrect + correct;
      const newTotalAttempts = totalAttempts + total;
      const newMasteredCount = masteredCount + masteredThisRound.length;

      setRemainingTerms(newRemaining);
      setMasteredCount(newMasteredCount);
      setAllWrongTerms(newWrongTerms);
      setTotalCorrect(newTotalCorrect);
      setTotalAttempts(newTotalAttempts);
      setRoundStats({ correct, total });
      setPhase("round-summary");
    }
  }

  // ─── Round Summary → Next Round ─────────────────────────────────────────────

  function startNextRound() {
    if (remainingTerms.length === 0) {
      finishLearning();
      return;
    }

    const nextBatch = remainingTerms.slice(0, BATCH_SIZE);
    setCurrentBatch(nextBatch);
    setBatchIndex(0);
    setTypedResults([]);

    if (allTerms.length >= 4) {
      setMcOptions(buildMcOptions(nextBatch[0], allTerms, settings));
      setSelectedMc(null);
      setPhase("mc");
    } else {
      setTypedAnswer("");
      setTypedSubmitted(false);
      setTypedCorrect(false);
      setPhase("typed");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // ─── Done ───────────────────────────────────────────────────────────────────

  function finishLearning() {
    if (savedRef.current) return;
    savedRef.current = true;

    const pct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const uniqueWrong = [...new Set(allWrongTerms)].slice(0, 10);
    const weakCats = [
      ...new Set(
        allTerms.filter((t) => uniqueWrong.includes(t.term)).map((t) => t.category)
      ),
    ];

    saveResult({
      mode: "Learn",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score: totalCorrect,
      total: totalAttempts,
      percentage: pct,
      weakTerms: uniqueWrong,
      weakCategories: weakCats,
    });

    const srData = getSRData();
    for (const t of allTerms) {
      const wrongCount = allWrongTerms.filter((w) => w === t.term).length;
      const quality = wrongCount === 0 ? 5 : wrongCount === 1 ? 3 : 1;
      srData[t.term] = reviewTerm(srData[t.term], t.term, quality);
    }
    saveSRData(srData);

    setPhase("done");
  }

  // ─── Computed ───────────────────────────────────────────────────────────────

  const poolSize =
    settings.categories.length === 0
      ? glossary.length
      : glossary.filter((g) => settings.categories.includes(g.category)).length;

  // ─── Settings Screen ────────────────────────────────────────────────────────

  if (phase === "settings") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button
            onClick={onBack}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              Learn Settings
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
              Customize how you want to study.
            </p>

            {/* Answer with */}
            <div className="mb-5">
              <label className="text-xs font-medium block mb-2" style={{ color: "var(--foreground)" }}>
                Answer with
              </label>
              <div className="flex gap-2">
                {(["definitions", "terms"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => saveSettings({ ...settings, answerWith: opt })}
                    className="flex-1 text-sm py-2.5 rounded-xl font-medium transition-all"
                    style={{
                      background: settings.answerWith === opt ? "var(--accent)" : "var(--surface)",
                      color: settings.answerWith === opt ? "#fff" : "var(--muted)",
                      border: `1px solid ${settings.answerWith === opt ? "transparent" : "var(--border)"}`,
                    }}
                  >
                    {opt === "definitions" ? "Definitions" : "Terms"}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                {settings.answerWith === "definitions"
                  ? "You'll see the term and answer with the definition"
                  : "You'll see the definition and answer with the term"}
              </p>
            </div>

            {/* Shuffle */}
            <div className="mb-5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  Shuffle order
                </span>
                <button
                  onClick={() => saveSettings({ ...settings, shuffleOrder: !settings.shuffleOrder })}
                  className="w-10 h-6 rounded-full transition-colors relative"
                  style={{ background: settings.shuffleOrder ? "var(--accent)" : "var(--border)" }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: settings.shuffleOrder ? "22px" : "4px" }}
                  />
                </button>
              </label>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="text-xs font-medium block mb-2" style={{ color: "var(--foreground)" }}>
                Categories
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => saveSettings({ ...settings, categories: [] })}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: settings.categories.length === 0 ? "var(--accent)" : "var(--surface)",
                    color: settings.categories.length === 0 ? "#fff" : "var(--muted)",
                    border: `1px solid ${settings.categories.length === 0 ? "transparent" : "var(--border)"}`,
                  }}
                >
                  All ({glossary.length})
                </button>
                {categories.map((cat) => {
                  const active = settings.categories.includes(cat);
                  const count = glossary.filter((g) => g.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        const next = active
                          ? settings.categories.filter((c) => c !== cat)
                          : [...settings.categories, cat];
                        saveSettings({ ...settings, categories: next });
                      }}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{
                        background: active ? "var(--accent)" : "var(--surface)",
                        color: active ? "#fff" : "var(--muted)",
                        border: `1px solid ${active ? "transparent" : "var(--border)"}`,
                      }}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={startLearning}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Start learning{" "}
              <span className="opacity-70">({poolSize} terms)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Done Screen ────────────────────────────────────────────────────────────

  if (phase === "done") {
    const pct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const uniqueWrong = [...new Set(allWrongTerms)].slice(0, 10);

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button
            onClick={onBack}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-md mx-auto text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
              style={{ background: "#e8f5e9" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6ab070" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              All terms mastered!
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>
              {masteredCount} terms learned &middot; {pct}% accuracy
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              {totalCorrect} correct / {totalAttempts} attempts
            </p>

            {pct >= 90 ? (
              <div
                className="rounded-xl p-4 mb-4 text-left"
                style={{ background: "#e8f5e9", border: "1px solid #c8e6c9" }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "#2d5a30" }}>
                  Excellent work!
                </p>
                <p className="text-xs" style={{ color: "#4a7a4d" }}>
                  You&apos;ve got a strong grasp on these terms. Try adding more categories for a
                  bigger challenge.
                </p>
              </div>
            ) : pct >= 70 ? (
              <div
                className="rounded-xl p-4 mb-4 text-left"
                style={{ background: "#fff8e1", border: "1px solid #ffecb3" }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "#8d6e0f" }}>
                  Good progress!
                </p>
                <p className="text-xs" style={{ color: "#a68612" }}>
                  You&apos;re getting there. Focus on the terms below to solidify your understanding.
                </p>
              </div>
            ) : (
              <div
                className="rounded-xl p-4 mb-4 text-left"
                style={{ background: "#fce4ec", border: "1px solid #f8bbd0" }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "#8b3a3a" }}>
                  Keep practicing!
                </p>
                <p className="text-xs" style={{ color: "#a04848" }}>
                  These terms need more review. Try learning in smaller batches by filtering to one
                  category at a time.
                </p>
              </div>
            )}

            {uniqueWrong.length > 0 && (
              <div
                className="rounded-xl p-4 mb-4 text-left"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                  Terms to review:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueWrong.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={startLearning}
                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Learn again
              </button>
              <button
                onClick={() => setPhase("settings")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: "var(--surface)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Change settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Round Summary Screen ───────────────────────────────────────────────────

  if (phase === "round-summary") {
    const allDone = remainingTerms.length === 0;

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button
            onClick={onBack}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-md mx-auto text-center py-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
              style={{
                background:
                  roundStats.correct === roundStats.total ? "#e8f5e9" : "#fff8e1",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={roundStats.correct === roundStats.total ? "#6ab070" : "#d4a843"}
                strokeWidth="2"
              >
                {roundStats.correct === roundStats.total ? (
                  <>
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </>
                ) : (
                  <>
                    <path d="M12 8v4m0 4h.01" />
                    <circle cx="12" cy="12" r="10" />
                  </>
                )}
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Round complete
            </h2>
            <p className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>
              {roundStats.correct}/{roundStats.total}
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
              {masteredCount} mastered &middot; {remainingTerms.length} remaining
            </p>

            {allDone ? (
              <button
                onClick={finishLearning}
                className="px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                See results
              </button>
            ) : (
              <button
                onClick={startNextRound}
                className="px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Continue ({remainingTerms.length} left)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── MC / Typed Study Screen ────────────────────────────────────────────────

  const currentTerm = currentBatch[batchIndex];
  if (!currentTerm) return null;

  const progressPct = allTerms.length > 0 ? (masteredCount / allTerms.length) * 100 : 0;
  const isLastInBatch = batchIndex === currentBatch.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={onBack}
          className="text-sm font-medium flex items-center gap-1"
          style={{ color: "var(--accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhase("settings")}
            className="p-1.5 rounded-lg hover:opacity-60"
            style={{ color: "var(--muted)" }}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {masteredCount}/{allTerms.length} mastered
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2 shrink-0">
        <div className="w-full h-2 rounded-full" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ background: "#6ab070", width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {phase === "mc" ? "Multiple choice" : "Typed review"} · {batchIndex + 1}/
            {currentBatch.length}
          </span>
          <span className="text-xs" style={{ color: "#6ab070" }}>
            {masteredCount} mastered
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-xl mx-auto mt-4">
          {/* Phase badge + category */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: phase === "mc" ? "var(--accent-light)" : "#e8f0fe",
                color: phase === "mc" ? "var(--accent)" : "#4a7ab5",
              }}
            >
              {phase === "mc" ? "Multiple choice" : "Type the answer"}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            >
              {currentTerm.category}
            </span>
          </div>

          {/* Prompt card */}
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p
              className="text-xs mb-1.5 uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              {settings.answerWith === "definitions" ? "Term" : "Definition"}
            </p>
            <p
              className="font-semibold leading-relaxed"
              style={{
                color: "var(--foreground)",
                fontSize: getPrompt(currentTerm).length > 80 ? "0.9375rem" : "1.25rem",
              }}
            >
              {getPrompt(currentTerm)}
            </p>
          </div>

          {/* MC mode */}
          {phase === "mc" && (
            <div className="space-y-2">
              {mcOptions.map((option, i) => {
                const isCorrect = option === getAnswer(currentTerm);
                const isPicked = selectedMc === option;
                const showAnswer = selectedMc !== null;

                let bg = "var(--surface)";
                let border = "var(--border)";
                let textColor = "var(--foreground)";

                if (showAnswer) {
                  if (isCorrect) {
                    bg = "#e8f5e9";
                    border = "#6ab070";
                    textColor = "#2d5a30";
                  } else if (isPicked) {
                    bg = "#fce4ec";
                    border = "#c96b6b";
                    textColor = "#8b3a3a";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleMcSelect(option)}
                    disabled={selectedMc !== null}
                    className="w-full text-left rounded-xl p-4 text-sm leading-relaxed transition-all"
                    style={{
                      background: bg,
                      border: `2px solid ${border}`,
                      color: textColor,
                    }}
                  >
                    <span className="font-medium mr-2 opacity-50">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {option.length > 120 ? option.slice(0, 120) + "..." : option}
                  </button>
                );
              })}

              {selectedMc !== null && (
                <div className="flex justify-center pt-3">
                  <button
                    onClick={advanceMc}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    {isLastInBatch ? "Start typed review →" : "Continue"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Typed mode */}
          {phase === "typed" && (
            <div>
              <div className="mb-3">
                <p
                  className="text-xs mb-2 uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  {settings.answerWith === "definitions"
                    ? "Type the definition"
                    : "Type the term"}
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !typedSubmitted && typedAnswer.trim()) {
                      handleTypedSubmit();
                    } else if (e.key === "Enter" && typedSubmitted) {
                      advanceTyped(typedResults);
                    }
                  }}
                  disabled={typedSubmitted}
                  placeholder="Type your answer..."
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: typedSubmitted
                      ? typedCorrect
                        ? "#e8f5e9"
                        : "#fce4ec"
                      : "var(--surface)",
                    color: "var(--foreground)",
                    border: `2px solid ${
                      typedSubmitted
                        ? typedCorrect
                          ? "#6ab070"
                          : "#c96b6b"
                        : "var(--border)"
                    }`,
                  }}
                />
              </div>

              {!typedSubmitted && (
                <div className="flex gap-2">
                  <button
                    onClick={handleTypedSubmit}
                    disabled={!typedAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    Check
                  </button>
                  <button
                    onClick={handleDontKnow}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{
                      color: "var(--muted)",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    Don&apos;t know
                  </button>
                </div>
              )}

              {typedSubmitted && (
                <div>
                  <div
                    className="rounded-xl p-4 mb-3"
                    style={{
                      background: typedCorrect ? "#e8f5e9" : "#fff8e1",
                      border: `1px solid ${typedCorrect ? "#6ab070" : "#d4a843"}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: typedCorrect ? "#6ab070" : "#c96b6b" }}
                    >
                      {typedCorrect ? "Correct!" : "Not quite. The answer is:"}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {getAnswer(currentTerm)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!typedCorrect && (
                      <button
                        onClick={handleOverride}
                        className="text-xs px-3 py-1.5 rounded-full font-medium"
                        style={{
                          color: "var(--muted)",
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        I was right (override)
                      </button>
                    )}
                    <button
                      onClick={() => advanceTyped(typedResults)}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      {isLastInBatch ? "See round results" : "Continue"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
