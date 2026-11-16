"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { CATHOLIC_VS_LUTHERAN, CVL_TIMELINE } from "@/data/veritas/catholic-vs-lutheran";

export default function CatholicVsLutheranPage() {
  const [expanded, setExpanded] = useState<string | null>(CATHOLIC_VS_LUTHERAN[0]?.id ?? null);
  const [showTimeline, setShowTimeline] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Catholic vs. Lutheran"
        subtitle="Authority, justification, sacraments, and the Eucharist — both sides' arguments, Aquinas, and the Catechism"
        icon="⚔️"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          <button
            onClick={() => setShowTimeline((v) => !v)}
            className="w-full rounded-lg border border-stone-800 bg-stone-900/40 px-4 py-2.5 text-left text-xs font-medium text-amber-400 transition-colors hover:border-amber-700/60"
          >
            {showTimeline ? "▾ Hide" : "▸ Show"} the historical timeline (1517 Theses → 2017 Joint Declaration)
          </button>
          {showTimeline && (
            <div className="mt-2 space-y-2 rounded-lg border border-stone-800/60 bg-stone-900/30 p-4">
              {CVL_TIMELINE.map((t) => (
                <div key={t.year} className="flex gap-3 text-xs">
                  <span className="w-24 shrink-0 font-mono text-stone-500">{t.year}</span>
                  <span className="text-stone-400 leading-relaxed">{t.event}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-8 space-y-3">
          {CATHOLIC_VS_LUTHERAN.map((topic) => {
            const isOpen = expanded === topic.id;
            return (
              <div key={topic.id} className="rounded-xl border border-stone-800/60 bg-stone-900/30">
                <button
                  onClick={() => setExpanded(isOpen ? null : topic.id)}
                  className="w-full px-4 py-3 text-left"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-100">{topic.topic}</span>
                    <span className="shrink-0 text-stone-600 text-xs">{isOpen ? "▾" : "▸"}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 leading-relaxed">{topic.oneLiner}</p>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-stone-800 px-4 py-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500">Catholic Position</p>
                        <p className="text-xs text-stone-300 leading-relaxed">{topic.catholicPosition}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {topic.catholicCitations.map((c) => (
                            <span key={c} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border border-sky-900/30 bg-sky-950/10 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sky-500">Lutheran Position</p>
                        <p className="text-xs text-stone-300 leading-relaxed">{topic.lutheranPosition}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {topic.lutheranCitations.map((c) => (
                            <span key={c} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">Aquinas's View</p>
                      <p className="text-xs text-stone-400 leading-relaxed">{topic.aquinasView}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500/80">Key Verses — Catholic reading</p>
                        <ul className="space-y-1">
                          {topic.keyVersesCatholic.map((v) => (
                            <li key={v} className="text-[11px] text-stone-500">{v}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sky-500/80">Key Verses — Lutheran reading</p>
                        <ul className="space-y-1">
                          {topic.keyVersesLutheran.map((v) => (
                            <li key={v} className="text-[11px] text-stone-500">{v}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">Common Ground</p>
                      <p className="text-xs text-stone-300 leading-relaxed">{topic.commonGround}</p>
                    </div>

                    <div className="rounded-lg border border-stone-700/50 bg-stone-800/30 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-400">How to Engage</p>
                      <p className="text-xs text-stone-300 leading-relaxed">{topic.howToEngage}</p>
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
