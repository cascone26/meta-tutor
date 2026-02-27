"use client";

import { useState, useRef } from "react";
import { arguments_data } from "@/lib/arguments";
import { recordStudySession } from "@/lib/streaks";

type Evaluation = {
  score: number; // 1-5
  feedback: string;
  matchedPremises: number[];
  missedPremises: string[];
};

export default function ArgumentReconstruction({ onBack }: { onBack: () => void }) {
  const [currentArg, setCurrentArg] = useState<typeof arguments_data[0] | null>(null);
  const [userPremises, setUserPremises] = useState<string[]>([""]);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  function pickArgument(arg?: typeof arguments_data[0]) {
    const target = arg || arguments_data.filter((a) => !completed.includes(a.id))[0] || arguments_data[0];
    setCurrentArg(target);
    setUserPremises([""]);
    setEvaluation(null);
    setShowAnswer(false);
  }

  function addPremise() {
    setUserPremises((p) => [...p, ""]);
    setTimeout(() => {
      const lastRef = textareaRefs.current[textareaRefs.current.length];
      lastRef?.focus();
    }, 100);
  }

  function removePremise(i: number) {
    if (userPremises.length <= 1) return;
    setUserPremises((p) => p.filter((_, idx) => idx !== i));
  }

  async function evaluate() {
    if (!currentArg || userPremises.every((p) => !p.trim())) return;
    setEvaluating(true);
    recordStudySession();

    try {
      const res = await fetch("/api/evaluate-argument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conclusion: currentArg.conclusion,
          actualPremises: currentArg.premises,
          userPremises: userPremises.filter((p) => p.trim()),
          philosopher: currentArg.philosopher,
        }),
      });
      const data = await res.json();
      setEvaluation(data);
      if (data.score >= 4) {
        setCompleted((c) => [...c, currentArg.id]);
      }
    } catch {
      setEvaluation({ score: 0, feedback: "Could not evaluate. Try again.", matchedPremises: [], missedPremises: [] });
    } finally {
      setEvaluating(false);
    }
  }

  const scoreColors: Record<number, string> = {
    1: "var(--error)", 2: "var(--error)", 3: "var(--warning)", 4: "var(--success)", 5: "var(--success)",
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Argument Reconstruction</h1>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Given a philosopher&apos;s conclusion, reconstruct the argument&apos;s premises. The AI checks your logical structure.
        </p>

        {/* Argument selector */}
        {!currentArg && (
          <div className="space-y-2">
            {arguments_data.map((arg) => (
              <button
                key={arg.id}
                onClick={() => pickArgument(arg)}
                className="w-full text-left rounded-xl p-4 transition-all"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${completed.includes(arg.id) ? "var(--success-border)" : "var(--border)"}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = completed.includes(arg.id) ? "var(--success-border)" : "var(--border)"; }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                    {arg.philosopher}
                  </span>
                  {completed.includes(arg.id) && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{arg.conclusion}</p>
              </button>
            ))}
          </div>
        )}

        {/* Active argument */}
        {currentArg && !evaluation && (
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                {currentArg.philosopher}
              </span>
              <div className="flex gap-1">
                {currentArg.topics.map((t) => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--background)", color: "var(--muted)" }}>{t}</span>
                ))}
              </div>
            </div>

            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Conclusion:</p>
            <p className="text-sm font-semibold mb-4 p-3 rounded-lg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
              {currentArg.conclusion}
            </p>

            <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
              Reconstruct the premises ({currentArg.premises.length} expected):
            </p>

            <div className="space-y-2 mb-3">
              {userPremises.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-xs font-medium mt-2 shrink-0" style={{ color: "var(--muted)" }}>P{i + 1}.</span>
                  <textarea
                    ref={(el) => { textareaRefs.current[i] = el; }}
                    value={p}
                    onChange={(e) => {
                      const updated = [...userPremises];
                      updated[i] = e.target.value;
                      setUserPremises(updated);
                    }}
                    placeholder="Enter a premise..."
                    rows={2}
                    className="flex-1 rounded-lg p-2 text-sm resize-none"
                    style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  />
                  {userPremises.length > 1 && (
                    <button onClick={() => removePremise(i)} className="text-xs mt-1 shrink-0" style={{ color: "var(--muted)" }}>x</button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={addPremise} className="text-xs font-medium" style={{ color: "var(--accent)" }}>+ Add premise</button>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCurrentArg(null); setEvaluation(null); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
                >Back to list</button>
                <button
                  onClick={evaluate}
                  disabled={evaluating || userPremises.every((p) => !p.trim())}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: "var(--accent)", color: "#fff", opacity: evaluating ? 0.6 : 1 }}
                >
                  {evaluating ? "Evaluating..." : "Check my argument"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Evaluation */}
        {evaluation && currentArg && (
          <div className="space-y-3">
            <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: (scoreColors[evaluation.score] || "var(--muted)") + "20", color: scoreColors[evaluation.score] || "var(--muted)" }}
                >
                  {evaluation.score}/5
                </span>
                <span className="text-sm" style={{ color: "var(--foreground)" }}>
                  {evaluation.score >= 4 ? "Strong reconstruction" : evaluation.score >= 3 ? "On the right track" : "Needs more work"}
                </span>
              </div>

              <p className="text-sm mb-3" style={{ color: "var(--foreground)", lineHeight: 1.6 }}>
                {evaluation.feedback}
              </p>

              {evaluation.missedPremises.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--error)" }}>Key premises you missed:</p>
                  <ul className="text-xs space-y-1" style={{ color: "var(--foreground)" }}>
                    {evaluation.missedPremises.map((p, i) => (
                      <li key={i}>- {p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Show full answer */}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-xs font-medium"
                style={{ color: "var(--accent)" }}
              >
                {showAnswer ? "Hide full argument" : "Show full argument"}
              </button>

              {showAnswer && (
                <div className="mt-2 p-3 rounded-lg" style={{ background: "var(--background)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Full argument:</p>
                  {currentArg.premises.map((p, i) => (
                    <p key={i} className="text-xs mb-1" style={{ color: "var(--foreground)" }}>
                      P{i + 1}. {p}
                    </p>
                  ))}
                  <p className="text-xs mt-2 italic" style={{ color: "var(--muted)" }}>{currentArg.explanation}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setEvaluation(null); setUserPremises([""]); setShowAnswer(false); }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >Try again</button>
              <button
                onClick={() => { setCurrentArg(null); setEvaluation(null); setShowAnswer(false); }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >Next argument</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
