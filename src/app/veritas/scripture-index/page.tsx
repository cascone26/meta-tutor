"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { SCRIPTURE_ENTRIES } from "@/data/veritas/scripture-index";

const CATEGORIES = [
  "all",
  "sola-scriptura",
  "sola-fide",
  "eucharist",
  "mary",
  "papacy",
  "purgatory",
  "saints",
  "salvation",
  "authority",
];

export default function ScriptureIndexPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = SCRIPTURE_ENTRIES.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        e.reference.toLowerCase().includes(s) ||
        e.text.toLowerCase().includes(s) ||
        e.protestantClaim.toLowerCase().includes(s) ||
        e.catholicResponse.toLowerCase().includes(s)
      );
    }
    return true;
  }).sort((a, b) => a.reference.localeCompare(b.reference));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Scripture Index"
        subtitle="Disputed passages: Protestant claims and Catholic responses"
        icon="⚖️"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  category === c
                    ? "bg-amber-600/20 text-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {c === "sola-scriptura"
                  ? "Scripture"
                  : c === "sola-fide"
                    ? "Faith"
                    : c === "papacy"
                      ? "Pope"
                      : c}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verses, claims..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} entries</p>
        </div>
        <div className="px-6 py-4 space-y-2">
          {filtered.map((entry) => (
            <button
              key={entry.reference}
              onClick={() =>
                setExpanded(expanded === entry.reference ? null : entry.reference)
              }
              className="w-full rounded-lg border border-stone-800/50 px-4 py-3 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex items-baseline gap-2 justify-between">
                <span className="font-semibold text-sm text-amber-400">
                  {entry.reference}
                </span>
                <span className="shrink-0 text-[10px] uppercase text-stone-700">
                  {entry.category}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                {entry.text}
              </p>
              {expanded === entry.reference && (
                <div className="mt-3 space-y-3 border-t border-stone-800 pt-3">
                  <div className="rounded-lg border border-red-900/30 bg-red-950/10 p-3">
                    <p className="text-[11px] font-semibold text-red-400 uppercase mb-2">
                      Protestant Claim
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {entry.protestantClaim}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-3">
                    <p className="text-[11px] font-semibold text-emerald-400 uppercase mb-2">
                      Catholic Response
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {entry.catholicResponse}
                    </p>
                  </div>
                  {entry.aquinasRef && (
                    <div>
                      <p className="text-[11px] font-semibold text-amber-600 uppercase">
                        Aquinas
                      </p>
                      <p className="text-[10px] text-amber-600">{entry.aquinasRef}</p>
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
