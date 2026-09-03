"use client";

// Per-class-page widget layout — order + visibility of the blocks on an RCA
// class page. Built 2026-08-24 (Jacob: "an edit widget drawer wiuld be nice
// to be able to shift around what i want on the main class screen... just so
// its easier for me to customize and make more personal especially bc we
// have to many tables and poarts and stuff" — same idiom as the K2C Estate
// tool: pick which pieces show and where). Same localStorage-per-key pattern
// already used across this app (fc-progress, custom-glossary, chess-prefs,
// rca-pacing offsets) — no backend needed for a single-user layout
// preference.

export type WidgetId = "books" | "links" | "referenceMaterials" | "yearBLink" | "lesson" | "gradingChecklist" | "roster" | "practice" | "teacherGuide";

export const WIDGET_LABELS: Record<WidgetId, string> = {
  books: "Books",
  links: "Lesson plan & Drive links",
  referenceMaterials: "Reference materials (Catechism/Gospel)",
  yearBLink: "Year B archive link",
  lesson: "Lesson pacing",
  gradingChecklist: "Grading checklist",
  roster: "Roster & attendance",
  practice: "Practice modes",
  teacherGuide: "Teacher's guide",
};

export const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "books",
  "links",
  "referenceMaterials",
  "yearBLink",
  "lesson",
  "gradingChecklist",
  "roster",
  "practice",
  "teacherGuide",
];

export type LayoutPrefs = { order: WidgetId[]; hidden: WidgetId[] };

function key(classId: string) {
  return `meta-tutor-rca-layout-${classId}`;
}

export function getLayoutPrefs(classId: string): LayoutPrefs {
  if (typeof window === "undefined") return { order: DEFAULT_WIDGET_ORDER, hidden: [] };
  try {
    const raw = localStorage.getItem(key(classId));
    if (!raw) return { order: DEFAULT_WIDGET_ORDER, hidden: [] };
    const parsed = JSON.parse(raw) as LayoutPrefs;
    // Merge in any widget ids that didn't exist yet when this was last saved
    // so a stale saved order doesn't silently drop a newly-added widget.
    const known = new Set(parsed.order);
    const merged = [...parsed.order, ...DEFAULT_WIDGET_ORDER.filter((w) => !known.has(w))];
    return { order: merged, hidden: parsed.hidden ?? [] };
  } catch {
    return { order: DEFAULT_WIDGET_ORDER, hidden: [] };
  }
}

export function saveLayoutPrefs(classId: string, prefs: LayoutPrefs) {
  try {
    localStorage.setItem(key(classId), JSON.stringify(prefs));
  } catch {}
}

export function resetLayoutPrefs(classId: string) {
  try {
    localStorage.removeItem(key(classId));
  } catch {}
}
