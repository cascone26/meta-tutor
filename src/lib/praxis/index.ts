import { PraxisQuestion, PraxisSubtest, PRAXIS_SUBTEST_ORDER } from "./types";
import { PRAXIS_QUESTIONS } from "./questions";

export * from "./types";
export { PRAXIS_QUESTIONS } from "./questions";

export function getPraxisBank(): PraxisQuestion[] {
  return PRAXIS_QUESTIONS;
}

export function getBySubtest(subtest: PraxisSubtest | "all"): PraxisQuestion[] {
  if (subtest === "all") return PRAXIS_QUESTIONS;
  return PRAXIS_QUESTIONS.filter((q) => q.subtest === subtest);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomQuestions(
  count: number,
  subtest: PraxisSubtest | "all" = "all",
  excludeIds: string[] = []
): PraxisQuestion[] {
  let pool = getBySubtest(subtest).filter((q) => !excludeIds.includes(q.id));
  if (pool.length === 0) pool = getBySubtest(subtest);
  return shuffle(pool).slice(0, count);
}

export function getSubtestCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: PRAXIS_QUESTIONS.length };
  for (const s of PRAXIS_SUBTEST_ORDER) {
    counts[s] = getBySubtest(s).length;
  }
  return counts;
}

// ─── Progress (localStorage) ────────────────────────────────────────────────
// Per-question mastery via a simple Leitner box (0=new … 5=mastered). Answered
// correctly → box up; wrong → back to box 1. Readiness per subtest = weighted
// mastery mapped onto the scaled-score range, so the learner sees an estimate
// against the real Kansas passing line.

const STORAGE_KEY = "meta-tutor-praxis-progress-v1";

export interface PraxisCardState {
  box: number; // 0..5
  seen: number;
  correct: number;
  lastSeen: string; // ISO date
}

export interface PraxisProgress {
  cards: Record<string, PraxisCardState>;
  totalAnswered: number;
  totalCorrect: number;
  sessions: number;
  lastPlayed: string | null;
}

export function emptyProgress(): PraxisProgress {
  return {
    cards: {},
    totalAnswered: 0,
    totalCorrect: 0,
    sessions: 0,
    lastPlayed: null,
  };
}

export function loadProgress(): PraxisProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<PraxisProgress>;
    return { ...emptyProgress(), ...parsed, cards: parsed.cards ?? {} };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: PraxisProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage full / disabled — non-fatal */
  }
}

export function recordAnswer(
  p: PraxisProgress,
  q: PraxisQuestion,
  correct: boolean,
  today: string
): PraxisProgress {
  const prev = p.cards[q.id] ?? { box: 0, seen: 0, correct: 0, lastSeen: today };
  const box = correct ? Math.min(5, prev.box + 1) : 1;
  return {
    ...p,
    cards: {
      ...p.cards,
      [q.id]: {
        box,
        seen: prev.seen + 1,
        correct: prev.correct + (correct ? 1 : 0),
        lastSeen: today,
      },
    },
    totalAnswered: p.totalAnswered + 1,
    totalCorrect: p.totalCorrect + (correct ? 1 : 0),
    lastPlayed: today,
  };
}

/**
 * Readiness estimate for a subtest, expressed as a scaled score against the
 * [100,200] range. Blends coverage (how many of the bank's questions have been
 * touched) with mastery (average Leitner box). This is a study aid, not an
 * official predicted score.
 */
export function subtestReadiness(
  p: PraxisProgress,
  subtest: PraxisSubtest
): { scaled: number; coverage: number; mastery: number; touched: number; total: number } {
  const qs = getBySubtest(subtest);
  const total = qs.length;
  let masterySum = 0;
  let touched = 0;
  for (const q of qs) {
    const c = p.cards[q.id];
    if (c && c.seen > 0) {
      touched++;
      masterySum += c.box / 5; // 0..1
    }
  }
  const coverage = total ? touched / total : 0;
  const mastery = touched ? masterySum / touched : 0;
  // Readiness = mastery discounted by how much you've actually covered.
  const readiness = mastery * (0.35 + 0.65 * coverage); // 0..1
  const scaled = Math.round(100 + readiness * 100); // map to [100,200]
  return { scaled, coverage, mastery, touched, total };
}
