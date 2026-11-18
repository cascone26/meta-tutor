/**
 * Starred sections — a lighter-weight companion to notes.ts's freeform chat
 * notes. Content pages (Catholic vs. Lutheran, Denominations, Heresies, etc.)
 * are built from structured topic/section arrays with stable ids, so instead
 * of saving a text blob, starring just remembers "this exact section,
 * on this exact page" and links back to it. Same localStorage-only pattern
 * as notes.ts and the existing Saved Arguments page.
 */

export interface StarredSection {
  key: string;
  page: string;
  href: string;
  title: string;
  summary: string;
  createdAt: string;
}

const KEY = "veritas-starred-sections";

export function getStars(): StarredSection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StarredSection[]) : [];
  } catch {
    return [];
  }
}

export function isStarred(key: string): boolean {
  return getStars().some((s) => s.key === key);
}

export function toggleStar(section: Omit<StarredSection, "createdAt">): boolean {
  const stars = getStars();
  const exists = stars.some((s) => s.key === section.key);
  const next = exists
    ? stars.filter((s) => s.key !== section.key)
    : [{ ...section, createdAt: new Date().toISOString() }, ...stars];
  localStorage.setItem(KEY, JSON.stringify(next));
  return !exists;
}

export function removeStar(key: string): void {
  localStorage.setItem(KEY, JSON.stringify(getStars().filter((s) => s.key !== key)));
}
