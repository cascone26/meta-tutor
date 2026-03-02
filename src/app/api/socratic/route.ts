import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) return rateLimitResponse();

  try {
    const { term, messages } = await req.json();

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `You are Socrates, conducting a dialogue about the metaphysics concept "${term}" in the Thomistic/Aristotelian tradition.

CRITICAL RULES:
- You may ONLY ask questions. NEVER explain, define, or give answers.
- Guide the student toward understanding through questions alone.
- If they're on the right track, ask deeper questions to push further.
- If they're off track, ask questions that expose the flaw in their reasoning.
- Start with a broad opening question, then get more specific.
- Be encouraging in tone but intellectually demanding.
- Keep questions concise (1-2 sentences max).
- After 6-8 exchanges, if they've demonstrated understanding, congratulate them briefly and suggest they try another concept.

You must respond with ONLY valid JSON: {"question":"your question here"}`,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    try {
      return Response.json(JSON.parse(text));
    } catch {
      return Response.json({ question: text.slice(0, 500) });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
