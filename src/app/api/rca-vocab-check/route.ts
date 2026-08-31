import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { notifyIfAuthError } from "@/lib/alert";
import { stripJsonFences } from "@/lib/json-fences";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

// Categories must match SoundStudio's exact category labels (latin-core.ts /
// buildLatinCards()) so a checked word sorts straight into an existing tab
// instead of creating a stray new one.
const SYSTEM = `You are a careful ecclesiastical (Church) Latin fact-checker for a First Form Latin 6 flashcard tool at Regina Caeli Academy. Jacob (the Latin tutor) types in a Latin word or phrase he wants to learn — it may be correctly spelled, misspelled, or not real Latin at all.

Your job:
1. Determine if the input is real, correctly-spelled ecclesiastical Latin (macrons optional, ignore them either way).
2. If misspelled, give the corrected spelling and explain what was wrong in 1 sentence.
3. Give the English translation/meaning.
4. Classify it into EXACTLY ONE of these categories (copy the string exactly): "Nouns", "sum — to be", "amō — to love", "Adjectives", "Prepositions", "Numbers", "Sayings". Use "Sayings" for any multi-word phrase, motto, or classroom saying; use a grammatical category only for a single core-vocabulary word that clearly belongs there.
5. If the input isn't real Latin at all (gibberish, English, a different language), say so honestly — don't invent a translation or force a category.

Respond with ONLY valid JSON, no markdown fences:
{"valid": true|false, "corrected": "...", "wasCorrected": true|false, "english": "...", "category": "...", "explanation": "1-2 sentences"}
"valid" is false only if this isn't real Latin at all. "corrected" is the best real Latin spelling either way (echo the input back, cleaned up, if it was already correct). "wasCorrected" is true only if "corrected" differs from the original input beyond macrons/case/whitespace.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user?.email || "unknown";
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return Response.json({ error: "No text given" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: "user", content: `INPUT: "${text.trim()}"\n\nCheck it. JSON only.` }],
    });
    const responseText = response.content[0]?.type === "text" ? response.content[0].text : "";
    try {
      const parsed = JSON.parse(stripJsonFences(responseText));
      return Response.json(parsed);
    } catch {
      return Response.json({ error: `Couldn't parse the model's response: "${responseText.slice(0, 150)}"` }, { status: 502 });
    }
  } catch (err) {
    notifyIfAuthError(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
