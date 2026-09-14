import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  rcaClasses,
  rcaSchedule,
  getClosure,
  rcaEvents,
  centralToday,
  currentLessonNumber,
  isPacingCurrent,
} from "@/lib/rca";
import { blockStartMinutes } from "@/lib/rca-upcoming";
import { rcaContent } from "@/lib/rca-content";
import { todaysLessonNumber } from "@/lib/rca-content/types";
import { getTeacherWatchFor } from "@/lib/rca-content/teacher-watchfor";
import { getSupabase } from "@/lib/supabase";

// Server-computed teaching-day brief — the single source for the teaching-morning
// notification (scripts/preclass-brief.mjs) so the pacing/lesson/watch-for logic
// lives in exactly one place (the same functions /rca/today's PacedLesson uses),
// never re-derived in a shell script. Deliberately GET-only and NOT session-gated:
// this is Jacob's single-teacher RCA data and the morning cron has no browser
// session — it reads his saved pacing offsets with the service key by email,
// same pattern as scripts/daily-nudge.mjs. Returns only his own lesson metadata
// (no other user's data is reachable here).
export const dynamic = "force-dynamic";

const JACOB_EMAIL = (process.env.JACOB_EMAIL ?? "cobo.cascone@gmail.com").toLowerCase();

async function getPacingOffsets(): Promise<Record<string, number>> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("mt_rca_pacing_override")
      .select("subject_id, lesson_offset")
      .eq("user_email", JACOB_EMAIL);
    const offsets: Record<string, number> = {};
    for (const row of data || []) offsets[row.subject_id] = row.lesson_offset;
    return offsets;
  } catch {
    // Best-effort — a missing offset just means the pure date-math estimate, same
    // as any page load where the pacing fetch fails.
    return {};
  }
}

export async function GET(req: Request) {
  // Reachable without a browser session (it's excluded from the middleware login
  // redirect in proxy.ts) so the teaching-morning cron can hit it — but guarded on a
  // shared token so it isn't actually public. When BRIEF_TOKEN is set (production), a
  // matching x-brief-token header is required; when it's unset (local dev), open.
  const secret = process.env.BRIEF_TOKEN;
  if (secret) {
    const got = Buffer.from(req.headers.get("x-brief-token") ?? "");
    const want = Buffer.from(secret);
    if (got.length !== want.length || !timingSafeEqual(got, want)) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const today = centralToday();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const closure = getClosure(today);
  const event = rcaEvents.find((e) => e.date === todayKey);
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
  const termEnd = new Date(rcaSchedule.termEnd + "T00:00:00");
  const inTerm = today >= termStart && today <= termEnd;
  const isTeachingWeekday = weekday === "Monday" || weekday === "Thursday";
  const isTeachingDay = inTerm && isTeachingWeekday && !closure && !event;

  if (!isTeachingDay) {
    const reason = !inTerm
      ? today < termStart
        ? `Term hasn't started yet (first day ${rcaSchedule.termStart}).`
        : `Term ended ${rcaSchedule.termEnd}.`
      : event
        ? `${event.label} — ${event.detail}`
        : closure
          ? `${closure.label} — no class${closure.estimated ? " (estimated)" : ""}.`
          : "Not a scheduled teaching day (Monday & Thursday only).";
    return NextResponse.json({ date: dateLabel, weekday, isTeachingDay: false, reason, classes: [] });
  }

  const offsets = await getPacingOffsets();

  const todaysClasses = rcaClasses
    .filter((c) => (c.days ?? rcaSchedule.days).includes(weekday as "Monday" | "Thursday"))
    .slice()
    .sort((a, b) => blockStartMinutes(a.block) - blockStartMinutes(b.block));

  const classes = todaysClasses.map((c) => {
    const content = rcaContent[c.id];
    let lessonN: number | null = null;
    let total: number | null = null;
    let pacingStale = false;
    let watch: { title: string; watchFor: string } | null = null;
    if (content) {
      total = content.lessons.length;
      const rawEstimate = todaysLessonNumber(
        content,
        currentLessonNumber(total, content.totalWeeks),
        weekday
      );
      lessonN = Math.min(total, Math.max(1, rawEstimate + (offsets[c.id] ?? 0)));
      pacingStale = !isPacingCurrent(content.totalWeeks ?? total);
      watch = getTeacherWatchFor(c.id, lessonN);
    }
    return {
      id: c.id,
      name: c.name,
      block: c.block ?? null,
      room: c.room ?? null,
      lessonN,
      total,
      pacingStale,
      watchFor: watch,
    };
  });

  const materials = Array.from(new Set(todaysClasses.flatMap((c) => c.books))).sort();

  return NextResponse.json({
    date: dateLabel,
    weekday,
    isTeachingDay: true,
    classCount: classes.length,
    hours: `${rcaSchedule.startTime}–${rcaSchedule.endTime}`,
    materials,
    classes,
  });
}
