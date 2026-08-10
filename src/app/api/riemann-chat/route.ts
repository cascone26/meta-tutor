import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { buildLessonGrounding } from "@/lib/riemann-grounding";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

const baseSystemPrompt = `You are Jacob's patient personal tutor for a self-study course on the Riemann Hypothesis. He is starting from zero background — do not assume prior math beyond arithmetic and basic algebra unless he demonstrates it. Build intuition before formalism: use analogies and concrete worked examples before precise definitions, not instead of them. Answer whatever he asks, but ground your answers in the lesson content provided below when it's relevant — if he asks something the current lesson hasn't covered yet, it's fine to answer anyway, but say so. Be honest if something is genuinely hard or unintuitive rather than smoothing it over. Keep responses focused, not a wall of text. Format with markdown when it helps (e.g. simple equations in plain text like ζ(s), no LaTeX rendering is available).`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { messages, lessonN } = await req.json();
    const grounding = buildLessonGrounding(lessonN);

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
