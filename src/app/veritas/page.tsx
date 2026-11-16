"use client";

import { useState } from "react";
import Link from "next/link";
import { SECTIONS } from "@/data/veritas/stations";

const STATS = [
  { value: "35", label: "Stations" },
  { value: "3,115", label: "Summa Articles" },
  { value: "227", label: "Library Texts" },
  { value: "343", label: "Glossary Terms" },
];

export default function VeritasHub() {
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const filteredSections = q
    ? SECTIONS.map((s) => ({
        ...s,
        stations: s.stations.filter(
          (st) => st.title.toLowerCase().includes(q) || st.desc.toLowerCase().includes(q)
        ),
      })).filter((s) => s.stations.length > 0)
    : SECTIONS;

  return (
    <div>
      <section className="flex flex-col items-center px-6 pt-32 pb-20 text-center">
        <div className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-amber-600">
          Catholic Theology &amp; Apologetics
        </div>
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-stone-100 sm:text-7xl">
          VERITAS
        </h1>
        <p className="mb-4 max-w-lg text-lg leading-relaxed text-stone-400">
          Grounded in the complete works of St. Thomas Aquinas and everything he drew from —
          Scripture, the Fathers, Aristotle, and the whole classical canon.
        </p>
        <p className="mb-10 max-w-md text-sm italic text-stone-500">
          &ldquo;All that I have written seems like straw compared to what has now been revealed to me.&rdquo;
          <span className="mt-1 block not-italic text-amber-600">— St. Thomas Aquinas, 1273</span>
        </p>
        <a
          href="#stations"
          className="rounded-full border border-amber-600/30 bg-amber-600/10 px-6 py-3 text-sm font-medium text-amber-500 transition-colors hover:bg-amber-600/20"
        >
          Enter Veritas
        </a>
      </section>

      <section className="border-y border-stone-800 bg-stone-900/50 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-amber-500">{s.value}</div>
              <div className="mt-1 text-sm text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div id="stations" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2 text-center text-sm font-medium uppercase tracking-[0.3em] text-amber-600">
          All Stations
        </h2>
        <p className="mb-10 text-center text-stone-500">
          35 stations. Everything from AI chat to the full Summa to a 2,000-year history of the
          Church.
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all of Veritas..."
          className="mb-10 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
        />

        <div className="space-y-12">
          {filteredSections.map((section) => (
            <div key={section.id}>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">{section.icon}</span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600">{section.label}</h3>
                <span className="text-[10px] text-stone-700">{section.stations.length}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.stations.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="rounded-xl border border-stone-800 bg-stone-900 p-5 transition-colors hover:border-amber-600/30"
                  >
                    <div className="mb-2 text-xl">{s.icon}</div>
                    <h4 className="mb-1.5 font-semibold text-stone-100">{s.title}</h4>
                    <p className="text-sm leading-relaxed text-stone-400">{s.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {filteredSections.length === 0 && (
            <p className="text-center text-sm text-stone-600">No stations match &ldquo;{search}&rdquo;.</p>
          )}
        </div>
      </div>

      <footer className="border-t border-stone-800 py-10 text-center">
        <p className="text-xs text-stone-600">Ad Maiorem Dei Gloriam</p>
      </footer>
    </div>
  );
}
