"use client";

import { useState } from "react";
import Flashcards from "@/components/study/Flashcards";
import Practice from "@/components/study/Practice";
import Match from "@/components/study/Match";
import MultipleChoice from "@/components/study/MultipleChoice";

type Mode = "hub" | "flashcards" | "practice" | "match" | "mc";

const modes = [
  {
    id: "flashcards" as Mode,
    title: "Flashcards",
    description: "Flip through key terms and definitions. Mark what you know.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 4v16" />
      </svg>
    ),
    color: "#6b8fbf",
  },
  {
    id: "practice" as Mode,
    title: "Practice",
    description: "Write answers to exam questions. Reveal key points to check yourself.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    color: "#7c6b9a",
  },
  {
    id: "match" as Mode,
    title: "Match",
    description: "Race to match terms with definitions. Beat your best time.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    color: "#bf8f6b",
  },
  {
    id: "mc" as Mode,
    title: "Multiple Choice",
    description: "Test your knowledge with auto-generated questions from the glossary.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    color: "#6ab070",
  },
];

export default function StudyPage() {
  const [mode, setMode] = useState<Mode>("hub");

  if (mode === "flashcards") return <Flashcards onBack={() => setMode("hub")} />;
  if (mode === "practice") return <Practice onBack={() => setMode("hub")} />;
  if (mode === "match") return <Match onBack={() => setMode("hub")} />;
  if (mode === "mc") return <MultipleChoice onBack={() => setMode("hub")} />;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Study
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Pick a study mode. Your progress is saved automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="text-left rounded-xl p-5 transition-all group"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = m.color;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: m.color + "18", color: m.color }}
              >
                {m.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
                {m.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {m.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
