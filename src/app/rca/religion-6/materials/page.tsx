import MaterialsHub from "@/components/rca/MaterialsHub";
import BackLink from "@/components/rca/BackLink";
import { LeafIcon } from "@/components/rca/NatureIcons";

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <BackLink href="/rca/religion-6" size="xs">Back to Religion 6</BackLink>

        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <LeafIcon size={28} style={{ color: "#6b8e5a" }} />
            Course Materials
          </h1>
          <p className="text-sm mb-6" style={{ color: "#5c6b52" }}>
            All textbooks and reference materials used in Religion 6 • Legitimate online sources
          </p>
        </div>

        <MaterialsHub />

        <div
          className="mt-8 p-4 rounded-lg border border-[#d9e4d3] bg-[#fbf8f0]"
          style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 100ms both" }}
        >
          <p className="text-xs text-gray-600">
            <span className="font-semibold block mb-1">Access Notes:</span>
            "Official" links go directly to resources. "Library" links use Internet Archive's Open Library,
            which allows free borrowing of physical books (14-day loans).
          </p>
        </div>
      </div>
    </div>
  );
}
