// Shared streaming-chat plumbing for every subject's AI tutor conversation. Extracted
// verbatim from rca-chat/riemann-chat/chess-coach's near-identical routes (2026-08-30) —
// auth, rate-limit, Anthropic streaming, and SSE encoding are byte-for-byte what those
// routes did inline. Only the system prompt and grounding/context differ per subject,
// so that's all a route provides now.
import Anthropic from "@anthropic-ai/sdk";
import { MessageStream } from "@anthropic-ai/sdk/lib/MessageStream";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sessionEmail } from "@/lib/dev-auth";
import { notifyIfAuthError } from "@/lib/alert";

export const anthropic = new Anthropic({ timeout: 25000 });

export type ChatRequestBody = { messages: { role: string; content: string }[]; [key: string]: unknown };

// 429 (shared Max-subscription usage ceiling) and 5xx are often gone a couple seconds later.
// The SDK reports a failed request via the async 'error' event on the stream, not a throw from
// messages.stream() itself (that call returns synchronously and the request runs in the
// background) -- so the retry has to live inside the error handler, re-issuing the request and
// re-wiring the same listeners, not around the call that creates the stream.
function isRetryable(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  return status === 429 || (typeof status === "number" && status >= 500);
}

export async function streamChat(
  req: NextRequest,
  opts: {
    systemPrompt: string;
    buildGrounding: (body: ChatRequestBody) => string;
    maxTokens?: number;
  }
): Promise<Response> {
  const userId = await sessionEmail(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const body = (await req.json()) as ChatRequestBody;
    const grounding = opts.buildGrounding(body);

    const streamParams = {
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
    };

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let closed = false;
        let retried = false;
        let gotAnyText = false;
        const safeEnqueue = (data: Uint8Array) => { if (!closed) controller.enqueue(data); };
        const safeClose = () => { if (!closed) { closed = true; controller.close(); } };

        const attach = (s: MessageStream) => {
          s.on("text", (text) => {
            gotAnyText = true;
            safeEnqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          });
          s.on("end", () => {
            safeEnqueue(encoder.encode("data: [DONE]\n\n"));
            safeClose();
          });
          s.on("error", (err) => {
            // Only retry a request that never streamed anything back yet -- once tokens have
            // reached the client, re-issuing the whole request would duplicate/garble output.
            if (!retried && !gotAnyText && isRetryable(err)) {
              retried = true;
              console.error("Anthropic stream error, retrying once:", err instanceof Error ? err.message : err);
              setTimeout(() => attach(anthropic.messages.stream(streamParams)), 2000);
              return;
            }
            console.error("Anthropic stream error:", err instanceof Error ? err.message : err);
            notifyIfAuthError(err);
            safeEnqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
            safeClose();
          });
        };

        attach(anthropic.messages.stream(streamParams));
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
