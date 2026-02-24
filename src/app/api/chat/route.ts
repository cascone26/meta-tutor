import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const anthropic = new Anthropic();

const notes = readFileSync(
  join(process.cwd(), "src/lib/notes.txt"),
  "utf-8"
);

const systemPrompt = `You are a study assistant for a college Metaphysics course (Thomistic/Aristotelian tradition). Your job is to help the student understand and prepare answers for their exam questions.

You have access to the student's actual course notes below. ALWAYS ground your answers in these notes first, then supplement with your broader knowledge of the subject when needed.

GUIDELINES:
- When helping with a question, walk through the relevant concepts step by step
- Reference specific ideas from the notes (e.g., "As your notes cover under the Divided Line...")
- Use clear, accessible language — explain jargon when it first appears
- When in "quiz mode", ask the student questions and guide them to the answer rather than giving it directly
- Give concrete examples to illustrate abstract concepts
- If the student seems confused, try a different angle or analogy
- Keep responses focused and not overly long — aim for thorough but digestible
- Format responses with markdown for readability (headers, bold key terms, bullet points)

COURSE NOTES:
${notes}`;

export async function POST(req: NextRequest) {
  const { messages, mode, userNotes } = await req.json();

  const modeInstruction =
    mode === "quiz"
      ? "\n\n[QUIZ MODE ACTIVE] Instead of explaining directly, ask the student targeted questions to test their understanding. Guide them with hints if they struggle. Be encouraging but push them to think critically."
      : "\n\n[STUDY MODE ACTIVE] Help the student understand the material thoroughly. Explain concepts clearly, reference the notes, and provide examples.";

  const userNotesSection =
    userNotes && userNotes.length > 0
      ? "\n\nADDITIONAL STUDENT NOTES:\n" +
        userNotes
          .map((n: { title: string; content: string }) => `--- ${n.title} ---\n${n.content}`)
          .join("\n\n")
      : "";

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 2048,
    system: systemPrompt + userNotesSection + modeInstruction,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      stream.on("text", (text) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      });
      stream.on("end", () => {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });
      stream.on("error", (err) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`)
        );
        controller.close();
      });
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
