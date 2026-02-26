"use client";

import { useState } from "react";
import { glossary, categories } from "@/lib/glossary";
import { recordStudySession } from "@/lib/streaks";

export default function AnalogyGenerator({ onBack }: { onBack: () => void }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<typeof glossary[0] | null>(null);
  const [analogy, setAnalogy] = useState<{ analogy: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ term: string; analogy: string; explanation: string }[]>([]);

  const pool = selectedCat ? glossary.filter((g) => g.category === selectedCat) : glossary;

  async function generate(term: typeof glossary[0]) {
    setSelectedTerm(term);
    setAnalogy(null);
    setLoading(true);
    recordStudySession();

    try {
      const res = await fetch("/api/analogy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: term.term, definition: term.definition, category: term.category }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalogy(data);
      setHistory((prev) => [{ term: term.term, ...data }, ...prev].slice(0, 20));
    } catch {
      setAnalogy({ analogy: "Could not generate analogy. Try again.", explanation: "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Analogy Generator</h1>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Pick a concept and get an everyday analogy to help it click.
        </p>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          <button onClick={() => setSelectedCat(null)} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: !selectedCat ? "var(--accent)" : "var(--surface)", color: !selectedCat ? "#fff" : "var(--muted)", border: `1px solid ${!selectedCat ? "var(--accent)" : "var(--border)"}` }}>All</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCat(cat)} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: selectedCat === cat ? "var(--accent)" : "var(--surface)", color: selectedCat === cat ? "#fff" : "var(--muted)", border: `1px solid ${selectedCat === cat ? "var(--accent)" : "var(--border)"}` }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Term grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {pool.map((g) => (
            <button
              key={g.term}
              onClick={() => generate(g)}
              className="text-left rounded-xl p-3 transition-all"
              style={{
                background: selectedTerm?.term === g.term ? "var(--accent-light)" : "var(--surface)",
                border: `1px solid ${selectedTerm?.term === g.term ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <p className="text-sm font-medium" style={{ color: selectedTerm?.term === g.term ? "var(--accent)" : "var(--foreground)" }}>{g.term}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{g.category}</p>
            </button>
          ))}
        </div>

        {/* Result */}
        {(loading || analogy) && selectedTerm && (
          <div className="rounded-xl p-5 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--accent)" }}>{selectedTerm.term}</h3>
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{selectedTerm.definition}</p>

            {loading ? (
              <p className="text-sm" style={{ color: "var(--muted)" }}>Generating analogy...</p>
            ) : analogy && (
              <>
                <div className="rounded-lg p-3 mb-2" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                  <p className="text-sm" style={{ color: "var(--foreground)", lineHeight: 1.7 }}>{analogy.analogy}</p>
                </div>
                {analogy.explanation && (
                  <p className="text-xs italic" style={{ color: "var(--muted)", lineHeight: 1.5 }}>{analogy.explanation}</p>
                )}
                <button onClick={() => generate(selectedTerm)} className="text-xs mt-3 px-3 py-1 rounded-lg" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                  Try another analogy
                </button>
              </>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Recent analogies</h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>{h.term}</p>
                  <p className="text-sm" style={{ color: "var(--foreground)", lineHeight: 1.5 }}>{h.analogy}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
