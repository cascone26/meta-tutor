// Generic optimistic-locked read-modify-write for a single synthetic mt_learner_profile
// row (subject_id starts with "__"), used to store feature data as jsonb without any DDL
// (the service_role key can't CREATE TABLE — see prep-store.ts / STATUS.md for the whole
// story). The payload lives in the jsonb `weak_areas` column; `updated_at` is the version
// stamp for compare-and-swap so concurrent writers can't clobber each other.
import { getSupabase } from "@/lib/supabase";

async function readDoc<T>(userEmail: string, subjectId: string): Promise<{ items: T[]; updatedAt: string | null }> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("mt_learner_profile")
    .select("weak_areas, updated_at")
    .eq("user_email", userEmail)
    .eq("subject_id", subjectId)
    .maybeSingle();
  if (!data) return { items: [], updatedAt: null };
  const row = data as { weak_areas: unknown; updated_at: string | null };
  return { items: Array.isArray(row.weak_areas) ? (row.weak_areas as T[]) : [], updatedAt: row.updated_at ?? null };
}

export async function readJsonbDoc<T>(userEmail: string, subjectId: string): Promise<T[]> {
  return (await readDoc<T>(userEmail, subjectId)).items;
}

/** Read → apply `mutate` → conditional write, retrying on a lost optimistic-lock race. */
export async function mutateJsonbDoc<T>(
  userEmail: string,
  subjectId: string,
  mutate: (items: T[]) => T[],
  dueCount?: (items: T[]) => number
): Promise<T[]> {
  const supabase = getSupabase();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { items, updatedAt } = await readDoc<T>(userEmail, subjectId);
    const next = mutate(items);
    const stamp = new Date().toISOString();
    const payload = {
      user_email: userEmail,
      subject_id: subjectId,
      weak_areas: next,
      due_count: dueCount ? dueCount(next) : 0,
      updated_at: stamp,
    };
    if (updatedAt === null) {
      const { error } = await supabase.from("mt_learner_profile").insert(payload);
      if (!error) return next;
      if ((error as { code?: string }).code !== "23505") throw error; // not a dup → real error
      continue; // row appeared concurrently → retry as update
    }
    const { data, error } = await supabase
      .from("mt_learner_profile")
      .update(payload)
      .eq("user_email", userEmail)
      .eq("subject_id", subjectId)
      .eq("updated_at", updatedAt)
      .select("subject_id");
    if (error) throw error;
    if (data && data.length > 0) return next;
    // lost the race → loop re-reads and re-applies
  }
  throw new Error(`jsonb-store CAS kept losing the race for ${subjectId}`);
}
