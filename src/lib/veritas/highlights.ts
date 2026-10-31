export interface Highlight {
  id: string;
  pageUrl: string;
  selectedText: string;
  color: "yellow" | "green" | "blue" | "pink";
  note: string;
  createdAt: number;
}

const STORAGE_KEY = "veritas-highlights";

function getAll(): Highlight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(highlights: Highlight[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
}

export function getAllHighlights(): Highlight[] {
  return getAll();
}

export function getHighlightsForPage(url: string): Highlight[] {
  return getAll().filter((h) => h.pageUrl === url);
}

export function addHighlight(
  pageUrl: string,
  selectedText: string,
  color: Highlight["color"],
  note: string = ""
): Highlight {
  const highlights = getAll();
  const h: Highlight = {
    id: crypto.randomUUID(),
    pageUrl,
    selectedText,
    color,
    note,
    createdAt: Date.now(),
  };
  highlights.push(h);
  saveAll(highlights);
  return h;
}

export function deleteHighlight(id: string) {
  const highlights = getAll().filter((h) => h.id !== id);
  saveAll(highlights);
}

export function updateHighlightNote(id: string, note: string) {
  const highlights = getAll();
  const h = highlights.find((h) => h.id === id);
  if (h) {
    h.note = note;
    saveAll(highlights);
  }
}
