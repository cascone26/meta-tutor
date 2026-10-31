"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { linkCitations, escapeHtml } from "@/lib/veritas/citations";
import GlossaryTooltip from "@/components/veritas/GlossaryTooltip";

interface DailyQuestion {
  question: string;
  hint: string;
  answer: string;
  citation: string;
  relatedTopics: string[];
}

const FALLBACK: DailyQuestion = {
  question:
    "If God is simple (having no parts), how can He possess multiple attributes like justice, mercy, and wisdom without being composed of parts?",
  hint: "Consider Aquinas's doctrine of divine simplicity — God's attributes are not parts of God but are identical with His essence, which we apprehend under different aspects due to our limited intellect.",
  answer:
    "In God, justice IS mercy IS wisdom IS His very essence. The distinction exists in our mode of understanding, not in God Himself. Because our finite intellect cannot grasp the infinite divine essence in a single concept, we use multiple names to signify what is one simple reality in God. As Aquinas says, these names are not synonymous because they signify the divine substance under different rationes (conceptual aspects), but they all refer to the same simple reality.",
  citation: "ST I, q.13, a.4 — 'These names are not synonymous... because they signify the divine substance under different aspects.'",
  relatedTopics: ["Divine Simplicity", "Divine Attributes", "Analogy of Being", "Negative Theology"],
};

export default function DailyPage() {
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const res = await fetch("/api/veritas-daily");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setQuestion(data);
      } catch {
        setQuestion(FALLBACK);
      }
      setLoading(false);
    };
    fetchDaily();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Daily Question"
        subtitle="A new theology question every day to sharpen your mind"
        icon="📆"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center px-6 py-12">
          {loading ? (
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-700 border-t-amber-500" />
              <p className="mt-3 text-sm text-stone-500">Loading today&apos;s question...</p>
            </div>
          ) : question ? (
            <div className="w-full max-w-2xl space-y-6">
              <div className="rounded-xl border border-stone-800 bg-stone-900/30 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-3">
                  Today&apos;s Question
                </p>
                <p className="text-lg font-medium leading-relaxed text-stone-100">
                  <GlossaryTooltip text={question.question} />
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    showHint
                      ? "border-amber-700 bg-amber-900/30 text-amber-400"
                      : "border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700"
                  }`}
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    showAnswer
                      ? "border-amber-700 bg-amber-900/30 text-amber-400"
                      : "border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700"
                  }`}
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>
              </div>

              {showHint && (
                <div className="rounded-xl border border-yellow-900/50 bg-yellow-950/20 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow-500 mb-2">Hint</p>
                  <p
                    className="text-sm text-stone-300 [&_a]:text-amber-500 [&_a:hover]:underline"
                    dangerouslySetInnerHTML={{ __html: linkCitations(escapeHtml(question.hint)) }}
                  />
                </div>
              )}

              {showAnswer && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 mb-2">Answer</p>
                    <p
                      className="text-sm leading-relaxed text-stone-200 [&_a]:text-amber-500 [&_a:hover]:underline"
                      dangerouslySetInnerHTML={{ __html: linkCitations(escapeHtml(question.answer)) }}
                    />
                  </div>
                  <div className="rounded-xl border border-stone-800 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-2">Citation</p>
                    <p
                      className="text-sm font-mono text-stone-400 [&_a]:text-amber-500 [&_a:hover]:underline"
                      dangerouslySetInnerHTML={{ __html: linkCitations(escapeHtml(question.citation)) }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {question.relatedTopics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] text-stone-500 border border-stone-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
