"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { glossary, categories } from "@/lib/glossary";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type TermState = {
  term: string;
  definition: string;
  category: string;
  correctStreak: number; // 0 = new, 1 = got MC right, 2+ = mastered
  phase: "mc" | "typed" | "mastered";
  lastWrong: boolean;
};

type Settings = {
  answerWith: "definitions" | "terms";
  shuffleOrder: boolean;
  categories: string[];
  masteryThreshold: number; // how many correct in a row to master
};

const defaultSettings: Settings = {
  answerWith: "definitions",
  shuffleOrder: true,
  categories: [],
  masteryThreshold: 2,
};

export default function Learn({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(true);
  const [terms, setTerms] = useState<TermState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mcOptions, setMcOptions] = useState<string[]>([]);
  const [selectedMc, setSelectedMc] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [typedSubmitted, setTypedSubmitted] = useState(false);
  const [typedCorrect, setTypedCorrect] = useState(false);
  const [round, setRound] = useState(1);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundTotal, setRoundTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-learn-settings");
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);

  function saveSettings(s: Settings) {
    setSettings(s);
    localStorage.setItem("meta-tutor-learn-settings", JSON.stringify(s));
  }

  function startLearning() {
    const pool =
      settings.categories.length > 0
        ? glossary.filter((g) => settings.categories.includes(g.category))
        : glossary;

    const ordered = settings.shuffleOrder ? shuffle(pool) : pool;

    const termStates: TermState[] = ordered.map((g) => ({
      term: g.term,
      definition: g.definition,
      category: g.category,
      correctStreak: 0,
      phase: "mc",
      lastWrong: false,
    }));

    setTerms(termStates);
    setCurrentIndex(0);
    setRound(1);
    setRoundCorrect(0);
    setRoundTotal(0);
    setShowSettings(false);
    generateMcOptions(termStates, 0, settings);
  }

  function generateMcOptions(
    pool: TermState[],
    idx: number,
    s: Settings
  ) {
    const current = pool[idx];
    if (!current) return;

    const correctAnswer =
      s.answerWith === "definitions" ? current.definition : current.term;

    const wrongPool = pool
      .filter((t) => t.term !== current.term)
      .map((t) => (s.answerWith === "definitions" ? t.definition : t.term));

    const wrongs = shuffle(wrongPool).slice(0, 3);
    setMcOptions(shuffle([correctAnswer, ...wrongs]));
    setSelectedMc(null);
    setTypedAnswer("");
    setTypedSubmitted(false);
    setTypedCorrect(false);
  }

  const getPrompt = useCallback(
    (t: TermState) => {
      return settings.answerWith === "definitions" ? t.term : t.definition;
    },
    [settings.answerWith]
  );

  const getAnswer = useCallback(
    (t: TermState) => {
      return settings.answerWith === "definitions" ? t.definition : t.term;
    },
    [settings.answerWith]
  );

  function getUnmastered(): TermState[] {
    return terms.filter((t) => t.phase !== "mastered");
  }

  const current = terms[currentIndex];
  const mastered = terms.filter((t) => t.phase === "mastered").length;
  const totalTerms = terms.length;
  const remaining = getUnmastered();

  function handleMcSelect(option: string) {
    if (selectedMc) return;
    setSelectedMc(option);
    const correct = getAnswer(current) === option;
    setRoundTotal(roundTotal + 1);

    if (correct) {
      setRoundCorrect(roundCorrect + 1);
      const newTerms = [...terms];
      const t = newTerms[currentIndex];
      t.correctStreak += 1;
      t.lastWrong = false;
      if (t.correctStreak >= 1) {
        t.phase = "typed"; // promote to typed
      }
      setTerms(newTerms);
    } else {
      const newTerms = [...terms];
      const t = newTerms[currentIndex];
      t.correctStreak = 0;
      t.lastWrong = true;
      setTerms(newTerms);
    }
  }

  function handleTypedSubmit() {
    if (typedSubmitted) return;
    setTypedSubmitted(true);

    const answer = getAnswer(current);
    const correct = normalize(typedAnswer) === normalize(answer);
    setTypedCorrect(correct);
    setRoundTotal(roundTotal + 1);

    if (correct) {
      setRoundCorrect(roundCorrect + 1);
      const newTerms = [...terms];
      const t = newTerms[currentIndex];
      t.correctStreak += 1;
      t.lastWrong = false;
      if (t.correctStreak >= settings.masteryThreshold) {
        t.phase = "mastered";
      }
      setTerms(newTerms);
    } else {
      const newTerms = [...terms];
      const t = newTerms[currentIndex];
      t.correctStreak = 0;
      t.phase = "mc"; // demote back to MC
      t.lastWrong = true;
      setTerms(newTerms);
    }
  }

  function normalize(s: string): string {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ");
  }

  function advance() {
    // Find next unmastered term
    const unmastered = terms
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.phase !== "mastered");

    if (unmastered.length === 0) return; // all done

    // Pick next one that isn't the current (if possible)
    let nextIdx: number;
    if (unmastered.length === 1) {
      nextIdx = unmastered[0].i;
    } else {
      const others = unmastered.filter(({ i }) => i !== currentIndex);
      // Prioritize ones that were last wrong
      const wrongOnes = others.filter(({ t }) => t.lastWrong);
      if (wrongOnes.length > 0) {
        nextIdx = wrongOnes[0].i;
      } else {
        nextIdx = others[0].i;
      }
    }

    setCurrentIndex(nextIdx);
    generateMcOptions(terms, nextIdx, settings);

    if (terms[nextIdx].phase === "typed") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function overrideCorrect() {
    const newTerms = [...terms];
    const t = newTerms[currentIndex];
    t.correctStreak += 1;
    t.lastWrong = false;
    if (t.phase === "typed" && t.correctStreak >= settings.masteryThreshold) {
      t.phase = "mastered";
    } else if (t.phase === "mc" && t.correctStreak >= 1) {
      t.phase = "typed";
    }
    setTerms(newTerms);
    setRoundCorrect(roundCorrect + 1);
  }

  // Settings screen
  if (showSettings) {
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
                  style={{
                    background: settings.shuffleOrder ? "var(--accent)" : "var(--border)",
                  }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{
                      left: settings.shuffleOrder ? "22px" : "4px",
                    }}
                  />
                </button>
              </label>
            </div>

            {/* Mastery threshold */}
            <div className="mb-5">
              <label className="text-xs font-medium block mb-2" style={{ color: "var(--foreground)" }}>
                Correct answers to master a term
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => saveSettings({ ...settings, masteryThreshold: n })}
                    className="flex-1 text-sm py-2 rounded-xl font-medium transition-all"
                    style={{
                      background: settings.masteryThreshold === n ? "var(--accent)" : "var(--surface)",
                      color: settings.masteryThreshold === n ? "#fff" : "var(--muted)",
                      border: `1px solid ${settings.masteryThreshold === n ? "transparent" : "var(--border)"}`,
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
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
              Start learning
              <span className="opacity-70 ml-1">
                ({settings.categories.length === 0
                  ? glossary.length
                  : glossary.filter((g) => settings.categories.includes(g.category)).length}{" "}
                terms)
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Done screen
  if (remaining.length === 0 && totalTerms > 0) {
    const pct = totalTerms > 0 ? Math.round((roundCorrect / Math.max(roundTotal, 1)) * 100) : 0;
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
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
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
            {totalTerms} terms learned &middot; {pct}% accuracy
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {roundCorrect} correct / {roundTotal} attempts
          </p>
          <div className="flex gap-3">
            <button
              onClick={startLearning}
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Learn again
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              Change settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const progressPct = totalTerms > 0 ? (mastered / totalTerms) * 100 : 0;

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
            onClick={() => setShowSettings(true)}
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
            {mastered}/{totalTerms} mastered
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
            {remaining.filter((t) => t.phase === "mc").length} learning
          </span>
          <span className="text-xs" style={{ color: "var(--accent)" }}>
            {remaining.filter((t) => t.phase === "typed").length} reviewing
          </span>
          <span className="text-xs" style={{ color: "#6ab070" }}>
            {mastered} mastered
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-xl mx-auto mt-4">
          {/* Phase indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background:
                  current.phase === "mc" ? "var(--accent-light)" : "#e8f0fe",
                color: current.phase === "mc" ? "var(--accent)" : "#4a7ab5",
              }}
            >
              {current.phase === "mc" ? "Multiple choice" : "Type the answer"}
            </span>
            {current.lastWrong && (
              <span className="text-xs" style={{ color: "#c96b6b" }}>
                Let&apos;s try again
              </span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            >
              {current.category}
            </span>
          </div>

          {/* Prompt */}
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs mb-1.5 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {settings.answerWith === "definitions" ? "Term" : "Definition"}
            </p>
            <p
              className="font-semibold leading-relaxed"
              style={{
                color: "var(--foreground)",
                fontSize: getPrompt(current).length > 80 ? "0.9375rem" : "1.25rem",
              }}
            >
              {getPrompt(current)}
            </p>
          </div>

          {/* MC mode */}
          {current.phase === "mc" && (
            <div className="space-y-2">
              {mcOptions.map((option, i) => {
                const isCorrect = option === getAnswer(current);
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

              {selectedMc && (
                <div className="flex justify-center pt-3">
                  <button
                    onClick={advance}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Typed mode */}
          {current.phase === "typed" && (
            <div>
              <div className="mb-3">
                <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {settings.answerWith === "definitions" ? "Type the definition" : "Type the term"}
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
                      advance();
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
                    onClick={() => {
                      setTypedAnswer("");
                      setTypedSubmitted(true);
                      setTypedCorrect(false);
                      setRoundTotal(roundTotal + 1);
                      // Mark wrong
                      const newTerms = [...terms];
                      const t = newTerms[currentIndex];
                      t.correctStreak = 0;
                      t.phase = "mc";
                      t.lastWrong = true;
                      setTerms(newTerms);
                    }}
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
                  {/* Show correct answer */}
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
                      {getAnswer(current)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!typedCorrect && (
                      <button
                        onClick={() => {
                          overrideCorrect();
                          setTypedCorrect(true);
                        }}
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
                      onClick={advance}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      Continue
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
