// meta-tutor-workers — built 2026-11-17 to replace a frozen one-time test
// deployment from 2026-11-02 that had never been touched since (see
// PROCESS.md 2026-11-16/17 entries for the full incident). Deliberately
// simple: unlike LessonDraft's worker-entry.js, this app has no oversized
// routes needing a bundle-size exclusion and no edge-cache/fallback-origin
// logic — just the OpenNext-built handler, wrapped in the same module-race
// retry LessonDraft needed (see its worker-entry.js, fetchWithModuleRaceRetry)
// since that's a known OpenNext-on-Workers flakiness class, not something
// specific to LessonDraft's own app logic.
import openNextHandler from "./.open-next/worker.js";

async function fetchWithModuleRaceRetry(request, env, ctx) {
  const attempts = [request, request.clone(), request.clone()];
  let lastError;
  for (let i = 0; i < attempts.length; i++) {
    let res;
    try {
      res = await openNextHandler.fetch(attempts[i], env, ctx);
    } catch (e) {
      lastError = e;
      continue;
    }
    if (res.status !== 500 || i === attempts.length - 1) return res;
  }
  throw lastError;
}

export default {
  async fetch(request, env, ctx) {
    return fetchWithModuleRaceRetry(request, env, ctx);
  },
};
