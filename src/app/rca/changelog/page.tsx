import BackLink from "@/components/rca/BackLink";
import { LeafIcon } from "@/components/rca/NatureIcons";
import { rcaChangelog } from "@/lib/rca-changelog";

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <BackLink href="/rca" size="xs">Back to RCA</BackLink>

        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <LeafIcon size={24} style={{ color: "#6b8e5a" }} />
            What's changed
          </h1>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            Real content refresh history — useful context for next year, or if something looks off.
          </p>
        </div>

        <div className="space-y-4">
          {[...rcaChangelog].reverse().map((entry, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#3f7ea6" }}>{entry.date}</p>
              <p className="text-sm" style={{ color: "#3a4a34" }}>{entry.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
