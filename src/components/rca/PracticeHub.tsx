"use client";

import { useState } from "react";
import UnderstandingCheck from "./UnderstandingCheck";
import SpeedDrill from "./SpeedDrill";
import MultipleChoiceQuiz from "./games/MultipleChoiceQuiz";
import MatchGame from "./games/MatchGame";
import GravityGame from "./games/GravityGame";
import { LeafIcon } from "./NatureIcons";

type Mode = "check" | "drill" | "mc" | "match" | "gravity";

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "check", label: "Understanding check", desc: "Deep, AI-graded, free response" },
  { id: "mc", label: "Multiple choice", desc: "Fast click-through quiz" },
  { id: "drill", label: "Speed drill", desc: "Flashcards, self-graded" },
  { id: "match", label: "Match", desc: "Click to pair, race the clock" },
  { id: "gravity", label: "Gravity", desc: "Type it before it falls" },
];

// Not every mode fits every subject equally. Speed Drill/Match/Gravity all run
// on short term<->answer flashcards (fetchShortCards) — that's a great match
// for subjects that are actually made of discrete memorizable facts (Latin
// vocab/declensions, catechism Q&A, spelling/grammar terms, math facts), and
// an awkward one for subjects that are fundamentally about writing/reasoning
// at length (a narration essay or a research paragraph doesn't reduce to a
// flashcard pair). Understanding Check (free response) and Multiple Choice
// both work everywhere, so they're never excluded — this only reorders which
// mode leads, plus a small "Best fit" badge, not a hard gate. Keyed by the
// real rcaClasses ids so it's exact per class, not a guessed subject "type".
const RECOMMENDED: Record<string, Mode[]> = {
  "saxon-76": ["drill", "gravity"], // math facts/procedures — fast recall under mild pressure fits directly
  "loe-essentials-c": ["match", "drill"], // phonograms/spelling rules/grammar terms are literally term<->definition pairs
  "first-form-latin-6": ["drill", "match"], // vocab + declension/conjugation memory work — the clearest flashcard fit of any class
  "religion-6": ["drill", "match"], // Baltimore Catechism is fixed question->answer pairs by design
  "science-6": ["mc", "match"], // vocab-heavy (matter/forces/biomes terms) + concept checks
  "history-6": ["mc", "drill"], // dates/names/places recall, alongside the research-paper writing Understanding Check covers
  "classical-language-arts-6": ["check", "drill"], // narration essays need free-response depth; poetry stanzas still drill well
  "music-34": ["drill", "mc"], // lyrics/hymn text and note/term recall are memorization-shaped
};

// One place to reach every practice mode for a class — the "mix of everything"
// layer. Every mode writes to the same subject-progress history with its own
// `mode` tag, so RcaDashboard can show which ones actually get used.
export default function PracticeHub({
  subjectId,
  subjectName,
  lessonN,
}: {
  subjectId: string;
  subjectName: string;
  /** Review mode — every game grounds on this specific past lesson instead of the current one. */
  lessonN?: number;
}) {
  const recommended = RECOMMENDED[subjectId] ?? [];
  const orderedModes = [
    ...recommended.map((id) => MODES.find((m) => m.id === id)!).filter(Boolean),
    ...MODES.filter((m) => !recommended.includes(m.id)),
  ];
  const [mode, setMode] = useState<Mode>(recommended[0] ?? "check");

  return (
    <div className="mb-6">
      <div className="flex gap-1.5 flex-wrap mb-3">
        {orderedModes.map((m) => {
          const isRecommended = recommended.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              style={{
                background: mode === m.id ? "#6b8e5a" : "#fbf8f0",
                color: mode === m.id ? "#fff" : "#5a7a4a",
                border: `1px solid ${mode === m.id ? "#6b8e5a" : isRecommended ? "#c9843a" : "#d9e4d3"}`,
              }}
              title={isRecommended ? `Best fit for ${subjectName}` : undefined}
            >
              {isRecommended && <span style={{ color: mode === m.id ? "#fff" : "#c9843a" }}>★</span>}
              {m.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: "#8a9a7c" }}>
        <LeafIcon size={11} />
        {MODES.find((m) => m.id === mode)?.desc}
        {recommended.includes(mode) && <span style={{ color: "#c9843a" }}>— best fit for {subjectName}</span>}
      </p>

      {mode === "check" && <UnderstandingCheck subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "drill" && <SpeedDrill subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "mc" && <MultipleChoiceQuiz subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "match" && <MatchGame subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "gravity" && <GravityGame subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
    </div>
  );
}
