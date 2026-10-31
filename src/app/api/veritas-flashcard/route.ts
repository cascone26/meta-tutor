import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { topic, difficulty } = await req.json();

    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic string is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const difficultyLevel = difficulty || "intermediate";

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `You are a Catholic theology flashcard generator grounded in St. Thomas Aquinas and the Catechism. Generate exactly 5 flashcards in JSON format. Each flashcard must have: front (string, the question), back (string, the answer — include a citation such as "ST I, q.2, a.3" or "CCC 1234" where relevant). Return ONLY valid JSON: {"cards": [{"front": "...", "back": "..."}, ...]} — exactly 5 objects. No markdown, no explanation, just the JSON object.`,
      messages: [
        {
          role: "user",
          content: `Generate 5 ${difficultyLevel}-level flashcards on the topic: ${topic}`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    await notifyIfAuthError(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
