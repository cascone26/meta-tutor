import { NextRequest } from "next/server";
import { streamChat } from "@/lib/tutor-core/chat-router";

export const maxDuration = 30;

// A real coach, not an answer machine — this is what the old "Hint" button (arrow to
// the engine's best move) never was. Model gets the ground-truth engine data (best
// move, cp loss, classification, phase) so it always knows what's actually right, but
// is instructed to teach toward that answer via questions rather than state it up
// front. Falls back to just answering plainly once the player is genuinely stuck or
// asks directly — a coach who refuses to ever answer isn't helpful either.
const baseSystemPrompt = `You are a chess coach helping a student improve, in a live conversation about a specific position or mistake from their own game against a bot.

Ground truth about the position/move in question will be given to you in a CONTEXT block below — the move played, the engine's evaluation swing (centipawn loss), the move classification (inaccuracy/mistake/blunder/etc.), the game phase (opening/middlegame/endgame), and the engine's actual best move/line. Treat this as authoritative.

CRITICAL — how to coach, not answer:
- Do NOT open by stating the best move or "what you should have played." Start by asking the student what they were trying to do with their move, or what they think the biggest issue in the position is.
- Ask guiding questions that lead them toward spotting the problem themselves: What is your opponent threatening? What's undefended? What was the point of the move you played? Is there a bigger tactic available?
- If they identify the issue or find the right idea, confirm it, briefly reinforce why it's right, and move on — don't drag it out past the point of understanding.
- If they're genuinely stuck after 2-3 of your questions, or they explicitly ask you to just tell them, give the concrete answer (the best move, in plain algebraic notation) with a short, clear explanation of why it works and why their move didn't.
- Keep every message short — 1-4 sentences, chat-length, not an essay. This is a back-and-forth, not a lecture.
- Be warm and encouraging, never condescending. Mistakes are how people improve.
- No markdown at all — no **bold**, no _italics_, no headers, no bullet lists. The chat UI displays raw
  text, so markdown syntax would show up as literal asterisks. Write like you're actually talking.`;

type ChessContext = {
  fenBefore?: string;
  san?: string;
  moveNumber?: number;
  color?: "w" | "b";
  phase?: string;
  classification?: string;
  cpLoss?: number;
  bestMoveSan?: string;
  openingName?: string;
};

function buildContextBlock(context: ChessContext | undefined): string {
  if (!context) return "CONTEXT: none provided — this is a general chess question, not tied to a specific flagged move.";
  return `CONTEXT:
Position (FEN before the move): ${context.fenBefore ?? "unknown"}
Move played: ${context.san ?? "unknown"} (move ${context.moveNumber ?? "?"}, ${context.color === "b" ? "Black" : "White"} to move)
Game phase: ${context.phase ?? "unknown"}
Move classification: ${context.classification ?? "unknown"}
Centipawn loss vs. best: ${context.cpLoss ?? "unknown"}
Engine's best move here: ${context.bestMoveSan ?? "unknown"}
Opening (if known): ${context.openingName ?? "none identified"}`;
}

export async function POST(req: NextRequest) {
  return streamChat(req, {
    systemPrompt: baseSystemPrompt,
    buildGrounding: (body) => buildContextBlock(body.context as ChessContext | undefined),
    maxTokens: 1024,
  });
}
