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
  const [mode, setMode] = useState<Mode>("check");

  return (
    <div className="mb-6">
      <div className="flex gap-1.5 flex-wrap mb-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: mode === m.id ? "#6b8e5a" : "#fbf8f0",
              color: mode === m.id ? "#fff" : "#5a7a4a",
              border: "1px solid #d9e4d3",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: "#8a9a7c" }}>
        <LeafIcon size={11} />
        {MODES.find((m) => m.id === mode)?.desc}
      </p>

      {mode === "check" && <UnderstandingCheck subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "drill" && <SpeedDrill subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "mc" && <MultipleChoiceQuiz subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "match" && <MatchGame subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
      {mode === "gravity" && <GravityGame subjectId={subjectId} subjectName={subjectName} lessonN={lessonN} />}
    </div>
  );
}
