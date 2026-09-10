"use client";

import { useState } from "react";
import type { GrammarChart as GrammarChartType } from "@/lib/rca-content/latin-grammar-charts";

const PRONOUNS = ["I", "you", "he/she/it", "we", "you (all)", "they"];

// One chart, two modes: Study (everything visible) and Memorize (Latin forms hidden,
// click-to-reveal, self-graded tally) — Jacob 2026-09-10 asked specifically for
// "charts and memorizing," not just prose explanations. Self-graded and session-only
// (no persistence) — an honest v1, not a claimed long-term mastery tracker.
export default function GrammarChart({ chart }: { chart: GrammarChartType }) {
  const [memorize, setMemorize] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [tally, setTally] = useState({ right: 0, wrong: 0 });

  function reveal(key: string) {
    setRevealed((prev) => new Set(prev).add(key));
  }
  function grade(key: string, correct: boolean) {
    if (revealed.has(key + ":graded")) return;
    setRevealed((prev) => new Set(prev).add(key + ":graded"));
    setTally((t) => (correct ? { ...t, right: t.right + 1 } : { ...t, wrong: t.wrong + 1 }));
  }
  function resetMemorize() {
    setRevealed(new Set());
    setTally({ right: 0, wrong: 0 });
  }

  const th = "text-left text-[11px] font-semibold uppercase tracking-wide py-1.5 px-2";
  const td = "text-sm py-1.5 px-2";
  const thStyle = { color: "#6b8e5a", borderBottom: "1px solid #e6e0d0" };
  const rowBorder = { borderBottom: "1px solid #f0ece0" };

  function Cell({ cellKey, latin }: { cellKey: string; latin: string }) {
    if (!memorize) return <span style={{ color: "#33402c", fontWeight: 600 }}>{latin}</span>;
    const isRevealed = revealed.has(cellKey);
    const isGraded = revealed.has(cellKey + ":graded");
    if (!isRevealed) {
      return (
        <button
          type="button"
          onClick={() => reveal(cellKey)}
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: "#eef2e2", color: "#8a9a7c" }}
        >
          ?
        </button>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <span style={{ color: "#33402c", fontWeight: 600 }}>{latin}</span>
        {!isGraded && (
          <span className="inline-flex gap-1">
            <button type="button" onClick={() => grade(cellKey, true)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#dcecd4", color: "#4a6a3a" }}>
              knew it
            </button>
            <button type="button" onClick={() => grade(cellKey, false)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#f0dede", color: "#a04a4a" }}>
              missed
            </button>
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#fff", border: "1px solid #e6e0d0" }}>
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        <p className="text-sm font-semibold" style={{ color: "#33402c" }}>{chart.title}</p>
        <div className="flex items-center gap-2">
          {memorize && (tally.right + tally.wrong > 0) && (
            <span className="text-[11px] font-semibold" style={{ color: "#5c6b52" }}>
              {tally.right}/{tally.right + tally.wrong}
            </span>
          )}
          <button
            type="button"
            onClick={() => { setMemorize((m) => !m); resetMemorize(); }}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: memorize ? "#3f7ea6" : "#eef2e2", color: memorize ? "#fff" : "#5c6b52" }}
          >
            {memorize ? "Studying" : "Memorize"}
          </button>
          {memorize && (
            <button type="button" onClick={resetMemorize} className="text-[11px] underline" style={{ color: "#8a9a7c" }}>
              Reset
            </button>
          )}
        </div>
      </div>
      {"modelWord" in chart && <p className="text-xs mb-2" style={{ color: "#8a9a7c" }}>{chart.modelWord}</p>}
      <p className="text-xs mb-3 rounded-lg px-2.5 py-1.5" style={{ background: "#f4f7ee", color: "#5c6b52" }}>
        <span className="font-semibold" style={{ color: "#4a6a3a" }}>The pattern: </span>
        {chart.formationRule}
      </p>

      {chart.kind === "verb" && (
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {chart.rows.map((cell, i) => (
              <tr key={i} style={i < 5 ? rowBorder : undefined}>
                <td className={td} style={{ color: "#8a9a7c", width: "30%" }}>{PRONOUNS[i]}</td>
                <td className={td}><Cell cellKey={`${chart.id}-${i}`} latin={cell.latin} /></td>
                <td className={td} style={{ color: "#5c6b52" }}>{cell.english}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {chart.kind === "noun" && (
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th className={th} style={thStyle}></th>
              <th className={th} style={thStyle}>Singular</th>
              <th className={th} style={thStyle}>Plural</th>
            </tr>
          </thead>
          <tbody>
            {chart.cases.map((c, i) => (
              <tr key={c} style={i < 4 ? rowBorder : undefined}>
                <td className={td} style={{ color: "#8a9a7c" }}>{c}</td>
                <td className={td}><Cell cellKey={`${chart.id}-sg-${i}`} latin={chart.singular[i]} /></td>
                <td className={td}><Cell cellKey={`${chart.id}-pl-${i}`} latin={chart.plural[i]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {chart.kind === "adjective" && (
        <div className="space-y-4">
          {chart.genders.map((g) => (
            <div key={g.gender}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#6b8e5a" }}>{g.gender}</p>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className={th} style={thStyle}></th>
                    <th className={th} style={thStyle}>Singular</th>
                    <th className={th} style={thStyle}>Plural</th>
                  </tr>
                </thead>
                <tbody>
                  {["Nominative", "Genitive", "Dative", "Accusative", "Ablative"].map((c, i) => (
                    <tr key={c} style={i < 4 ? rowBorder : undefined}>
                      <td className={td} style={{ color: "#8a9a7c" }}>{c}</td>
                      <td className={td}><Cell cellKey={`${chart.id}-${g.gender}-sg-${i}`} latin={g.singular[i]} /></td>
                      <td className={td}><Cell cellKey={`${chart.id}-${g.gender}-pl-${i}`} latin={g.plural[i]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {chart.kind === "principal-parts" && (
        <div>
          <table className="w-full mb-3" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["1st (present)", "2nd (infinitive)", "3rd (perfect)", "4th (p.p.p.)"].map((h) => (
                  <th key={h} className={th} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {chart.regular.parts.map((p, i) => (
                  <td key={i} className={td}><Cell cellKey={`${chart.id}-reg-${i}`} latin={p} /></td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="text-xs font-semibold mb-1" style={{ color: "#8a5a2a" }}>Irregular — memorize individually:</p>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {chart.irregulars.map((v, ri) => (
                <tr key={v.latin} style={ri < chart.irregulars.length - 1 ? rowBorder : undefined}>
                  <td className={td} style={{ color: "#5c6b52", width: "20%" }}>{v.english}</td>
                  {v.parts.map((p, i) => (
                    <td key={i} className={td}><Cell cellKey={`${chart.id}-${v.latin}-${i}`} latin={p} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chart.kind === "numbers" && (
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {chart.numbers.map((num, i) => (
              <tr key={num.value} style={i < chart.numbers.length - 1 ? rowBorder : undefined}>
                <td className={td} style={{ color: "#8a9a7c", width: "10%" }}>{num.value}</td>
                <td className={td}><Cell cellKey={`${chart.id}-${num.value}`} latin={num.latin} /></td>
                <td className={td} style={{ color: "#5c6b52" }}>{num.english}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
