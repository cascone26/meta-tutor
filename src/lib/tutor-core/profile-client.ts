// Client-side wrapper around /api/learner-profile — for the dashboard (Phase 7) and
// anywhere else that wants the learner's cross-subject profile without touching Supabase
// directly. Same fetch-and-swallow-errors shape as src/lib/subject-progress.ts.
import type { LearnerProfile } from "./types";

export async function getLearnerProfile(): Promise<LearnerProfile | null> {
  try {
    const res = await fetch("/api/learner-profile");
    if (!res.ok) return null;
    return (await res.json()) as LearnerProfile;
  } catch (e) {
    console.error("Failed to load learner profile:", e);
    return null;
  }
}
