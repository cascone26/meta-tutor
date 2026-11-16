"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { TIMELINE_EVENTS } from "@/data/veritas/timeline";

const CATEGORIES = [
  "all", "aquinas", "council", "heresy", "philosophy", "church", "papacy", "scripture", "encyclical",
];

const formatYear = (year: number): string => {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }
  return year.toString();
};

export default function TimelinePage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showTier3, setShowTier3] = useState(false);

  const filtered = TIMELINE_EVENTS.filter((event) => {
    if (category !== "all" && event.category !== category) return false;
    if (!showTier3 && event.tier === 3) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        event.title.toLowerCase().includes(s) ||
        event.description.toLowerCase().includes(s) ||
        (event.tags?.some(tag => tag.toLowerCase().includes(s)))
      );
    }
    return true;
  }).sort((a, b) => a.year - b.year);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Chronological Timeline"
        subtitle="Church history, philosophy, and theology from antiquity to Vatican II"
        icon="📜"
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
                {c}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <div className="mt-2 flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showTier3}
                onChange={(e) => setShowTier3(e.target.checked)}
                className="rounded border-stone-700"
              />
              <span className="text-xs text-stone-400">Show detail (tier 3)</span>
            </label>
            <p className="text-[10px] text-stone-600">{filtered.length} events</p>
          </div>
        </div>
        <div className="px-6 py-4 space-y-3">
          {filtered.map((event) => (
            <div
              key={`${event.year}-${event.title}`}
              className="rounded-lg border border-stone-800/50 px-4 py-3 hover:border-stone-700 hover:bg-stone-900/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-fit">
                  <p className="font-semibold text-sm text-amber-500">{formatYear(event.year)}</p>
                  {event.endYear && (
                    <p className="text-xs text-stone-600">–{formatYear(event.endYear)}</p>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm text-stone-200">{event.title}</span>
                    <span className="text-[10px] uppercase text-stone-700 ml-auto">{event.category}</span>
                    {event.tier === 3 && (
                      <span className="text-[9px] text-stone-600 px-1.5 py-0.5 rounded bg-stone-800">detail</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed mb-2">{event.description}</p>
                  {event.connection && (
                    <p className="text-[11px] text-amber-600 italic">{event.connection}</p>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
