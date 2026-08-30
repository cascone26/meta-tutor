import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getSupabase } from "@/lib/supabase";
import { newCard, reviewCard, isDue, isMastered, stateLabel, type FsrsCardState, type RatingKey } from "@/lib/latin-lab/fsrs";
import { getRollingAccuracy, getWeakGrammarTags } from "@/lib/latin-lab/server-progress";

type VocabStateRow = {
  vocab_item: string;
  unit_id: string;
  grammar_tags: string[];
  fsrs_state: FsrsCardState;
  due: string;
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const userEmail = session.user.email;
  const supabase = getSupabase();

  const [{ data: vocabRows, error: vErr }, accuracy, weakTags] = await Promise.all([
    supabase
      .from("mt_latin_vocab_state")
      .select("vocab_item, unit_id, grammar_tags, fsrs_state, due")
      .eq("user_email", userEmail),
    getRollingAccuracy(userEmail),
    getWeakGrammarTags(userEmail),
  ]);

  if (vErr) return new Response("Failed to load vocab state", { status: 500 });

  const rows = (vocabRows || []) as VocabStateRow[];
  const now = new Date();
  const due = rows.filter((r) => isDue(r.fsrs_state, now)).map((r) => ({ vocabItem: r.vocab_item, unitId: r.unit_id, grammarTags: r.grammar_tags }));

  const stats = { new: 0, learning: 0, review: 0, mastered: 0 };
  for (const r of rows) {
    if (isMastered(r.fsrs_state)) stats.mastered++;
    else {
      const label = stateLabel(r.fsrs_state);
      if (label === "new") stats.new++;
      else if (label === "learning" || label === "relearning") stats.learning++;
      else stats.review++;
    }
  }

  return Response.json({
    due,
    stats,
    totalTracked: rows.length,
    comprehensionAccuracy: accuracy,
    weakGrammarTags: weakTags,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const userEmail = session.user.email;
  const supabase = getSupabase();
  const body = await req.json();

  if (body.action === "seedUnit") {
    // Called once a learner finishes a unit's comprehension check — enters that
    // unit's vocab into the FSRS queue as new (due now) cards, but never
    // overwrites a word already being tracked (e.g. reused across units).
    const { unitId, vocab } = body as { unitId: string; vocab: { latin: string; grammarTags: string[] }[] };
    if (!unitId || !Array.isArray(vocab)) return new Response("Missing unitId/vocab", { status: 400 });

    const { data: existingRows } = await supabase
      .from("mt_latin_vocab_state")
      .select("vocab_item")
      .eq("user_email", userEmail)
      .in("vocab_item", vocab.map((v) => v.latin));
    const already = new Set((existingRows || []).map((r) => r.vocab_item));

    const toInsert = vocab
      .filter((v) => !already.has(v.latin))
      .map((v) => {
        const card = newCard();
        return {
          user_email: userEmail,
          vocab_item: v.latin,
          unit_id: unitId,
          grammar_tags: v.grammarTags || [],
          fsrs_state: card,
          due: card.due,
        };
      });

    if (toInsert.length > 0) {
      const { error } = await supabase.from("mt_latin_vocab_state").insert(toInsert);
      if (error) return new Response("Failed to seed vocab", { status: 500 });
    }
    return Response.json({ ok: true, seeded: toInsert.length });
  }

  if (body.action === "reviewVocab") {
    const { vocabItem, unitId, grammarTags, rating } = body as {
      vocabItem: string;
      unitId: string;
      grammarTags: string[];
      rating: RatingKey;
    };
    if (!vocabItem || !rating) return new Response("Missing vocabItem/rating", { status: 400 });

    const { data: existing } = await supabase
      .from("mt_latin_vocab_state")
      .select("fsrs_state")
      .eq("user_email", userEmail)
      .eq("vocab_item", vocabItem)
      .maybeSingle();

    const card = existing ? (existing.fsrs_state as FsrsCardState) : newCard();
    const updated = reviewCard(card, rating);

    const { error } = await supabase.from("mt_latin_vocab_state").upsert(
      {
        user_email: userEmail,
        vocab_item: vocabItem,
        unit_id: unitId,
        grammar_tags: grammarTags || [],
        fsrs_state: updated,
        due: updated.due,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_email,vocab_item" }
    );
    if (error) return new Response("Failed to save review", { status: 500 });
    return Response.json({ ok: true, card: updated });
  }

  if (body.action === "logComprehension") {
    const { unitId, question, difficulty, grammarTags, correct, responseMs } = body;
    const { error } = await supabase.from("mt_latin_comprehension").insert({
      user_email: userEmail,
      unit_id: unitId,
      question,
      difficulty,
      grammar_tags: grammarTags || [],
      correct: !!correct,
      response_ms: responseMs ?? null,
    });
    if (error) return new Response("Failed to log result", { status: 500 });
    return Response.json({ ok: true });
  }

  return new Response("Unknown action", { status: 400 });
}
