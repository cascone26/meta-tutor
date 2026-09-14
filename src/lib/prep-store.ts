// Server-only storage for the two features that would otherwise need new tables/columns
// (#7 reverse homework, #10 prep-contact). Since DDL isn't reachable with the credentials
// on hand (service_role key = PostgREST data-plane only, no CREATE TABLE/ALTER), both
// piggyback on the EXISTING mt_learner_profile table, which the service key can fully
// read/write. Data lives in synthetic, namespaced rows (subject_id starts with "__") whose
// jsonb `weak_areas` column holds the actual payload. getLearnerProfile() filters these
// synthetic rows out of the real per-subject list, so nothing user-facing sees them.
//
// This is a deliberate reuse, not a hack that loses data — if a real table ever becomes
// possible, these rows migrate 1:1. Only import from app/api/**/route.ts (or a local
// script via REST), same convention as the other tutor-core server modules.
import { getSupabase } from "@/lib/supabase";

export const PREP_TASKS_SUBJECT = "__prep_tasks__";
export const PREP_CONTACT_SUBJECT = "__prep_contact__";

/** True for the synthetic rows this module owns — used to hide them from real subject lists. */
export function isSyntheticSubject(subjectId: string): boolean {
  return subjectId.startsWith("__");
}

export type PrepAssignment = {
  id: string;
  subject_id: string;
  lesson_n: number | null;
  task: string;
  rationale: string | null;
  due_date: string | null;
  done: boolean;
  created_at: string;
};

async function readPrepRow(userEmail: string): Promise<{ tasks: PrepAssignment[]; updatedAt: string | null }> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("mt_learner_profile")
    .select("weak_areas, updated_at")
    .eq("user_email", userEmail)
    .eq("subject_id", PREP_TASKS_SUBJECT)
    .maybeSingle();
  if (!data) return { tasks: [], updatedAt: null };
  const row = data as { weak_areas: unknown; updated_at: string | null };
  return {
    tasks: Array.isArray(row.weak_areas) ? (row.weak_areas as PrepAssignment[]) : [],
    updatedAt: row.updated_at ?? null,
  };
}

export async function getPrepTasks(userEmail: string): Promise<PrepAssignment[]> {
  return (await readPrepRow(userEmail)).tasks;
}

// Read-modify-write with optimistic concurrency, so concurrent generate/toggle/delete
// requests can't silently clobber each other (the store is a single jsonb row, so a naive
// upsert would lose whichever write landed first). Uses the existing updated_at column as a
// version stamp — no DDL. `mutate` receives the current task list and returns the new one;
// on a lost CAS race we re-read and re-apply, up to a few tries.
export async function mutatePrepTasks(
  userEmail: string,
  mutate: (tasks: PrepAssignment[]) => PrepAssignment[]
): Promise<PrepAssignment[]> {
  const supabase = getSupabase();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { tasks, updatedAt } = await readPrepRow(userEmail);
    const next = mutate(tasks);
    const stamp = new Date().toISOString();
    const payload = {
      user_email: userEmail,
      subject_id: PREP_TASKS_SUBJECT,
      weak_areas: next,
      due_count: next.filter((t) => !t.done).length,
      updated_at: stamp,
    };

    if (updatedAt === null) {
      // No row yet — insert. If someone else inserted first, this conflicts → retry as update.
      const { error } = await supabase.from("mt_learner_profile").insert(payload);
      if (!error) return next;
      // 23505 = unique_violation (row now exists) → loop and take the update path.
      if ((error as { code?: string }).code !== "23505") throw error;
      continue;
    }

    // Row exists — conditional update guarded on the version we read. select() returns the
    // affected rows; an empty result means another writer moved updated_at → re-read & retry.
    const { data, error } = await supabase
      .from("mt_learner_profile")
      .update(payload)
      .eq("user_email", userEmail)
      .eq("subject_id", PREP_TASKS_SUBJECT)
      .eq("updated_at", updatedAt)
      .select("subject_id");
    if (error) throw error;
    if (data && data.length > 0) return next;
    // Lost the race — loop re-reads the now-newer row and re-applies mutate.
  }
  throw new Error("prep-tasks write kept losing the optimistic-lock race");
}

export type PrepContact = {
  prepContactMinutes7d: number | null;
  topPrepApps: { app: string; minutes: number }[] | null;
};

export async function getPrepContact(userEmail: string): Promise<PrepContact> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("mt_learner_profile")
    .select("due_count, weak_areas")
    .eq("user_email", userEmail)
    .eq("subject_id", PREP_CONTACT_SUBJECT)
    .maybeSingle();
  if (!data) return { prepContactMinutes7d: null, topPrepApps: null };
  const row = data as { due_count: number | null; weak_areas: unknown };
  return {
    prepContactMinutes7d: typeof row.due_count === "number" ? row.due_count : null,
    topPrepApps: Array.isArray(row.weak_areas) ? (row.weak_areas as { app: string; minutes: number }[]) : null,
  };
}
