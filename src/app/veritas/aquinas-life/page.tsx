"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { AQUINAS_LIFE, AQUINAS_COMPLETE_WORKS } from "@/data/veritas/aquinas-life";

export default function VeritasAquinasLife() {
  const [tab, setTab] = useState<"life" | "works">("life");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filteredWorks = AQUINAS_COMPLETE_WORKS.filter((w) => {
    if (category !== "all" && w.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      return w.title.toLowerCase().includes(s) || w.description.toLowerCase().includes(s);
    }
    return true;
  }).sort((a, b) => a.title.localeCompare(b.title));

  const categories = ["all", ...new Set(AQUINAS_COMPLETE_WORKS.map((w) => w.category))];

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Thomas Aquinas"
        subtitle="Life, works, and legacy — the Angelic Doctor"
        icon="✨"
      />

      <div className="border-b border-stone-800 bg-stone-950 px-6">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("life")}
            className={`px-3 py-3 text-sm font-medium transition-colors ${
              tab === "life"
                ? "border-b-2 border-amber-600 text-amber-400"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            Life & Timeline
          </button>
          <button
            onClick={() => setTab("works")}
            className={`px-3 py-3 text-sm font-medium transition-colors ${
              tab === "works"
                ? "border-b-2 border-amber-600 text-amber-400"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            Complete Works
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "life" ? (
          <div className="space-y-3 px-6 py-4">
            {AQUINAS_LIFE.map((event, i) => (
              <div key={i} className="rounded-lg border border-stone-800 p-4">
                <div className="flex items-baseline gap-3">
                  <div className="rounded bg-amber-600/20 px-2 py-1 text-xs font-semibold text-amber-400">
                    {event.year}
                  </div>
                  <h3 className="font-semibold text-stone-200">{event.title}</h3>
                </div>
                <p className="mt-2 text-sm text-stone-400">{event.description}</p>
                {event.significance && (
                  <div className="mt-2 rounded bg-stone-800/40 p-2.5">
                    <p className="text-xs uppercase text-stone-600">Significance</p>
                    <p className="mt-1 text-xs text-stone-500">{event.significance}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                      category === c
                        ? "bg-amber-600/20 text-amber-400"
                        : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search works..."
                className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
              />
              <p className="mt-1 text-[10px] text-stone-600">{filteredWorks.length} works</p>
            </div>

            <div className="space-y-2 px-6 py-4">
              {filteredWorks.map((work) => (
                <div key={work.title} className="rounded-lg border border-stone-800/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-stone-200">{work.title}</h3>
                      {work.latinTitle && (
                        <p className="text-xs italic text-stone-600">{work.latinTitle}</p>
                      )}
                    </div>
                    <span className="rounded bg-stone-800 px-2 py-1 text-[10px] uppercase text-stone-400">
                      {work.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-400">{work.description}</p>
                  {work.dateWritten && (
                    <p className="mt-1 text-xs text-stone-600">{work.dateWritten}</p>
                  )}
                  {work.significance && (
                    <div className="mt-2 rounded bg-stone-800/40 p-2">
                      <p className="text-xs uppercase text-stone-600">Significance</p>
                      <p className="mt-1 text-xs text-stone-500">{work.significance}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
