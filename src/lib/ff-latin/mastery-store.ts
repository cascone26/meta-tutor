// First Form Latin — per-item mastery for JACOB, tracked with the same FSRS engine Latin
// Lab uses (ts-fsrs via latin-lab/fsrs.ts) so weak items resurface on his real forgetting
// curve, cumulatively across every lesson. Stored in one isolated synthetic
// mt_learner_profile row ("__ff_latin_mastery__") as jsonb — no new table (DDL isn't
// reachable with the service key), and deliberately separate from Latin Lab's
// mt_latin_vocab_state so the two courses never cross-contaminate.
import { newCard, reviewCard, isDue, isMastered, stateLabel, type FsrsCardState, type RatingKey } from "@/lib/latin-lab/fsrs";
import { readJsonbDoc, mutateJsonbDoc } from "@/lib/jsonb-store";

export const FF_MASTERY_SUBJECT = "__ff_latin_mastery__";

export type FFCard = {
  key: string;       // stable item id, e.g. "L5:vocab:voco" or "L5:conj:porto:present"
  itemType: string;  // "vocab" | "saying" | "conjugate" | "decline" | "principal-parts" | "parse" | "translate"
  lesson: number;    // highest lesson this item belongs to (for JIT / cumulative filtering)
  fsrs: FsrsCardState;
};

export async function getMastery(userEmail: string): Promise<FFCard[]> {
  return readJsonbDoc<FFCard>(userEmail, FF_MASTERY_SUBJECT);
}

export type MasteryStats = { tracked: number; due: number; mastered: number; learning: number };

export function computeStats(cards: FFCard[], now = new Date()): MasteryStats {
  let due = 0, mastered = 0, learning = 0;
  for (const c of cards) {
    if (isMastered(c.fsrs)) mastered++;
    else if (isDue(c.fsrs, now)) due++;
    if (["learning", "relearning", "new"].includes(stateLabel(c.fsrs))) learning++;
  }
  return { tracked: cards.length, due, mastered, learning };
}

/** Cards due now, optionally capped to lessons ≤ maxLesson (JIT "prep the next class"). */
export function dueCards(cards: FFCard[], maxLesson?: number, now = new Date()): FFCard[] {
  return cards.filter((c) => isDue(c.fsrs, now) && (maxLesson === undefined || c.lesson <= maxLesson));
}

/** Record a graded answer. Auto-creates the card on first sight of an item. */
export async function reviewItem(
  userEmail: string,
  key: string,
  itemType: string,
  lesson: number,
  rating: RatingKey
): Promise<void> {
  await mutateJsonbDoc<FFCard>(
    userEmail,
    FF_MASTERY_SUBJECT,
    (cards) => {
      const idx = cards.findIndex((c) => c.key === key);
      if (idx === -1) {
        return [...cards, { key, itemType, lesson, fsrs: reviewCard(newCard(), rating) }];
      }
      const copy = cards.slice();
      copy[idx] = { ...copy[idx], fsrs: reviewCard(copy[idx].fsrs, rating) };
      return copy;
    },
    (cards) => cards.filter((c) => isDue(c.fsrs)).length
  );
}
