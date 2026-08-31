import type { LearnerProfile } from "@/lib/tutor-core/types";

export default function ProfileStats({ profile }: { profile: LearnerProfile }) {
  const withData = profile.subjects.filter((s) => s.sampleSize > 0);
  const avgAccuracy =
    withData.length > 0 && withData.some((s) => s.accuracy !== null)
      ? withData.filter((s) => s.accuracy !== null).reduce((sum, s) => sum + (s.accuracy as number), 0) /
        withData.filter((s) => s.accuracy !== null).length
      : null;
  const totalDue = profile.subjects.reduce((sum, s) => sum + s.dueCount, 0);

  const stats = [
    { label: "Subjects tracked", value: String(withData.length) },
    { label: "Overall accuracy", value: avgAccuracy !== null ? `${Math.round(avgAccuracy * 100)}%` : "—" },
    { label: "Due right now", value: String(totalDue) },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "#1a1d2b", border: "1px solid #2a2d3d" }}>
          <p className="text-xl font-bold" style={{ color: "#e8e6f0" }}>{s.value}</p>
          <p className="text-xs mt-1" style={{ color: "#8087a0" }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
