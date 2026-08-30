// Server-only Latin Lab progress helpers — shared by /api/latin-progress (CRUD) and
// /api/latin-lab (AI generation, which needs rolling accuracy to pick a difficulty
// tier). Uses the service-role Supabase client — only ever import this from an
// app/api/**/route.ts file, never from a client component.
import { getSupabase } from "@/lib/supabase";

const ROLLING_WINDOW = 15; // per the research: ~15 comprehension checks gives a usable profile

export async function getRollingAccuracy(userEmail: string): Promise<{ accuracy: number; sampleSize: number }> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mt_latin_comprehension")
    .select("correct")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false })
    .limit(ROLLING_WINDOW);

  if (error || !data || data.length === 0) return { accuracy: 0.5, sampleSize: 0 }; // default: medium difficulty until we have data

  const correct = data.filter((r) => r.correct).length;
  return { accuracy: correct / data.length, sampleSize: data.length };
}

export function difficultyForAccuracy(accuracy: number, sampleSize: number): "easy" | "medium" | "hard" {
  if (sampleSize < 3) return "medium"; // not enough signal yet — start in the middle
  if (accuracy < 0.7) return "easy";
  if (accuracy > 0.85) return "hard";
  return "medium";
}

export async function getWeakGrammarTags(userEmail: string): Promise<{ tag: string; missCount: number }[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mt_latin_comprehension")
    .select("grammar_tags, correct")
    .eq("user_email", userEmail)
    .eq("correct", false)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    for (const tag of (row.grammar_tags as string[]) || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag, missCount]) => ({ tag, missCount }));
}
