import { TriviaSRSCard } from "./trivia-types";

export function updateTriviaSRSCard(
  card: TriviaSRSCard,
  quality: number
): TriviaSRSCard {
  const now = new Date().toISOString().split("T")[0];

  let { interval, repetition, easeFactor } = card;

  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  }

  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ...card,
    interval,
    repetition,
    easeFactor,
    nextReview: nextDate.toISOString().split("T")[0],
    lastReview: now,
  };
}

export function createTriviaSRSCard(
  question: string,
  answer: string,
  category: string,
  explanation: string
): TriviaSRSCard {
  const today = new Date().toISOString().split("T")[0];
  return {
    id: `srs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    question,
    answer,
    category: category as TriviaSRSCard["category"],
    explanation,
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReview: today,
    lastReview: null,
  };
}

export function isTriviaDueForReview(card: TriviaSRSCard): boolean {
  const today = new Date().toISOString().split("T")[0];
  return card.nextReview <= today;
}
