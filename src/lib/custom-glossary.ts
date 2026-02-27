import { glossary as baseGlossary } from "./glossary";
import type { GlossaryTerm } from "./glossary";

export type { GlossaryTerm };

export type CustomGlossaryData = {
  added: GlossaryTerm[];
  edited: Record<string, GlossaryTerm>; // keyed by original term name
  deleted: string[]; // original term names to hide
};

const STORAGE_KEY = "meta-tutor-custom-glossary";

function emptyData(): CustomGlossaryData {
  return { added: [], edited: {}, deleted: [] };
}

export function getCustomData(): CustomGlossaryData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptyData();
  } catch {
    return emptyData();
  }
}

export function saveCustomData(data: CustomGlossaryData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getEffectiveGlossary(): GlossaryTerm[] {
  const { added, edited, deleted } = getCustomData();
  const deletedSet = new Set(deleted);
  const base = baseGlossary
    .filter((g) => !deletedSet.has(g.term))
    .map((g) => edited[g.term] ?? g);
  return [...base, ...added];
}

export function getEffectiveCategories(): string[] {
  return [...new Set(getEffectiveGlossary().map((g) => g.category))];
}
