"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { ANALOGIES } from "@/data/veritas/analogies";

export default function AnalogiesPage() {
  const [doctrine, setDoctrine] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const doctrines = ["all", ...Array.from(new Set(ANALOGIES.map((a) => a.doctrine)))];
  const filtered = ANALOGIES.filter((a) => doctrine === "all" || a.doctrine === doctrine);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Analogies" subtitle="Teaching analogies for hard doctrines — with their limits and heresy warnings" icon="🪞" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {doctrines.map((d) => (
              <button
                key={d}
                onClick={() => setDoctrine(d)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  doctrine === d ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-stone-600">{filtered.length} analogies</p>
        </div>

        <div className="px-6 py-4 space-y-2">
          {filtered.map((a, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} className="rounded-xl border border-stone-800/60 bg-stone-900/30">
                <button onClick={() => setExpanded(isOpen ? null : i)} className="w-full px-4 py-3 text-left">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-100">{a.doctrine}</span>
                    <span className="shrink-0 text-xs text-stone-600">{isOpen ? "▾" : "▸"}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 leading-relaxed">{a.analogy}</p>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-stone-800 px-4 py-4">
                    {a.source && <p className="text-[11px] text-stone-600">Source: {a.source}</p>}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">Strengths</p>
                        <p className="text-xs text-stone-300 leading-relaxed">{a.strengths}</p>
                      </div>
                      <div className="rounded-lg border border-stone-700/50 bg-stone-800/30 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-400">Limitations</p>
                        <p className="text-xs text-stone-300 leading-relaxed">{a.limitations}</p>
                      </div>
                    </div>
                    {a.heresyWarning && (
                      <div className="rounded-lg border border-rose-900/40 bg-rose-950/10 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-rose-500">Heresy Warning</p>
                        <p className="text-xs text-stone-300 leading-relaxed">{a.heresyWarning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
