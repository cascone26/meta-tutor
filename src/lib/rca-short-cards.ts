export type ShortCard = { term: string; answer: string };

// Shared fetch for the "short" card format both Match and Gravity need — answers
// under ~4 words, unlike the free-text/multi-sentence answers the other modes use.
export async function fetchShortCards(subjectId: string, lessonN?: number): Promise<{ cards: ShortCard[]; error?: string }> {
  const res = await fetch("/api/rca-understanding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "generate-short", subjectId, lessonN }),
  });
  const data = await res.json();
  if (!res.ok || data.error || !data.cards?.length) {
    return { cards: [], error: data.error || "Couldn't load cards — try again." };
  }
  return { cards: data.cards };
}

// Forgiving match for typed answers — case/punctuation/whitespace-insensitive,
// and accepts a substring match either direction so "rome" matches "Rome" or "the
// Roman Empire" without demanding a verbatim hit.
export function looseMatch(input: string, target: string): boolean {
  const norm = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");
  const a = norm(input);
  const b = norm(target);
  if (!a) return false;
  if (a === b) return true;
  // Substring matching only kicks in above 2 chars — otherwise a single letter
  // that happens to appear in the target ("o" in "Rome") would false-positive.
  return a.length > 2 && (b.includes(a) || a.includes(b));
}
