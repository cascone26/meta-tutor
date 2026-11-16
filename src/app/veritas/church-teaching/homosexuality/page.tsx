"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import {
  CCC_TEXTS,
  AQUINAS_NATURAL_LAW,
  MAGISTERIAL_DOCUMENTS,
  TERMINOLOGY,
  PASTORAL_CARE,
  OBJECTIONS,
  RELATED_GLOSSARY_TERMS,
} from "@/data/veritas/church-teaching-homosexuality";

const SECTIONS = [
  { id: "ccc", label: "Catechism" },
  { id: "aquinas", label: "Aquinas & Natural Law" },
  { id: "documents", label: "Magisterial Documents" },
  { id: "terminology", label: "Terminology" },
  { id: "pastoral", label: "Pastoral Care" },
  { id: "objections", label: "Objections & Responses" },
] as const;

export default function HomosexualityTeachingPage() {
  const [tab, setTab] = useState<string>("ccc");
  const [openObjection, setOpenObjection] = useState<number | null>(null);
  const [openDoc, setOpenDoc] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Church Teaching: Homosexuality"
        subtitle="Catechism texts, Aquinas, magisterial documents, pastoral care, and the honest objections"
        icon="✝️"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setTab(s.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  tab === s.id ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {tab === "ccc" && (
            <>
              <p className="text-xs text-stone-500 leading-relaxed mb-2">
                The Catechism of the Catholic Church addresses homosexuality in the section on the Sixth Commandment
                (chastity), §§2357–2359, with a further reference at §2396. Full text, verbatim:
              </p>
              {CCC_TEXTS.map((c) => (
                <div key={c.num} className="rounded-lg border border-stone-800/60 bg-stone-900/30 p-4">
                  <p className="mb-1 text-[11px] font-mono font-semibold text-amber-500">CCC {c.num}</p>
                  <p className="text-sm text-stone-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </>
          )}

          {tab === "aquinas" && (
            <div className="rounded-lg border border-stone-800/60 bg-stone-900/30 p-4">
              <p className="mb-1 text-[11px] font-mono font-semibold text-amber-500">{AQUINAS_NATURAL_LAW.reference}</p>
              <p className="text-sm text-stone-300 leading-relaxed mb-3">{AQUINAS_NATURAL_LAW.summary}</p>
              <div className="rounded-md border border-stone-700/50 bg-stone-800/30 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">Modern Context</p>
                <p className="text-xs text-stone-400 leading-relaxed">{AQUINAS_NATURAL_LAW.modernNote}</p>
              </div>
            </div>
          )}

          {tab === "documents" && (
            <div className="space-y-2">
              {MAGISTERIAL_DOCUMENTS.map((d) => {
                const isOpen = openDoc === d.title;
                return (
                  <button
                    key={d.title}
                    onClick={() => setOpenDoc(isOpen ? null : d.title)}
                    className="w-full rounded-lg border border-stone-800/50 px-4 py-3 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-stone-200">{d.title}</span>
                      <span className="ml-auto shrink-0 text-[10px] text-stone-600">{d.year}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-600">{d.issuedBy}</p>
                    {isOpen && (
                      <p className="mt-2 border-t border-stone-800 pt-2 text-xs text-stone-400 leading-relaxed">
                        {d.summary}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "terminology" && (
            <div className="space-y-2">
              {TERMINOLOGY.map((t) => (
                <div key={t.term} className="rounded-lg border border-stone-800/50 bg-stone-900/30 p-4">
                  <p className="mb-1 text-sm font-semibold text-stone-200">{t.term}</p>
                  <p className="text-xs text-stone-400 leading-relaxed">{t.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "pastoral" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-4">
                <p className="mb-1 text-sm font-semibold text-emerald-400">{PASTORAL_CARE.courage.name}</p>
                <p className="text-xs text-stone-400 leading-relaxed">{PASTORAL_CARE.courage.description}</p>
              </div>
              <div className="rounded-lg border border-stone-800/50 bg-stone-900/30 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">The Call to Chastity</p>
                <p className="text-xs text-stone-400 leading-relaxed">{PASTORAL_CARE.callToChastity}</p>
              </div>
              <div className="rounded-lg border border-stone-800/50 bg-stone-900/30 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">Could This Teaching Develop?</p>
                <p className="text-xs text-stone-400 leading-relaxed">{PASTORAL_CARE.developmentVsChange}</p>
              </div>
            </div>
          )}

          {tab === "objections" && (
            <div className="space-y-2">
              {OBJECTIONS.map((o, i) => {
                const isOpen = openObjection === i;
                return (
                  <button
                    key={o.objection}
                    onClick={() => setOpenObjection(isOpen ? null : i)}
                    className="w-full rounded-lg border border-stone-800/50 px-4 py-3 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-stone-600 text-xs shrink-0">{isOpen ? "▾" : "▸"}</span>
                      <span className="font-semibold text-sm text-stone-200">{o.objection}</span>
                    </div>
                    {isOpen && (
                      <p className="mt-2 border-t border-stone-800 pt-2 text-xs text-stone-400 leading-relaxed">
                        {o.response}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-stone-800 pt-4">
            <span className="text-[10px] text-stone-600">Related glossary terms:</span>
            {RELATED_GLOSSARY_TERMS.map((t) => (
              <span key={t} className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
