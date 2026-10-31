import { NextRequest } from "next/server";
import { streamChat } from "@/lib/tutor-core/chat-router";
import { OBJECTION_PROMPT } from "@/lib/veritas/constants";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  return streamChat(req, {
    systemPrompt: OBJECTION_PROMPT,
    buildGrounding: () => "",
  });
}
