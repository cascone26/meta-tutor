import { NextRequest, NextResponse } from "next/server";
import { sessionEmail } from "@/lib/dev-auth";
import { buildAllItems } from "@/lib/ff-latin/content";
import { gradeExact, isExactType, type DrillItem } from "@/lib/ff-latin/items";
import { getMastery, computeStats, dueCards, reviewItem } from "@/lib/ff-latin/mastery-store";

// First Form Latin drill for JACOB — adaptive (FSRS) production practice grounded in his
// real quizzes. Three modes:
//   adaptive : due weak items across all lessons, cumulative
//   jit      : same but capped to lessons ≤ ?lesson (prep the next class)
//   quiz     : every item of one specific quiz (?lesson=N) — the "take the real quiz cold" gate
// Grading is deterministic for exact-answer types (vocab/saying/conjugate/decline); the
// client never receives answers until it POSTs one back.

const ALL_ITEMS: DrillItem[] = buildAllItems();
const BY_KEY = new Map(ALL_ITEMS.map((i) => [i.key, i]));

// Lessons that actually have drillable items, for the client's quiz/JIT lesson picker.
const LESSONS_WITH_ITEMS = [...new Set(ALL_ITEMS.map((i) => i.lesson))].sort((a, b) => a - b);

function stripAnswer(i: DrillItem) {
  return { key: i.key, lesson: i.lesson, itemType: i.itemType, prompt: i.prompt, direction: i.direction };
}

export async function GET(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "adaptive";
  const lessonParam = url.searchParams.get("lesson");
  const lesson = lessonParam ? parseInt(lessonParam, 10) : undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "12", 10) || 12, 40);

  const cards = await getMastery(userEmail);
  const stats = computeStats(cards);

  let batch: DrillItem[];
  if (mode === "quiz") {
    // Every item of the specified quiz, in order — the real-quiz mastery gate.
    batch = ALL_ITEMS.filter((i) => i.lesson === lesson);
  } else {
    // Adaptive / JIT: due tracked items first (weak spots resurfacing), then unseen items
    // (never drilled) to grow coverage, capped to lesson ≤ `lesson` in JIT mode.
    const now = new Date();
    const due = dueCards(cards, mode === "jit" ? lesson : undefined, now)
      .map((c) => BY_KEY.get(c.key))
      .filter((i): i is DrillItem => !!i);
    const seen = new Set(cards.map((c) => c.key));
    const fresh = ALL_ITEMS.filter(
      (i) => !seen.has(i.key) && (mode !== "jit" || lesson === undefined || i.lesson <= lesson)
    );
    batch = [...due, ...fresh].slice(0, limit);
  }

  return NextResponse.json({
    mode,
    lesson: lesson ?? null,
    stats,
    total: ALL_ITEMS.length,
    lessons: LESSONS_WITH_ITEMS,
    items: batch.map(stripAnswer),
    quizItemCount: mode === "quiz" ? batch.length : undefined,
  });
}

export async function POST(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  let body: { key?: string; answer?: string; selfRating?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  const item = body.key ? BY_KEY.get(body.key) : undefined;
  if (!item) return new Response("Unknown item", { status: 400 });

  if (isExactType(item.itemType)) {
    const result = gradeExact(item, body.answer ?? "");
    await reviewItem(userEmail, item.key, item.itemType, item.lesson, result.correct ? "Good" : "Again");
    return NextResponse.json({ correct: result.correct, near: result.near, expected: result.expected });
  }

  // parse/translate: accept the learner's self-rating (honest self-check) — still records FSRS.
  // (An AI grader can be layered here later; the exact key answer is shown for self-comparison.)
  const rating = body.selfRating === "got" ? "Good" : "Again";
  await reviewItem(userEmail, item.key, item.itemType, item.lesson, rating);
  return NextResponse.json({ correct: rating === "Good", near: false, expected: item.answer });
}
