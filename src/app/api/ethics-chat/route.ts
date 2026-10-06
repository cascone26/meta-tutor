import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";
import { ethicsNotes } from "@/lib/ethics-notes";

export const maxDuration = 30;

const anthropic = new Anthropic({
  timeout: 25000,
});

const systemPrompt = `You are a study assistant for a college Ethics course (Thomistic/Aristotelian tradition). This student's exam is primarily TRUE/FALSE questions.

Your primary job is to help the student prepare for true/false exam questions by:
- Clarifying precisely what statements mean and whether they are true or false according to the course
- Generating practice true/false questions on requested topics
- Explaining the exact wording and distinctions that make statements true or false
- Highlighting common trick/confusion points (e.g. antecedent vs consequent passions, choice vs consent, wish vs intention)
- Helping the student memorize key assertions, justifications, and definitions

GUIDELINES:
- Be precise and direct — T/F exams hinge on exact wording
- When explaining why something is true or false, quote the relevant section of the notes
- Point out confusable pairs (e.g. "Don't confuse antecedent with consequent passions")
- Keep responses focused and digestible
- Format responses with markdown for readability (bold key terms, bullet points)
- Do NOT fabricate information — only use what is in the course notes below

COURSE NOTES:
${ethicsNotes}`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { messages } = await req.json();

    const stream = anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let closed = false;

        const safeEnqueue = (data: Uint8Array) => {
          if (!closed) controller.enqueue(data);
        };

        const safeClose = () => {
          if (!closed) {
            closed = true;
            controller.close();
          }
        };

        stream.on("text", (text) => {
          safeEnqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        });
        stream.on("end", () => {
          safeEnqueue(encoder.encode("data: [DONE]\n\n"));
          safeClose();
        });
        stream.on("error", (err) => {
          console.error("[ethics-chat] stream error:", err.message);
          safeEnqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`)
          );
          safeClose();
        });
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    await notifyIfAuthError(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
