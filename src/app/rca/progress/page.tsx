import { LeafIcon } from "@/components/rca/NatureIcons";
import ProgressTrend from "@/components/rca/ProgressTrend";

// The "test my understanding" checks already save every result (via
// subject-progress.ts's logWrongAnswer/saveResult, namespaced `rca-<subjectId>`)
// but nothing ever looked back at that data — this is the missing trend view.
export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* No "Back to RCA" pill here — the header already shows "All RCA classes" contextually. */}
        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <LeafIcon size={24} style={{ color: "#6b8e5a" }} />
            Prep progress
          </h1>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            How your "test my understanding" checks have gone, per class.
          </p>
        </div>

        <ProgressTrend />
      </div>
    </div>
  );
}
