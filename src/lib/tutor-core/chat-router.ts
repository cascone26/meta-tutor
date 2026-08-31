// Shared streaming-chat plumbing for every subject's AI tutor conversation. Extracted
// verbatim from rca-chat/riemann-chat/chess-coach's near-identical routes (2026-08-30) —
// auth, rate-limit, Anthropic streaming, and SSE encoding are byte-for-byte what those
// routes did inline. Only the system prompt and grounding/context differ per subject,
// so that's all a route provides now.
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";

export const anthropic = new Anthropic({ timeout: 25000 });

export type ChatRequestBody = { messages: { role: string; content: string }[]; [key: string]: unknown };

export async function streamChat(
  req: NextRequest,
  opts: {
    systemPrompt: string;
    buildGrounding: (body: ChatRequestBody) => string;
    maxTokens?: number;
  }
): Promise<Response> {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const body = (await req.json()) as ChatRequestBody;
    const grounding = opts.buildGrounding(body);

    const stream = anthropic.messages.stream({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: opts.maxTokens ?? 2048,
      system: [
        { type: "text" as const, text: opts.systemPrompt, cache_control: { type: "ephemeral" as const } },
        { type: "text" as const, text: grounding },
      ],
      messages: body.messages.map((m) => ({
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
