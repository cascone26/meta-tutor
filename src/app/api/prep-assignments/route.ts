import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";
import { sessionEmail } from "@/lib/dev-auth";
import { getRcaClass, currentLessonNumber, prepAheadLessonRange, nextTeachingDate, centralToday } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { getTeacherWatchFor } from "@/lib/rca-content/teacher-watchfor";
import { getPrepTasks, mutatePrepTasks, type PrepAssignment } from "@/lib/prep-store";

// "Reverse homework": the app assigns Jacob (the teacher) concrete, dated prep tasks for
// the lesson he should be prepping AHEAD to — turning the standing "stay a week ahead" rule
// (prepAheadLessonRange in rca.ts) into a real, checkable, due-dated to-do list. Tasks are
// AI-generated but grounded in the real lesson content + his own Teacher's Guide watch-for.
//
// Storage: the mt_learner_profile table's jsonb column (see prep-store.ts) instead of a
// dedicated table — DDL isn't reachable with the service_role key, so this reuses an
// existing table the key can fully write. Fully functional, no migration required.
export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

function dueDateISO(): string {
  const d = nextTeachingDate() ?? centralToday();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sortTasks(tasks: PrepAssignment[]): PrepAssignment[] {
  return tasks.slice().sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const ad = a.due_date || "", bd = b.due_date || "";
    if (ad !== bd) return ad < bd ? -1 : 1;
    return (b.created_at || "") < (a.created_at || "") ? -1 : 1;
  });
}

// GET — all assignments for the user, open first, each sorted by due date.
export async function GET(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });
  try {
    const tasks = await getPrepTasks(userEmail);
    return NextResponse.json({ assignments: sortTasks(tasks) });
  } catch (e) {
    console.error("[prep-assignments GET]", e);
    return new Response("Failed to load prep assignments", { status: 500 });
  }
}

// POST { subjectId } — generate 2-3 grounded prep tasks for the prep-ahead lesson.
export async function POST(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  let subjectId: string;
  try {
    ({ subjectId } = await req.json());
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  const klass = getRcaClass(subjectId);
  const content = rcaContent[subjectId];
  if (!klass || !content) return new Response("Unknown or contentless subject", { status: 400 });

  const total = content.lessons.length;
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

  let generated: { task: string; rationale?: string }[] = [];
  try {
    const msg = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("");
    const cleaned = text.replace(/```json\s*|```/g, "").trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(match ? match[0] : cleaned);
    if (Array.isArray(parsed)) {
      generated = parsed
        .filter((t) => t && typeof t.task === "string" && t.task.trim())
        .slice(0, 3)
        .map((t) => ({ task: String(t.task).trim(), rationale: t.rationale ? String(t.rationale).trim() : undefined }));
    }
  } catch (e) {
    console.error("[prep-assignments POST] generation failed:", e);
    return new Response("Failed to generate prep tasks", { status: 502 });
  }

  if (generated.length === 0) return new Response("No tasks generated", { status: 502 });

  const due = dueDateISO();
  const now = new Date().toISOString();
  const newTasks: PrepAssignment[] = generated.map((t) => ({
    id: randomUUID(),
    subject_id: subjectId,
    lesson_n: targetN,
    task: t.task,
    rationale: t.rationale ?? null,
    due_date: due,
    done: false,
    created_at: now,
  }));

  try {
    const all = await mutatePrepTasks(userEmail, (existing) => [...newTasks, ...existing]);
    return NextResponse.json({ assignments: sortTasks(all), lessonN: targetN, subject: klass.name });
  } catch (e) {
    console.error("[prep-assignments POST] save:", e);
    return new Response("Failed to save prep tasks", { status: 500 });
  }
}

// PATCH { id, done } — check off / un-check a task.
export async function PATCH(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  let id: string, done: boolean;
  try {
    ({ id, done } = await req.json());
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  if (!id || typeof done !== "boolean") return new Response("Missing/invalid id or done", { status: 400 });

  await mutatePrepTasks(userEmail, (tasks) => tasks.map((t) => (t.id === id ? { ...t, done } : t)));
  return NextResponse.json({ ok: true });
}

// DELETE { id } — remove a task entirely.
export async function DELETE(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  let id: string;
  try {
    ({ id } = await req.json());
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  if (!id) return new Response("Missing id", { status: 400 });

  await mutatePrepTasks(userEmail, (tasks) => tasks.filter((t) => t.id !== id));
  return NextResponse.json({ ok: true });
}
