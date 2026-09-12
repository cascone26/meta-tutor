import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { sessionEmail } from "@/lib/dev-auth";
import { getSupabase } from "@/lib/supabase";
import { getRcaClass, currentLessonNumber, prepAheadLessonRange, nextTeachingDate, centralToday } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { getTeacherWatchFor } from "@/lib/rca-content/teacher-watchfor";

// "Reverse homework": the app assigns Jacob (the teacher) concrete, dated prep
// tasks for the lesson he should be prepping AHEAD to — turning the standing
// "stay a week ahead" rule (prepAheadLessonRange in rca.ts, today only a passive
// banner in LessonViewer) into a real, checkable, due-dated to-do list. Tasks are
// AI-generated but grounded in the real lesson content + his own Teacher's Guide
// watch-for, then stored so they persist and can be checked off / correlate into
// the learner profile later.
export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

function dueDateISO(): string {
  // Prep is "due before the next time he's in front of kids."
  const d = nextTeachingDate() ?? centralToday();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// GET — all assignments for the user, open first, each sorted by due date.
export async function GET(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mt_prep_assignments")
    .select("id, subject_id, lesson_n, task, rationale, due_date, done, created_at")
    .eq("user_email", userEmail)
    .order("done", { ascending: true })
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[prep-assignments GET]", error);
    return new Response("Failed to load prep assignments", { status: 500 });
  }
  return NextResponse.json({ assignments: data || [] });
}

// POST { subjectId } — generate 2-3 grounded prep tasks for the prep-ahead lesson.
export async function POST(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const { subjectId } = await req.json();
  const klass = getRcaClass(subjectId);
  const content = rcaContent[subjectId];
  if (!klass || !content) return new Response("Unknown or contentless subject", { status: 400 });

  const total = content.lessons.length;
  // The lesson kids reach ~1 week out is the one Jacob should have prepped by his
  // next class — that's what we build tasks around.
  const { in1WeekN } = prepAheadLessonRange(total, content.totalWeeks ?? total);
  const targetN = Math.min(total, Math.max(currentLessonNumber(total, content.totalWeeks), in1WeekN));
  const lesson = content.lessons.find((l) => l.n === targetN);
  const watch = getTeacherWatchFor(subjectId, targetN);

  const lessonText = lesson
    ? lesson.sections.map((s) => `${s.label}: ${s.text}`).join("\n")
    : "(no structured lesson content on file for this lesson)";

  const prompt = `You are generating a short prep to-do list for Jacob, the TEACHER (not a student), for his upcoming ${klass.name} class at Regina Caeli Academy. He follows a standing rule: always be at least a week ahead of the students.

The lesson he should prep to is Lesson ${targetN}${total ? ` of ${total}` : ""}. Its content:
${lessonText}
${watch ? `\nThe one thing his own Teacher's Guide flags to watch for here — "${watch.title}": ${watch.watchFor}` : ""}

Write 2 to 3 CONCRETE prep tasks for Jacob to do before he teaches this. Each must be a specific action he can actually check off (e.g. "Work all 8 practice problems in Lesson ${targetN} yourself so you can model #6's two-step setup", not "review the lesson"). Ground them in the real content above. Tasks should build HIS readiness and anticipate where students struggle.

Respond with ONLY a JSON array, no prose, no markdown fences. Each element: {"task": "...", "rationale": "one short sentence on why this matters"}.`;

  let tasks: { task: string; rationale?: string }[] = [];
  try {
    const msg = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("");
    // Be defensive: strip any accidental fences, grab the first JSON array.
    const cleaned = text.replace(/```json\s*|```/g, "").trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(match ? match[0] : cleaned);
    if (Array.isArray(parsed)) {
      tasks = parsed
        .filter((t) => t && typeof t.task === "string" && t.task.trim())
        .slice(0, 3)
        .map((t) => ({ task: String(t.task).trim(), rationale: t.rationale ? String(t.rationale).trim() : undefined }));
    }
  } catch (e) {
    console.error("[prep-assignments POST] generation failed:", e);
    return new Response("Failed to generate prep tasks", { status: 502 });
  }

  if (tasks.length === 0) return new Response("No tasks generated", { status: 502 });

  const due = dueDateISO();
  const rows = tasks.map((t) => ({
    user_email: userEmail,
    subject_id: subjectId,
    lesson_n: targetN,
    task: t.task,
    rationale: t.rationale ?? null,
    due_date: due,
    done: false,
  }));

  const supabase = getSupabase();
  const { data, error } = await supabase.from("mt_prep_assignments").insert(rows).select();
  if (error) {
    console.error("[prep-assignments POST] insert:", error);
    return new Response("Failed to save prep tasks", { status: 500 });
  }
  return NextResponse.json({ assignments: data, lessonN: targetN, subject: klass.name });
}

// PATCH { id, done } — check off / un-check a task.
export async function PATCH(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const { id, done } = await req.json();
  if (!id || typeof done !== "boolean") return new Response("Missing/invalid id or done", { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase
    .from("mt_prep_assignments")
    .update({ done })
    .eq("id", id)
    .eq("user_email", userEmail);
  if (error) {
    console.error("[prep-assignments PATCH]", error);
    return new Response("Failed to update task", { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE { id } — remove a task entirely.
export async function DELETE(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  if (!id) return new Response("Missing id", { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase
    .from("mt_prep_assignments")
    .delete()
    .eq("id", id)
    .eq("user_email", userEmail);
  if (error) {
    console.error("[prep-assignments DELETE]", error);
    return new Response("Failed to delete task", { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
