import { TriviaCategory } from "./trivia-types";

export const TRIVIA_CATEGORIES: Record<
  TriviaCategory,
  { label: string; color: string; icon: string }
> = {
  geography: { label: "Geography", color: "#3b82f6", icon: "🌍" },
  history: { label: "History", color: "#a855f7", icon: "📜" },
  science: { label: "Science", color: "#22c55e", icon: "🔬" },
  "movies-tv": { label: "Movies & TV", color: "#ef4444", icon: "🎬" },
  music: { label: "Music", color: "#ec4899", icon: "🎵" },
  sports: { label: "Sports", color: "#f97316", icon: "🏆" },
  literature: { label: "Literature", color: "#8b5cf6", icon: "📚" },
  "food-drink": { label: "Food & Drink", color: "#eab308", icon: "🍔" },
  art: { label: "Art", color: "#14b8a6", icon: "🎨" },
  "pop-culture": { label: "Pop Culture", color: "#f43f5e", icon: "⭐" },
  mythology: { label: "Mythology", color: "#6366f1", icon: "⚡" },
  presidents: { label: "Presidents & Politics", color: "#0ea5e9", icon: "🏛️" },
};

export const ALL_TRIVIA_CATEGORIES = Object.keys(
  TRIVIA_CATEGORIES
) as TriviaCategory[];
