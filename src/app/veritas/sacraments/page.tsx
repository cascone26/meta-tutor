"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import SectionStar from "@/components/veritas/SectionStar";
import GoDeeper from "@/components/veritas/GoDeeper";
import { SACRAMENTS } from "@/data/veritas/sacraments";

const PAGE_LABEL = "Sacraments";
const PAGE_HREF = "/veritas/sacraments";

export default function SacramentsPage() {
  const [expanded, setExpanded] = useState<string | null>(SACRAMENTS[0]?.name ?? null);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Sacraments"
        subtitle="Matter, form, minister, and effects — the seven channels of divine grace"
        icon="✨"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 space-y-3">
          {SACRAMENTS.map((sacrament) => {
            const isOpen = expanded === sacrament.name;
            return (
              <div
                key={sacrament.name}
                className="rounded-xl border border-stone-800/60 bg-stone-900/30 overflow-hidden"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpanded(isOpen ? null : sacrament.name)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded(isOpen ? null : sacrament.name)}
                  className="w-full cursor-pointer px-4 py-3 text-left"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-100">{sacrament.name}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <SectionStar
                        page={PAGE_LABEL}
                        href={`${PAGE_HREF}#${sacrament.name}`}
                        sectionId={sacrament.name}
                        title={sacrament.name}
                        summary={sacrament.institution}
                      />
                      <span className="text-stone-600 text-xs">{isOpen ? "▾" : "▸"}</span>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="space-y-3 border-t border-stone-800 px-4 py-4">
                    <GoDeeper question={`Go deeper on the sacrament of ${sacrament.name}. ${sacrament.institution}`} />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500">
                          Matter
                        </p>
                        <p className="text-xs text-stone-300 leading-relaxed">{sacrament.matter}</p>
                      </div>

                      <div className="rounded-lg border border-sky-900/30 bg-sky-950/10 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sky-500">
                          Form
                        </p>
                        <p className="text-xs text-stone-300 leading-relaxed italic">{sacrament.form}</p>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                          Minister
                        </p>
                        <p className="text-xs text-stone-400 leading-relaxed">{sacrament.minister}</p>
                      </div>

                      <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-3">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                          Institution
                        </p>
                        <p className="text-xs text-stone-400 leading-relaxed">{sacrament.institution}</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        Effects
                      </p>
                      <ul className="space-y-1">
                        {sacrament.effects.map((effect, i) => (
                          <li key={i} className="text-xs text-stone-300 leading-relaxed">
                            • {effect}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        Scriptural Basis
                      </p>
                      <ul className="space-y-1">
                        {sacrament.scriptualBasis.map((basis, i) => (
                          <li key={i} className="text-xs text-stone-400 leading-relaxed">
                            {basis}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                        Aquinas
                      </p>
                      <p className="text-xs text-stone-400 leading-relaxed">{sacrament.aquinasRef}</p>
                    </div>

                    <div className="rounded-lg border border-stone-800/50 bg-stone-900/40 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                        Catechism
                      </p>
                      <p className="text-xs text-stone-400 leading-relaxed">{sacrament.cccRef}</p>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        Common Objections
                      </p>
                      <div className="space-y-2">
                        {sacrament.commonObjections.map((item, i) => (
                          <div key={i} className="rounded-lg border border-stone-700/40 bg-stone-800/20 p-3">
                            <p className="text-[10px] text-stone-500 font-medium mb-1">Objection:</p>
                            <p className="text-xs text-stone-300 italic mb-2">{item.objection}</p>
                            <p className="text-[10px] text-stone-500 font-medium mb-1">Response:</p>
                            <p className="text-xs text-stone-300">{item.response}</p>
                          </div>
                        ))}
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
