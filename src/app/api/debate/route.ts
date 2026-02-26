import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { topic, aiSide, messages } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: `You are a philosophy debate partner in the Thomistic/Aristotelian metaphysics tradition.

TOPIC: "${topic}"
YOUR POSITION: You are arguing ${aiSide} this position.

RULES:
- Make clear, concise philosophical arguments (2-4 sentences max per turn).
- Reference specific philosophers, concepts, and arguments from the tradition.
- Challenge the student's reasoning — find weaknesses, ask for clarification.
- Be respectful but intellectually rigorous. Don't concede easily.
- If the student makes a strong point, acknowledge it briefly but counter.
- After 5-6 exchanges, offer a brief summary of both sides and what the student argued well.
- Stay grounded in Aristotelian-Thomistic metaphysics.

Respond with ONLY valid JSON: {"argument":"your argument here"}`,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    try {
      return Response.json(JSON.parse(text));
    } catch {
      return Response.json({ argument: text.slice(0, 500) });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
