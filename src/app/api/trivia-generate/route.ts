import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Anthropic } from "@anthropic-ai/sdk";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const userEmail = session.user.email;
  const rateLimitResult = await checkRateLimit(userEmail);
  if (!rateLimitResult.allowed) {
    return rateLimitResponse();
  }

  const body = await req.json();
  const { category, count = 10 } = body;

  if (!category) {
    return new Response("Missing category", { status: 400 });
  }

  const supabase = getSupabase();
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultHeaders: {
      "anthropic-beta": "prompt-caching-2024-07-16",
    },
    timeout: 25000,
  });

  const model = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

  try {
    const prompt = `Generate exactly ${count} trivia questions for the "${category}" category. Each question should:
- Have 4 multiple choice options (one correct answer)
- Be at a random difficulty (easy, medium, or hard)
- Include a helpful explanation

Format your response as a JSON array with this exact structure:
[
  {
    "id": "gen-CATEGORY-1",
    "question": "Question text?",
    "answer": "Correct answer",
    "options": ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"],
    "category": "${category}",
    "difficulty": "easy|medium|hard",
    "explanation": "Why this is correct..."
  }
]

Generate only valid JSON, no other text.`;

    const message = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const questions = JSON.parse(content.text);
    const validQuestions = questions.filter(
      (q: any) => q.id && q.question && q.answer && q.options && q.category
    );

    if (validQuestions.length > 0) {
      for (const q of validQuestions) {
        await supabase.from("mt_trivia_ai_questions").upsert(
          {
            id: `${userEmail}-${q.id}`,
            user_email: userEmail,
            question: q.question,
            answer: q.answer,
            options: q.options,
            category: q.category,
            difficulty: q.difficulty || "medium",
            explanation: q.explanation || "",
          },
          { onConflict: `${userEmail}-${q.id}` }
        );
      }
    }

    return NextResponse.json({
      success: true,
      questions: validQuestions,
      generated: validQuestions.length,
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error("[trivia-generate error]", error);
    return new Response("Failed to generate questions", { status: 500 });
  }
}
