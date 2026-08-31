"use client";

import { useEffect, useState } from "react";

// Jacob-added Latin vocab/phrases, checked via /api/rca-vocab-check then
// saved here so they show up as real flashcards in SoundStudio's Study/Quiz
// modes alongside the built-in latin-core.ts vocabulary — same
// localStorage-per-browser pattern as RcaNotes.tsx.
export type CustomVocabItem = {
  id: string;
  latin: string;
  english: string;
  category: string;
  note?: string;
  createdAt: number;
};

const STORAGE_KEY = "meta-tutor-latin-custom-vocab";

export function useCustomVocab() {
  const [items, setItems] = useState<CustomVocabItem[]>([]);

  useEffect(() => {
    // Deferred a tick (same pattern as useRcaPacingOffsets' fetch().then())
    // rather than setState synchronously in the effect body — this only ever
    // runs client-side post-mount either way, so it's just as SSR/hydration-
    // safe, but keeps the actual state update off the initial effect tick.
    Promise.resolve().then(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
    });
  }, []);

  function persist(next: CustomVocabItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addItem(item: Omit<CustomVocabItem, "id" | "createdAt">): CustomVocabItem {
    const withId: CustomVocabItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    persist([...items, withId]);
    return withId;
  }

  function removeItem(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  return { items, addItem, removeItem };
}
