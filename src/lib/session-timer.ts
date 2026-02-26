export type SessionLog = {
  date: string; // YYYY-MM-DD
  totalSeconds: number;
};

const KEY = "meta-tutor-session-timer";
const LOG_KEY = "meta-tutor-session-log";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function getSessionLog(): SessionLog[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(LOG_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addSessionTime(seconds: number) {
  const log = getSessionLog();
  const t = today();
  const existing = log.find((l) => l.date === t);
  if (existing) {
    existing.totalSeconds += seconds;
  } else {
    log.push({ date: t, totalSeconds: seconds });
  }
  // Keep last 90 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const filtered = log.filter((l) => l.date >= cutoffStr);
  localStorage.setItem(LOG_KEY, JSON.stringify(filtered));
}

export function getTodayStudyTime(): number {
  const log = getSessionLog();
  const t = today();
  return log.find((l) => l.date === t)?.totalSeconds || 0;
}

export function getWeekStudyTime(): number {
  const log = getSessionLog();
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const weekAgo = d.toISOString().split("T")[0];
  return log.filter((l) => l.date >= weekAgo).reduce((s, l) => s + l.totalSeconds, 0);
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Timer state persistence (for page refreshes)
export function saveTimerState(running: boolean, elapsed: number, startedAt: number | null) {
  localStorage.setItem(KEY, JSON.stringify({ running, elapsed, startedAt }));
}

export function getTimerState(): { running: boolean; elapsed: number; startedAt: number | null } {
  if (typeof window === "undefined") return { running: false, elapsed: 0, startedAt: null };
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return { running: false, elapsed: 0, startedAt: null };
    const state = JSON.parse(saved);
    // If timer was running, add elapsed time since last save
    if (state.running && state.startedAt) {
      const additionalSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      state.elapsed += additionalSeconds;
      state.startedAt = Date.now();
    }
    return state;
  } catch {
    return { running: false, elapsed: 0, startedAt: null };
  }
}
