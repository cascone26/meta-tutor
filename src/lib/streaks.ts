export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  studyDates: string[]; // last 90 days
  badges: string[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (data: StreakData, stats: BadgeStats) => boolean;
};

export type BadgeStats = {
  totalQuizzes: number;
  termsStudied: number;
  termsMastered: number;
  perfectQuizzes: number;
  totalTerms: number;
};

const KEY = "meta-tutor-streaks";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function getStreakData(): StreakData {
  if (typeof window === "undefined") return { currentStreak: 0, longestStreak: 0, lastStudyDate: "", studyDates: [], badges: [] };
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : { currentStreak: 0, longestStreak: 0, lastStudyDate: "", studyDates: [], badges: [] };
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastStudyDate: "", studyDates: [], badges: [] };
  }
}

export function recordStudySession() {
  const data = getStreakData();
  const t = today();
  const y = yesterday();

  if (data.lastStudyDate === t) {
    // Already recorded today
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }

  if (data.lastStudyDate === y) {
    data.currentStreak += 1;
  } else if (data.lastStudyDate !== t) {
    data.currentStreak = 1;
  }

  data.lastStudyDate = t;
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  if (!data.studyDates.includes(t)) {
    data.studyDates.push(t);
  }
  // Keep last 90 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  data.studyDates = data.studyDates.filter((d) => d >= cutoffStr);

  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export const badges: Badge[] = [
  { id: "first-quiz", name: "First Steps", description: "Complete your first quiz", icon: "🎯", check: (_, s) => s.totalQuizzes >= 1 },
  { id: "streak-3", name: "On a Roll", description: "3-day study streak", icon: "🔥", check: (d) => d.currentStreak >= 3 || d.longestStreak >= 3 },
  { id: "streak-7", name: "Week Warrior", description: "7-day study streak", icon: "⚡", check: (d) => d.currentStreak >= 7 || d.longestStreak >= 7 },
  { id: "streak-14", name: "Committed", description: "14-day study streak", icon: "💪", check: (d) => d.currentStreak >= 14 || d.longestStreak >= 14 },
  { id: "streak-30", name: "Unstoppable", description: "30-day study streak", icon: "👑", check: (d) => d.currentStreak >= 30 || d.longestStreak >= 30 },
  { id: "terms-10", name: "Getting Started", description: "Study 10 terms", icon: "📖", check: (_, s) => s.termsStudied >= 10 },
  { id: "terms-30", name: "Deep Diver", description: "Study 30 terms", icon: "🧠", check: (_, s) => s.termsStudied >= 30 },
  { id: "terms-all", name: "Completionist", description: "Study every term", icon: "🏆", check: (_, s) => s.termsStudied >= s.totalTerms },
  { id: "mastered-10", name: "Scholar", description: "Master 10 terms", icon: "🎓", check: (_, s) => s.termsMastered >= 10 },
  { id: "mastered-all", name: "Metaphysician", description: "Master every term", icon: "🌟", check: (_, s) => s.termsMastered >= s.totalTerms },
  { id: "perfect-1", name: "Flawless", description: "Get a perfect quiz score", icon: "💯", check: (_, s) => s.perfectQuizzes >= 1 },
  { id: "quizzes-10", name: "Quiz Master", description: "Complete 10 quizzes", icon: "📝", check: (_, s) => s.totalQuizzes >= 10 },
  { id: "quizzes-25", name: "Relentless", description: "Complete 25 quizzes", icon: "🔄", check: (_, s) => s.totalQuizzes >= 25 },
];

export function checkBadges(streakData: StreakData, stats: BadgeStats): string[] {
  const earned: string[] = [];
  for (const badge of badges) {
    if (badge.check(streakData, stats)) {
      earned.push(badge.id);
    }
  }
  // Update stored badges
  const data = getStreakData();
  data.badges = earned;
  localStorage.setItem(KEY, JSON.stringify(data));
  return earned;
}
