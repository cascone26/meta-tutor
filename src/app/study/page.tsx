"use client";

import { useState } from "react";
import Flashcards from "@/components/study/Flashcards";
import Practice from "@/components/study/Practice";
import Match from "@/components/study/Match";
import MultipleChoice from "@/components/study/MultipleChoice";
import Learn from "@/components/study/Learn";
import EssayOutliner from "@/components/study/EssayOutliner";
import TeachBack from "@/components/study/TeachBack";
import FillInBlank from "@/components/study/FillInBlank";
import ArgumentReconstruction from "@/components/study/ArgumentReconstruction";
import TimedExam from "@/components/study/TimedExam";
import SocraticDialogue from "@/components/study/SocraticDialogue";
import Debate from "@/components/study/Debate";
import ReadingComp from "@/components/study/ReadingComp";
import AudioReview from "@/components/study/AudioReview";
import AnalogyGenerator from "@/components/study/AnalogyGenerator";

type Mode = "hub" | "learn" | "flashcards" | "practice" | "match" | "mc" | "outline" | "teachback" | "fillinblank" | "argument" | "exam" | "socratic" | "debate" | "reading" | "audio" | "analogy";

const modes = [
  {
    id: "learn" as Mode,
    title: "Learn",
    description: "Quizlet-style learning. Multiple choice first, then type. Master every term.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
    color: "#e07c4f",
    featured: true,
  },
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
    featured: false,
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
    featured: false,
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
    featured: false,
  },
  {
    id: "mc" as Mode,
    title: "Multiple Choice",
    description: "Quick quiz with auto-generated questions from the glossary.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    color: "#6ab070",
    featured: false,
  },
  {
    id: "outline" as Mode,
    title: "Essay Outliner",
    description: "Build structured outlines for essay questions before writing.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: "#8b6ba7",
    featured: false,
  },
  {
    id: "teachback" as Mode,
    title: "Teach Back",
    description: "Explain concepts in your own words. AI evaluates your understanding.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    color: "#c67db7",
    featured: false,
  },
  {
    id: "fillinblank" as Mode,
    title: "Fill in Blank",
    description: "Key terms blanked from definitions. Fill them in from memory.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16M4 12h8M4 17h12" />
        <rect x="14" y="10" width="6" height="4" rx="1" strokeDasharray="2 2" />
      </svg>
    ),
    color: "#6b9fbf",
    featured: false,
  },
  {
    id: "argument" as Mode,
    title: "Arguments",
    description: "Reconstruct a philosopher's argument from the conclusion.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12h6M9 16h6M13 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-7-5z" />
        <path d="M13 4v5h5" />
      </svg>
    ),
    color: "#9a7c6b",
    featured: false,
  },
  {
    id: "exam" as Mode,
    title: "Timed Exam",
    description: "Full mock exam. 30 minutes, no AI, no glossary. Real pressure.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: "#c96b6b",
    featured: false,
  },
  {
    id: "socratic" as Mode,
    title: "Socratic",
    description: "AI only asks questions. You do the thinking.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
    ),
    color: "#d4a843",
    featured: false,
  },
  {
    id: "debate" as Mode,
    title: "Debate",
    description: "Argue a philosophical position. AI takes the other side.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "#c67db7",
    featured: false,
  },
  {
    id: "reading" as Mode,
    title: "Reading Comp",
    description: "Read primary texts, then answer comprehension questions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: "#6b8fbf",
    featured: false,
  },
  {
    id: "audio" as Mode,
    title: "Audio Review",
    description: "Listen to terms and definitions. Study on the go.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
      </svg>
    ),
    color: "#6ab070",
    featured: false,
  },
  {
    id: "analogy" as Mode,
    title: "Analogies",
    description: "Get everyday analogies for abstract concepts.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "#bf8f6b",
    featured: false,
  },
];

export default function StudyPage() {
  const [mode, setMode] = useState<Mode>("hub");

  if (mode === "learn") return <Learn onBack={() => setMode("hub")} />;
  if (mode === "flashcards") return <Flashcards onBack={() => setMode("hub")} />;
  if (mode === "practice") return <Practice onBack={() => setMode("hub")} />;
  if (mode === "match") return <Match onBack={() => setMode("hub")} />;
  if (mode === "mc") return <MultipleChoice onBack={() => setMode("hub")} />;
  if (mode === "outline") return <EssayOutliner onBack={() => setMode("hub")} />;
  if (mode === "teachback") return <TeachBack onBack={() => setMode("hub")} />;
  if (mode === "fillinblank") return <FillInBlank onBack={() => setMode("hub")} />;
  if (mode === "argument") return <ArgumentReconstruction onBack={() => setMode("hub")} />;
  if (mode === "exam") return <TimedExam onBack={() => setMode("hub")} />;
  if (mode === "socratic") return <SocraticDialogue onBack={() => setMode("hub")} />;
  if (mode === "debate") return <Debate onBack={() => setMode("hub")} />;
  if (mode === "reading") return <ReadingComp onBack={() => setMode("hub")} />;
  if (mode === "audio") return <AudioReview onBack={() => setMode("hub")} />;
  if (mode === "analogy") return <AnalogyGenerator onBack={() => setMode("hub")} />;

  const featured = modes.find((m) => m.featured)!;
  const rest = modes.filter((m) => !m.featured);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Study
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Pick a study mode. Your progress is saved automatically.
        </p>

        {/* Featured: Learn mode */}
        <button
          onClick={() => setMode(featured.id)}
          className="w-full text-left rounded-xl p-5 mb-4 transition-all"
          style={{
            background: "var(--surface)",
            border: `2px solid ${featured.color}40`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = featured.color;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = featured.color + "40";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: featured.color + "18", color: featured.color }}
            >
              {featured.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>
                  {featured.title}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: featured.color + "20", color: featured.color }}
                >
                  Recommended
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {featured.description}
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
              style={{ color: "var(--muted)" }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Other modes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {rest.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="text-left rounded-xl p-4 transition-all"
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
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2.5"
                style={{ background: m.color + "18", color: m.color }}
              >
                {m.icon}
              </div>
              <h3 className="font-semibold text-sm mb-0.5" style={{ color: "var(--foreground)" }}>
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
