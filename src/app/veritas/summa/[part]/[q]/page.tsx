"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUMMA_STRUCTURE } from "@/data/veritas/summa-structure";
import { SUMMA_FOLDER } from "@/data/veritas/summa-folders";

interface ArticleSection {
  label: string;
  kind: "objection" | "contrary" | "answer" | "reply" | "other";
  text: string;
}

interface Article {
  number: string;
  title: string;
  sections: ArticleSection[];
}

function sectionKind(label: string): ArticleSection["kind"] {
  const l = label.toLowerCase();
  if (l.startsWith("objection")) return "objection";
  if (l.startsWith("on the contrary")) return "contrary";
  if (l.startsWith("i answer that") || l.startsWith("i answer")) return "answer";
  if (l.startsWith("reply to objection")) return "reply";
  return "other";
}

function parseSummaQuestion(markdown: string): { title: string; articles: Article[] } {
  const lines = markdown.split("\n");
  let title = "";
  const articleBlocks: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      title = line.replace(/^#\s+/, "");
    } else if (line.startsWith("## ")) {
      if (current) articleBlocks.push(current);
      current = { heading: line.replace(/^##\s+/, ""), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) articleBlocks.push(current);

  const articles: Article[] = articleBlocks.map((block, i) => {
    const match = block.heading.match(/^Article\s+(\d+):\s*(.*)$/i);
    const number = match ? match[1] : String(i + 1);
    const artTitle = match ? match[2] : block.heading;

    const sections: ArticleSection[] = [];
    let secLabel = "";
    let secLines: string[] = [];
    const pushSection = () => {
      if (secLabel) {
        sections.push({ label: secLabel, kind: sectionKind(secLabel), text: secLines.join("\n").trim() });
      }
    };
    for (const line of block.lines) {
      if (line.startsWith("### ")) {
        pushSection();
        secLabel = line.replace(/^###\s+/, "");
        secLines = [];
      } else {
        secLines.push(line);
      }
    }
    pushSection();

    return { number, title: artTitle, sections };
  });

  return { title, articles };
}

const sectionStyle: Record<ArticleSection["kind"], string> = {
  objection: "border-stone-800 bg-stone-900/30",
  contrary: "border-amber-900/40 bg-amber-950/10",
  answer: "border-emerald-900/40 bg-emerald-950/10",
  reply: "border-sky-900/30 bg-sky-950/10",
  other: "border-stone-800 bg-stone-900/30",
};
const sectionLabelStyle: Record<ArticleSection["kind"], string> = {
  objection: "text-stone-500",
  contrary: "text-amber-500",
  answer: "text-emerald-400",
  reply: "text-sky-500",
  other: "text-stone-500",
};

export default function SummaQuestionPage() {
  const params = useParams();
  const partId = params.part as string;
  const qNum = params.q as string;
  const part = SUMMA_STRUCTURE.find((p) => p.id === partId);
  const questionMeta = part?.questions.find((q) => String(q.number) === qNum);

  const [data, setData] = useState<{ title: string; articles: Article[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("1");

  useEffect(() => {
    if (!part) return;
    setLoading(true);
    setError(false);
    const folder = SUMMA_FOLDER[part.id];
    fetch(`/summa/${folder}/q${qNum}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((text) => {
        setData(parseSummaQuestion(text));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [part, qNum]);

  if (!part || !questionMeta) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-stone-950">
        <p className="text-stone-500 mb-4">Question not found.</p>
        <Link href="/veritas/summa" className="text-sm text-amber-500 hover:text-amber-400">Back to Summa</Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2 shrink-0">
        <Link href={`/veritas/summa/${part.id}`} className="text-xs text-stone-500 hover:text-stone-300">&larr; {part.name}</Link>
        <div className="text-center">
          <p className="text-xs font-semibold text-stone-300">Question {questionMeta.number}</p>
          <p className="text-[10px] text-stone-600">{questionMeta.title}</p>
        </div>
        <span className="text-[10px] text-stone-600">{questionMeta.articles} articles</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {loading && <p className="text-sm text-stone-600">Loading...</p>}
        {error && <p className="text-sm text-stone-600">Could not load this question's text.</p>}

        {data && (
          <div className="mx-auto max-w-2xl space-y-3">
            <h1 className="text-lg font-semibold text-stone-100">{data.title}</h1>
            {data.articles.map((art) => {
              const isOpen = expanded === art.number;
              return (
                <div key={art.number} className="rounded-xl border border-stone-800/60 bg-stone-900/20">
                  <button onClick={() => setExpanded(isOpen ? null : art.number)} className="w-full px-4 py-3 text-left">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-stone-200">Article {art.number}: {art.title}</span>
                      <span className="shrink-0 text-xs text-stone-600">{isOpen ? "▾" : "▸"}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="space-y-2 border-t border-stone-800 px-4 py-4">
                      {art.sections.map((s, i) => (
                        <div key={i} className={`rounded-lg border p-3 ${sectionStyle[s.kind]}`}>
                          <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${sectionLabelStyle[s.kind]}`}>{s.label}</p>
                          <p className="text-sm leading-relaxed text-stone-300 whitespace-pre-line">{s.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
