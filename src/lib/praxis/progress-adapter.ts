// Praxis progress adapter — reads client-synced Leitner-box state from the synthetic
// __praxis__ row in mt_learner_profile and produces a SubjectSnapshot for the
// cross-subject learner profile. Praxis itself has no server tables; state stays
// client-side (localStorage), synced only the summary after each session via
// /api/praxis-progress (see src/app/api/praxis-progress/route.ts).
import type { SubjectProgressAdapter } from "@/lib/tutor-core/progress-interface";
import type { WeakArea, DueItem, SubjectSnapshot } from "@/lib/tutor-core/types";
import { getSupabase } from "@/lib/supabase";
import { subtestReadiness, type PraxisProgress, PRAXIS_SUBTEST_ORDER } from "./index";

interface PraxisProfileRow {
  progress: PraxisProgress;
  accuracy: number;
  lastActivityAt: string | null;
  updated_at: string | null;
}

async function getPraxisProfileRow(userEmail: string): Promise<PraxisProfileRow | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("mt_learner_profile")
    .select("weak_areas, updated_at")
    .eq("user_email", userEmail)
    .eq("subject_id", "__praxis__")
    .maybeSingle();
  if (!data) return null;
  const row = data as { weak_areas: unknown; updated_at: string | null };
  if (!row.weak_areas || typeof row.weak_areas !== "object") return null;
  const payload = row.weak_areas as Record<string, unknown>;
  return {
    progress: (payload.progress as PraxisProgress) || { cards: {}, totalAnswered: 0, totalCorrect: 0, sessions: 0, lastPlayed: null },
    accuracy: (payload.accuracy as number) || 0,
    lastActivityAt: (payload.lastActivityAt as string) || null,
    updated_at: row.updated_at,
  };
}

export const praxisProgressAdapter: SubjectProgressAdapter = {
  subjectId: "praxis",

  async getWeakAreas(userEmail: string): Promise<WeakArea[]> {
    // Praxis weak areas = subtests with lowest readiness (lowest coverage/mastery)
    const row = await getPraxisProfileRow(userEmail);
    if (!row) return [];
    const { progress } = row;
    const subtests = PRAXIS_SUBTEST_ORDER.map((s) => ({
      id: s,
      readiness: subtestReadiness(progress, s),
    })).sort((a, b) => a.readiness.scaled - b.readiness.scaled);
    // Top 3 weakest subtests
    return subtests.slice(0, 3).map((s) => ({
      label: s.id.replace(/-/g, " "),
      missCount: Math.round((1 - s.readiness.mastery) * 10),
      lastMissedAt: null,
    }));
  },

  async getDueItems(userEmail: string): Promise<DueItem[]> {
    // Praxis has no SRS due-dates like Latin; return empty.
    // (Deadline is tracked as a static fact in the UI, not a per-item due date.)
    return [];
  },

  async getSummaryForProfile(userEmail: string): Promise<SubjectSnapshot> {
    const row = await getPraxisProfileRow(userEmail);
    if (!row) {
      return {
        subjectId: "praxis",
        accuracy: null,
        sampleSize: 0,
        weakAreas: [],
        dueCount: 0,
        lastActivityAt: null,
      };
    }

    const { progress, accuracy, lastActivityAt } = row;
    return {
      subjectId: "praxis",
      accuracy: progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : null,
      sampleSize: progress.totalAnswered,
      weakAreas: await praxisProgressAdapter.getWeakAreas(userEmail),
      dueCount: 0, // Praxis has no per-item due dates
      lastActivityAt,
    };
  },
};
