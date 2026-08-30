// Cris's Metaphysics quiz history — was localStorage-only ("meta-tutor-history"),
// now backed by the same Supabase mt_quiz_history table RCA already uses, via
// subject-progress.ts / /api/subject-progress, namespaced under subject="metaphysics".
// Kept as its own module (not inlined at call sites) so the ~15 call sites across
// study/ components and countdown/dashboard/review pages didn't need to change shape.

import { getSubjectProgress, saveResult as saveSubjectResult } from "@/lib/subject-progress";

const SUBJECT = "metaphysics";

export type QuizResult = {
  mode: string;
  date: string;
  timestamp: number;
  score: number;
  total: number;
  percentage: number;
  weakTerms: string[];
  weakCategories: string[];
};

export async function getHistory(): Promise<QuizResult[]> {
  const { history } = await getSubjectProgress(SUBJECT);
  return history;
}

export async function saveResult(result: QuizResult) {
  await saveSubjectResult(SUBJECT, result);
}

export async function getWeakAreas(): Promise<{ terms: string[]; categories: string[] }> {
  const { weakAreas } = await getSubjectProgress(SUBJECT);
  return weakAreas;
}
