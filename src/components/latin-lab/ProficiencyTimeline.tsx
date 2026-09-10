"use client";

import { latinProficiencyTimeline } from "@/lib/latin-lab/proficiency-timeline";

// Static reference content (researched once, not per-render) — see
// proficiency-timeline.ts's header comment for full source citations.
export default function ProficiencyTimeline() {
  return (
    <div>
      <div className="rounded-xl p-4 mb-4" style={{ background: "#241b14", border: "1px solid #3a2d1f" }}>
        <p className="text-xs font-semibold mb-1" style={{ color: "#c17a3a" }}>Your researched learning timeline</p>
        <p className="text-sm" style={{ color: "#f0e6d8", lineHeight: 1.6 }}>
          Where a self-taught Latin reader should realistically be, phase by phase — benchmarked against the National
          Latin Exam syllabi, the ACTFL/American Classical League Standards for Classical Language Learning, Ørberg&apos;s
          Lingua Latina self-study pacing, and general self-study fluency research (~600-650 hours / 1-2 years to real
          reading fluency). Latin Lab&apos;s units cover comparable grammar in a comparable order — not a verified
          chapter-for-chapter match — so each phase is described as &quot;roughly parallel to,&quot; not identical to, its
          external benchmark.
        </p>
      </div>

      <div className="rounded-xl p-4 mb-4" style={{ background: "#2e2419", border: "1px solid #c17a3a" }}>
        <p className="text-xs font-semibold" style={{ color: "#c17a3a" }}>Where you are now</p>
        <p className="text-sm mt-1" style={{ color: "#f0e6d8" }}>
          Units 1-10 are built and live — that&apos;s the Phase 1 → Phase 2 boundary below. Units 11-15 (Phase 3) are
          roadmap-only so far.
        </p>
      </div>

      <div className="space-y-3">
        {latinProficiencyTimeline.map((p) => {
          const isRoadmapOnly = p.latinLabUnits.includes("roadmap") || p.latinLabUnits.includes("Beyond") || p.latinLabUnits.includes("unadapted");
          return (
            <div key={p.phase} className="rounded-xl p-4" style={{ background: "#221912", border: "1px solid #3a2d1f" }}>
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <p className="text-sm font-bold" style={{ color: "#f0e6d8" }}>
                  Phase {p.phase} — {p.title}
                </p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: isRoadmapOnly ? "#3a2d1f" : "#4a6a3a", color: isRoadmapOnly ? "#a08b73" : "#e8f0e0" }}
                >
                  {isRoadmapOnly ? "roadmap" : "built"}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: "#c17a3a" }}>{p.timeframe} · {p.proficiencyLevel}</p>
              <p className="text-xs mb-2" style={{ color: "#a08b73" }}>Latin Lab: {p.latinLabUnits}</p>
              <ul className="text-sm space-y-0.5 mb-2" style={{ color: "#e0d0b8" }}>
                {p.whatYouShouldKnow.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <span style={{ color: "#c17a3a" }}>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px]" style={{ color: "#7a6852" }}>{p.externalBenchmark}</p>
              <p className="text-[10px] mt-1" style={{ color: "#5c4d3a" }}>Source: {p.source}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
