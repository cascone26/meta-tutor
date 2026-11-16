"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { HERESIES } from "@/data/veritas/heresies";

export default function HeresiesPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = HERESIES.filter((heresy) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        heresy.name.toLowerCase().includes(s) ||
        heresy.founder.toLowerCase().includes(s) ||
        heresy.coreClaim.toLowerCase().includes(s)
      );
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Heresies Condemned by the Church"
        subtitle="Errors refuted through doctrine and council definitions"
        icon="⚠️"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search heresies..."
            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} heresies</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          {filtered.map((heresy) => (
            <button
              key={heresy.name}
              onClick={() => setExpanded(expanded === heresy.name ? null : heresy.name)}
              className="w-full rounded-lg border border-stone-800/50 px-4 py-2.5 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-stone-200">{heresy.name}</span>
                  <span className="ml-auto text-[10px] text-stone-700">{heresy.period}</span>
                </div>
                {expanded === heresy.name ? null : (
                  <p className="text-xs text-stone-500 line-clamp-1">{heresy.founder}</p>
                )}
              </div>
              {expanded === heresy.name && (
                <div className="mt-2 space-y-2 border-t border-stone-800 pt-2">
                  <p className="text-[11px] text-stone-600">{heresy.founder}</p>
                  <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-2.5">
                    <p className="text-[10px] uppercase text-rose-700">The Error</p>
                    <p className="mt-1 text-xs text-stone-400 leading-relaxed">{heresy.coreClaim}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-2.5">
                    <p className="text-[10px] uppercase text-emerald-700">The Truth</p>
                    <p className="mt-1 text-xs text-stone-400 leading-relaxed">{heresy.refutation}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-amber-600">Aquinas Reference</p>
                    <p className="mt-1 text-[11px] text-stone-400">{heresy.aquinasRef}</p>
                  </div>
                  {heresy.councilResponse && (
                    <div>
                      <p className="text-[10px] uppercase text-stone-700">Council Response</p>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed">{heresy.councilResponse}</p>
                    </div>
                  )}
                  {heresy.modernEchoes && (
                    <div>
                      <p className="text-[10px] uppercase text-stone-700">Modern Echoes</p>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed">{heresy.modernEchoes}</p>
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
