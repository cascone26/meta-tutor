"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/veritas/PageHeader";
import { DENOMINATIONS } from "@/data/veritas/denominations";

export default function DenominationsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(DENOMINATIONS[0]?.name ?? null);

  const filtered = DENOMINATIONS.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(s) ||
      d.founder.toLowerCase().includes(s) ||
      d.keyBeliefs.some((b) => b.toLowerCase().includes(s))
    );
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Christian Denominations"
        subtitle="Major Protestant traditions, Latter-day Saints, Witnesses, and Orthodox — beliefs, history, and Catholic engagement"
        icon="⛪"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, founder, or belief..."
            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} traditions</p>
        </div>

        <div className="px-6 py-4 pb-8 space-y-3">
          {filtered.map((denom) => {
            const isOpen = expanded === denom.name;
            return (
              <div key={denom.name} className="rounded-xl border border-stone-800/60 bg-stone-900/30">
                <button
                  onClick={() => setExpanded(isOpen ? null : denom.name)}
                  className="w-full px-4 py-3 text-left"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-100">{denom.name}</span>
                    <span className="shrink-0 text-stone-600 text-xs">{isOpen ? "▾" : "▸"}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-1">
                    Founded {denom.founded} by {denom.founder}
                  </p>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-stone-800 px-4 py-4">
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-amber-500">Key Beliefs</p>
                      <ul className="space-y-1">
                        {denom.keyBeliefs.map((belief, idx) => (
                          <li key={idx} className="text-xs text-stone-400 leading-relaxed">
                            • {belief}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-blue-500">Differences from Catholicism</p>
                      <ul className="space-y-1">
                        {denom.differencesFromCatholic.map((diff, idx) => (
                          <li key={idx} className="text-xs text-stone-400 leading-relaxed">
                            • {diff}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {denom.name === "Lutheran" && (
                      <div className="rounded-lg border border-cyan-900/30 bg-cyan-950/10 p-3">
                        <p className="text-xs text-cyan-300 leading-relaxed">
                          For a comprehensive deep-dive on Lutheran theology, see{" "}
                          <Link href="/veritas/catholic-vs-lutheran" className="font-semibold text-cyan-400 hover:underline">
                            Catholic vs. Lutheran
                          </Link>
                          .
                        </p>
                      </div>
                    )}

                    <div className="rounded-lg border border-stone-700/50 bg-stone-800/30 p-3">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">How to Engage</p>
                      <p className="text-xs text-stone-300 leading-relaxed">{denom.bestApproach}</p>
                    </div>
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
