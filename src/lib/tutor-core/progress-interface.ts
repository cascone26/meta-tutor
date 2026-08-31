// The contract every subject implements to plug into the cross-subject learner profile
// (mt_learner_profile). Deliberately loose: only summary OUTPUTS are shared here, never
// algorithm state — Latin's FSRS, Trivia's SM-2 variant, and RCA's plain quiz-history
// all stay exactly as they are underneath. Writing new attempts stays each subject's own
// job via its existing route (e.g. /api/latin-progress); an adapter only reads and
// summarizes what's already there. See src/lib/latin-lab/progress-adapter.ts (Phase 5)
// for the first real implementation.
import type { WeakArea, DueItem, SubjectSnapshot } from "./types";

export interface SubjectProgressAdapter {
  subjectId: string;
  getWeakAreas(userEmail: string): Promise<WeakArea[]>;
  getDueItems(userEmail: string): Promise<DueItem[]>; // [] for subjects with no SRS concept
  getSummaryForProfile(userEmail: string): Promise<SubjectSnapshot>;
}
