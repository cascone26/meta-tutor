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

export async function getPrepTasks(userEmail: string): Promise<PrepAssignment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mt_learner_profile")
    .select("weak_areas")
    .eq("user_email", userEmail)
    .eq("subject_id", PREP_TASKS_SUBJECT)
    .maybeSingle();
  if (error || !data) return [];
  const arr = (data as { weak_areas: unknown }).weak_areas;
  return Array.isArray(arr) ? (arr as PrepAssignment[]) : [];
}

export async function savePrepTasks(userEmail: string, tasks: PrepAssignment[]): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("mt_learner_profile").upsert(
    {
      user_email: userEmail,
      subject_id: PREP_TASKS_SUBJECT,
      weak_areas: tasks,
      due_count: tasks.filter((t) => !t.done).length,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_email,subject_id" }
  );
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
