import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { conclusion, actualPremises, userPremises, philosopher } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are evaluating a student's attempt to reconstruct a philosophical argument. They were given only the conclusion and asked to provide the premises.

You must respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{"score":1-5,"feedback":"2-3 sentence evaluation of their logical reasoning","matchedPremises":[indices of actual premises they captured],"missedPremises":["key premises they missed, stated concisely"]}

Scoring:
- 5: Captured all key premises with good logical structure
- 4: Captured most premises, minor gaps
- 3: Got the general direction but missed important steps
- 2: Only captured one or two premises, significant gaps
- 1: Fundamentally misunderstood the argument

Be encouraging. Focus on logical structure, not exact wording. A premise counts as "matched" if the student captured its essential meaning.`,
      messages: [
        {
          role: "user",
          content: `PHILOSOPHER: ${philosopher}
CONCLUSION: ${conclusion}
ACTUAL PREMISES: ${actualPremises.map((p: string, i: number) => `P${i + 1}. ${p}`).join("\n")}

STUDENT'S PREMISES: ${userPremises.map((p: string, i: number) => `P${i + 1}. ${p}`).join("\n")}

Evaluate their reconstruction. Respond with JSON only.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    try {
      const parsed = JSON.parse(text);
      return Response.json(parsed);
    } catch {
      return Response.json({ score: 3, feedback: text.slice(0, 500), matchedPremises: [], missedPremises: [] });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
