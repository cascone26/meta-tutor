"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { GLOSSARY_ENTRIES } from "@/data/veritas/glossary";

const CATEGORIES = [
  "all", "metaphysics", "theology", "moral", "sacramental",
  "christology", "ecclesiology", "eschatology", "logic",
];

export default function VeritasGlossary() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = GLOSSARY_ENTRIES.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      return e.term.toLowerCase().includes(s) || e.definition.toLowerCase().includes(s) || (e.latin?.toLowerCase().includes(s));
    }
    return true;
  }).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Glossary" subtitle="Theological and philosophical terms — plain English with progressive depth" icon="📚" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${category === c ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"}`}
              >{c}</button>
            ))}
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search terms..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700" />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} terms</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          {filtered.map((entry) => (
            <button key={entry.term} onClick={() => setExpanded(expanded === entry.term ? null : entry.term)}
              className="w-full rounded-lg border border-stone-800/50 px-4 py-2.5 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-stone-200">{entry.term}</span>
                {entry.latin && <span className="text-[11px] italic text-stone-600">{entry.latin}</span>}
                <span className="ml-auto text-[10px] uppercase text-stone-700">{entry.category}</span>
              </div>
              {expanded === entry.term ? (
                <div className="mt-2 space-y-2 border-t border-stone-800 pt-2">
                  <p className="text-sm text-stone-400 leading-relaxed">{entry.definition}</p>
                  {entry.aquinasRef && (
                    <p className="text-[11px] text-amber-600">Aquinas: {entry.aquinasRef}</p>
                  )}
                  {entry.relatedTerms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] text-stone-600">Related:</span>
                      {entry.relatedTerms.map((t) => (
                        <span key={t} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-xs text-stone-500 line-clamp-1">{entry.definition}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
