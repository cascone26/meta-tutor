// Guitar progress tracking. Two tiers, same split as the rest of the hub:
//  - Lesson completion / XP / streak: localStorage only (own keys — doesn't touch Cris's
//    shared "meta-tutor-streaks" key, this is Jacob's own subject).
//  - Chord-drill misses + session scores: the existing subject-progress Supabase tables
//    (mt_wrong_answers / mt_quiz_history), subject="guitar" — same backend every other
//    subject already uses, so the /dashboard-style history and weak-area queries just work.
import { getSubjectProgress, logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { LESSONS, TOTAL_XP } from "./curriculum";

const SUBJECT = "guitar";
const COMPLETED_KEY = "guitar-completed-lessons";
const STREAK_KEY = "guitar-streak";

export type GuitarStreak = {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string; // YYYY-MM-DD
};

function today(): string {
  return new Date().toISOString().split("T")[0];
}
function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function getCompletedLessons(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function isLessonUnlocked(lessonId: string): boolean {
  const i = LESSONS.findIndex((l) => l.id === lessonId);
  if (i <= 0) return true;
  return getCompletedLessons().has(LESSONS[i - 1].id);
}

export function markLessonComplete(lessonId: string) {
  const completed = getCompletedLessons();
  completed.add(lessonId);
  try {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
  } catch (e) {
    console.error("Failed to save guitar lesson progress:", e);
  }
  recordPracticeToday();
}

export function getXp(): number {
  const completed = getCompletedLessons();
  return LESSONS.filter((l) => completed.has(l.id)).reduce((sum, l) => sum + l.xp, 0);
}

export function getXpStats() {
  const xp = getXp();
  return { xp, totalXp: TOTAL_XP, pct: TOTAL_XP > 0 ? Math.round((xp / TOTAL_XP) * 100) : 0 };
}

export function getStreak(): GuitarStreak {
  if (typeof window === "undefined") return { currentStreak: 0, longestStreak: 0, lastPracticeDate: "" };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { currentStreak: 0, longestStreak: 0, lastPracticeDate: "" };
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastPracticeDate: "" };
  }
}

export function recordPracticeToday(): GuitarStreak {
  const data = getStreak();
  const t = today();
  if (data.lastPracticeDate !== t) {
    data.currentStreak = data.lastPracticeDate === yesterday() ? data.currentStreak + 1 : 1;
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
    data.lastPracticeDate = t;
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save guitar streak:", e);
    }
  }
  return data;
}

/** Call when a chord-drill attempt fails to recognize the target chord — feeds the shared
 *  weak-areas view same as every other subject's wrong-answer log. */
export async function logChordMiss(chordId: string, category: string, mode: string) {
  try {
    await logWrongAnswer(SUBJECT, chordId, chordId, category, mode);
  } catch (e) {
    console.error("Failed to log chord miss:", e);
  }
}

export async function logPracticeResult(mode: string, score: number, total: number, weakTerms: string[] = []) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  try {
    await saveResult(SUBJECT, {
      mode,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score,
      total,
      percentage,
      weakTerms,
      weakCategories: [],
    });
  } catch (e) {
    console.error("Failed to save guitar practice result:", e);
  }
}

export async function getGuitarHistory() {
  return getSubjectProgress(SUBJECT);
}
