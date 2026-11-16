"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/veritas/PageHeader";
import { SUMMA_STRUCTURE } from "@/data/veritas/summa-structure";

export default function SummaPartPage() {
  const params = useParams();
  const partId = params.part as string;
  const part = SUMMA_STRUCTURE.find((p) => p.id === partId);
  const [search, setSearch] = useState("");

  if (!part) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-stone-950">
        <p className="text-stone-500 mb-4">Part not found.</p>
        <Link href="/veritas/summa" className="text-sm text-amber-500 hover:text-amber-400">Back to Summa</Link>
      </div>
    );
  }

  const filtered = part.questions.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return q.title.toLowerCase().includes(s) || String(q.number).includes(s);
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={part.name} subtitle={part.fullName} icon="🏛️" />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <Link href="/veritas/summa" className="text-xs text-stone-500 hover:text-stone-300">&larr; All parts</Link>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by number or title..."
            className="mt-2 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
          />
          <p className="mt-1 text-[10px] text-stone-600">{filtered.length} of {part.questions.length} questions</p>
        </div>
        <div className="px-6 py-3 space-y-1">
          {filtered.map((q) => (
            <Link
              key={q.number}
              href={`/veritas/summa/${part.id}/${q.number}`}
              className="flex items-center gap-3 rounded-lg border border-stone-800/50 px-4 py-2.5 transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <span className="w-10 shrink-0 text-xs font-mono text-amber-600">Q{q.number}</span>
              <span className="flex-1 text-sm text-stone-300">{q.title}</span>
              <span className="shrink-0 text-[10px] text-stone-600">{q.articles} art.</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
