import BackLink from "@/components/rca/BackLink";
import { BirdIcon } from "@/components/rca/NatureIcons";
import { music34LessonsYearB } from "@/lib/rca-content/music-3-4-year-b";

// Archived reference — see the header comment in music-3-4-year-b.ts. Kept
// simple (no pacing/lesson-viewer logic) since it's not live curriculum,
// just something to page through if RCA runs Year B again.
export default function MusicYearBPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <BackLink href="/rca/music-34" size="xs">Back to Music 3-4</BackLink>

        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <BirdIcon size={24} style={{ color: "#3f7ea6" }} />
            Music 3-4 — Year B (archived)
          </h1>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            Not this year's curriculum (2026-2027 is Year A) — kept for reference in case RCA runs
            Year B in a future year.
          </p>
        </div>

        <div className="space-y-3">
          {music34LessonsYearB.map((l) => (
            <div key={l.n} className="rounded-xl p-4" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#3f7ea6" }}>Lesson {l.n}</p>
              {l.note && <p className="text-xs font-semibold mb-1" style={{ color: "#8a6a45" }}>{l.note}</p>}
              <p className="text-sm mb-1" style={{ color: "#3a4a34" }}><span className="font-semibold">Warm-up: </span>{l.warmup}</p>
              <p className="text-sm mb-1" style={{ color: "#3a4a34" }}><span className="font-semibold">Hymns and Chants: </span>{l.hymnsChants}</p>
              <p className="text-sm" style={{ color: "#3a4a34" }}><span className="font-semibold">Recorder: </span>{l.recorder}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
