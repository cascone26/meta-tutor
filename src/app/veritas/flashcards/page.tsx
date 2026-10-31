"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { linkCitations, escapeHtml } from "@/lib/veritas/citations";
import GlossaryTooltip from "@/components/veritas/GlossaryTooltip";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  nextReview: number;
  interval: number;
  ease: number;
}

export default function FlashcardsPage() {
  const [mode, setMode] = useState<"generate" | "review">("generate");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [loading, setLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<{ front: string; back: string }[]>([]);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewFlipped, setReviewFlipped] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("veritas-flashcards");
    if (stored) {
      try {
        setDeck(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const saveDeck = (cards: Flashcard[]) => {
    setDeck(cards);
    localStorage.setItem("veritas-flashcards", JSON.stringify(cards));
  };

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setGeneratedCards([]);
    try {
      const res = await fetch("/api/veritas-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), difficulty }),
      });
      const data = await res.json();
      if (data.cards) {
        setGeneratedCards(data.cards);
      }
    } catch {
      setGeneratedCards([
        { front: "What are the Five Ways?", back: "Five proofs for the existence of God presented by Aquinas in ST I, q.2, a.3: Motion, Efficient Cause, Contingency, Gradation, and Governance." },
        { front: "What is the principle of double effect?", back: "An action with both good and bad effects is permissible if: (1) the act itself is good/neutral, (2) the good is intended, (3) the bad is not the means, (4) proportionate reason exists." },
        { front: "Define transubstantiation.", back: "The substance of bread and wine is changed into the Body and Blood of Christ, while the accidents (appearances) of bread and wine remain." },
        { front: "What is natural law?", back: "The rational creature's participation in the eternal law of God. Its first principle: good is to be done and pursued, evil is to be avoided (ST I-II, q.94, a.2)." },
        { front: "What is the hypostatic union?", back: "The union of Christ's divine and human natures in one divine Person (hypostasis), without confusion, change, division, or separation (Council of Chalcedon, 451)." },
      ]);
    }
    setLoading(false);
  };

  const saveCard = (front: string, back: string) => {
    const newCard: Flashcard = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      front,
      back,
      nextReview: Date.now(),
      interval: 1,
      ease: 2.5,
    };
    saveDeck([...deck, newCard]);
  };

  const dueCards = deck.filter((c) => c.nextReview <= Date.now());

  const rateCard = (rating: "again" | "hard" | "good" | "easy") => {
    if (dueCards.length === 0) return;
    const card = dueCards[currentIndex];
    const updated = { ...card };

    switch (rating) {
      case "again":
        updated.interval = 1;
        updated.ease = Math.max(1.3, updated.ease - 0.2);
        break;
      case "hard":
        updated.interval = Math.max(1, updated.interval * 1.2);
        updated.ease = Math.max(1.3, updated.ease - 0.15);
        break;
      case "good":
        updated.interval = updated.interval * updated.ease;
        break;
      case "easy":
        updated.interval = updated.interval * updated.ease * 1.3;
        updated.ease += 0.15;
        break;
    }

    updated.nextReview = Date.now() + updated.interval * 24 * 60 * 60 * 1000;
    const newDeck = deck.map((c) => (c.id === card.id ? updated : c));
    saveDeck(newDeck);
    setReviewFlipped(false);
    if (currentIndex >= dueCards.length - 1) {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Flashcards" subtitle="Generate and review with spaced repetition" icon="🃏" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("generate")}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                mode === "generate"
                  ? "bg-amber-900/50 text-amber-400 border border-amber-700"
                  : "bg-stone-900 text-stone-500 border border-stone-800 hover:border-stone-700"
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => { setMode("review"); setCurrentIndex(0); setReviewFlipped(false); }}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                mode === "review"
                  ? "bg-amber-900/50 text-amber-400 border border-amber-700"
                  : "bg-stone-900 text-stone-500 border border-stone-800 hover:border-stone-700"
              }`}
            >
              Review ({dueCards.length} due)
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          {mode === "generate" && (
            <div className="space-y-4">
              <div className="max-w-lg space-y-3">
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., The Five Ways, Eucharist, Trinity)"
                  className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <div className="flex gap-2">
                  {["beginner", "intermediate", "advanced"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                        difficulty === d
                          ? "bg-amber-900/50 text-amber-400 border border-amber-700"
                          : "bg-stone-900 text-stone-500 border border-stone-800 hover:border-stone-700"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-stone-100 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Generating..." : "Generate 5 Cards"}
                </button>
              </div>

              {generatedCards.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-stone-300">Generated Cards — click to flip</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {generatedCards.map((card, i) => (
                      <div
                        key={i}
                        onClick={() => setFlipped(flipped === i ? null : i)}
                        className="cursor-pointer rounded-xl border border-stone-800 p-4 min-h-[140px] flex flex-col justify-between transition-all hover:border-stone-700"
                      >
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 mb-2">
                            {flipped === i ? "Answer" : "Question"}
                          </p>
                          {flipped === i ? (
                            <p
                              className="text-sm text-stone-200 [&_a]:text-amber-500 [&_a:hover]:underline"
                              dangerouslySetInnerHTML={{ __html: linkCitations(escapeHtml(card.back)) }}
                            />
                          ) : (
                            <p className="text-sm text-stone-200">
                              <GlossaryTooltip text={card.front} />
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-stone-600">Click to flip</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveCard(card.front, card.back);
                            }}
                            className="rounded bg-stone-800 px-2 py-1 text-[10px] text-stone-400 hover:bg-stone-700 hover:text-stone-200 transition-colors"
                          >
                            Save to Deck
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "review" && (
            <div className="flex flex-col items-center">
              {dueCards.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-stone-400 text-sm">No cards due for review.</p>
                  <p className="text-stone-600 text-xs mt-1">
                    {deck.length === 0
                      ? "Generate some cards first and save them to your deck."
                      : `${deck.length} cards in deck. Next review coming soon.`}
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-lg space-y-4">
                  <p className="text-center text-xs text-stone-600">
                    Card {currentIndex + 1} of {dueCards.length}
                  </p>
                  <div
                    onClick={() => setReviewFlipped(!reviewFlipped)}
                    className="cursor-pointer rounded-xl border border-stone-800 p-6 min-h-[200px] flex flex-col justify-center items-center text-center transition-all hover:border-stone-700"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 mb-3">
                      {reviewFlipped ? "Answer" : "Question"}
                    </p>
                    {reviewFlipped ? (
                      <p
                        className="text-base text-stone-200 [&_a]:text-amber-500 [&_a:hover]:underline"
                        dangerouslySetInnerHTML={{ __html: linkCitations(escapeHtml(dueCards[currentIndex]?.back ?? "")) }}
                      />
                    ) : (
                      <p className="text-base text-stone-200">
                        <GlossaryTooltip text={dueCards[currentIndex]?.front ?? ""} />
                      </p>
                    )}
                    {!reviewFlipped && <p className="mt-4 text-[10px] text-stone-600">Click to reveal answer</p>}
                  </div>
                  {reviewFlipped && (
                    <div className="flex justify-center gap-2">
                      {(["again", "hard", "good", "easy"] as const).map((r) => {
                        const colors: Record<string, string> = {
                          again: "bg-red-900/50 text-red-400 border-red-800 hover:bg-red-900",
                          hard: "bg-orange-900/50 text-orange-400 border-orange-800 hover:bg-orange-900",
                          good: "bg-emerald-900/50 text-emerald-400 border-emerald-800 hover:bg-emerald-900",
                          easy: "bg-blue-900/50 text-blue-400 border-blue-800 hover:bg-blue-900",
                        };
                        return (
                          <button
                            key={r}
                            onClick={() => rateCard(r)}
                            className={`rounded-lg border px-4 py-2 text-xs font-medium capitalize transition-colors ${colors[r]}`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {deck.length > 0 && (
                <div className="mt-8 w-full max-w-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-600">Total deck: {deck.length} cards</p>
                    <button
                      onClick={() => {
                        if (confirm("Clear entire deck?")) {
                          saveDeck([]);
                          setCurrentIndex(0);
                        }
                      }}
                      className="text-[10px] text-red-600 hover:text-red-400"
                    >
                      Clear Deck
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
