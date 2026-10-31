import { NextRequest } from "next/server";
import { streamChat } from "@/lib/tutor-core/chat-router";
import { DEBATE_PREP_PROMPT } from "@/lib/veritas/constants";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  return streamChat(req, {
    systemPrompt: DEBATE_PREP_PROMPT,
    buildGrounding: () => "",
  });
}
