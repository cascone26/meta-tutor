export type WrongAnswer = {
  term: string;
  definition: string;
  category: string;
  count: number;
  lastWrong: number;
  modes: string[];
};

const KEY = "meta-tutor-wrong-answers";

export function getWrongAnswers(): Record<string, WrongAnswer> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function logWrongAnswer(term: string, definition: string, category: string, mode: string) {
  const data = getWrongAnswers();
  const existing = data[term];
  if (existing) {
    existing.count += 1;
    existing.lastWrong = Date.now();
    if (!existing.modes.includes(mode)) existing.modes.push(mode);
  } else {
    data[term] = { term, definition, category, count: 1, lastWrong: Date.now(), modes: [mode] };
  }
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getWrongAnswersList(): WrongAnswer[] {
  return Object.values(getWrongAnswers()).sort((a, b) => b.count - a.count);
}

export function clearWrongAnswer(term: string) {
  const data = getWrongAnswers();
  delete data[term];
  localStorage.setItem(KEY, JSON.stringify(data));
}
