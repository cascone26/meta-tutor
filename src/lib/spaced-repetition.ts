export type SREntry = {
  term: string;
  ease: number; // 2.5 default
  interval: number; // days
  lastReview: number; // timestamp
  nextReview: number; // timestamp
  reps: number;
};

export function getSRData(): Record<string, SREntry> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem("meta-tutor-sr");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveSRData(data: Record<string, SREntry>) {
  localStorage.setItem("meta-tutor-sr", JSON.stringify(data));
}

// Simplified SM-2 algorithm
export function reviewTerm(
  entry: SREntry | undefined,
  term: string,
  quality: number // 0-5 (0=blackout, 3=correct with difficulty, 5=perfect)
): SREntry {
  const now = Date.now();

  if (!entry) {
    entry = {
      term,
      ease: 2.5,
      interval: 0,
      lastReview: now,
      nextReview: now,
      reps: 0,
    };
  }

  let { ease, interval, reps } = entry;

  if (quality >= 3) {
    // Correct
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else interval = Math.round(interval * ease);
    reps += 1;
  } else {
    // Incorrect — reset
    reps = 0;
    interval = 0;
  }

  ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    term,
    ease,
    interval,
    lastReview: now,
    nextReview,
    reps,
  };
}

export function getDueTerms(data: Record<string, SREntry>): string[] {
  const now = Date.now();
  return Object.values(data)
    .filter((e) => e.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview)
    .map((e) => e.term);
}

export function getTermStats(data: Record<string, SREntry>) {
  const entries = Object.values(data);
  const now = Date.now();
  const due = entries.filter((e) => e.nextReview <= now).length;
  const learning = entries.filter((e) => e.reps < 2).length;
  const reviewing = entries.filter((e) => e.reps >= 2 && e.nextReview <= now).length;
  const mastered = entries.filter((e) => e.reps >= 3 && e.nextReview > now).length;
  return { total: entries.length, due, learning, reviewing, mastered };
}
