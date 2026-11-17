"use client";

import { useState } from "react";
import Link from "next/link";
import { SECTIONS } from "@/data/veritas/stations";
import IconGlyph from "@/components/veritas/IconGlyph";

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
      <section className="flex flex-col items-center px-6 pt-28 pb-16 text-center">
        <div className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-amber-600">
          Catholic Theology &amp; Apologetics
        </div>
        <h1 className="vg-serif mb-6 text-6xl font-semibold tracking-tight text-stone-100 sm:text-7xl">
          Veritas
        </h1>
        <p className="mb-4 max-w-lg text-lg leading-relaxed text-stone-400">
          A quiet library and study for the Catholic faith — grounded in the complete works of
          St. Thomas Aquinas, Scripture, the Fathers, and the whole classical canon.
        </p>
        <p className="vg-serif mb-10 max-w-md text-base italic text-stone-500">
          &ldquo;All that I have written seems like straw compared to what has now been revealed to me.&rdquo;
          <span className="mt-1 block not-italic text-sm text-amber-600">— St. Thomas Aquinas, 1273</span>
        </p>
        <a
          href="#stations"
          className="rounded-full border border-amber-600/30 bg-amber-600/10 px-6 py-3 text-sm font-medium text-amber-500 transition-all hover:bg-amber-600/20"
        >
          Enter Veritas
        </a>
      </section>

      <div id="stations" className="mx-auto max-w-5xl px-6 py-16">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all of Veritas..."
          className="mb-10 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-600 outline-none transition-all focus:border-amber-700"
        />

        <div className="space-y-12">
          {filteredSections.map((section) => (
            <div key={section.id}>
              <div className="mb-4 flex items-center gap-2">
                <IconGlyph name={section.glyph} className="h-3.5 w-3.5 text-amber-600" />
                <h3 className="vg-serif text-base font-semibold text-amber-600">{section.label}</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.stations.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group rounded-xl border border-stone-800 bg-stone-900 p-5 transition-all hover:border-amber-600/40"
                  >
                    <div className="mb-2 text-amber-600 transition-colors group-hover:text-amber-500">
                      <IconGlyph name={s.glyph} className="h-5 w-5" />
                    </div>
                    <h4 className="vg-serif mb-1.5 text-lg font-semibold text-stone-100">{s.title}</h4>
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
        <p className="vg-serif text-sm italic tracking-wide text-stone-600">Ad Maiorem Dei Gloriam</p>
      </footer>
    </div>
  );
}
