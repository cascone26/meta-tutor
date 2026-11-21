"use client";

import { useState } from "react";
import { SONGS, Difficulty } from "@/lib/guitar/songs";
import PlayAlong from "@/components/guitar/PlayAlong";
import ChordSheet from "@/components/guitar/ChordSheet";

const DIFFICULTIES: (Difficulty | "all")[] = ["all", "beginner", "easy", "intermediate"];
const DIFFICULTY_LABEL: Record<string, string> = { all: "All", beginner: "Beginner", easy: "Easy", intermediate: "Intermediate" };

export default function PlayAlongPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [songId, setSongId] = useState<string | null>(null);
  const [view, setView] = useState<"play" | "sheet">("play");

  const filtered = SONGS.filter((s) => difficulty === "all" || s.difficulty === difficulty);
  const song = SONGS.find((s) => s.id === songId);

  if (song) {
    return (
      <div className="pt-6">
        <div className="flex items-center justify-center gap-2 mb-2 px-5">
          <button onClick={() => setSongId(null)} className="g-btn-ghost" style={{ padding: "0.35rem 0.8rem", fontSize: "0.7rem" }}>← Songs</button>
          <button
            onClick={() => setView("play")}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: view === "play" ? "var(--g-accent)" : "var(--g-surface)", color: view === "play" ? "#fff" : "var(--g-text)", border: "1px solid var(--g-border)" }}
          >
            Play
          </button>
          <button
            onClick={() => setView("sheet")}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: view === "sheet" ? "var(--g-accent)" : "var(--g-surface)", color: view === "sheet" ? "#fff" : "var(--g-text)", border: "1px solid var(--g-border)" }}
          >
            Chord Sheet
          </button>
        </div>
        {view === "play" ? <PlayAlong song={song} /> : <ChordSheet song={song} />}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-xl font-semibold mb-1 text-center" style={{ color: "var(--g-text)" }}>Play-Along</h1>
      <p className="text-sm mb-5 text-center" style={{ color: "var(--g-muted)" }}>{SONGS.length} songs — pick one to play along with a metronome or read its chord sheet.</p>

      <div className="flex justify-center gap-2 mb-5 flex-wrap">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              background: difficulty === d ? "var(--g-accent)" : "var(--g-surface)",
              color: difficulty === d ? "#fff" : "var(--g-text)",
              border: "1px solid var(--g-border)",
            }}
          >
            {DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5">
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSongId(s.id); setView("play"); }}
            className="g-card px-4 py-3 text-left flex items-center justify-between transition-transform hover:-translate-y-0.5"
          >
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--g-text)" }}>{s.title}</div>
              <div className="text-xs" style={{ color: "var(--g-muted)" }}>Key of {s.key} · {s.bpm} BPM</div>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase shrink-0 ml-2"
              style={{ background: "var(--g-accent-wash)", color: "var(--g-accent-dark)" }}
            >
              {s.difficulty}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
