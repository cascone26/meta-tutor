"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { prophecyDatabase } from "@/data/veritas/prophecy";

const CATEGORIES = [
  "all",
  "birth-origins",
  "nature-identity",
  "ministry",
  "passion-death",
  "resurrection-exaltation",
  "covenant-kingdom",
  "second-coming",
];

export default function ProphecyPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = prophecyDatabase
    .filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(s) ||
          e.otSource.text.toLowerCase().includes(s) ||
          e.apologeticSignificance.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Prophecy"
        subtitle="Messianic prophecies: Old Testament predictions and New Testament fulfillments"
        icon="📜"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  category === c
                    ? "bg-amber-600/20 text-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {c === "all"
                  ? "All"
                  : c === "birth-origins"
                    ? "Birth"
                    : c === "nature-identity"
                      ? "Nature"
                      : c === "passion-death"
                        ? "Passion"
                        : c === "resurrection-exaltation"
                          ? "Resurrection"
                          : c === "covenant-kingdom"
                            ? "Covenant"
                            : c === "second-coming"
                              ? "2nd Coming"
                              : c}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prophecies..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} entries</p>
        </div>
        <div className="px-6 py-4 space-y-2">
          {filtered.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="w-full rounded-lg border border-stone-800/50 px-4 py-3 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex items-baseline gap-2 justify-between">
                <span className="font-semibold text-sm text-stone-200 flex-1">
                  {entry.title}
                </span>
                <span className="shrink-0 text-[10px] uppercase text-stone-700">
                  {entry.category}
                </span>
              </div>
              {expanded !== entry.id && (
                <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                  {entry.apologeticSignificance.substring(0, 100)}...
                </p>
              )}
              {expanded === entry.id && (
                <div className="mt-3 space-y-3 border-t border-stone-800 pt-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-lg border border-stone-800/60 bg-stone-900/30 p-3">
                      <p className="text-[11px] font-semibold text-stone-500 uppercase mb-2">
                        OT Source
                      </p>
                      <p className="text-[11px] font-mono text-amber-600 mb-1">
                        {entry.otSource.reference}
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed mb-2">
                        {entry.otSource.text}
                      </p>
                      <p className="text-[10px] text-stone-600 italic">
                        {entry.otSource.context}
                      </p>
                    </div>
                    <div className="rounded-lg border border-sky-800/60 bg-sky-950/20 p-3">
                      <p className="text-[11px] font-semibold text-sky-400 uppercase mb-2">
                        NT Fulfillment
                      </p>
                      <p className="text-[11px] font-mono text-sky-400 mb-1">
                        {entry.ntFulfillment.reference}
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {entry.ntFulfillment.text}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-stone-800/50 bg-stone-900/20 p-3">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase mb-2">
                      Apologetic Significance
                    </p>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {entry.apologeticSignificance}
                    </p>
                  </div>
                  {entry.aquinasReferences.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-amber-600 uppercase mb-1">
                        Aquinas References
                      </p>
                      <div className="space-y-1">
                        {entry.aquinasReferences.map((ref, i) => (
                          <p key={i} className="text-[10px] text-amber-600">
                            {ref}
                          </p>
                        ))}
                      </div>
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
