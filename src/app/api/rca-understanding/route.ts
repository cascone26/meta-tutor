import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sessionEmail } from "@/lib/dev-auth";
import { notifyIfAuthError } from "@/lib/alert";
import { buildClassGrounding } from "@/lib/rca-grounding";
import { stripJsonFences } from "@/lib/json-fences";

export const maxDuration = 30;

const anthropic = new Anthropic({ timeout: 25000 });

const GENERATE_SYSTEM = `You are building a "do I actually understand this well enough to teach it" self-check for Jacob, a tutor at Regina Caeli Academy prepping for his next class. This tests JACOB's own mastery of the material he's about to teach — not generic trivia, not a kids' worksheet.

CLARITY and CONSTRUCT VALIDITY (research-grounded principles from K-12 assessment design):
- Each question should test ONE specific skill or concept — avoid ambiguous wording that could be read multiple ways.
- Avoid trick questions or "gotcha" wording. The goal is to catch real gaps in understanding, not to surprise Jacob with the phrasing.
- Ask Jacob to APPLY or REASON about the concept, not just recall a definition or a phrase he memorized. For example, ask him to identify a misconception, solve a variant problem, or explain why something is true — not just state what it is.
- State the success criterion implicitly by what a complete answer looks like (an example: if asking for a mathematical procedure, show the final computation required; if asking for a Latin form, show the specific case/tense/person).

Generate questions matched to the SUBJECT below:
- Math (Saxon): give an actual example problem exercising the specific concept in the current lesson — Jacob should have to compute a real answer or explain a step. The problem should test understanding, not just rote recall (e.g., "Why does multiplying by a fraction less than 1 give a smaller result?" instead of "What is 1/2 of 8?").
- Latin / LOE (grammar-and-spelling subjects): ask him to conjugate/decline/translate a specific form, apply a spelling rule, or identify a grammar concept from the lesson. Include variants (e.g., "What form would this be in the nominative plural?") to test understanding, not just one memorized form.
- Religion / History / Science (reading-and-content subjects): ask about specific content he'd need to explain to a student — a fact, a cause, a distinction, a translation of a term. Ask him to explain WHY or DISTINGUISH between similar concepts, not just state them.
- Music: ask about the specific hymn/chant/round or music-theory concept in the lesson (translation, historical context, or notation). Include a "why" or "how is this different from" variant to test reasoning.

If the grounding below includes a "REAL BALTIMORE CATECHISM CONTENT", "REAL LATIN CONTENT", or "REAL PHONOGRAM SOUNDS" block, treat it as ground truth and build every question/answer directly from it — do NOT invent catechism question numbers, Latin vocabulary/forms, or phonogram sounds that aren't in that block.

Respond with ONLY valid JSON, no markdown fences: {"questions":[{"question":"...","answer":"..."}]}
Generate exactly 4 questions, ordered easier to harder. Answers should be specific and checkable (1-3 sentences, or a computed value for math). Answers should show what understanding looks like, not just the bare minimum.`;

const EVALUATE_SYSTEM = `You are checking Jacob's (a tutor's) answer against the correct answer for a lesson-prep self-check. Be honest, not encouraging-by-default — the whole point is catching real gaps before he teaches the material.

FEEDBACK PRINCIPLES (research-grounded from K-12 instructional coaching):
- Give SPECIFIC feedback about what Jacob got RIGHT first (the idea he understood, the procedure he executed correctly, the distinction he made).
- Then name the SPECIFIC THING that's missing or wrong — not "something is off" but "the final step is missing" or "you gave the present tense but the text needs the past."
- If there is a clear NEXT STEP to focus on, name it explicitly (e.g., "Before your next lesson, work through one more example where the exponent is negative" or "Check the 3rd-person singular form in the conjugation table to see the pattern").
- Keep feedback to ONE or TWO things, not a laundry list — Jakob can only act on what's immediately actionable.
- Be plain language, not vague praise ("great effort" is not helpful; "you set up the equation correctly but forgot to divide by 3" is).

Respond with ONLY valid JSON, no markdown fences: {"result":"correct"|"partial"|"incorrect","feedback":"specific, actionable 2-3 sentence explanation"}
- correct: matches the key content, no meaningful gap
- partial: right idea but missing something specific or has a minor error — explain what's there and what's missing
- incorrect: wrong, or doesn't address the actual question — be specific about the gap`;

// Short term/fact pairs — built for game modes (Match, Gravity-typing) where the
// answer has to be short enough to click-match or type under time pressure. This
// maps directly onto how memory-work-heavy this curriculum actually is: Latin
// vocabulary, Catechism facts, phonogram sounds, historical names/dates.
const GENERATE_SHORT_SYSTEM = `You are building short flashcard-style term/fact pairs from ONE lesson, for Jacob (a tutor at Regina Caeli Academy) to drill against for speed.

Generate 6 pairs matched to the SUBJECT:
- Math (Saxon): a short math fact/term and its value or one-line rule.
- Latin / LOE: a specific Latin word/saying/phonogram and its short translation/meaning (NOT a full sentence).
- Religion / History / Science: a specific term, name, date, or fact and a short answer (1-5 words).
- Music: a term (hymn title, notation symbol) and its short meaning.

CRITICAL: every "answer" must be SHORT — ideally 1-4 words, never more than 6. These get typed under a countdown timer, so long answers make the game unplayable. If the real answer is naturally longer, pick the single most essential word/phrase instead.

If the grounding below includes a "REAL BALTIMORE CATECHISM CONTENT", "REAL LATIN CONTENT", or "REAL PHONOGRAM SOUNDS" block, pull every card directly from it — don't invent catechism facts, Latin words/forms, or phonogram sounds outside that block.

Respond with ONLY valid JSON, no markdown fences: {"cards":[{"term":"...","answer":"..."}]}
Exactly 6 cards, no duplicates.`;

// Multiple-choice — same underlying question style as the open-ended check, but
// with 3 plausible wrong answers so it can be a fast click-through quiz instead of
// typed/AI-graded. Distractors should be genuinely plausible, not obviously wrong.
// Design principle: wrong options should represent common misconceptions or application
// errors, not random guesses — so they test understanding, not just recognition of facts.
const GENERATE_MC_SYSTEM = `You are building a multiple-choice quiz from ONE lesson, for Jacob (a tutor at Regina Caeli Academy) prepping to teach it.

QUESTION DESIGN (K-12 assessment research):
- Each question should test understanding or application, not just recall. For example, ask Jacob to IDENTIFY a misconception when given a worked problem, APPLY a rule to a new case, or DISTINGUISH between similar concepts — not just remember a definition.
- The DISTRACTORS (wrong answers) should be specific, plausible mistakes that Jacob could actually make — not jokes or randomly wrong. Examples:
  * Math: a computational error from a common procedural mistake (e.g., multiplying top and bottom instead of cross-multiplying when finding equivalent fractions)
  * Latin: a form that matches the wrong case/number/tense/person (e.g., nominative singular when the sentence needs genitive plural)
  * Content: a fact that's *almost* right but from a different lesson or context, or a common misconception
  * These are the mistakes students ask about — make the wrong answers represent them.

Generate 5 questions matched to the SUBJECT (math problems for Saxon, grammar/translation for Latin/LOE, content facts for Religion/History/Science, hymn/notation facts for Music). Each question needs exactly 4 answer options where exactly ONE is correct and the other 3 are plausible, specific, real wrong answers — the kind a tutor could actually second-guess because they represent real confusion points.

If the grounding below includes a "REAL BALTIMORE CATECHISM CONTENT", "REAL LATIN CONTENT", or "REAL PHONOGRAM SOUNDS" block, build every question and its correct answer from THAT — wrong-but-plausible distractors may still be invented, but the correct answer must come from the real content, not a guess.

Respond with ONLY valid JSON, no markdown fences: {"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0}]}
correctIndex is 0-3, the index of the right option within that question's options array. Shuffle which index is correct across questions — don't always put it first.`;

export async function POST(req: NextRequest) {
  const userId = await sessionEmail(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return rateLimitResponse();

  try {
    const body = await req.json();

    if (body.action === "generate") {
      const grounding = buildClassGrounding(body.subjectId, body.lessonN);
      const label = body.lessonN ? "REVIEW LESSON" : "CURRENT LESSON";
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: GENERATE_SYSTEM,
        messages: [{ role: "user", content: `${grounding}\n\nGenerate the 4-question self-check for the ${label} above. JSON only.` }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        const parsed = JSON.parse(stripJsonFences(text));
        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          return Response.json({ questions: [], error: "Model returned no questions — try again." });
        }
        return Response.json(parsed);
      } catch {
        return Response.json({ questions: [], error: `Couldn't parse the model's response: "${text.slice(0, 150)}"` });
      }
    }

    if (body.action === "generate-short") {
      const grounding = buildClassGrounding(body.subjectId, body.lessonN);
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 700,
        system: GENERATE_SHORT_SYSTEM,
        messages: [{ role: "user", content: `${grounding}\n\nGenerate the 6 short term/fact cards for this lesson. JSON only.` }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        const parsed = JSON.parse(stripJsonFences(text));
        if (!parsed.cards || !Array.isArray(parsed.cards) || parsed.cards.length === 0) {
          return Response.json({ cards: [], error: "Model returned no cards — try again." });
        }
        return Response.json(parsed);
      } catch {
        return Response.json({ cards: [], error: `Couldn't parse the model's response: "${text.slice(0, 150)}"` });
      }
    }

    if (body.action === "generate-mc") {
      const grounding = buildClassGrounding(body.subjectId, body.lessonN);
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 1400,
        system: GENERATE_MC_SYSTEM,
        messages: [{ role: "user", content: `${grounding}\n\nGenerate the 5-question multiple-choice quiz for this lesson. JSON only.` }],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        const parsed = JSON.parse(stripJsonFences(text));
        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          return Response.json({ questions: [], error: "Model returned no questions — try again." });
        }
        return Response.json(parsed);
      } catch {
        return Response.json({ questions: [], error: `Couldn't parse the model's response: "${text.slice(0, 150)}"` });
      }
    }

    if (body.action === "evaluate") {
      const { question, correctAnswer, userAnswer } = body;
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: EVALUATE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `QUESTION: ${question}\nCORRECT ANSWER: ${correctAnswer}\n\nJACOB'S ANSWER: ${userAnswer}\n\nEvaluate. JSON only.`,
          },
        ],
      });
      const text = response.content[0]?.type === "text" ? response.content[0].text : "";
      try {
        return Response.json(JSON.parse(stripJsonFences(text)));
      } catch {
        return Response.json({ result: "partial", feedback: text.slice(0, 300) });
      }
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    notifyIfAuthError(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
