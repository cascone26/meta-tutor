import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";
import { buildLessonGrounding } from "@/lib/riemann-grounding";
import { stripJsonFences } from "@/lib/json-fences";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

const GENERATE_SYSTEM = `You are building a self-check for Jacob, who is learning the Riemann Hypothesis from zero background, to test whether he actually absorbed the CURRENT lesson below — not generic trivia, not questions about later lessons he hasn't reached yet.

Ask questions that check real conceptual understanding: restate a definition in his own words, explain why a step works, work a small concrete example, or spot a common misconception from the lesson. Avoid questions with a one-word answer unless the lesson is genuinely that narrow.

Respond with ONLY valid JSON, no markdown fences: {"questions":[{"question":"...","answer":"..."}]}
Generate exactly 4 questions, ordered easier to harder. Answers should be specific and checkable (1-3 sentences).`;

const EVALUATE_SYSTEM = `You are checking Jacob's answer against the correct answer for a self-study understanding-check on the Riemann Hypothesis. Be honest, not encouraging-by-default — he's testing himself precisely because he wants to catch real gaps, not feel good.

Respond with ONLY valid JSON, no markdown fences: {"result":"correct"|"partial"|"incorrect","feedback":"1-2 sentence explanation of what's right/missing"}
- correct: matches the key idea, no meaningful gap
- partial: right general idea but missing something specific or has a minor error
- incorrect: wrong, or doesn't address the actual question`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const body = await req.json();

    if (body.action === "generate") {
      const grounding = buildLessonGrounding(body.lessonN);
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: GENERATE_SYSTEM,
        messages: [{ role: "user", content: `${grounding}\n\nGenerate the 4-question self-check for the CURRENT LESSON above. JSON only.` }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        const parsed = JSON.parse(stripJsonFences(text));
        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          return Response.json({ questions: [], error: "Model returned no questions — try again." });
        }
        return Response.json(parsed);
      } catch {
        return Response.json({ questions: [], error: `Couldn't parse the model's response: "${text.slice(0, 150)}"` });
      }
    }

    if (body.action === "evaluate") {
      const { question, correctAnswer, userAnswer } = body;
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: EVALUATE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `QUESTION: ${question}\nCORRECT ANSWER: ${correctAnswer}\n\nJACOB'S ANSWER: ${userAnswer}\n\nEvaluate. JSON only.`,
          },
        ],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        return Response.json(JSON.parse(stripJsonFences(text)));
      } catch {
        return Response.json({ result: "partial", feedback: text.slice(0, 300) });
      }
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    notifyIfAuthError(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
