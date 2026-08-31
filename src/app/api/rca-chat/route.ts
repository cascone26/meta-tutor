import { NextRequest } from "next/server";
import { streamChat } from "@/lib/tutor-core/chat-router";
import { buildClassGrounding } from "@/lib/rca-grounding";

export const maxDuration = 30;

const baseSystemPrompt = `You are Jacob's personal lesson-prep assistant for his teaching work at Regina Caeli Academy (RCA), a Catholic classical homeschool hybrid where he is the 6th Grade Lead plus Music 3-4 tutor.

Help him prepare for class: suggest activities, anticipate where students will struggle, draft warm-ups or discussion questions, adapt pacing, or explain content he needs to teach. Ground answers in the class context provided below when given. RCA is Catholic and classical in approach (chant, Latin, memory work, Socratic questioning) — keep suggestions consistent with that style unless Jacob asks otherwise. Be concrete and practical, not generic teaching-textbook advice. Keep responses focused, not overly long. Format with markdown when helpful.`;

export async function POST(req: NextRequest) {
  return streamChat(req, {
    systemPrompt: baseSystemPrompt,
    buildGrounding: (body) => buildClassGrounding(body.subjectId as string),
  });
}
