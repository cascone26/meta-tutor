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
    const { passage, source } = await req.json();

    const key = cacheKey("reading-quiz", source, passage.slice(0, 200));
    const cached = getCached(key);
    if (cached) return Response.json(cached);

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `You are generating reading comprehension questions for a metaphysics student. The questions should test whether the student actually read and understood the passage — NOT general knowledge.

Respond with ONLY valid JSON: {"questions":[{"question":"...","answer":"..."},{"question":"...","answer":"..."},{"question":"...","answer":"..."}]}

Generate exactly 4 questions. Questions should:
- Test specific claims or distinctions made in the passage
- Ask what the author argues, not what the student thinks
- Have concise, specific answers (1-2 sentences)
- Progress from easier to harder`,
      messages: [
        {
          role: "user",
          content: `SOURCE: ${source}\n\nPASSAGE:\n${passage}\n\nGenerate 4 reading comprehension questions. JSON only.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    try {
      const data = JSON.parse(text);
      setCache(key, data);
      return Response.json(data);
    } catch {
      return Response.json({
        questions: [
          { question: "What is the main argument of this passage?", answer: "See the passage for the central claim." },
          { question: "What key distinction does the author draw?", answer: "The passage distinguishes between different aspects of the topic." },
        ],
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
