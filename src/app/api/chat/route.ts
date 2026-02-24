import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { courseNotes } from "@/lib/course-notes";

const anthropic = new Anthropic();

const baseSystemPrompt = `You are a study assistant for a college Metaphysics course (Thomistic/Aristotelian tradition). Your job is to help the student understand and prepare answers for their exam questions.

You have access to the student's actual course notes and any primary source texts they've added. ALWAYS ground your answers in these materials first. When primary sources are available, quote and reference them directly rather than paraphrasing. Only supplement with broader knowledge when the provided materials don't cover the topic.

GUIDELINES:
- When helping with a question, walk through the relevant concepts step by step
- Reference specific ideas from the notes (e.g., "As your notes cover under the Divided Line...")
- When primary source texts are available, cite them directly (e.g., "As Aquinas writes in the Summa...")
- Use clear, accessible language — explain jargon when it first appears
- When in "quiz mode", ask the student questions and guide them to the answer rather than giving it directly
- Give concrete examples to illustrate abstract concepts
- If the student seems confused, try a different angle or analogy
- Keep responses focused and not overly long — aim for thorough but digestible
- Format responses with markdown for readability (headers, bold key terms, bullet points)
- Do NOT search the internet or fabricate quotes. Only use what is provided in the notes and sources below.

COURSE NOTES:
${courseNotes}`;

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, userNotes, sources } = await req.json();

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

    // Truncate sources to avoid hitting context limits (~150k chars total budget)
    let sourcesSection = "";
    if (sources && sources.length > 0) {
      const maxSourceChars = 80000;
      let charBudget = maxSourceChars;
      const includedSources: string[] = [];

      for (const s of sources as { title: string; author: string; content: string }[]) {
        const entry = `--- ${s.title} (${s.author}) ---\n${s.content}`;
        if (entry.length <= charBudget) {
          includedSources.push(entry);
          charBudget -= entry.length;
        } else if (charBudget > 1000) {
          includedSources.push(
            `--- ${s.title} (${s.author}) [TRUNCATED] ---\n${s.content.slice(0, charBudget - 100)}\n[... text truncated for length ...]`
          );
          break;
        }
      }

      if (includedSources.length > 0) {
        sourcesSection =
          "\n\nPRIMARY SOURCE TEXTS (quote these directly when relevant):\n" +
          includedSources.join("\n\n");
      }
    }

    const fullSystem = baseSystemPrompt + sourcesSection + userNotesSection + modeInstruction;

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 2048,
      system: fullSystem,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        stream.on("text", (text) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        });
        stream.on("end", () => {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        });
        stream.on("error", (err) => {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err.message })}\n\n`
            )
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
