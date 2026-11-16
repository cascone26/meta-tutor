"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { CRITICS } from "@/data/veritas/critics";

const FIELDS = [
  "all",
  "New Atheism",
  "Philosophy",
  "Political economy",
  "Existentialism",
  "Biblical criticism",
];

export default function VeritasCritics() {
  const [field, setField] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = CRITICS.filter((c) => {
    if (field !== "all" && c.field !== field) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(s) ||
        c.coreArguments.some((arg) => arg.toLowerCase().includes(s)) ||
        c.keyWorks.some((work) => work.toLowerCase().includes(s))
      );
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Famous Critics"
        subtitle="From Dawkins to Pagels — the Church's most serious challengers and Catholic responses"
        icon="⚔️"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {FIELDS.map((f) => (
              <button
                key={f}
                onClick={() => setField(f)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  field === f
                    ? "bg-amber-600/20 text-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search critics, arguments, works..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} critics</p>
        </div>
        <div className="px-6 py-4 space-y-2">
          {filtered.map((critic) => (
            <button
              key={critic.name}
              onClick={() =>
                setExpanded(expanded === critic.name ? null : critic.name)
              }
              className="w-full rounded-lg border border-stone-800/50 px-4 py-3 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-stone-200">
                  {critic.name}
                </span>
                <span className="text-[11px] text-stone-600">{critic.dates}</span>
                <span className="ml-auto text-[10px] uppercase text-stone-700">
                  {critic.field}
                </span>
              </div>
              {expanded === critic.name ? (
                <div className="mt-3 space-y-3 border-t border-stone-800 pt-3">
                  <div>
                    <p className="text-[10px] uppercase text-stone-600 mb-1">
                      Key Works
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {critic.keyWorks.map((work) => (
                        <span
                          key={work}
                          className="rounded bg-stone-800 px-2 py-1 text-[10px] text-stone-400"
                        >
                          {work}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-stone-600 mb-1">
                      Core Arguments
                    </p>
                    <ul className="space-y-1">
                      {critic.coreArguments.map((arg, i) => (
                        <li key={i} className="text-xs text-stone-400 leading-relaxed">
                          • {arg}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-stone-600 mb-1">
                      Philosophical Weaknesses
                    </p>
                    <ul className="space-y-1">
                      {critic.weaknesses.map((weak, i) => (
                        <li key={i} className="text-xs text-stone-400 leading-relaxed">
                          • {weak}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                    <p className="text-[10px] uppercase text-amber-600 mb-2 font-semibold">
                      Catholic Response
                    </p>
                    <ul className="space-y-1">
                      {critic.catholicResponses.map((resp, i) => (
                        <li key={i} className="text-xs text-amber-200/90 leading-relaxed">
                          • {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-xs text-stone-500 line-clamp-1">
                  {critic.coreArguments[0]}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
