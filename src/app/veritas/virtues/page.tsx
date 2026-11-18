"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import SectionStar from "@/components/veritas/SectionStar";
import GoDeeper from "@/components/veritas/GoDeeper";
import { VIRTUES } from "@/data/veritas/virtues";

const PAGE_LABEL = "Virtues";
const PAGE_HREF = "/veritas/virtues";

const TYPES = ["all", "theological", "cardinal", "capital-sin", "gift", "fruit", "beatitude"];

export default function VirtuesPage() {
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = VIRTUES.filter((virtue) => {
    if (type !== "all" && virtue.type !== type) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        virtue.name.toLowerCase().includes(s) ||
        virtue.description.toLowerCase().includes(s) ||
        (virtue.opposingVice?.toLowerCase().includes(s) ?? false)
      );
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Virtues"
        subtitle="Theological, cardinal, the gifts and fruits of the Spirit, capital vices, and beatitudes — cultivating holiness"
        icon="⛪"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  type === t ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {t === "capital-sin" ? "Capital Vices" : t}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search virtues..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} entries</p>
        </div>

        <div className="px-6 py-4 space-y-2">
          {filtered.map((virtue) => {
            const isOpen = expanded === virtue.name;
            return (
              <div
                key={virtue.name}
                role="button"
                tabIndex={0}
                onClick={() => setExpanded(isOpen ? null : virtue.name)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded(isOpen ? null : virtue.name)}
                className="w-full cursor-pointer rounded-lg border border-stone-800/50 px-4 py-2.5 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-stone-200">{virtue.name}</span>
                  <span className="ml-auto text-[10px] uppercase text-stone-700">{virtue.type}</span>
                  <SectionStar
                    page={PAGE_LABEL}
                    href={`${PAGE_HREF}#${virtue.name}`}
                    sectionId={virtue.name}
                    title={virtue.name}
                    summary={virtue.description}
                  />
                </div>

                {isOpen ? (
                  <div className="mt-2 space-y-2 border-t border-stone-800 pt-2">
                    <p className="text-sm text-stone-400 leading-relaxed">{virtue.description}</p>

                    <GoDeeper question={`Go deeper on the virtue of ${virtue.name} (${virtue.type}). ${virtue.description}`} />

                    <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-2">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                        Aquinas
                      </p>
                      <p className="text-[11px] text-stone-400 leading-relaxed">{virtue.aquinasRef}</p>
                    </div>

                    {virtue.opposingVice && (
                      <div>
                        <p className="text-[10px] text-stone-500 font-medium mb-0.5">Opposing Vice:</p>
                        <p className="text-xs text-stone-300">{virtue.opposingVice}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-stone-500 line-clamp-1">{virtue.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
