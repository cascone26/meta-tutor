// Simple in-memory rate limiter — resets when the serverless function cold starts,
// but still prevents runaway costs within a warm instance.
// Uses IP-based tracking since there's no auth system.

const DAILY_LIMIT = 75; // max API calls per IP per day

interface UsageEntry {
  count: number;
  resetAt: number; // timestamp
}

const usage = new Map<string, UsageEntry>();

function getResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
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
