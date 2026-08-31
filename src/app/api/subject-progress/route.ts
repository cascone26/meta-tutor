import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabase } from "@/lib/supabase";
import { rcaProgressAdapter } from "@/lib/rca/progress-adapter";
import { upsertSubjectSnapshot } from "@/lib/tutor-core/profile-aggregator";

// This route is shared by every rca-{classId} subject (Jacob) AND "metaphysics"
// (Cristian) — only sync into the learner profile for subjects that have adopted a
// SubjectProgressAdapter (RCA, as of Phase 6). Cristian's Metaphysics has none yet, so
// his writes here are completely unaffected — no adapter forced on him.
async function syncLearnerProfileIfAdopted(userEmail: string, subject: string): Promise<void> {
  if (!subject.startsWith("rca-")) return;
  try {
    const snapshot = await rcaProgressAdapter.getSummaryForProfile(userEmail);
    await upsertSubjectSnapshot(userEmail, snapshot);
  } catch (e) {
    console.error("Failed to sync learner profile:", e);
  }
}

type WrongAnswerRow = {
  term: string;
  definition: string | null;
  category: string | null;
  count: number;
  last_wrong: string;
  modes: string[];
};

type HistoryRow = {
  mode: string;
  score: number;
  total: number;
  percentage: number;
  weak_terms: string[];
  weak_categories: string[];
  created_at: string;
};

function computeWeakAreas(history: HistoryRow[]) {
  const recent = history.slice(0, 20);
  const termCounts: Record<string, number> = {};
  const catCounts: Record<string, number> = {};
  for (const r of recent) {
    for (const t of r.weak_terms || []) termCounts[t] = (termCounts[t] || 0) + 1;
    for (const c of r.weak_categories || []) catCounts[c] = (catCounts[c] || 0) + 1;
  }
  const terms = Object.entries(termCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
  const categories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c);
  return { terms, categories };
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const subject = new URL(req.url).searchParams.get("subject");
  if (!subject) return new Response("Missing subject", { status: 400 });

  const supabase = getSupabase();
  const userEmail = session.user.email;

  const [{ data: wrongAnswers, error: waErr }, { data: history, error: hErr }] = await Promise.all([
    supabase
      .from("mt_wrong_answers")
      .select("term, definition, category, count, last_wrong, modes")
      .eq("user_email", userEmail)
      .eq("subject", subject)
      .order("count", { ascending: false }),
    supabase
      .from("mt_quiz_history")
      .select("mode, score, total, percentage, weak_terms, weak_categories, created_at")
      .eq("user_email", userEmail)
      .eq("subject", subject)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (waErr || hErr) {
    console.error("[subject-progress GET]", waErr || hErr);
    return new Response("Failed to load progress", { status: 500 });
  }

  return NextResponse.json({
    wrongAnswers: (wrongAnswers || []) as WrongAnswerRow[],
    history: (history || []) as HistoryRow[],
    weakAreas: computeWeakAreas((history || []) as HistoryRow[]),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const userEmail = session.user.email;
  const supabase = getSupabase();
  const body = await req.json();
  const { action, subject } = body;

  if (!subject) return new Response("Missing subject", { status: 400 });

  if (action === "logWrongAnswer") {
    const { term, definition, category, mode } = body;
    const { data: existing } = await supabase
      .from("mt_wrong_answers")
      .select("count, modes")
      .eq("user_email", userEmail)
      .eq("subject", subject)
      .eq("term", term)
      .maybeSingle();

    if (existing) {
      const modes = existing.modes.includes(mode) ? existing.modes : [...existing.modes, mode];
      const { error } = await supabase
        .from("mt_wrong_answers")
        .update({ count: existing.count + 1, last_wrong: new Date().toISOString(), modes })
        .eq("user_email", userEmail)
        .eq("subject", subject)
        .eq("term", term);
      if (error) return new Response("Failed to update", { status: 500 });
    } else {
      const { error } = await supabase.from("mt_wrong_answers").insert({
        user_email: userEmail,
        subject,
        term,
        definition,
        category,
        count: 1,
        modes: [mode],
      });
      if (error) return new Response("Failed to insert", { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "saveResult") {
    const { result } = body;
    const { error } = await supabase.from("mt_quiz_history").insert({
      user_email: userEmail,
      subject,
      mode: result.mode,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      weak_terms: result.weakTerms || [],
      weak_categories: result.weakCategories || [],
    });
    if (error) return new Response("Failed to save result", { status: 500 });
    await syncLearnerProfileIfAdopted(userEmail, subject);
    return NextResponse.json({ ok: true });
  }

  if (action === "clearWrongAnswer") {
    const { term } = body;
    const { error } = await supabase
      .from("mt_wrong_answers")
      .delete()
      .eq("user_email", userEmail)
      .eq("subject", subject)
      .eq("term", term);
    if (error) return new Response("Failed to clear", { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return new Response("Unknown action", { status: 400 });
}
