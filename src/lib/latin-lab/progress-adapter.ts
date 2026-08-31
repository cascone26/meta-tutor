// Latin Lab's SubjectProgressAdapter — the pilot implementation (Tutor Core Phase 5).
// A thin bridge, not new tracking: reads exactly what mt_latin_vocab_state and
// mt_latin_comprehension already store, via the existing FSRS engine and
// getWeakGrammarTags()/getRollingAccuracy() from server-progress.ts. Latin's FSRS state
// itself is untouched — this only produces the summary shape the learner profile wants.
import { getSupabase } from "@/lib/supabase";
import { isDue, type FsrsCardState } from "./fsrs";
import { getRollingAccuracy, getWeakGrammarTags } from "./server-progress";
import type { SubjectProgressAdapter } from "@/lib/tutor-core/progress-interface";
import type { WeakArea, DueItem, SubjectSnapshot } from "@/lib/tutor-core/types";

type VocabStateRow = { vocab_item: string; unit_id: string; fsrs_state: FsrsCardState; due: string; updated_at: string };

async function getVocabRows(userEmail: string): Promise<VocabStateRow[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("mt_latin_vocab_state")
    .select("vocab_item, unit_id, fsrs_state, due, updated_at")
    .eq("user_email", userEmail);
  return (data as VocabStateRow[]) || [];
}

export const latinLabProgressAdapter: SubjectProgressAdapter = {
  subjectId: "latin-lab",

  async getWeakAreas(userEmail: string): Promise<WeakArea[]> {
    const tags = await getWeakGrammarTags(userEmail);
    return tags.map((t) => ({ label: t.tag.replace(/-/g, " "), missCount: t.missCount, lastMissedAt: null }));
  },

  async getDueItems(userEmail: string): Promise<DueItem[]> {
    const rows = await getVocabRows(userEmail);
    const now = new Date();
    return rows.filter((r) => isDue(r.fsrs_state, now)).map((r) => ({ id: r.vocab_item, label: r.vocab_item, dueAt: r.due }));
  },

  async getSummaryForProfile(userEmail: string): Promise<SubjectSnapshot> {
    const [rows, accuracy, weakAreas] = await Promise.all([
      getVocabRows(userEmail),
      getRollingAccuracy(userEmail),
      latinLabProgressAdapter.getWeakAreas(userEmail),
    ]);
    const now = new Date();
    const dueCount = rows.filter((r) => isDue(r.fsrs_state, now)).length;
    const lastActivityAt = rows.reduce<string | null>(
      (latest, r) => (!latest || r.updated_at > latest ? r.updated_at : latest),
      null
    );

    return {
      subjectId: "latin-lab",
      accuracy: accuracy.sampleSize > 0 ? accuracy.accuracy : null,
      sampleSize: accuracy.sampleSize,
      weakAreas: weakAreas.slice(0, 5),
      dueCount,
      lastActivityAt,
    };
  },
};
