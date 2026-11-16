"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { QUICKDRAW_ENTRIES } from "@/data/veritas/quickdraw";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "protestant", label: "Protestant" },
  { id: "atheist", label: "Atheist" },
  { id: "muslim", label: "Muslim" },
  { id: "orthodox", label: "Orthodox" },
  { id: "secular", label: "Secular" },
  { id: "spiritual", label: "Spiritual" },
  { id: "ex-catholic", label: "Ex-Catholic" },
];

export default function QuickDraw() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = QUICKDRAW_ENTRIES.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (search && !e.objection.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-app flex-col">
      <PageHeader
        title="Apologetics Quick-Draw"
        subtitle="Fast lookup organized by objection — for live conversations"
        icon="⚡"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  category === c.id
                    ? "bg-amber-600/20 text-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search objections..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
        </div>

        <div className="px-6 py-4 space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-stone-800 transition-colors hover:border-stone-700"
            >
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="w-full px-4 py-3 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="mr-2 inline-block rounded-md bg-stone-800 px-1.5 py-0.5 text-[10px] uppercase text-stone-400">
                      {entry.category}
                    </span>
                    <span className="text-sm font-medium text-stone-200">
                      &ldquo;{entry.objection}&rdquo;
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-stone-600">
                    {expanded === entry.id ? "−" : "+"}
                  </span>
                </div>
                {expanded !== entry.id && (
                  <p className="mt-1.5 text-xs text-stone-500 line-clamp-2">
                    {entry.shortResponse}
                  </p>
                )}
              </button>

              {expanded === entry.id && (
                <div className="border-t border-stone-800 px-4 py-4 space-y-3">
                  <div>
                    <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                      Quick Response
                    </h4>
                    <p className="text-sm text-stone-300">{entry.shortResponse}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                      Full Response
                    </h4>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-400">
                      {entry.fullResponse}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                        Key Verses
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.keyVerses.map((v) => (
                          <span key={v} className="rounded-md bg-stone-800 px-2 py-0.5 text-[11px] text-stone-400">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                        Aquinas
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.aquinasRefs.map((r) => (
                          <span key={r} className="rounded-md bg-amber-900/30 px-2 py-0.5 text-[11px] text-amber-400">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {entry.fatherQuotes && entry.fatherQuotes.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                        Father Quotes
                      </h4>
                      <div className="space-y-2">
                        {entry.fatherQuotes.map((q) => (
                          <p key={q} className="text-xs text-stone-500 italic">
                            {q}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
