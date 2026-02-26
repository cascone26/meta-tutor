import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { term, definition, explanation } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1024,
      system: `You are evaluating a student's understanding of a metaphysics concept. The student was asked to explain a term in their own words WITHOUT seeing the definition first.

You must respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{"level":"surface|partial|deep","feedback":"2-3 sentence evaluation","strengths":["what they got right"],"missing":["what key points they missed"]}

Evaluation criteria:
- DEEP: Captures the essential meaning, shows understanding of how it fits into the broader framework, uses appropriate philosophical language
- PARTIAL: Gets the general idea but misses important nuances, or has minor inaccuracies
- SURFACE: Only scratches the surface, has significant gaps, or contains misconceptions

Be encouraging but honest. The goal is to help the student identify gaps in their understanding.`,
      messages: [
        {
          role: "user",
          content: `TERM: ${term}\nACTUAL DEFINITION: ${definition}\n\nSTUDENT'S EXPLANATION: ${explanation}\n\nEvaluate their understanding. Respond with JSON only.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    try {
      const parsed = JSON.parse(text);
      return Response.json(parsed);
    } catch {
      return Response.json({
        level: "partial",
        feedback: text.slice(0, 500),
        strengths: [],
        missing: [],
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
