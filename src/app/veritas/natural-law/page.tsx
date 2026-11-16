"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { NATURAL_LAW_TOPICS } from "@/data/veritas/natural-law";

export default function NaturalLawPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = NATURAL_LAW_TOPICS.filter((topic) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        topic.topic.toLowerCase().includes(s) ||
        topic.naturalLawArgument.toLowerCase().includes(s) ||
        topic.modernApplication.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Natural Law"
        subtitle="Reason, human dignity, and the moral order — Aquinas on virtue, rights, and the common good"
        icon="⚖️"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} topics</p>
        </div>

        <div className="px-6 py-4 space-y-3">
          {filtered.map((topic) => {
            const isOpen = expanded === topic.topic;
            return (
              <div
                key={topic.topic}
                className="rounded-lg border border-stone-800/60 bg-stone-900/30 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : topic.topic)}
                  className="w-full px-4 py-3 text-left"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-100">{topic.topic}</span>
                    <span className="shrink-0 text-stone-600 text-xs">{isOpen ? "▾" : "▸"}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {topic.naturalLawArgument}
                  </p>
                </button>

                {isOpen && (
                  <div className="space-y-3 border-t border-stone-800 px-4 py-4">
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500">
                        Natural Law Argument
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">{topic.naturalLawArgument}</p>
                    </div>

                    <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                        Aquinas
                      </p>
                      <p className="text-xs text-stone-400 leading-relaxed">{topic.aquinasReference}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        Modern Application
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">{topic.modernApplication}</p>
                    </div>

                    <div className="rounded-lg border border-stone-700/40 bg-stone-800/20 p-3">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                        Objection &amp; Response
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] text-stone-500 font-medium mb-0.5">Objection:</p>
                          <p className="text-xs text-stone-300 italic">{topic.commonObjection}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 font-medium mb-0.5">Response:</p>
                          <p className="text-xs text-stone-300">{topic.response}</p>
                        </div>
                      </div>
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
