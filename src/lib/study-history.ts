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

export function getHistory(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("meta-tutor-history");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: QuizResult) {
  const history = getHistory();
  history.unshift(result);
  // Keep last 100
  if (history.length > 100) history.length = 100;
  localStorage.setItem("meta-tutor-history", JSON.stringify(history));
}

export function getWeakAreas(): { terms: string[]; categories: string[] } {
  const history = getHistory().slice(0, 20);
  const termCounts: Record<string, number> = {};
  const catCounts: Record<string, number> = {};

  for (const r of history) {
    for (const t of r.weakTerms) {
      termCounts[t] = (termCounts[t] || 0) + 1;
    }
    for (const c of r.weakCategories) {
      catCounts[c] = (catCounts[c] || 0) + 1;
    }
  }

  const terms = Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);

  const categories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([c]) => c);

  return { terms, categories };
}
