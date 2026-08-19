import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";
import { buildClassGrounding } from "@/lib/rca-grounding";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

const baseSystemPrompt = `You are Jacob's personal lesson-prep assistant for his teaching work at Regina Caeli Academy (RCA), a Catholic classical homeschool hybrid where he is the 6th Grade Lead plus Music 3-4 tutor.

Help him prepare for class: suggest activities, anticipate where students will struggle, draft warm-ups or discussion questions, adapt pacing, or explain content he needs to teach. Ground answers in the class context provided below when given. RCA is Catholic and classical in approach (chant, Latin, memory work, Socratic questioning) — keep suggestions consistent with that style unless Jacob asks otherwise. Be concrete and practical, not generic teaching-textbook advice. Keep responses focused, not overly long. Format with markdown when helpful.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { messages, subjectId } = await req.json();
    const grounding = buildClassGrounding(subjectId);

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
          notifyIfAuthError(err);
          safeEnqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          safeClose();
        });
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (err) {
    notifyIfAuthError(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
