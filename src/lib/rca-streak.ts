// Streak computation — pure function, no I/O, so it's trivial to reason about/test.
// "activeToday: false" doesn't zero the streak by itself — a streak stays alive
// through the end of today as long as yesterday had a session, matching how every
// real streak app (Duolingo etc.) avoids punishing you before the day is over.
export type StreakResult = { current: number; longest: number; activeToday: boolean };

export function computeStreak(dates: Date[]): StreakResult {
  const dayKeys = new Set(dates.map((d) => d.toDateString()));
  if (dayKeys.size === 0) return { current: 0, longest: 0, activeToday: false };

  const sortedDesc = Array.from(dayKeys)
    .map((k) => new Date(k))
    .sort((a, b) => b.getTime() - a.getTime());

  const oneDay = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeToday = dayKeys.has(today.toDateString());

  let current = 0;
  let cursor = activeToday ? today : new Date(today.getTime() - oneDay);
  if (dayKeys.has(cursor.toDateString())) {
    while (dayKeys.has(cursor.toDateString())) {
      current++;
      cursor = new Date(cursor.getTime() - oneDay);
    }
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedDesc.length; i++) {
    const diffDays = Math.round((sortedDesc[i - 1].getTime() - sortedDesc[i].getTime()) / oneDay);
    if (diffDays === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  return { current, longest: Math.max(current, longest), activeToday };
}
