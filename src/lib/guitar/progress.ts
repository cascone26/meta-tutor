// Guitar progress tracking. Two tiers, same split as the rest of the hub:
//  - Lesson completion / XP / streak: localStorage only (own keys — doesn't touch Cris's
//    shared "meta-tutor-streaks" key, this is Jacob's own subject).
//  - Chord-drill misses + session scores: the existing subject-progress Supabase tables
//    (mt_wrong_answers / mt_quiz_history), subject="guitar" — same backend every other
//    subject already uses, so the /dashboard-style history and weak-area queries just work.
import { getSubjectProgress, logWrongAnswer, saveResult } from "@/lib/subject-progress";
import { LESSONS, MODULES, lessonsByModule, TOTAL_XP } from "./curriculum";

const SUBJECT = "guitar";
const COMPLETED_KEY = "guitar-completed-lessons";
const STREAK_KEY = "guitar-streak";
const PRACTICE_DATES_KEY = "guitar-practice-dates";

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
  recordPracticeDate(t);
  return data;
}

/** Last 90 days of practice dates (YYYY-MM-DD), for the streak-calendar heatmap — same
 *  pattern as the site-wide streaks.ts's studyDates, kept separate since this is its own
 *  localStorage key under Jacob's own subject. */
export function getPracticeDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRACTICE_DATES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function recordPracticeDate(dateKey: string) {
  const dates = getPracticeDates();
  if (dates.includes(dateKey)) return;
  const trimmed = [...dates, dateKey].slice(-90);
  try {
    localStorage.setItem(PRACTICE_DATES_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save guitar practice dates:", e);
  }
}

export type GuitarBadge = { id: string; name: string; description: string; earned: boolean };

/** Derived entirely from completed-lesson ids + streak — no separate "achievements" store
 *  to keep in sync, so a badge can never drift out of step with what's actually completed. */
export function getBadges(completed: Set<string>, streak: GuitarStreak): GuitarBadge[] {
  const moduleComplete = (moduleId: string) => lessonsByModule(moduleId).every((l) => completed.has(l.id));
  return [
    { id: "first-chord", name: "First Chord", description: "Played your first clean chord (E minor).", earned: completed.has("your-first-chord-e-minor") },
    { id: "open-chords", name: "Open Chord Master", description: "Completed every open-chord lesson.", earned: moduleComplete("open-chords") },
    { id: "seventh-chords", name: "Seventh Heaven", description: "Completed every seventh-chord lesson.", earned: moduleComplete("seventh-chords") },
    { id: "rhythm", name: "Rhythm Keeper", description: "Completed every strumming/rhythm lesson.", earned: moduleComplete("strumming-rhythm") },
    { id: "barre", name: "Barre None", description: "Nailed your first full barre chord (F major).", earned: completed.has("f-major-your-first-barre-chord") },
    { id: "songbird", name: "Songbird", description: "Played along with every song in the curriculum.", earned: moduleComplete("songs") },
    { id: "streak-7", name: "7-Day Streak", description: "Practiced 7 days in a row.", earned: streak.longestStreak >= 7 },
    { id: "streak-30", name: "30-Day Streak", description: "Practiced 30 days in a row.", earned: streak.longestStreak >= 30 },
    { id: "graduate", name: "Curriculum Complete", description: "Finished every lesson in the curriculum.", earned: MODULES.every((m) => moduleComplete(m.id)) },
  ];
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
