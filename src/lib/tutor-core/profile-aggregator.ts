// Server-only. Reads/writes mt_learner_profile — one row per (user, subject), written by
// each subject's own progress route after it writes its own subject-specific tables (see
// src/lib/latin-lab/progress-adapter.ts, Phase 5). Only ever import from an
// app/api/**/route.ts file, same convention as src/lib/latin-lab/server-progress.ts.
import { getSupabase } from "@/lib/supabase";
import { getPrepContact, isSyntheticSubject } from "@/lib/prep-store";
import type { SubjectSnapshot, LearnerProfile, AmbientInsight } from "./types";

type ProfileRow = {
  subject_id: string;
  accuracy: number | null;
  sample_size: number;
  weak_areas: SubjectSnapshot["weakAreas"];
  due_count: number;
  last_activity_at: string | null;
  updated_at: string;
};

type AmbientInsightRow = {
  peak_focus_hour: number | null;
  avg_session_minutes: number | null;
  sample_days: number;
  computed_at: string;
};

async function getAmbientInsight(userEmail: string): Promise<AmbientInsight | null> {
  const supabase = getSupabase();
  // peak-focus/session live in mt_ambient_insights; prep-contact lives in a synthetic
  // mt_learner_profile row (see prep-store.ts — no new columns needed since DDL isn't
  // reachable with the service key). Fetch both and merge.
  const [{ data }, prep] = await Promise.all([
    supabase
      .from("mt_ambient_insights")
      .select("peak_focus_hour, avg_session_minutes, sample_days, computed_at")
      .eq("user_email", userEmail)
      .maybeSingle(),
    getPrepContact(userEmail),
  ]);

  if (!data && prep.prepContactMinutes7d === null) return null;
  const row = (data || {}) as Partial<AmbientInsightRow>;
  return {
    peakFocusHour: row.peak_focus_hour ?? null,
    avgSessionMinutes: row.avg_session_minutes ?? null,
    sampleDays: row.sample_days ?? 0,
    prepContactMinutes7d: prep.prepContactMinutes7d,
    topPrepApps: prep.topPrepApps,
    computedAt: row.computed_at ?? new Date().toISOString(),
  };
}

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
  const [{ data }, ambientInsight] = await Promise.all([
    supabase
      .from("mt_learner_profile")
      .select("subject_id, accuracy, sample_size, weak_areas, due_count, last_activity_at, updated_at")
      .eq("user_email", userEmail),
    getAmbientInsight(userEmail),
  ]);

  // Drop the synthetic rows prep-store.ts uses for prep tasks / prep-contact — they
  // aren't real learnable subjects and must never show in the profile's subject list.
  const rows = ((data || []) as ProfileRow[]).filter((r) => !isSyntheticSubject(r.subject_id));
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

  return { userEmail, subjects, ambientInsight, updatedAt };
}
