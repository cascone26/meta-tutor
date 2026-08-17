"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TriviaSRSCard } from "@/lib/trivia-types";
import { isTriviaDueForReview, updateTriviaSRSCard } from "@/lib/trivia-srs";
import { TRIVIA_CATEGORIES } from "@/lib/trivia-categories";

export default function TriviaReviewPage() {
  const [allCards, setAllCards] = useState<TriviaSRSCard[]>([]);
  const [dueCards, setDueCards] = useState<TriviaSRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const res = await fetch("/api/trivia-progress");
        if (res.ok) {
          const data = await res.json();
          setAllCards(data.srsCards || []);
          setDueCards((data.srsCards || []).filter(isTriviaDueForReview));
        }
      } catch (e) {
        console.error("Failed to load SRS cards:", e);
      }
      setMounted(true);
    };

    loadCards();
  }, []);

  async function handleRate(quality: number) {
    const card = allCards.find((c) => c.id === dueCards[currentIndex].id);
    if (!card) return;

    const updated = updateTriviaSRSCard(card, quality);
    const newAll = allCards.map((c) =>
      c.id === updated.id ? updated : c
    );
    setAllCards(newAll);
    setReviewedCount((prev) => prev + 1);

    // Save to Supabase
    await fetch("/api/trivia-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upsertSRSCard",
        ...updated,
        easeFactor: updated.easeFactor,
      }),
    }).catch((e) => console.error("Failed to update SRS card:", e));

    const remaining = dueCards.filter((_, i) => i > currentIndex);
    if (remaining.length > 0) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setDueCards([]);
    }
  }

  async function handleDelete(id: string) {
    const newAll = allCards.filter((c) => c.id !== id);
    setAllCards(newAll);
    const newDue = dueCards.filter((c) => c.id !== id);
    setDueCards(newDue);

    // Delete from Supabase
    await fetch("/api/trivia-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteSRSCard", id }),
    }).catch((e) => console.error("Failed to delete SRS card:", e));

    if (currentIndex >= newDue.length && newDue.length > 0) {
      setCurrentIndex(newDue.length - 1);
    } else if (newDue.length === 0) {
      setDueCards([]);
    }
  }

  if (!mounted) return null;

  if (allCards.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="text-center space-y-4 px-5">
          <p className="text-4xl opacity-40">♻️</p>
          <h1 className="text-xl font-bold">Review Deck Empty</h1>
          <p className="text-sm" style={{ color: "#d8b4fe" }}>
            Play quizzes to add questions to your review deck.
          </p>
          <Link
            href="/trivia/play"
            className="inline-block mt-4 py-3 px-8 rounded-lg font-bold transition-opacity hover:opacity-90"
            style={{ background: "#f472b6", color: "#1a0f1f" }}
          >
            Start Playing
          </Link>
        </div>
      </div>
    );
  }

  if (dueCards.length === 0 && reviewedCount === 0) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="text-center space-y-4 px-5">
          <p className="text-4xl opacity-60">✓</p>
          <h1 className="text-xl font-bold">All Caught Up</h1>
          <p className="text-sm" style={{ color: "#d8b4fe" }}>
            No cards due. Come back tomorrow.
          </p>
          <div
            className="rounded-lg p-4 max-w-xs mx-auto"
            style={{ background: "#2d1845", borderColor: "#6b21a8", border: "1px solid" }}
          >
            <p className="text-sm" style={{ color: "#d8b4fe" }}>
              <strong>{allCards.length}</strong> cards in your deck
            </p>
          </div>
          <Link
            href="/trivia/play"
            className="inline-block mt-4 py-3 px-8 rounded-lg font-bold transition-opacity hover:opacity-90"
            style={{ background: "#f472b6", color: "#1a0f1f" }}
          >
            Play More
          </Link>
        </div>
      </div>
    );
  }

  if (currentIndex >= dueCards.length) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center"
        style={{ background: "#1a0f1f", color: "#f3e8ff" }}
      >
        <div className="text-center space-y-4 px-5">
          <p className="text-4xl">✓</p>
          <h1 className="text-xl font-bold" style={{ color: "#f472b6" }}>
            Review Complete
          </h1>
          <p className="text-sm" style={{ color: "#d8b4fe" }}>
            {reviewedCount} cards reviewed
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/trivia/play"
              className="py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90"
              style={{ background: "#f472b6", color: "#1a0f1f" }}
            >
              Play
            </Link>
            <Link
              href="/trivia"
              className="py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90"
              style={{
                background: "#6b21a8",
                color: "#f3e8ff",
                border: "1px solid #f472b6",
              }}
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = dueCards[currentIndex];
  const catInfo = TRIVIA_CATEGORIES[card.category];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#1a0f1f", color: "#f3e8ff" }}
    >
      {/* Progress bar */}
      <div
        className="h-1 w-full overflow-hidden"
        style={{ background: "#2d1845" }}
      >
        <div
          className="h-full transition-all"
          style={{
            background: "#f472b6",
            width: `${((currentIndex + 1) / dueCards.length) * 100}%`,
          }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-10">
        <div className="max-w-2xl mx-auto w-full">
          {/* Card header */}
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: catInfo.color }}
          >
            {catInfo.icon} {catInfo.label}
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold mb-8">{card.question}</h2>

          {/* Answer reveal */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-6 rounded-lg font-bold transition-opacity hover:opacity-90 mb-6"
              style={{
                background: "#f472b6",
                color: "#1a0f1f",
              }}
            >
              Reveal Answer
            </button>
          ) : (
            <>
              <div
                className="rounded-lg p-6 mb-6"
                style={{
                  background: "#065f46",
                  borderColor: "#10b981",
                  border: "2px solid",
                }}
              >
                <p className="text-2xl font-bold text-center" style={{ color: "#d1fae5" }}>
                  {card.answer}
                </p>
              </div>

              {card.explanation && (
                <div
                  className="rounded-lg p-4 mb-6"
                  style={{
                    background: "#2d1845",
                    borderColor: "#6b21a8",
                    border: "1px solid",
                  }}
                >
                  <p className="text-sm" style={{ color: "#d8b4fe" }}>
                    {card.explanation}
                  </p>
                </div>
              )}

              {/* Rating buttons */}
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRate(0)}
                    className="py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: "#7f1d1d",
                      color: "#fecaca",
                      border: "1px solid #ef4444",
                    }}
                  >
                    Forgot (0)
                  </button>
                  <button
                    onClick={() => handleRate(2)}
                    className="py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: "#7f1d1d",
                      color: "#fecaca",
                      border: "1px solid #ef4444",
                    }}
                  >
                    Difficult (2)
                  </button>
                  <button
                    onClick={() => handleRate(4)}
                    className="py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: "#14532d",
                      color: "#d1fae5",
                      border: "1px solid #10b981",
                    }}
                  >
                    Good (4)
                  </button>
                  <button
                    onClick={() => handleRate(5)}
                    className="py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: "#14532d",
                      color: "#d1fae5",
                      border: "1px solid #10b981",
                    }}
                  >
                    Easy (5)
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(card.id)}
                  className="w-full py-2 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
                  style={{
                    background: "#2d1845",
                    color: "#f3e8ff",
                    border: "1px solid #6b21a8",
                  }}
                >
                  Delete Card
                </button>
              </div>
            </>
          )}

          <div
            className="text-center text-sm"
            style={{ color: "#d8b4fe" }}
          >
            {currentIndex + 1} of {dueCards.length}
          </div>
        </div>
      </div>
    </div>
  );
}
