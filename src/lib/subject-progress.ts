// Generalized, subject-namespaced version of wrong-answers.ts + study-history.ts.
// Kept separate from those files so Cris's Metaphysics course storage/behavior is untouched.

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

function storageKey(subject: string, name: string) {
  return `meta-tutor-${subject}-${name}`;
}

export function getWrongAnswers(subject: string): Record<string, WrongAnswer> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(storageKey(subject, "wrong-answers"));
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function logWrongAnswer(subject: string, term: string, definition: string, category: string, mode: string) {
  const data = getWrongAnswers(subject);
  const existing = data[term];
  if (existing) {
    existing.count += 1;
    existing.lastWrong = Date.now();
    if (!existing.modes.includes(mode)) existing.modes.push(mode);
  } else {
    data[term] = { term, definition, category, count: 1, lastWrong: Date.now(), modes: [mode] };
  }
  try {
    localStorage.setItem(storageKey(subject, "wrong-answers"), JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save wrong answers:", e);
  }
}

export function getWrongAnswersList(subject: string): WrongAnswer[] {
  return Object.values(getWrongAnswers(subject)).sort((a, b) => b.count - a.count);
}

export function clearWrongAnswer(subject: string, term: string) {
  const data = getWrongAnswers(subject);
  delete data[term];
  try {
    localStorage.setItem(storageKey(subject, "wrong-answers"), JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save wrong answers:", e);
  }
}

export function getHistory(subject: string): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(storageKey(subject, "history"));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveResult(subject: string, result: QuizResult) {
  const history = getHistory(subject);
  history.unshift(result);
  if (history.length > 100) history.length = 100;
  try {
    localStorage.setItem(storageKey(subject, "history"), JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save quiz history:", e);
  }
}

export function getWeakAreas(subject: string): { terms: string[]; categories: string[] } {
  const history = getHistory(subject).slice(0, 20);
  const termCounts: Record<string, number> = {};
  const catCounts: Record<string, number> = {};

  for (const r of history) {
    for (const t of r.weakTerms) termCounts[t] = (termCounts[t] || 0) + 1;
    for (const c of r.weakCategories) catCounts[c] = (catCounts[c] || 0) + 1;
  }

  const terms = Object.entries(termCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
  const categories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c);

  return { terms, categories };
}
