/**
 * Local "highlight and save" notes for Veritas AI chat/response text — the
 * copy-paste-to-Notes-app workflow Jacob was already doing by hand. Same
 * localStorage-only pattern as the existing Saved Arguments page (no Supabase
 * table, no auth round trip, instant).
 */

export interface VeritasNote {
  id: string;
  text: string;
  source: string;
  createdAt: string;
}

const KEY = "veritas-chat-notes";

export function getNotes(): VeritasNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as VeritasNote[]) : [];
  } catch {
    return [];
  }
}

export function saveNote(text: string, source: string): VeritasNote {
  const note: VeritasNote = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    source,
    createdAt: new Date().toISOString(),
  };
  const notes = [note, ...getNotes()];
  localStorage.setItem(KEY, JSON.stringify(notes));
  return note;
}

export function deleteNote(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(getNotes().filter((n) => n.id !== id)));
}
