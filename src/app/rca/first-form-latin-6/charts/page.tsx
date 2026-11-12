"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ALL_CHARTS,
  familyOf,
  FAMILY_LABELS,
  FAMILY_ORDER,
  type GrammarChart as GrammarChartType,
} from "@/lib/rca-content/latin-grammar-charts";
import GrammarChart from "@/components/rca/GrammarChart";
import { LeafIcon } from "@/components/rca/NatureIcons";

type Category = "all" | GrammarChartType["kind"];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "verb", label: "Verbs" },
  { id: "noun", label: "Nouns" },
  { id: "adjective", label: "Adjectives" },
  { id: "principal-parts", label: "Principal parts" },
  { id: "numbers", label: "Numbers" },
];

export default function LatinChartsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [family, setFamily] = useState<string>("all");

  const families = useMemo(() => {
    const present = new Set(ALL_CHARTS.map((c) => familyOf(c)));
    return FAMILY_ORDER.filter((f) => present.has(f));
  }, []);

  const charts = useMemo(() => {
    return ALL_CHARTS.filter((c) => {
      if (category !== "all" && c.kind !== category) return false;
      if (family !== "all" && familyOf(c) !== family) return false;
      return true;
    });
  }, [category, family]);

  function pickCategory(c: Category) {
    setCategory(c);
    setFamily("all");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-5 py-8 pb-24">
        <div className="mt-2 mb-5" style={{ animation: "fadeUpIn 0.5s ease both" }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <LeafIcon size={22} style={{ color: "#6b8e5a" }} />
            Grammar reference
          </h1>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            Every First Form Latin paradigm, in one place — browse or filter instead of asking.
            Toggle any chart to Memorize mode to self-quiz it.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => pickCategory(c.id)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
              style={{
                background: category === c.id ? "#6b8e5a" : "rgba(107,142,90,0.1)",
                color: category === c.id ? "#fff" : "#4a6b3a",
                border: category === c.id ? "1px solid #6b8e5a" : "1px solid rgba(107,142,90,0.25)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Family filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FamilyBtn active={family === "all"} onClick={() => setFamily("all")}>
            Any word
          </FamilyBtn>
          {families.map((f) => (
            <FamilyBtn key={f} active={family === f} onClick={() => setFamily(f)}>
              {FAMILY_LABELS[f].split("—")[0].trim()}
            </FamilyBtn>
          ))}
        </div>

        {charts.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(107,142,90,0.1)", border: "1px solid #d9e4d3" }}>
            <p className="text-sm" style={{ color: "#4a6b3a" }}>No charts match that filter combination.</p>
          </div>
        ) : (
          charts.map((chart) => <GrammarChart key={chart.id} chart={chart} />)
        )}

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <Link href="/rca/first-form-latin-6/drill" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            Practice these forms in the drill →
          </Link>
          <Link href="/rca/first-form-latin-6" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            ← Back to First Form Latin
          </Link>
        </div>
      </div>
    </div>
  );
}

function FamilyBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-2.5 py-1 text-xs font-medium transition"
      style={{
        background: active ? "#3f7ea6" : "#f4f7ee",
        color: active ? "#fff" : "#5c6b52",
        border: active ? "1px solid #3f7ea6" : "1px solid #e6e0d0",
      }}
    >
      {children}
    </button>
  );
}
