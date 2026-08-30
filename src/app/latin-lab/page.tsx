"use client";

import { useState } from "react";
import { latinUnits, latinUnitsRoadmap, getLatinUnit } from "@/lib/latin-lab/units";
import UnitReader from "@/components/latin-lab/UnitReader";
import ComprehensionCheck from "@/components/latin-lab/ComprehensionCheck";
import VocabReview from "@/components/latin-lab/VocabReview";
import ProgressPanel from "@/components/latin-lab/ProgressPanel";

type View = "read" | "check" | "review" | "progress";

export default function LatinLabPage() {
  const [unitId, setUnitId] = useState(latinUnits[0].id);
  const [view, setView] = useState<View>("read");
  const unit = getLatinUnit(unitId)!;

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#f0e6d8" }}>Latin Lab</h1>
      <p className="text-sm mb-1" style={{ color: "#a08b73" }}>
        Comprehensible-input method, classical pronunciation — a separate, research-based course from RCA's Latin.
      </p>
      <p className="text-xs mb-5" style={{ color: "#7a6852" }}>
        Adaptive: comprehension checks are AI-generated per attempt and get harder as your accuracy climbs; vocabulary review
        uses FSRS spaced repetition, not a fixed schedule. This gets more accurate the more you use it.
      </p>

      {/* Unit picker */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {latinUnits.map((u) => (
          <button
            key={u.id}
            onClick={() => { setUnitId(u.id); setView("read"); }}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: u.id === unitId ? "#c17a3a" : "#241b14",
              color: u.id === unitId ? "#1a1410" : "#a08b73",
              border: "1px solid #3a2d1f",
            }}
          >
            {u.order}. {u.title}
          </button>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-1 mb-5 rounded-lg p-1" style={{ background: "#241b14" }}>
        {(["read", "check", "review", "progress"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 py-1.5 rounded-md text-xs font-medium capitalize"
            style={{ background: view === v ? "#3a2d1f" : "transparent", color: view === v ? "#f0e6d8" : "#7a6852" }}
          >
            {v === "check" ? "Comprehension" : v === "review" ? "Vocab review" : v}
          </button>
        ))}
      </div>

      {view === "read" && <UnitReader unit={unit} onStartCheck={() => setView("check")} />}
      {view === "check" && <ComprehensionCheck unit={unit} onDone={() => setView("read")} />}
      {view === "review" && <VocabReview onDone={() => setView("progress")} />}
      {view === "progress" && <ProgressPanel />}

      <div className="mt-8 rounded-xl p-4" style={{ background: "#1f1712", border: "1px dashed #3a2d1f" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#7a6852" }}>Roadmap — not built yet</p>
        <ul className="text-xs space-y-1" style={{ color: "#6b5a45" }}>
          {latinUnitsRoadmap.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
