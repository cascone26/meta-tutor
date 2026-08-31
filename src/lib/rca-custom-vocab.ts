"use client";

import { useEffect, useState } from "react";

// Jacob-added Latin vocab/phrases, checked via /api/rca-vocab-check then
// saved here so they show up as real flashcards in SoundStudio's Study/Quiz
// modes alongside the built-in latin-core.ts vocabulary — same
// localStorage-per-browser pattern as RcaNotes.tsx. Also best-effort synced to
// /api/rca-custom-vocab (mt_custom_vocab) so the words are durable
// cross-device AND visible to scripts/gen-custom-vocab-audio.mjs, the local
// script that's the only way to generate real verified audio for a
// Jacob-typed word (see the table comment in supabase-schema-hub.sql for why
// this can't just happen live in the app). audioReady flips true once that
// script has run and a real mp3 exists — SoundStudio uses it to decide
// between the real file and the instant-but-lower-fidelity browser-speech
// fallback.
export type CustomVocabItem = {
  id: string;
  latin: string;
  english: string;
  category: string;
  note?: string;
  createdAt: number;
  audioReady?: boolean;
};

const STORAGE_KEY = "meta-tutor-latin-custom-vocab";

export function useCustomVocab() {
  const [items, setItems] = useState<CustomVocabItem[]>([]);

  useEffect(() => {
    // Deferred a tick (same pattern as useRcaPacingOffsets' fetch().then())
    // rather than setState synchronously in the effect body — this only ever
    // runs client-side post-mount either way, so it's just as SSR/hydration-
    // safe, but keeps the actual state update off the initial effect tick.
    Promise.resolve().then(async () => {
      let local: CustomVocabItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) local = JSON.parse(raw);
      } catch {}
      setItems(local);

      // Merge in the server's view: picks up words added on another
      // device, and refreshes audioReady for anything the local generator
      // script has since verified. Best-effort — if this fails, the local
      // list from above still works exactly as before.
      try {
        const res = await fetch("/api/rca-custom-vocab");
        if (!res.ok) return;
        const { items: serverItems } = (await res.json()) as { items: CustomVocabItem[] };
        const byId = new Map(local.map((i) => [i.id, i]));
        for (const s of serverItems) {
          const existing = byId.get(s.id);
          if (existing) existing.audioReady = s.audioReady;
          else byId.set(s.id, s);
        }
        const merged = [...byId.values()];
        setItems(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {}
    });
  }, []);

  function persist(next: CustomVocabItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addItem(item: Omit<CustomVocabItem, "id" | "createdAt" | "audioReady">): CustomVocabItem {
    const withId: CustomVocabItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    persist([...items, withId]);
    fetch("/api/rca-custom-vocab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(withId),
    }).catch(() => {}); // best-effort — localStorage already has it regardless
    return withId;
  }

  function removeItem(id: string) {
    persist(items.filter((i) => i.id !== id));
    fetch(`/api/rca-custom-vocab?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  }

  return { items, addItem, removeItem };
}
