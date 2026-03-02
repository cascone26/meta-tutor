import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getCached, setCache, cacheKey } from "@/lib/cache";
import { auth } from "@/auth";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) return rateLimitResponse();

  try {
    const { term, definition, category } = await req.json();

    const key = cacheKey("analogy", term, category);
    const cached = getCached(key);
    if (cached) return Response.json(cached);

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `You create vivid, everyday analogies to help students understand abstract metaphysical concepts.

Rules:
- Use concrete, relatable scenarios (cooking, sports, building, family life, etc.)
- The analogy should genuinely illuminate the concept, not just loosely relate to it
- Include a brief explanation of how the analogy maps onto the philosophical concept
- Keep it concise: 2-3 sentences for the analogy, 1-2 for the explanation

Respond with ONLY valid JSON: {"analogy":"the analogy here","explanation":"how it maps to the concept"}`,
      messages: [
        {
          role: "user",
          content: `TERM: ${term}\nDEFINITION: ${definition}\nCATEGORY: ${category}\n\nCreate a vivid everyday analogy for this metaphysical concept. JSON only.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    try {
      const data = JSON.parse(text);
      setCache(key, data);
      return Response.json(data);
    } catch {
      return Response.json({ analogy: text.slice(0, 500), explanation: "" });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
