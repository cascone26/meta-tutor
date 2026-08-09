import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { getRcaClass, rcaClasses, rcaSchedule, currentLessonNumber } from "@/lib/rca";
import { music34Overview, music34Lessons } from "@/lib/rca-content/music-3-4";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

function buildGeneralGrounding(): string {
  const list = rcaClasses.map((c) => `- ${c.name} (${c.grade}, ${c.area})`).join("\n");
  return `CONTEXT: Regina Caeli Academy (KSC, Overland Park KS) — a Catholic classical homeschool hybrid. Jacob is the 6th Grade Lead plus Music 3-4 / PE 3-4 / PE 5-6 tutor, on campus ${rcaSchedule.days.join(" & ")} ${rcaSchedule.startTime}-${rcaSchedule.endTime}. He's not currently viewing a specific class page, so answer generally across his full teaching load unless he names a subject.\n\nHIS CLASSES:\n${list}`;
}

function buildGrounding(subjectId: string | undefined): string {
  if (!subjectId || subjectId === "general") return buildGeneralGrounding();

  const cls = getRcaClass(subjectId);
  if (!cls) return buildGeneralGrounding();

  let grounding = `CLASS: ${cls.name} (${cls.grade}, ${cls.area}) at Regina Caeli Academy — a Catholic classical homeschool hybrid. Jacob (the tutor) meets this class as part of his Mon/Thu on-campus schedule.\nSUMMARY: ${cls.summary}\n`;
  if (cls.books.length) grounding += `BOOKS: ${cls.books.join(", ")}\n`;

  if (cls.id === "music-34") {
    const n = currentLessonNumber(music34Lessons.length);
    const lesson = music34Lessons.find((l) => l.n === n);
    grounding += `\n${music34Overview}\n\nCURRENT LESSON (Lesson ${n} of ${music34Lessons.length}):\n`;
    if (lesson) {
      grounding += `Choral Warm-up: ${lesson.warmup}\nHymns and Chants: ${lesson.hymnsChants}\nRecorder: ${lesson.recorder}\n`;
      if (lesson.note) grounding += `Note: ${lesson.note}\n`;
    }
  } else if (cls.lessonPlanUrl) {
    grounding += `\nFull lesson plan content hasn't been pulled into this app yet — the master doc lives at ${cls.lessonPlanUrl}. Answer from general knowledge of the subject/grade level and RCA's classical, Catholic approach, and say so if asked something only the doc would answer.\n`;
  }

  return grounding;
}

const baseSystemPrompt = `You are Jacob's personal lesson-prep assistant for his teaching work at Regina Caeli Academy (RCA), a Catholic classical homeschool hybrid where he is the 6th Grade Lead plus Music 3-4 / PE 3-4 / PE 5-6 tutor.

Help him prepare for class: suggest activities, anticipate where students will struggle, draft warm-ups or discussion questions, adapt pacing, or explain content he needs to teach. Ground answers in the class context provided below when given. RCA is Catholic and classical in approach (chant, Latin, memory work, Socratic questioning) — keep suggestions consistent with that style unless Jacob asks otherwise. Be concrete and practical, not generic teaching-textbook advice. Keep responses focused, not overly long. Format with markdown when helpful.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { messages, subjectId } = await req.json();
    const grounding = buildGrounding(subjectId);

    const stream = anthropic.messages.stream({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: [
        { type: "text" as const, text: baseSystemPrompt, cache_control: { type: "ephemeral" as const } },
        { type: "text" as const, text: grounding },
      ],
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let closed = false;
        const safeEnqueue = (data: Uint8Array) => { if (!closed) controller.enqueue(data); };
        const safeClose = () => { if (!closed) { closed = true; controller.close(); } };

        stream.on("text", (text) => {
          safeEnqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        });
        stream.on("end", () => {
          safeEnqueue(encoder.encode("data: [DONE]\n\n"));
          safeClose();
        });
        stream.on("error", (err) => {
          safeEnqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          safeClose();
        });
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
