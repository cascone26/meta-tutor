import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabase } from "@/lib/supabase";
import { rcaClasses } from "@/lib/rca";
import { computeStreak } from "@/lib/rca-streak";

type HistoryRow = { subject: string; weak_categories: string[]; created_at: string };

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const subjects = rcaClasses.map((c) => `rca-${c.id}`);
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("mt_quiz_history")
    .select("subject, weak_categories, created_at")
    .eq("user_email", session.user.email)
    .in("subject", subjects)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[rca-progress GET]", error);
    return new Response("Failed to load progress", { status: 500 });
  }

  const rows = (data || []) as HistoryRow[];
  const dates = rows.map((r) => new Date(r.created_at));
  const streak = computeStreak(dates);

  const dayKeys = new Set(dates.map((d) => d.toDateString()));
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    d.setHours(0, 0, 0, 0);
    return { date: d.toISOString().slice(0, 10), weekday: d.toLocaleDateString("en-US", { weekday: "narrow" }), active: dayKeys.has(d.toDateString()) };
  });

  const catCounts: Record<string, number> = {};
  for (const r of rows.slice(0, 40)) {
    for (const c of r.weak_categories || []) catCounts[c] = (catCounts[c] || 0) + 1;
  }
  const topWeakAreas = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c);

  return NextResponse.json({ streak, last14, totalSessions: rows.length, topWeakAreas });
}
