export type TriviaCategory =
  | "geography"
  | "history"
  | "science"
  | "movies-tv"
  | "music"
  | "sports"
  | "literature"
  | "food-drink"
  | "art"
  | "pop-culture"
  | "mythology"
  | "presidents";

export interface TriviaQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: TriviaCategory;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
}

export interface TriviaSRSCard {
  id: string;
  question: string;
  answer: string;
  category: TriviaCategory;
  explanation: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: string;
  lastReview: string | null;
}

export interface TriviaCategoryStats {
  answered: number;
  correct: number;
}

export interface TriviaDailyStats {
  answered: number;
  correct: number;
}

export interface TriviaUserProgress {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  categoryStats: Record<TriviaCategory, TriviaCategoryStats>;
  dailyStats: Record<string, TriviaDailyStats>;
  level: number;
  xp: number;
}

export type TriviaDifficulty = "easy" | "medium" | "hard";

export const XP_BY_DIFFICULTY: Record<
  TriviaDifficulty,
  { correct: number; wrong: number }
> = {
  easy: { correct: 5, wrong: 2 },
  medium: { correct: 10, wrong: 3 },
  hard: { correct: 20, wrong: 5 },
};

export const QUIZ_SIZES = [10, 15, 20, 25, 50] as const;
export const TIMER_OPTIONS = [0, 15, 30, 60] as const;
