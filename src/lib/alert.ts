// Pings Jacob's phone directly when a whole-app-wide failure class breaks silently —
// the 2026-08-19 incident (stray quotes in the Supabase env vars, a stale synced
// Anthropic OAuth token) took an hour of manual CDP digging to find precisely because
// every call site fails open/catches-and-returns-empty. This is the loud alternative:
// fire-and-forget, best-effort, never throws, never blocks the caller's own error
// handling. Same ntfy topic + plain-curl-body convention as the rest of the fleet's
// watchdogs (~/tools/*.sh on Jacob's Mac).
const NTFY_TOPIC = "jacob-cobo-80c6d2b9e9c4";
const COOLDOWN_MS = 10 * 60 * 1000; // 10 min — avoid paging once per request during an outage

// Module-level state survives across warm invocations of the same lambda instance but
// resets on cold start, so this is a best-effort dedupe, not a guarantee — acceptable
// for "don't spam", not load-bearing for correctness.
const lastSent: Record<string, number> = {};

export function notifyOps(message: string, key: string = message): void {
  const now = Date.now();
  if (now - (lastSent[key] ?? 0) < COOLDOWN_MS) return;
  lastSent[key] = now;

  fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: `Meta Tutor: ${message}`,
  }).catch(() => {
    // best-effort — if ntfy itself is unreachable there's nothing more to do here
  });
}

// The Anthropic OAuth token synced from Jacob's Keychain (~/tools/sync-meta-tutor-
// token.sh) going stale breaks every AI route in the app simultaneously — the same
// underlying cause every time, so match on the signature rather than requiring every
// call site to know what a revoked/expired token error looks like. One key ("auth-
// error") across all routes so a stale-token outage pages once, not once per route.
export function notifyIfAuthError(err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  if (/revoked|authentication_error|invalid.?x-api-key|401/i.test(message)) {
    notifyOps(`AI route hit an auth error — synced Anthropic token likely stale, check ~/tools/sync-meta-tutor-token.sh: ${message}`, "auth-error");
  }
}
