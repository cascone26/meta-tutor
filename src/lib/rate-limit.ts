// Rate limiter with in-memory tracking.
// Resets on serverless cold start, but prevents runaway costs within warm instances.
// Combined with auth, this provides reasonable protection.

const DAILY_LIMIT = 75;

interface UsageEntry {
  count: number;
  resetAt: number;
}

const usage = new Map<string, UsageEntry>();

function getResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = usage.get(ip);

  if (!entry || now >= entry.resetAt) {
    usage.set(ip, { count: 1, resetAt: getResetTime() });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

export function rateLimitResponse() {
  return Response.json(
    { error: "Daily usage limit reached. Try again tomorrow!" },
    { status: 429 }
  );
}
