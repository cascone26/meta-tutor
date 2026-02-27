"use client";

import { useState, useRef } from "react";
import { getEffectiveGlossary, getEffectiveCategories, type GlossaryTerm } from "@/lib/custom-glossary";
import { recordStudySession } from "@/lib/streaks";

type Level = "surface" | "partial" | "deep" | null;

type Evaluation = {
  level: Level;
  feedback: string;
  missing: string[];
  strengths: string[];
};

export default function TeachBack({ onBack }: { onBack: () => void }) {
  const glossary = getEffectiveGlossary();
  const categories = getEffectiveCategories();

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [currentTerm, setCurrentTerm] = useState<GlossaryTerm | null>(null);
  const [explanation, setExplanation] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [history, setHistory] = useState<{ term: string; level: Level }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pool = selectedCat ? glossary.filter((g) => g.category === selectedCat) : glossary;

  function pickRandom() {
    const available = pool.filter((g) => !history.find((h) => h.term === g.term));
    const list = available.length > 0 ? available : pool;
    const term = list[Math.floor(Math.random() * list.length)];
    setCurrentTerm(term);
    setExplanation("");
    setEvaluation(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  async function evaluate() {
    if (!currentTerm || !explanation.trim()) return;
    setEvaluating(true);
    recordStudySession();

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: currentTerm.term, definition: currentTerm.definition, explanation: explanation.trim() }),
      });
      const data = await res.json();
      setEvaluation(data);
      setHistory((h) => [...h, { term: currentTerm.term, level: data.level }]);
    } catch {
      setEvaluation({ level: "surface", feedback: "Could not evaluate. Try again.", missing: [], strengths: [] });
    } finally {
      setEvaluating(false);
    }
  }

  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    surface: { bg: "var(--error-bg)", text: "var(--error)", border: "var(--error-border)" },
    partial: { bg: "var(--warning-bg)", text: "var(--warning)", border: "var(--warning-border)" },
    deep: { bg: "var(--success-bg)", text: "var(--success)", border: "var(--success-border)" },
  };

  const deepCount = history.filter((h) => h.level === "deep").length;
  const partialCount = history.filter((h) => h.level === "partial").length;
  const surfaceCount = history.filter((h) => h.level === "surface").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>
            &larr; Back
          </button>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Teach Back
          </h1>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Explain a concept in your own words. The AI evaluates your understanding without giving you the answer first.
        </p>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          <button
            onClick={() => setSelectedCat(null)}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: !selectedCat ? "var(--accent)" : "var(--surface)",
              color: !selectedCat ? "#fff" : "var(--muted)",
              border: `1px solid ${!selectedCat ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: selectedCat === cat ? "var(--accent)" : "var(--surface)",
                color: selectedCat === cat ? "#fff" : "var(--muted)",
                border: `1px solid ${selectedCat === cat ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="flex gap-3 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
              Deep: {deepCount}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>
              Partial: {partialCount}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
              Surface: {surfaceCount}
            </span>
          </div>
        )}

        {/* No term selected */}
        {!currentTerm && (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              A random concept will be chosen. Explain it in your own words — no peeking at definitions.
            </p>
            <button
              onClick={pickRandom}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Start
            </button>
          </div>
        )}

        {/* Active term */}
        {currentTerm && !evaluation && (
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: "var(--accent)" }}>
              Explain this concept:
            </p>
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
              {currentTerm.term}
            </h2>
            <textarea
              ref={textareaRef}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain this concept in your own words as if teaching it to someone..."
              rows={6}
              className="w-full rounded-lg p-3 text-sm resize-none"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {explanation.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <div className="flex gap-2">
                <button
                  onClick={pickRandom}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
                >
                  Skip
                </button>
                <button
                  onClick={evaluate}
                  disabled={evaluating || explanation.trim().length < 10}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: explanation.trim().length < 10 ? "var(--border)" : "var(--accent)",
                    color: explanation.trim().length < 10 ? "var(--muted)" : "#fff",
                    opacity: evaluating ? 0.6 : 1,
                  }}
                >
                  {evaluating ? "Evaluating..." : "Check my understanding"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Evaluation result */}
        {evaluation && currentTerm && (
          <div className="space-y-3">
            <div
              className="rounded-xl p-5"
              style={{
                background: evaluation.level ? levelColors[evaluation.level].bg : "var(--surface)",
                border: `1px solid ${evaluation.level ? levelColors[evaluation.level].border : "var(--border)"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{
                    background: evaluation.level ? levelColors[evaluation.level].text + "20" : "var(--border)",
                    color: evaluation.level ? levelColors[evaluation.level].text : "var(--muted)",
                  }}
                >
                  {evaluation.level} understanding
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {currentTerm.term}
                </span>
              </div>

              <p className="text-sm mb-3" style={{ color: "var(--foreground)", lineHeight: 1.6 }}>
                {evaluation.feedback}
              </p>

              {evaluation.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--success)" }}>What you got right:</p>
                  <ul className="text-xs space-y-0.5" style={{ color: "var(--foreground)" }}>
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>+ {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.missing.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--error)" }}>What&apos;s missing:</p>
                  <ul className="text-xs space-y-0.5" style={{ color: "var(--foreground)" }}>
                    {evaluation.missing.map((m, i) => (
                      <li key={i}>- {m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setExplanation("");
                  setEvaluation(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                Try again
              </button>
              <button
                onClick={pickRandom}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Next concept
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
