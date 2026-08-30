// Cris's Metaphysics wrong-answer tracker — was localStorage-only ("meta-tutor-wrong-answers"),
// now backed by the same Supabase mt_wrong_answers table RCA already uses, via
// subject-progress.ts / /api/subject-progress, namespaced under subject="metaphysics".

import {
  getSubjectProgress,
  logWrongAnswer as logSubjectWrongAnswer,
  clearWrongAnswer as clearSubjectWrongAnswer,
} from "@/lib/subject-progress";

const SUBJECT = "metaphysics";

export type WrongAnswer = {
  term: string;
  definition: string;
  category: string;
  count: number;
  lastWrong: number;
  modes: string[];
};

export async function logWrongAnswer(term: string, definition: string, category: string, mode: string) {
  await logSubjectWrongAnswer(SUBJECT, term, definition, category, mode);
}

export async function getWrongAnswersList(): Promise<WrongAnswer[]> {
  const { wrongAnswers } = await getSubjectProgress(SUBJECT);
  return wrongAnswers;
}

export async function clearWrongAnswer(term: string) {
  await clearSubjectWrongAnswer(SUBJECT, term);
}
