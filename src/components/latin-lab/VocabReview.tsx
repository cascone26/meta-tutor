"use client";

import { useEffect, useState } from "react";
import { latinUnits } from "@/lib/latin-lab/units";

type DueItem = { vocabItem: string; unitId: string; grammarTags: string[] };
type Rating = "Again" | "Hard" | "Good" | "Easy";

function findEnglish(latin: string): string {
  for (const unit of latinUnits) {
    const hit = unit.newVocab.find((v) => v.latin === latin);
    if (hit) return hit.english;
  }
  return "";
}

export default function VocabReview({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [due, setDue] = useState<DueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    fetch("/api/latin-progress")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => {
        setDue(data.due || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function rate(rating: Rating) {
    const item = due[index];
    await fetch("/api/latin-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reviewVocab", vocabItem: item.vocabItem, unitId: item.unitId, grammarTags: item.grammarTags, rating }),
    }).catch(() => {});
    setRevealed(false);
    if (index + 1 >= due.length) onDone();
    else setIndex((i) => i + 1);
  }

  if (loading) return <p className="text-sm text-center py-10" style={{ color: "#a08b73" }}>Loading due vocabulary…</p>;
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-sm mb-3" style={{ color: "#c26e6e" }}>Couldn&apos;t load your vocab review — try again.</p>
        <button onClick={load} className="text-sm underline" style={{ color: "#c17a3a" }}>Retry</button>
      </div>
    );
  }
  if (due.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm mb-3" style={{ color: "#a08b73" }}>Nothing due for review right now — nice work.</p>
        <button onClick={onDone} className="text-sm underline" style={{ color: "#c17a3a" }}>Back</button>
      </div>
    );
  }

  const item = due[index];
  const english = findEnglish(item.vocabItem);

  return (
    <div>
      <p className="text-xs mb-3 text-center" style={{ color: "#a08b73" }}>{index + 1} / {due.length} due</p>
      <div className="rounded-xl p-8 text-center mb-4" style={{ background: "#221912", border: "1px solid #3a2d1f" }} onClick={() => setRevealed(true)}>
        <p className="text-2xl font-semibold mb-2" style={{ color: "#f0e6d8" }}>{item.vocabItem}</p>
        {revealed ? (
          <p className="text-lg" style={{ color: "#c17a3a" }}>{english}</p>
        ) : (
          <p className="text-xs" style={{ color: "#7a6852" }}>Tap to reveal</p>
        )}
      </div>
      {revealed && (
        <div className="grid grid-cols-4 gap-2">
          {(["Again", "Hard", "Good", "Easy"] as Rating[]).map((r) => (
            <button
              key={r}
              onClick={() => rate(r)}
              className="py-2.5 rounded-lg text-xs font-medium"
              style={{
                background: r === "Again" ? "#3a1f1f" : r === "Hard" ? "#3a2e1f" : r === "Good" ? "#1f3a26" : "#1f3a35",
                color: r === "Again" ? "#c26e6e" : r === "Hard" ? "#c2a06e" : r === "Good" ? "#8fc26e" : "#6ec2b0",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
