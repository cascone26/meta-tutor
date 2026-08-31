import type { LearnerProfile } from "@/lib/tutor-core/types";
import { subjectLabel } from "./subject-label";

export default function WeakAreasList({ profile }: { profile: LearnerProfile }) {
  const flattened = profile.subjects
    .flatMap((s) => s.weakAreas.map((w) => ({ ...w, subjectId: s.subjectId })))
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 10);

  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#1a1d2b", border: "1px solid #2a2d3d" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "#8a9bd8" }}>Where you're actually struggling — across everything</p>
      {flattened.length === 0 ? (
        <p className="text-sm" style={{ color: "#8087a0" }}>Not enough data yet — this fills in as you use each subject.</p>
      ) : (
        <div className="space-y-2">
          {flattened.map((w, i) => (
            <div key={`${w.subjectId}-${w.label}-${i}`} className="flex items-center justify-between text-sm">
              <div>
                <span style={{ color: "#e8e6f0" }}>{w.label}</span>
                <span className="text-xs ml-2" style={{ color: "#8087a0" }}>{subjectLabel(w.subjectId)}</span>
              </div>
              <span style={{ color: "#d88a8a" }}>{w.missCount}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
