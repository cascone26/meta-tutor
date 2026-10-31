import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const today = new Date().toISOString().split("T")[0];
    const weakTopic = req.nextUrl.searchParams.get("weakTopic");

    const topicInstruction = weakTopic
      ? ` The question MUST focus on the topic "${weakTopic}" — this is an area the user is weak in and needs practice with. Frame the question to test understanding of this specific area.`
      : "";

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `You are a Catholic theology daily question generator grounded in St. Thomas Aquinas, the Summa Theologica, Sacred Scripture, and the Catechism of the Catholic Church. Generate one thought-provoking theology question for the day. Return ONLY valid JSON with this exact structure: {"question": "string", "hint": "string", "answer": "string", "citation": "string", "relatedTopics": ["string", "string", "string"]}. No markdown, no explanation, just the JSON object. The question should challenge the reader to think deeply. The hint should nudge toward the answer without giving it away. The citation should reference Aquinas, Scripture, or the Catechism. Include 3-5 related topics.${topicInstruction}`,
      messages: [
        {
          role: "user",
          content: `Generate a Catholic theology question for ${today}.${weakTopic ? ` Focus on: ${weakTopic}.` : ""} Make it substantial — something worth meditating on.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const daily = JSON.parse(text);

    return new Response(JSON.stringify(daily), {
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
