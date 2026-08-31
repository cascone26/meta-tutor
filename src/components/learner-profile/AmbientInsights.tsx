import type { AmbientInsight } from "@/lib/tutor-core/types";

function hourLabel(hour: number): string {
  const h = hour % 12 || 12;
  return `${h}${hour < 12 ? "am" : "pm"}`;
}

export default function AmbientInsights({ insight }: { insight: AmbientInsight | null }) {
  if (!insight || insight.sampleDays < 1) return null; // nothing to say yet — say nothing, not a fake stat

  const parts: string[] = [];
  if (insight.peakFocusHour !== null) parts.push(`you focus best around ${hourLabel(insight.peakFocusHour)}`);
  if (insight.avgSessionMinutes !== null) parts.push(`typical session is ~${Math.round(insight.avgSessionMinutes)} min`);

  if (parts.length === 0) return null;

  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#1a1d2b", border: "1px solid #2a2d3d" }}>
      <p className="text-xs font-semibold mb-2" style={{ color: "#8a9bd8" }}>
        From your activity {insight.sampleDays < 7 ? `(${insight.sampleDays} day${insight.sampleDays === 1 ? "" : "s"} so far)` : ""}
      </p>
      <p className="text-sm" style={{ color: "#e8e6f0" }}>
        {parts.join(", ")}.
      </p>
    </div>
  );
}
