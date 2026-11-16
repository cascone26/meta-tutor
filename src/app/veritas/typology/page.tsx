"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { TYPOLOGIES } from "@/data/veritas/typology";

const CATEGORIES = [
  "all",
  "christological",
  "marian",
  "sacramental",
  "ecclesiological",
  "eschatological",
  "moral",
];

export default function TypologyPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = TYPOLOGIES.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        e.otType.toLowerCase().includes(s) ||
        e.ntAntitype.toLowerCase().includes(s) ||
        e.explanation.toLowerCase().includes(s)
      );
    }
    return true;
  }).sort((a, b) => a.otType.localeCompare(b.otType));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Typology"
        subtitle="Old Testament types and their New Testament antitypes — patterns foreshadowing Christ"
        icon="🔗"
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
                {c === "christological"
                  ? "Christ"
                  : c === "ecclesiological"
                    ? "Church"
                    : c === "eschatological"
                      ? "Eschat."
                      : c}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search types, antitypes..."
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
              <div className="flex items-start gap-2 mb-1">
                <span className="shrink-0 text-xs text-stone-600">
                  {expanded === entry.id ? "▾" : "▸"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-stone-200">
                      {entry.otType}
                    </span>
                    <span className="text-stone-600 text-xs">→</span>
                    <span className="text-amber-400 text-sm">{entry.ntAntitype}</span>
                  </div>
                </div>
                <span className="ml-auto shrink-0 text-[10px] uppercase text-stone-700">
                  {entry.category}
                </span>
              </div>
              {expanded !== entry.id && (
                <p className="text-xs text-stone-500 line-clamp-1 ml-5">
                  {entry.explanation.substring(0, 100)}...
                </p>
              )}
              {expanded === entry.id && (
                <div className="mt-3 ml-5 space-y-2 border-t border-stone-800 pt-3">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-400 uppercase mb-1">
                      OT Passages
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {entry.otPassages.map((p) => (
                        <span
                          key={p}
                          className="rounded bg-stone-800/40 px-2 py-1 text-[10px] text-stone-400"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-amber-500 uppercase mb-1">
                      NT Passages
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {entry.ntPassages.map((p) => (
                        <span
                          key={p}
                          className="rounded bg-amber-600/20 px-2 py-1 text-[10px] text-amber-400"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-400 uppercase mb-1">
                      Explanation
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {entry.explanation}
                    </p>
                  </div>
                  {entry.patristicSupport.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-stone-400 uppercase mb-1">
                        Patristic Support
                      </p>
                      <div className="space-y-1">
                        {entry.patristicSupport.map((p, i) => (
                          <p key={i} className="text-xs text-stone-400">
                            <span className="font-semibold">{p.father}</span>
                            {p.quote && (
                              <>
                                : {p.quote}
                              </>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.aquinasReferences.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-amber-600 uppercase mb-1">
                        Aquinas
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
                  {entry.cccReferences.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-stone-400 uppercase mb-1">
                        CCC
                      </p>
                      <p className="text-[10px] text-stone-500">
                        §{entry.cccReferences.join(", §")}
                      </p>
                    </div>
                  )}
                  <p className="text-[11px] text-stone-400 leading-relaxed border-t border-stone-800 pt-2">
                    <span className="font-semibold">Apologetic Use:</span>{" "}
                    {entry.apologeticUse}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
