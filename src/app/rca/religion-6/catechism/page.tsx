import CatechismReference from "@/components/rca/CatechismReference";
import BackLink from "@/components/rca/BackLink";
import { BirdIcon } from "@/components/rca/NatureIcons";

export default function CatechismPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-8">
        <BackLink href="/rca/religion-6" size="xs">Back to Religion 6</BackLink>

        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <BirdIcon size={28} style={{ color: "#3f7ea6" }} />
            Baltimore Catechism No. 2
          </h1>
          <p className="text-sm mb-6" style={{ color: "#5c6b52" }}>
            Complete reference (421 questions across 37 lessons) • Public domain
          </p>
        </div>

        <CatechismReference />
      </div>
    </div>
  );
}
