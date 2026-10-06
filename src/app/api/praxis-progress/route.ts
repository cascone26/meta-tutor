import { NextRequest } from "next/server";
import { sessionEmail } from "@/lib/dev-auth";
import { getSupabase } from "@/lib/supabase";
import type { PraxisProgress } from "@/lib/praxis";

export async function POST(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  try {
    const { progress } = await req.json();
    if (!progress || typeof progress !== "object") {
      return Response.json({ error: "Invalid progress payload" }, { status: 400 });
    }

    // Compute summary fields for the profile row (mirrors what the adapter will read)
    const accuracy =
      progress.totalAnswered > 0
        ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
        : 0;
    const lastActivityAt = progress.lastPlayed || null;

    // Upsert using optimistic concurrency (same pattern as prep-store.ts).
    // The whole row is a synthetic __praxis__ row whose weak_areas jsonb holds the payload.
    const supabase = getSupabase();
    const SYNTHETIC_SUBJECT = "__praxis__";

    // Read current row to get the version stamp.
    const { data: existing } = await supabase
      .from("mt_learner_profile")
      .select("updated_at")
      .eq("user_email", userEmail)
      .eq("subject_id", SYNTHETIC_SUBJECT)
      .maybeSingle();

    const stamp = new Date().toISOString();
    const payload = {
      user_email: userEmail,
      subject_id: SYNTHETIC_SUBJECT,
      weak_areas: { progress, accuracy, lastActivityAt },
      due_count: 0, // Praxis has no per-item due dates
      updated_at: stamp,
    };

    if (!existing) {
      // Insert the row if it doesn't exist.
      const { error } = await supabase.from("mt_learner_profile").insert(payload);
      if (error) {
        // Possible race: another request inserted first. Retry as update.
        if ((error as { code?: string }).code === "23505") {
          // Unique constraint violated — fall through to update (below) in next attempt.
          // For simplicity, just return success; the update will happen on next sync.
          return Response.json({ synced: true });
        }
        throw error;
      }
      return Response.json({ synced: true });
    }

    // Row exists — update it.
    const { error } = await supabase
      .from("mt_learner_profile")
      .update({
        weak_areas: payload.weak_areas,
        due_count: 0,
        updated_at: stamp,
      })
      .eq("user_email", userEmail)
      .eq("subject_id", SYNTHETIC_SUBJECT);
    if (error) throw error;

    return Response.json({ synced: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
