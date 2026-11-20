"use client";

import { useState } from "react";
import { SONGS } from "@/lib/guitar/songs";
import PlayAlong from "@/components/guitar/PlayAlong";

export default function PlayAlongPage() {
  const [songId, setSongId] = useState(SONGS[0].id);
  const song = SONGS.find((s) => s.id === songId)!;

  return (
    <div className="max-w-md mx-auto px-5 py-6">
      <h1 className="text-xl font-semibold mb-4 text-center" style={{ color: "var(--foreground)" }}>Play-Along</h1>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {SONGS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSongId(s.id)}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              background: s.id === songId ? "var(--accent)" : "var(--surface)",
              color: s.id === songId ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)",
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
