"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEffectiveGlossary, getEffectiveCategories } from "@/lib/custom-glossary";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<string | null>(() => {
    try { const s = localStorage.getItem("meta-tutor-fc-progress"); return s ? JSON.parse(s).category ?? null : null; } catch { return null; }
  });
  const [shuffled, setShuffled] = useState<boolean>(() => {
    try { const s = localStorage.getItem("meta-tutor-fc-progress"); return s ? JSON.parse(s).shuffled ?? true : true; } catch { return true; }
  });
  const [cards, setCards] = useState(() => {
    const g = getEffectiveGlossary();
    try {
      const s = localStorage.getItem("meta-tutor-fc-progress");
      if (s) {
        const p = JSON.parse(s);
        if (p.cardTerms?.length) {
          const termMap = Object.fromEntries(g.map((t) => [t.term, t]));
          const restored = p.cardTerms.map((t: string) => termMap[t]).filter(Boolean);
          if (restored.length) return restored;
        }
      }
    } catch {}
    return g;
  });
  const [index, setIndex] = useState<number>(() => {
    try { const s = localStorage.getItem("meta-tutor-fc-progress"); return s ? JSON.parse(s).index ?? 0 : 0; } catch { return 0; }
  });
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem("meta-tutor-fc-progress"); return s ? new Set(JSON.parse(s).knownTerms ?? []) : new Set(); } catch { return new Set(); }
  });

  const restoredRef = useRef(typeof window !== "undefined" && !!localStorage.getItem("meta-tutor-fc-progress"));

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem("meta-tutor-fc-progress", JSON.stringify({
        category,
        shuffled,
        cardTerms: cards.map((c: { term: string }) => c.term),
        index,
        knownTerms: [...known],
      }));
    } catch {}
  }, [category, shuffled, cards, index, known]);

  // Reset cards when category/shuffle changes — skip on initial mount if restored
  useEffect(() => {
    if (restoredRef.current) { restoredRef.current = false; return; }
    const g = getEffectiveGlossary();
    const filtered = category ? g.filter((t) => t.category === category) : g;
    setCards(shuffled ? shuffle(filtered) : [...filtered]);
    setIndex(0);
    setFlipped(false);
  }, [category, shuffled]);

  const card = cards[index];

  const next = useCallback(() => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    }
  }, [index, cards.length]);

  const prev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  }, [index]);

  const markKnown = useCallback(() => {
    if (card) {
      setKnown((prev) => {
        const next = new Set(prev);
        if (next.has(card.term)) next.delete(card.term);
        else next.add(card.term);
        return next;
      });
    }
  }, [card]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "k") markKnown();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev, markKnown]);

  function reshuffleRemaining() {
    const remaining = getEffectiveGlossary().filter(
      (g) => !known.has(g.term) && (!category || g.category === category)
    );
    setCards(shuffle(remaining));
    setIndex(0);
    setFlipped(false);
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <p className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          No cards left!
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          You marked all {known.size} terms as known.
        </p>
        <button onClick={() => { setKnown(new Set()); reshuffleRemaining(); try { localStorage.removeItem("meta-tutor-fc-progress"); } catch {} }} className="text-sm px-4 py-2 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {index + 1} / {cards.length} &middot; {known.size} known
        </span>
      </div>

      {/* Category filter + order toggle */}
      <div className="flex gap-2 flex-wrap px-4 pb-3 shrink-0">
        <button
          onClick={() => setCategory(null)}
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            background: !category ? "var(--accent)" : "var(--surface)",
            color: !category ? "#fff" : "var(--muted)",
            border: `1px solid ${!category ? "transparent" : "var(--border)"}`,
          }}
        >
          All
        </button>
        {getEffectiveCategories().map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? null : cat)}
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: category === cat ? "var(--accent)" : "var(--surface)",
              color: category === cat ? "#fff" : "var(--muted)",
              border: `1px solid ${category === cat ? "transparent" : "var(--border)"}`,
            }}
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto flex rounded-full overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <button
            onClick={() => setShuffled(true)}
            className="text-xs px-2.5 py-1 font-medium"
            style={{
              background: shuffled ? "var(--accent)" : "var(--surface)",
              color: shuffled ? "#fff" : "var(--muted)",
            }}
          >
            Shuffle
          </button>
          <button
            onClick={() => setShuffled(false)}
            className="text-xs px-2.5 py-1 font-medium"
            style={{
              background: !shuffled ? "var(--accent)" : "var(--surface)",
              color: !shuffled ? "#fff" : "var(--muted)",
            }}
          >
            In Order
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div className="w-full max-w-lg">
          <div
            onClick={() => setFlipped(!flipped)}
            className="w-full rounded-2xl p-8 cursor-pointer transition-all select-none"
            style={{
              background: "var(--surface)",
              border: `2px solid ${known.has(card.term) ? "var(--success)" : "var(--border)"}`,
              minHeight: "240px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!flipped ? (
              <>
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Term</p>
                <p className="text-2xl font-semibold text-center" style={{ color: "var(--foreground)" }}>
                  {card.term}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full mt-3"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  {card.category}
                </span>
                <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>tap to flip</p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Definition</p>
                <p className="text-base leading-relaxed text-center" style={{ color: "var(--foreground)" }}>
                  {card.definition}
                </p>
                <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>tap to flip back</p>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prev}
              disabled={index === 0}
              className="p-2.5 rounded-full transition-opacity disabled:opacity-20"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--foreground)" }}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex gap-2">
              <button
                onClick={markKnown}
                className="text-xs px-4 py-2 rounded-full font-medium transition-all"
                style={{
                  background: known.has(card.term) ? "var(--success)" : "var(--surface)",
                  color: known.has(card.term) ? "#fff" : "var(--muted)",
                  border: `1px solid ${known.has(card.term) ? "transparent" : "var(--border)"}`,
                }}
              >
                {known.has(card.term) ? "Known" : "Mark as known"}
              </button>
              <button
                onClick={reshuffleRemaining}
                className="text-xs px-4 py-2 rounded-full font-medium"
                style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
              >
                Shuffle
              </button>
            </div>

            <button
              onClick={next}
              disabled={index === cards.length - 1}
              className="p-2.5 rounded-full transition-opacity disabled:opacity-20"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--foreground)" }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          <p className="text-center text-xs mt-3" style={{ color: "var(--muted)" }}>
            Space to flip &middot; Arrows to navigate &middot; K to mark known
          </p>
        </div>
      </div>
    </div>
  );
}
