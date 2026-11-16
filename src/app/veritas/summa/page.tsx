import Link from "next/link";
import PageHeader from "@/components/veritas/PageHeader";
import { SUMMA_STRUCTURE } from "@/data/veritas/summa-structure";

export default function SummaHubPage() {
  const totalQuestions = SUMMA_STRUCTURE.reduce((n, p) => n + p.questions.length, 0);
  const totalArticles = SUMMA_STRUCTURE.reduce((n, p) => n + p.questions.reduce((m, q) => m + q.articles, 0), 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Summa Theologiae"
        subtitle={`${SUMMA_STRUCTURE.length} parts — ${totalQuestions} questions — ${totalArticles} articles, full text`}
        icon="🏛️"
      />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {SUMMA_STRUCTURE.map((part) => (
            <Link
              key={part.id}
              href={`/veritas/summa/${part.id}`}
              className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 transition-colors hover:border-amber-700/60 hover:bg-stone-900"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-sm text-stone-100">{part.name}</span>
                <span className="text-[10px] text-stone-600">{part.questions.length} questions</span>
              </div>
              <p className="mt-0.5 text-[11px] text-amber-600">{part.fullName}</p>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">{part.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
