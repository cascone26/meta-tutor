// Subject-namespaced progress tracking, backed by Supabase (mt_wrong_answers /
// mt_quiz_history) via /api/subject-progress. Separate from wrong-answers.ts /
// study-history.ts (Cris's localStorage-based Metaphysics tracking) on purpose —
// this is a different backend entirely, not just a different storage key.

export type WrongAnswer = {
  term: string;
  definition: string;
  category: string;
  count: number;
  lastWrong: number;
  modes: string[];
};

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

export type SubjectProgress = {
  wrongAnswers: WrongAnswer[];
  history: QuizResult[];
  weakAreas: { terms: string[]; categories: string[] };
};

type WrongAnswerRow = {
  term: string;
  definition: string | null;
  category: string | null;
  count: number;
  last_wrong: string;
  modes: string[];
};

type HistoryRow = {
  mode: string;
  score: number;
  total: number;
  percentage: number;
  weak_terms: string[];
  weak_categories: string[];
  created_at: string;
};

// Throws on genuine fetch/network/auth failure — callers must not treat a caught
// exception the same as "fetch succeeded, there's just nothing yet." That silent
// swallow-to-empty was a real bug (found 2026-08-30, same failure class as the Latin
// Lab silent-failure fix this session): a transient error looked identical to "no
// progress yet" everywhere this was called. Callers should catch this explicitly and
// show a real error+retry state — see src/app/dashboard/page.tsx for the pattern.
export async function getSubjectProgress(subject: string): Promise<SubjectProgress> {
  const res = await fetch(`/api/subject-progress?subject=${encodeURIComponent(subject)}`);
  if (!res.ok) throw new Error(`subject-progress fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    wrongAnswers: (data.wrongAnswers as WrongAnswerRow[]).map((r) => ({
      term: r.term,
      definition: r.definition || "",
      category: r.category || "",
      count: r.count,
      lastWrong: new Date(r.last_wrong).getTime(),
      modes: r.modes,
    })),
    history: (data.history as HistoryRow[]).map((r) => ({
      mode: r.mode,
      date: new Date(r.created_at).toLocaleDateString(),
      timestamp: new Date(r.created_at).getTime(),
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      weakTerms: r.weak_terms,
      weakCategories: r.weak_categories,
    })),
    weakAreas: data.weakAreas,
  };
}

export async function logWrongAnswer(subject: string, term: string, definition: string, category: string, mode: string) {
  try {
    await fetch("/api/subject-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logWrongAnswer", subject, term, definition, category, mode }),
    });
  } catch (e) {
    console.error("Failed to log wrong answer:", e);
  }
}

export async function saveResult(subject: string, result: QuizResult) {
  try {
    await fetch("/api/subject-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "saveResult", subject, result }),
    });
  } catch (e) {
    console.error("Failed to save quiz result:", e);
  }
}

export async function clearWrongAnswer(subject: string, term: string) {
  try {
    await fetch("/api/subject-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clearWrongAnswer", subject, term }),
    });
  } catch (e) {
    console.error("Failed to clear wrong answer:", e);
  }
}
