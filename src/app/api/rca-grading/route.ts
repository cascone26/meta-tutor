import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabase } from "@/lib/supabase";

// "Did I grade this yet" checklist for real detected assessment items
// (Test/Investigation/Homework Check) — see getGradableItems in rca-upcoming.ts.
// Only rows that are actually checked get stored (absence = not done), so this
// stays small regardless of how many gradable items exist across a year.

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const prefix = new URL(req.url).searchParams.get("prefix"); // e.g. "saxon-76#"
  const supabase = getSupabase();
  let query = supabase.from("mt_rca_grading_checklist").select("item_key, done").eq("user_email", session.user.email);
  if (prefix) query = query.like("item_key", `${prefix}%`);
  const { data, error } = await query;

  if (error) {
    console.error("[rca-grading GET]", error);
    return new Response("Failed to load checklist", { status: 500 });
  }

  const done: Record<string, boolean> = {};
  for (const row of data || []) done[row.item_key] = row.done;
  return NextResponse.json({ done });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { itemKey, done } = await req.json();
  if (!itemKey || typeof done !== "boolean") return new Response("Missing/invalid itemKey or done", { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase.from("mt_rca_grading_checklist").upsert(
    { user_email: session.user.email, item_key: itemKey, done, updated_at: new Date().toISOString() },
    { onConflict: "user_email,item_key" }
  );

  if (error) {
    console.error("[rca-grading POST]", error);
    return new Response("Failed to save checklist item", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
