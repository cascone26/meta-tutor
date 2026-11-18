"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import SectionStar from "@/components/veritas/SectionStar";
import GoDeeper from "@/components/veritas/GoDeeper";
import { COUNCILS } from "@/data/veritas/councils";

const PAGE_LABEL = "Ecumenical Councils";
const PAGE_HREF = "/veritas/councils";

export default function CouncilsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = COUNCILS.filter((council) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        council.name.toLowerCase().includes(s) ||
        council.location.toLowerCase().includes(s) ||
        council.issue.toLowerCase().includes(s)
      );
    }
    return true;
  }).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Ecumenical Councils"
        subtitle="21 councils from Nicaea (325) to Vatican II (1965)"
        icon="⛪"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search councils..."
            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} councils</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          {filtered.map((council) => (
            <div
              key={council.name}
              role="button"
              tabIndex={0}
              onClick={() => setExpanded(expanded === council.name ? null : council.name)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded(expanded === council.name ? null : council.name)}
              className="w-full cursor-pointer rounded-lg border border-stone-800/50 px-4 py-2.5 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-stone-200">{council.name}</span>
                  <span className="ml-auto text-[10px] text-stone-700">{council.year}</span>
                  <SectionStar page={PAGE_LABEL} href={`${PAGE_HREF}#${council.name}`} sectionId={council.name} title={council.name} summary={council.issue} />
                </div>
                {expanded === council.name ? null : (
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {council.location}{council.pope ? ` · ${council.pope}` : ""}
                  </p>
                )}
              </div>
              {expanded === council.name && (
                <div className="mt-2 space-y-2 border-t border-stone-800 pt-2">
                  <GoDeeper question={`Go deeper on the ${council.name} (${council.year}). Issue addressed: ${council.issue}`} />
                  <div>
                    <p className="text-[11px] text-stone-600">{council.location}</p>
                    {council.pope && <p className="text-[11px] text-amber-600">{council.pope}</p>}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-700">Issue Addressed</p>
                    <p className="mt-1 text-xs text-stone-400 leading-relaxed">{council.issue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-700">Key Definitions</p>
                    <ul className="mt-1 ml-3 space-y-1">
                      {council.keyDefinitions.map((def) => (
                        <li key={def} className="text-xs text-stone-400 leading-relaxed">• {def}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-700">Significance</p>
                    <p className="mt-1 text-xs text-stone-400 leading-relaxed">{council.significance}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
