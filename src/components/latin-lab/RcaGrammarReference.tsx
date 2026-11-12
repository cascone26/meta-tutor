"use client";

import { useMemo, useState } from "react";
import {
  ALL_CHARTS,
  familyOf,
  FAMILY_LABELS,
  FAMILY_ORDER,
  type GrammarChart as GrammarChartType,
} from "@/lib/rca-content/latin-grammar-charts";
import RcaGrammarChart from "./RcaGrammarChart";

type Category = "all" | GrammarChartType["kind"];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "verb", label: "Verbs" },
  { id: "noun", label: "Nouns" },
  { id: "adjective", label: "Adjectives" },
  { id: "principal-parts", label: "Principal parts" },
  { id: "numbers", label: "Numbers" },
];

// RCA's First Form Latin paradigm reference, surfaced inside Latin Lab too (Jacob,
// 2026-11-11: "input any rca latin stuff into the normal latin mt section") — kept clearly
// labeled as a separate course's content (ecclesiastical pronunciation, Memoria Press's
// 6th-grade sequence) rather than silently merged into Latin Lab's own classical-
// pronunciation narrative units, per units.ts's own documented distinction.
export default function RcaGrammarReference() {
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
    <div>
      <div className="rounded-xl p-3 mb-4" style={{ background: "#1f1712", border: "1px dashed #3a2d1f" }}>
        <p className="text-xs" style={{ color: "#a08b73" }}>
          From RCA&apos;s First Form Latin (ecclesiastical pronunciation, Memoria Press&apos;s 6th-grade
          sequence) — a separate course from this page&apos;s own units above, surfaced here so it&apos;s
          all in one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => pickCategory(c.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            style={{
              background: category === c.id ? "#c17a3a" : "#241b14",
              color: category === c.id ? "#1a1410" : "#a08b73",
              border: "1px solid #3a2d1f",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <FamilyBtn active={family === "all"} onClick={() => setFamily("all")}>Any word</FamilyBtn>
        {families.map((f) => (
          <FamilyBtn key={f} active={family === f} onClick={() => setFamily(f)}>
            {FAMILY_LABELS[f].split("—")[0].trim()}
          </FamilyBtn>
        ))}
      </div>

      {charts.length === 0 ? (
        <p className="text-sm" style={{ color: "#7a6852" }}>No charts match that filter combination.</p>
      ) : (
        charts.map((chart) => <RcaGrammarChart key={chart.id} chart={chart} />)
      )}

      <a
        href="/rca/first-form-latin-6/drill"
        className="flex items-center justify-between rounded-xl px-4 py-3 mt-2 transition-transform hover:scale-[1.01]"
        style={{ background: "#c17a3a", color: "#1a1410" }}
      >
        <span className="text-sm font-semibold">Practice these forms in the FF Latin drill</span>
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function FamilyBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-2.5 py-1 text-xs font-medium transition"
      style={{
        background: active ? "#c17a3a" : "#241b14",
        color: active ? "#1a1410" : "#a08b73",
        border: "1px solid #3a2d1f",
      }}
    >
      {children}
    </button>
  );
}
