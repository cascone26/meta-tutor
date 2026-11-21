"use client";

import { useState } from "react";
import { SONGS } from "@/lib/guitar/songs";
import PlayAlong from "@/components/guitar/PlayAlong";

export default function PlayAlongPage() {
  const [songId, setSongId] = useState(SONGS[0].id);
  const song = SONGS.find((s) => s.id === songId)!;

  return (
    <div className="pt-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap px-5">
        {SONGS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSongId(s.id)}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              background: s.id === songId ? "var(--g-accent)" : "var(--g-surface)",
              color: s.id === songId ? "#fff" : "var(--g-text)",
              border: "1px solid var(--g-border)",
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
      <PlayAlong song={song} />
    </div>
  );
}
