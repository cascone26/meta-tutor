import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

// A real coach, not an answer machine — this is what the old "Hint" button (arrow to
// the engine's best move) never was. Model gets the ground-truth engine data (best
// move, cp loss, classification, phase) so it always knows what's actually right, but
// is instructed to teach toward that answer via questions rather than state it up
// front. Falls back to just answering plainly once the player is genuinely stuck or
// asks directly — a coach who refuses to ever answer isn't helpful either.
const baseSystemPrompt = `You are a chess coach helping a student improve, in a live conversation about a specific position or mistake from their own game against a bot.

Ground truth about the position/move in question will be given to you in a CONTEXT block below — the move played, the engine's evaluation swing (centipawn loss), the move classification (inaccuracy/mistake/blunder/etc.), the game phase (opening/middlegame/endgame), and the engine's actual best move/line. Treat this as authoritative.

CRITICAL — how to coach, not answer:
- Do NOT open by stating the best move or "what you should have played." Start by asking the student what they were trying to do with their move, or what they think the biggest issue in the position is.
- Ask guiding questions that lead them toward spotting the problem themselves: What is your opponent threatening? What's undefended? What was the point of the move you played? Is there a bigger tactic available?
- If they identify the issue or find the right idea, confirm it, briefly reinforce why it's right, and move on — don't drag it out past the point of understanding.
- If they're genuinely stuck after 2-3 of your questions, or they explicitly ask you to just tell them, give the concrete answer (the best move, in plain algebraic notation) with a short, clear explanation of why it works and why their move didn't.
- Keep every message short — 1-4 sentences, chat-length, not an essay. This is a back-and-forth, not a lecture.
- Be warm and encouraging, never condescending. Mistakes are how people improve.
- No markdown at all — no **bold**, no _italics_, no headers, no bullet lists. The chat UI displays raw
  text, so markdown syntax would show up as literal asterisks. Write like you're actually talking.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { messages, context } = await req.json();

    const contextBlock = context
      ? `CONTEXT:
Position (FEN before the move): ${context.fenBefore ?? "unknown"}
Move played: ${context.san ?? "unknown"} (move ${context.moveNumber ?? "?"}, ${context.color === "b" ? "Black" : "White"} to move)
Game phase: ${context.phase ?? "unknown"}
Move classification: ${context.classification ?? "unknown"}
Centipawn loss vs. best: ${context.cpLoss ?? "unknown"}
Engine's best move here: ${context.bestMoveSan ?? "unknown"}
Opening (if known): ${context.openingName ?? "none identified"}`
      : "CONTEXT: none provided — this is a general chess question, not tied to a specific flagged move.";

    const stream = anthropic.messages.stream({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: [
        { type: "text" as const, text: baseSystemPrompt, cache_control: { type: "ephemeral" as const } },
        { type: "text" as const, text: contextBlock },
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
