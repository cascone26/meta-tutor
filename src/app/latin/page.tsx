"use client";

import { useEffect, useState } from "react";
import { getSubjectProgress } from "@/lib/subject-progress";

export default function LatinPage() {
  const [weakAreas, setWeakAreas] = useState<{ terms: string[]; categories: string[] }>({ terms: [], categories: [] });
  const [sessionsLogged, setSessionsLogged] = useState(0);

  useEffect(() => {
    getSubjectProgress("latin").then((p) => {
      setWeakAreas(p.weakAreas);
      setSessionsLogged(p.history.length);
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <h1 className="text-xl font-semibold mb-1">Latin</h1>
      <p className="text-sm mb-8" style={{ color: "#c2a988" }}>
        Vocab and grammar drills, quizzed like Quizlet, tracked like everything else here.
      </p>

      <div className="rounded-xl p-4 mb-4" style={{ background: "#241c14", border: "1px solid #382c1c" }}>
        <h2 className="text-sm font-semibold mb-1">Coming next</h2>
        <ul className="text-sm space-y-1.5 mt-2" style={{ color: "#c2a988" }}>
          <li>&mdash; Vocab + declension/conjugation flashcards and quizzing for the school year's material</li>
          <li>&mdash; Same active-recall study modes as the rest of Meta Tutor, retargeted at Latin</li>
          <li>&mdash; Chat that notices recurring mistakes and suggests going back to fundamentals</li>
        </ul>
      </div>

      <div className="rounded-xl p-4" style={{ background: "#241c14", border: "1px solid #382c1c" }}>
        <h2 className="text-sm font-semibold mb-2">Your weak areas</h2>
        {sessionsLogged === 0 ? (
          <p className="text-sm" style={{ color: "#8a7355" }}>No study sessions logged yet.</p>
        ) : (
          <div className="flex gap-1.5 flex-wrap">
            {weakAreas.terms.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#182620", color: "#6fae82" }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
