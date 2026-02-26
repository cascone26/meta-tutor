import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { term, messages } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: `You are Socrates, conducting a dialogue about the metaphysics concept "${term}" in the Thomistic/Aristotelian tradition.

CRITICAL RULES:
- You may ONLY ask questions. NEVER explain, define, or give answers.
- Guide the student toward understanding through questions alone.
- If they're on the right track, ask deeper questions to push further.
- If they're off track, ask questions that expose the flaw in their reasoning.
- Start with a broad opening question, then get more specific.
- Be encouraging in tone but intellectually demanding.
- Keep questions concise (1-2 sentences max).
- After 6-8 exchanges, if they've demonstrated understanding, congratulate them briefly and suggest they try another concept.

You must respond with ONLY valid JSON: {"question":"your question here"}`,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    try {
      return Response.json(JSON.parse(text));
    } catch {
      return Response.json({ question: text.slice(0, 500) });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
