import { GospelMarkReference } from "@/components/rca/GospelReference";
import BackLink from "@/components/rca/BackLink";
import { BirdIcon } from "@/components/rca/NatureIcons";

export default function GospelMarkPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-8">
        <BackLink href="/rca/religion-6" size="xs">Back to Religion 6</BackLink>

        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <BirdIcon size={28} style={{ color: "#3f7ea6" }} />
            Gospel of Mark
          </h1>
          <p className="text-sm mb-6" style={{ color: "#5c6b52" }}>
            Complete text (16 chapters, 677 verses) • Douay-Rheims Version, public domain
          </p>
        </div>

        <GospelMarkReference />
      </div>
    </div>
  );
}
