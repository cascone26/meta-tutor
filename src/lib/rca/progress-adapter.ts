// RCA's SubjectProgressAdapter (Tutor Core Phase 6) — the second implementation, proving
// the interface isn't Latin-specific. Aggregates across all of Jacob's rca-{classId}
// subject keys (same list rca-progress/route.ts already queries) into one "rca" entry
// in the cross-subject profile — per-class breakdown stays inside the RCA area itself,
// this is just the roll-up. No SRS/due concept exists for RCA today, so getDueItems()
// is always empty — that's honest, not a gap in this adapter.
import { getSupabase } from "@/lib/supabase";
import { rcaClasses } from "@/lib/rca";
import type { SubjectProgressAdapter } from "@/lib/tutor-core/progress-interface";
import type { WeakArea, DueItem, SubjectSnapshot } from "@/lib/tutor-core/types";

const ROLLING_WINDOW = 20; // matches computeWeakAreas() in /api/subject-progress

type HistoryRow = { percentage: number; weak_categories: string[]; created_at: string };

async function getRecentHistory(userEmail: string): Promise<HistoryRow[]> {
  const supabase = getSupabase();
  const subjects = rcaClasses.map((c) => `rca-${c.id}`);
  const { data } = await supabase
    .from("mt_quiz_history")
    .select("percentage, weak_categories, created_at")
    .eq("user_email", userEmail)
    .in("subject", subjects)
    .order("created_at", { ascending: false })
    .limit(ROLLING_WINDOW);
  return (data as HistoryRow[]) || [];
}

export const rcaProgressAdapter: SubjectProgressAdapter = {
  subjectId: "rca",

  async getWeakAreas(userEmail: string): Promise<WeakArea[]> {
    const rows = await getRecentHistory(userEmail);
    const counts: Record<string, number> = {};
    for (const r of rows) {
      for (const c of r.weak_categories || []) counts[c] = (counts[c] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, missCount]) => ({ label, missCount, lastMissedAt: null }));
  },

  async getDueItems(): Promise<DueItem[]> {
    return []; // RCA has no spaced-repetition concept yet
  },

  async getSummaryForProfile(userEmail: string): Promise<SubjectSnapshot> {
    const [rows, weakAreas] = await Promise.all([getRecentHistory(userEmail), rcaProgressAdapter.getWeakAreas(userEmail)]);
    const accuracy = rows.length > 0 ? rows.reduce((sum, r) => sum + r.percentage, 0) / rows.length / 100 : null;
    const lastActivityAt = rows[0]?.created_at ?? null; // already ordered desc

    return {
      subjectId: "rca",
      accuracy,
      sampleSize: rows.length,
      weakAreas,
      dueCount: 0,
      lastActivityAt,
    };
  },
};
