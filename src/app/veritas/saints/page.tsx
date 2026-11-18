"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import SectionStar from "@/components/veritas/SectionStar";
import GoDeeper from "@/components/veritas/GoDeeper";
import { SAINTS } from "@/data/veritas/saints";

const PAGE_LABEL = "Saints & Doctors of the Church";
const PAGE_HREF = "/veritas/saints";

export default function SaintsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = SAINTS.filter((saint) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        saint.name.toLowerCase().includes(s) ||
        saint.title.toLowerCase().includes(s) ||
        saint.theologicalContribution.toLowerCase().includes(s)
      );
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Saints & Doctors of the Church"
        subtitle="Ecclesiastical teachers whose wisdom shaped Christian theology"
        icon="⛪"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saints..."
            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} saints</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          {filtered.map((saint) => (
            <div
              key={saint.name}
              role="button"
              tabIndex={0}
              onClick={() => setExpanded(expanded === saint.name ? null : saint.name)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded(expanded === saint.name ? null : saint.name)}
              className="w-full cursor-pointer rounded-lg border border-stone-800/50 px-4 py-2.5 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-stone-200">{saint.name}</span>
                  <span className="ml-auto text-[10px] text-stone-700">{saint.lived}</span>
                  <SectionStar page={PAGE_LABEL} href={`${PAGE_HREF}#${saint.name}`} sectionId={saint.name} title={saint.name} summary={saint.theologicalContribution} />
                </div>
                {expanded === saint.name ? null : (
                  <p className="text-xs text-stone-500 line-clamp-1">{saint.title}</p>
                )}
              </div>
              {expanded === saint.name && (
                <div className="mt-2 space-y-2 border-t border-stone-800 pt-2">
                  <p className="text-[11px] text-amber-600">{saint.title}</p>
                  <GoDeeper question={`Go deeper on ${saint.name} (${saint.lived}), ${saint.title}. Theological contribution: ${saint.theologicalContribution}`} />
                  <div>
                    <p className="text-[10px] uppercase text-stone-700">Major Works</p>
                    <ul className="mt-1 ml-3 space-y-0.5">
                      {saint.majorWorks.map((work) => (
                        <li key={work} className="text-xs text-stone-400">• {work}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-700">Theological Contribution</p>
                    <p className="mt-1 text-xs text-stone-400 leading-relaxed">{saint.theologicalContribution}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-700">Connection to Aquinas</p>
                    <p className="mt-1 text-xs text-stone-400 leading-relaxed">{saint.connectionToAquinas}</p>
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
