"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { GROUNDING_ARGUMENTS } from "@/data/veritas/grounding-arguments";

export default function GroundingArgumentsPage() {
  const [tag, setTag] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const tags = ["all", ...Array.from(new Set(GROUNDING_ARGUMENTS.flatMap((a) => a.tags)))];

  const filtered = GROUNDING_ARGUMENTS.filter((a) => tag === "all" || a.tags.includes(tag));

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Grounding Arguments" subtitle="What you stand on when the feelings are gone" icon="⚓" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  tag === t ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-stone-600">{filtered.length} arguments</p>
        </div>

        <div className="px-6 py-4 space-y-3">
          {filtered.map((a) => {
            const isOpen = expanded === a.slug;
            return (
              <div key={a.slug} className="rounded-xl border border-stone-800/60 bg-stone-900/30">
                <button onClick={() => setExpanded(isOpen ? null : a.slug)} className="w-full px-4 py-3 text-left">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-100">{a.title}</span>
                    <span className="shrink-0 text-xs text-stone-600">{isOpen ? "▾" : "▸"}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 leading-relaxed">{a.oneLine}</p>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-stone-800 px-4 py-4">
                    <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500">Why It Matters</p>
                      <p className="text-xs text-stone-300 leading-relaxed">{a.whyItMatters}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">The Case</p>
                      {a.theCase.map((p, i) => (
                        <p key={i} className="text-sm leading-relaxed text-stone-300">{p}</p>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-500">Objections &amp; Responses</p>
                      {a.objections.map((o, i) => (
                        <div key={i} className="rounded-lg border border-sky-900/30 bg-sky-950/10 p-3">
                          <p className="mb-1 text-xs font-semibold text-stone-200">{o.q}</p>
                          <p className="text-xs text-stone-400 leading-relaxed">{o.a}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {a.sources.map((s) => (
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
