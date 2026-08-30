import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { notifyIfAuthError } from "@/lib/alert";
import { stripJsonFences } from "@/lib/json-fences";
import { getLatinUnit } from "@/lib/latin-lab/units";
import { getRollingAccuracy, difficultyForAccuracy } from "@/lib/latin-lab/server-progress";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

// Per the research behind this feature: comprehension questions are generated
// per-learner from the real unit narrative at a difficulty tier chosen by that
// learner's rolling accuracy (easy/<70%, medium/default, hard/>85%) — not
// hand-written and not identical across attempts, so the check tests actual
// reading comprehension instead of memorized answers.
const GENERATE_SYSTEM = `You are building a reading-comprehension check for a Latin Lab lesson (comprehensible-input method — classical pronunciation, original graded narrative). The learner just read the Latin narrative below; test whether they actually understood it, not whether they memorized grammar terms.

Generate exactly 4 questions AT THE REQUESTED DIFFICULTY:
- easy: ask about a single concrete fact directly stated in one sentence (who/what/where).
- medium: ask the learner to infer something from combining two sentences, or to translate one short sentence.
- hard: ask the learner to apply the unit's grammar focus to a NEW sentence you construct using only vocabulary from the unit's vocab list (e.g. build a new genitive-case example if the unit teaches genitive), or to explain why a specific grammatical form is used.

Every question must be answerable ONLY from the narrative/vocab provided — never invent Latin vocabulary or grammar not given to you. Give each question a short array of grammarTags drawn from the unit's grammarTags list that it actually tests.

Respond with ONLY valid JSON, no markdown fences:
{"questions":[{"question":"...","answer":"...","grammarTags":["..."]}]}`;

const EXPLAIN_SYSTEM = `You are a Latin tutor using the Socratic method. The learner just got a comprehension question wrong. Given the question, the correct answer, and what they answered instead, write a SHORT (2-3 sentence) explanation that starts from their specific wrong answer and walks them to the right idea — don't just restate the correct answer, show them the gap in their reasoning. Reference the actual Latin word(s) involved. No markdown, plain text, warm but direct tone.`;

const EVALUATE_SYSTEM = `You are grading a learner's free-text answer to a Latin reading-comprehension question against the correct answer. Be lenient on English phrasing/word order, strict on whether they actually understood the Latin.

Respond with ONLY valid JSON, no markdown fences: {"result":"correct"|"partial"|"incorrect"}
- correct: matches the key content, no meaningful gap
- partial: right idea but missing something specific or a minor error
- incorrect: wrong, or doesn't address the actual question`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const userEmail = session.user.email;

  const { allowed } = await checkRateLimit(userEmail);
  if (!allowed) return rateLimitResponse();

  try {
    const body = await req.json();

    if (body.action === "generate-comprehension") {
      const unit = getLatinUnit(body.unitId);
      if (!unit) return Response.json({ error: "Unknown unit" }, { status: 400 });

      const { accuracy, sampleSize } = await getRollingAccuracy(userEmail);
      const difficulty = difficultyForAccuracy(accuracy, sampleSize);

      const prompt = `UNIT: ${unit.latinTitle} (${unit.title})
GRAMMAR FOCUS: ${unit.grammarFocus.join("; ")}
GRAMMAR TAGS AVAILABLE: ${unit.grammarTags.join(", ")}

NARRATIVE (Latin):
${unit.narrative.join(" ")}

ENGLISH GLOSS (ground truth, do not show learner):
${unit.englishGloss}

VOCAB LIST:
${unit.newVocab.map((v) => `${v.latin} = ${v.english}`).join("; ")}

DIFFICULTY: ${difficulty} (learner's rolling comprehension accuracy: ${Math.round(accuracy * 100)}% over ${sampleSize} recent checks)

Generate the 4-question comprehension check. JSON only.`;

      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: GENERATE_SYSTEM,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        const parsed = JSON.parse(stripJsonFences(text));
        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          return Response.json({ questions: [], difficulty, error: "Model returned no questions — try again." });
        }
        return Response.json({ questions: parsed.questions, difficulty });
      } catch {
        return Response.json({ questions: [], difficulty, error: `Couldn't parse the model's response: "${text.slice(0, 150)}"` });
      }
    }

    if (body.action === "evaluate") {
      const { question, correctAnswer, userAnswer } = body;
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: EVALUATE_SYSTEM,
        messages: [{ role: "user", content: `QUESTION: ${question}\nCORRECT ANSWER: ${correctAnswer}\nLEARNER'S ANSWER: ${userAnswer}\n\nEvaluate. JSON only.` }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        return Response.json(JSON.parse(stripJsonFences(text)));
      } catch {
        return Response.json({ result: "partial" });
      }
    }

    if (body.action === "explain") {
      const { question, correctAnswer, userAnswer } = body;
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: EXPLAIN_SYSTEM,
        messages: [{ role: "user", content: `QUESTION: ${question}\nCORRECT ANSWER: ${correctAnswer}\nLEARNER'S ANSWER: ${userAnswer}\n\nExplain.` }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      return Response.json({ explanation: text || "Couldn't generate an explanation — try again." });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    notifyIfAuthError(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
