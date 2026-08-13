// Rate limiter backed by Supabase (mt_rate_limit table), not an in-memory Map.
// The old in-memory version reset on every serverless cold start — a
// different Vercel instance (or the same one recycling) meant a fresh Map,
// so the "75/day" cap didn't actually hold across a real day of traffic
// (found 2026-08-13, sick-him audit). This needs the same migration step as
// mt_wrong_answers/mt_quiz_history: run supabase-schema-hub.sql (now
// includes mt_rate_limit) in the Supabase SQL editor before this actually
// enforces anything — until then it fails open (allows every request, logs
// a warning) rather than silently breaking every AI feature in the app.

import { getSupabase } from "./supabase";

const DAILY_LIMIT = 75;

function getResetTime(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

export async function checkRateLimit(userKey: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();

  const { data: existing, error: selectError } = await supabase
    .from("mt_rate_limit")
    .select("count, reset_at")
    .eq("user_key", userKey)
    .maybeSingle();

  if (selectError) {
    // Table likely doesn't exist yet (migration not run) — fail open rather
    // than take down every AI feature over a missing rate-limit table.
    console.error("Rate limit check failed, allowing request:", selectError.message);
    return { allowed: true, remaining: DAILY_LIMIT };
  }

  if (!existing || existing.reset_at <= nowIso) {
    await supabase
      .from("mt_rate_limit")
      .upsert({ user_key: userKey, count: 1, reset_at: getResetTime() }, { onConflict: "user_key" });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (existing.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await supabase
    .from("mt_rate_limit")
    .update({ count: existing.count + 1 })
    .eq("user_key", userKey);
  return { allowed: true, remaining: DAILY_LIMIT - existing.count - 1 };
}

export function rateLimitResponse() {
  return Response.json(
    { error: "Daily usage limit reached. Try again tomorrow!" },
    { status: 429 }
  );
}
