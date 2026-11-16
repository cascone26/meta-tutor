"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { ONE_LINERS } from "@/data/veritas/oneliners";

export default function OneLinersPage() {
  const [topic, setTopic] = useState("all");
  const [search, setSearch] = useState("");

  const topics = ["all", ...Array.from(new Set(ONE_LINERS.map((o) => o.topic)))];

  const filtered = ONE_LINERS.filter((o) => {
    if (topic !== "all" && o.topic !== topic) return false;
    if (search) {
      const s = search.toLowerCase();
      return o.line.toLowerCase().includes(s) || o.topic.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="One-Liners" subtitle="Quick, quotable lines organized by topic" icon="⚡" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  topic === t ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lines..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} lines</p>
        </div>
        <div className="px-6 py-4 space-y-2">
          {filtered.map((o, i) => (
            <div key={i} className="rounded-lg border border-stone-800/50 px-4 py-3">
              <p className="text-sm text-stone-200 leading-relaxed">&ldquo;{o.line}&rdquo;</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">{o.topic}</span>
                {o.source && <span className="text-[10px] text-stone-600">— {o.source}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
