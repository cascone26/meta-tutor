// Server-only. Reads/writes mt_learner_profile — one row per (user, subject), written by
// each subject's own progress route after it writes its own subject-specific tables (see
// src/lib/latin-lab/progress-adapter.ts, Phase 5). Only ever import from an
// app/api/**/route.ts file, same convention as src/lib/latin-lab/server-progress.ts.
import { getSupabase } from "@/lib/supabase";
import type { SubjectSnapshot, LearnerProfile } from "./types";

type ProfileRow = {
  subject_id: string;
  accuracy: number | null;
  sample_size: number;
  weak_areas: SubjectSnapshot["weakAreas"];
  due_count: number;
  last_activity_at: string | null;
  updated_at: string;
};

export async function upsertSubjectSnapshot(userEmail: string, snapshot: SubjectSnapshot): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("mt_learner_profile").upsert(
    {
      user_email: userEmail,
      subject_id: snapshot.subjectId,
      accuracy: snapshot.accuracy,
      sample_size: snapshot.sampleSize,
      weak_areas: snapshot.weakAreas,
      due_count: snapshot.dueCount,
      last_activity_at: snapshot.lastActivityAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_email,subject_id" }
  );
}

export async function getLearnerProfile(userEmail: string): Promise<LearnerProfile> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("mt_learner_profile")
    .select("subject_id, accuracy, sample_size, weak_areas, due_count, last_activity_at, updated_at")
    .eq("user_email", userEmail);

  const rows = (data || []) as ProfileRow[];
  const subjects: SubjectSnapshot[] = rows.map((r) => ({
    subjectId: r.subject_id,
    accuracy: r.accuracy,
    sampleSize: r.sample_size,
    weakAreas: r.weak_areas || [],
    dueCount: r.due_count,
    lastActivityAt: r.last_activity_at,
  }));

  const updatedAt = rows.reduce(
    (latest, r) => (r.updated_at > latest ? r.updated_at : latest),
    rows[0]?.updated_at ?? new Date(0).toISOString()
  );

  return { userEmail, subjects, updatedAt };
}
