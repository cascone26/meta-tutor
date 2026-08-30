// Thin wrapper around ts-fsrs (the FSRS spaced-repetition algorithm — Anki's default
// since 2024, ~20-30% fewer reviews than SM-2 for the same retention per the research
// behind this feature, see STATUS.md 2026-08-30). Used ONLY for Latin Lab vocab —
// the rest of the app's flashcard-style review still uses the existing SM-2
// implementation in src/lib/spaced-repetition.ts, left alone on purpose.

import { FSRS, generatorParameters, createEmptyCard, Rating, State, type Card } from "ts-fsrs";

const params = generatorParameters();
const scheduler = new FSRS(params);

export type FsrsCardState = Card;

export function newCard(now: Date = new Date()): FsrsCardState {
  return createEmptyCard(now);
}

export const RATING = { Again: Rating.Again, Hard: Rating.Hard, Good: Rating.Good, Easy: Rating.Easy } as const;
export type RatingKey = keyof typeof RATING;

export function reviewCard(card: FsrsCardState, rating: RatingKey, now: Date = new Date()): FsrsCardState {
  const result = scheduler.repeat(card, now);
  return result[RATING[rating]].card;
}

export function isDue(card: FsrsCardState, now: Date = new Date()): boolean {
  return new Date(card.due).getTime() <= now.getTime();
}

const STATE_LABEL: Record<number, string> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

export function stateLabel(card: FsrsCardState): string {
  return STATE_LABEL[card.state] ?? "new";
}

// "Mastered" isn't an FSRS concept — it's our own threshold for the dashboard:
// stable enough (>=21 day interval) and actually in the Review state, not New/Relearning.
export function isMastered(card: FsrsCardState): boolean {
  return card.state === State.Review && card.stability >= 21;
}
