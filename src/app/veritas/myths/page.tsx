"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { MYTHS, type Myth } from "@/data/veritas/myths";

const CATEGORIES: { id: "all" | Myth["category"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "history", label: "History" },
  { id: "doctrine", label: "Doctrine" },
  { id: "bible", label: "Bible" },
  { id: "practice", label: "Practice" },
  { id: "science", label: "Science" },
];

export default function MythsPage() {
  const [category, setCategory] = useState<"all" | Myth["category"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = MYTHS.filter((m) => category === "all" || m.category === category);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Myths Debunked" subtitle="Common historical and doctrinal myths, corrected with sources" icon="🔍" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  category === c.id ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-stone-600">{filtered.length} myths</p>
        </div>

        <div className="px-6 py-4 space-y-2">
          {filtered.map((m) => {
            const isOpen = expanded === m.myth;
            return (
              <div key={m.myth} className="rounded-xl border border-stone-800/60 bg-stone-900/30">
                <button onClick={() => setExpanded(isOpen ? null : m.myth)} className="w-full px-4 py-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="mr-2 rounded bg-rose-900/30 border border-rose-800/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-400">Myth</span>
                      <span className="text-sm text-stone-200">{m.myth}</span>
                    </div>
                    <span className="shrink-0 text-xs text-stone-600">{isOpen ? "▾" : "▸"}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-stone-800 px-4 py-4">
                    <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">Correction</p>
                      <p className="text-sm leading-relaxed text-stone-300">{m.correction}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.keySources.map((s) => (
                        <span key={s} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">{s}</span>
                      ))}
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
