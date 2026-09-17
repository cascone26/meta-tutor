// The DrillItem shape + answer grading for First Form Latin practice. Items are built in
// content.ts from verified sources (vocab-data.ts + latin-grammar-charts.ts). Grading is
// deterministic wherever the source gives an exact answer (vocab, sayings, paradigm forms)
// — instant, free, and correct — so AI is only a fallback for genuinely free-form translation.

export type DrillItem = {
  key: string;
  lesson: number;            // earliest lesson this item is taught (for cumulative/JIT filtering)
  itemType: "vocab" | "saying" | "conjugate" | "decline" | "principal-parts" | "parse" | "translate";
  prompt: string;            // shown to Jacob
  direction?: string;        // e.g. "English → Latin"
  answer: string;            // the canonical correct answer
  acceptable?: string[];     // extra accepted variants
};

// ── Grading ──────────────────────────────────────────────────────────────────

/** Normalize for forgiving-but-fair matching: lowercase, strip macrons/diacritics,
 * collapse whitespace, drop trailing punctuation. */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics (macrons)
    .replace(/[.,;:!?'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

export type GradeResult = { correct: boolean; near: boolean; expected: string };

/** Deterministic grade for exact-answer item types (vocab/saying/conjugate/decline).
 * `near` = macron/typo-close (1 edit) → count as a miss but tell him he was close. */
export function gradeExact(item: DrillItem, answer: string): GradeResult {
  const got = norm(answer);
  const want = norm(item.answer);
  const variants = [want, ...(item.acceptable ?? []).map(norm)];
  if (variants.includes(got)) return { correct: true, near: false, expected: item.answer };
  const near = variants.some((w) => w.length > 3 && levenshtein(got, w) <= 1);
  return { correct: false, near, expected: item.answer };
}

/** Item types that grade deterministically (no AI). parse/translate may need AI for phrasing. */
export function isExactType(t: DrillItem["itemType"]): boolean {
  return t === "vocab" || t === "saying" || t === "conjugate" || t === "decline" || t === "principal-parts";
}
