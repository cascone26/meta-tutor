import type { LearnerProfile } from "@/lib/tutor-core/types";
import { subjectLabel } from "./subject-label";

function relativeTime(iso: string | null): string {
  if (!iso) return "never";
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function SubjectBreakdown({ profile }: { profile: LearnerProfile }) {
  const tracked = profile.subjects.filter((s) => s.sampleSize > 0 || s.dueCount > 0);

  return (
    <div className="rounded-xl p-4" style={{ background: "#1a1d2b", border: "1px solid #2a2d3d" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "#8a9bd8" }}>By subject</p>
      {tracked.length === 0 ? (
        <p className="text-sm" style={{ color: "#8087a0" }}>Nothing tracked yet — use a subject and it'll show up here.</p>
      ) : (
        <div className="space-y-3">
          {tracked.map((s) => (
            <div key={s.subjectId} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium" style={{ color: "#e8e6f0" }}>{subjectLabel(s.subjectId)}</span>
                <span className="text-xs ml-2" style={{ color: "#8087a0" }}>
                  last active {relativeTime(s.lastActivityAt)}
                  {s.dueCount > 0 && ` · ${s.dueCount} due`}
                </span>
              </div>
              <span style={{ color: "#e8e6f0" }}>{s.accuracy !== null ? `${Math.round(s.accuracy * 100)}%` : "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
