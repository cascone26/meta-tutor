import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { buildClassGrounding } from "@/lib/rca-grounding";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

const GENERATE_SYSTEM = `You are building a "do I actually understand this well enough to teach it" self-check for Jacob, a tutor at Regina Caeli Academy prepping for his next class. This tests JACOB's own mastery of the material he's about to teach — not generic trivia, not a kids' worksheet.

Generate questions matched to the SUBJECT below:
- Math (Saxon): give an actual example problem exercising the specific concept in the current lesson — Jacob should have to compute a real answer.
- Latin / LOE (grammar-and-spelling subjects): ask him to conjugate/decline/translate a specific form, apply a spelling rule, or identify a grammar concept from the lesson.
- Religion / History / Science (reading-and-content subjects): ask about specific content he'd need to explain to a student — a fact, a cause, a distinction, a translation of a term — not "what do you think."
- Music: ask about the specific hymn/chant/round or music-theory concept in the lesson (translation, historical context, or notation).

Respond with ONLY valid JSON, no markdown fences: {"questions":[{"question":"...","answer":"..."}]}
Generate exactly 4 questions, ordered easier to harder. Answers should be specific and checkable (1-3 sentences, or a computed value for math).`;

const EVALUATE_SYSTEM = `You are checking Jacob's (a tutor's) answer against the correct answer for a lesson-prep self-check. Be honest, not encouraging-by-default — the whole point is catching real gaps before he teaches the material.

Respond with ONLY valid JSON, no markdown fences: {"result":"correct"|"partial"|"incorrect","feedback":"1-2 sentence explanation of what's right/missing"}
- correct: matches the key content, no meaningful gap
- partial: right idea but missing something specific or has a minor error
- incorrect: wrong, or doesn't address the actual question`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const body = await req.json();

    if (body.action === "generate") {
      const grounding = buildClassGrounding(body.subjectId);
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: GENERATE_SYSTEM,
        messages: [{ role: "user", content: `${grounding}\n\nGenerate the 4-question self-check for the CURRENT LESSON above. JSON only.` }],
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      try {
        return Response.json(JSON.parse(text));
      } catch {
        return Response.json({ questions: [] });
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
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      try {
        return Response.json(JSON.parse(text));
      } catch {
        return Response.json({ result: "partial", feedback: text.slice(0, 300) });
      }
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
