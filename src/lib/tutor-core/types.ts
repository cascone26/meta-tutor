// Shared types for the cross-subject learner profile. Deliberately thin — a subject's
// own progress tables (mt_latin_vocab_state, mt_trivia_srs_cards, mt_quiz_history, …)
// stay exactly as they are; these types are only the shape each subject SUMMARIZES
// itself into for the unified profile, never a replacement for subject-owned storage.

export type WeakArea = {
  label: string; // human-readable: "genitive singular", "Sacraments", "Category: Science"
  missCount: number;
  lastMissedAt: string | null; // ISO timestamp
};

export type DueItem = {
  id: string; // subject-scoped identifier — an SRS card id, a vocab item, etc.
  label: string;
  dueAt: string; // ISO timestamp
};

export type SubjectSnapshot = {
  subjectId: string;
  accuracy: number | null; // 0-1 over the subject's own rolling window; null = no data yet
  sampleSize: number;
  weakAreas: WeakArea[]; // subject decides ranking/truncation before handing this over
  dueCount: number; // 0 for subjects with no spaced-repetition concept (e.g. RCA today)
  lastActivityAt: string | null; // ISO timestamp
};

export type LearnerProfile = {
  userEmail: string;
  subjects: SubjectSnapshot[];
  updatedAt: string; // ISO timestamp of the most recently updated subject snapshot
};
