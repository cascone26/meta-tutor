"use client";

import { useEffect, useState } from "react";
import type { LatinUnit } from "@/lib/latin-lab/units";

type Question = { question: string; answer: string; grammarTags: string[] };
type Verdict = "correct" | "partial" | "incorrect";

export default function ComprehensionCheck({ unit, onDone }: { unit: LatinUnit; onDone: () => void }) {
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/latin-lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate-comprehension", unitId: unit.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        setQuestions(data.questions || []);
        setDifficulty(data.difficulty || "medium");
        setStartedAt(Date.now());
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn't reach the AI to generate questions — try again.");
        setLoading(false);
      });
  }, [unit.id]);

  async function submit() {
    if (!input.trim()) return;
    const q = questions[index];
    const res = await fetch("/api/latin-lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "evaluate", question: q.question, correctAnswer: q.answer, userAnswer: input }),
    });
    const data = await res.json();
    const v: Verdict = data.result || "partial";
    setVerdict(v);
    if (v === "correct") setScore((s) => s + 1);

    const responseMs = Date.now() - startedAt;
    fetch("/api/latin-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "logComprehension",
        unitId: unit.id,
        question: q.question,
        difficulty,
        grammarTags: q.grammarTags,
        correct: v === "correct",
        responseMs,
      }),
    }).catch(() => {});

    if (v !== "correct") {
      setExplaining(true);
      fetch("/api/latin-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "explain", question: q.question, correctAnswer: q.answer, userAnswer: input }),
      })
        .then((r) => r.json())
        .then((data) => setExplanation(data.explanation || ""))
        .finally(() => setExplaining(false));
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      fetch("/api/latin-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "seedUnit",
          unitId: unit.id,
          vocab: unit.newVocab.map((v) => ({ latin: v.latin, grammarTags: unit.grammarTags })),
        }),
      }).catch(() => {});
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setVerdict(null);
    setExplanation("");
    setStartedAt(Date.now());
  }

  if (loading) {
    return <p className="text-sm text-center py-10" style={{ color: "#a08b73" }}>Generating your comprehension check ({difficulty} difficulty)…</p>;
  }
  if (error && questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm mb-3" style={{ color: "#c17a3a" }}>{error}</p>
        <button onClick={onDone} className="text-sm underline" style={{ color: "#a08b73" }}>Back to reading</button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "#a08b73" }}>
          {index + 1} / {questions.length} · {difficulty} · {score} correct
        </span>
      </div>
      <div className="rounded-xl p-5" style={{ background: "#221912", border: "1px solid #3a2d1f" }}>
        <p className="text-sm mb-4" style={{ color: "#f0e6d8", lineHeight: 1.7 }}>{q.question}</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={verdict !== null}
          placeholder="Your answer…"
          rows={2}
          className="w-full rounded-lg px-3 py-2 text-sm mb-3"
          style={{ background: "#1a1410", border: "1px solid #3a2d1f", color: "#f0e6d8" }}
        />
        {verdict === null ? (
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: input.trim() ? "#c17a3a" : "#3a2d1f", color: input.trim() ? "#1a1410" : "#7a6852" }}
          >
            Check
          </button>
        ) : (
          <div>
            <div
              className="p-3 rounded-lg mb-2"
              style={{
                background: verdict === "correct" ? "#1e2e1a" : verdict === "partial" ? "#2e2a1a" : "#2e1a1a",
                color: verdict === "correct" ? "#8fc26e" : verdict === "partial" ? "#c2b06e" : "#c26e6e",
              }}
            >
              <p className="text-sm font-medium">
                {verdict === "correct" ? "Correct!" : verdict === "partial" ? "Partially right" : "Not quite"}
              </p>
              {verdict !== "correct" && <p className="text-xs mt-1" style={{ color: "#a08b73" }}>Expected: {q.answer}</p>}
            </div>
            {verdict !== "correct" && (explaining ? (
              <p className="text-xs" style={{ color: "#a08b73" }}>Getting an explanation…</p>
            ) : explanation ? (
              <p className="text-sm mb-3" style={{ color: "#e0d0b8", lineHeight: 1.6 }}>{explanation}</p>
            ) : null)}
            <button onClick={next} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c17a3a", color: "#1a1410" }}>
              {index + 1 >= questions.length ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
