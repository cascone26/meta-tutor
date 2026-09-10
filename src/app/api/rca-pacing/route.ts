import { NextRequest, NextResponse } from "next/server";
import { sessionEmail } from "@/lib/dev-auth";
import { getSupabase } from "@/lib/supabase";

// Per-subject lesson-number correction. currentLessonNumber() in rca.ts is pure
// date math from term start — it has no way to know a snow day, a slow lesson, or
// a closure Jacob didn't skip pushed the real class off that schedule. This lets
// him nudge the estimate back onto reality from the app instead of it silently
// drifting for the rest of the year.

export async function GET(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mt_rca_pacing_override")
    .select("subject_id, lesson_offset")
    .eq("user_email", userEmail);

  if (error) {
    console.error("[rca-pacing GET]", error);
    return new Response("Failed to load pacing overrides", { status: 500 });
  }

  const offsets: Record<string, number> = {};
  for (const row of data || []) offsets[row.subject_id] = row.lesson_offset;
  return NextResponse.json({ offsets });
}

export async function POST(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const { subjectId, offset } = await req.json();
  if (!subjectId || typeof offset !== "number" || !Number.isFinite(offset)) {
    return new Response("Missing/invalid subjectId or offset", { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("mt_rca_pacing_override").upsert(
    {
      user_email: userEmail,
      subject_id: subjectId,
      lesson_offset: offset,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_email,subject_id" }
  );

  if (error) {
    console.error("[rca-pacing POST]", error);
    return new Response("Failed to save pacing override", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
