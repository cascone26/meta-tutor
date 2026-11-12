"use client";

import { useState } from "react";
import type { GrammarChart as GrammarChartType } from "@/lib/rca-content/latin-grammar-charts";

const PRONOUNS = ["I", "you", "he/she/it", "we", "you (all)", "they"];

// Dark-themed reskin of components/rca/GrammarChart.tsx for Latin Lab's palette — same
// Study/Memorize self-quiz behavior, just restyled so First Form Latin's reference charts
// (ecclesiastical pronunciation, RCA's own sequence) don't look like a foreign RCA widget
// bolted onto Latin Lab's dark theme. Data stays the single source of truth in
// latin-grammar-charts.ts; only presentation is duplicated, per this repo's own
// "duplicate, don't share across lanes/themes" convention.
export default function RcaGrammarChart({ chart }: { chart: GrammarChartType }) {
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
  const thStyle = { color: "#c17a3a", borderBottom: "1px solid #3a2d1f" };
  const rowBorder = { borderBottom: "1px solid #2a2118" };

  function Cell({ cellKey, latin }: { cellKey: string; latin: string }) {
    if (!memorize) return <span style={{ color: "#f0e6d8", fontWeight: 600 }}>{latin}</span>;
    const isRevealed = revealed.has(cellKey);
    const isGraded = revealed.has(cellKey + ":graded");
    if (!isRevealed) {
      return (
        <button
          type="button"
          onClick={() => reveal(cellKey)}
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: "#2a2118", color: "#7a6852" }}
        >
          ?
        </button>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <span style={{ color: "#f0e6d8", fontWeight: 600 }}>{latin}</span>
        {!isGraded && (
          <span className="inline-flex gap-1">
            <button type="button" onClick={() => grade(cellKey, true)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#2f3a24", color: "#9bb87a" }}>
              knew it
            </button>
            <button type="button" onClick={() => grade(cellKey, false)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#3a2420", color: "#c98a8a" }}>
              missed
            </button>
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#241b14", border: "1px solid #3a2d1f" }}>
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        <p className="text-sm font-semibold" style={{ color: "#f0e6d8" }}>{chart.title}</p>
        <div className="flex items-center gap-2">
          {memorize && (tally.right + tally.wrong > 0) && (
            <span className="text-[11px] font-semibold" style={{ color: "#a08b73" }}>
              {tally.right}/{tally.right + tally.wrong}
            </span>
          )}
          <button
            type="button"
            onClick={() => { setMemorize((m) => !m); resetMemorize(); }}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: memorize ? "#c17a3a" : "#2a2118", color: memorize ? "#1a1410" : "#a08b73" }}
          >
            {memorize ? "Studying" : "Memorize"}
          </button>
          {memorize && (
            <button type="button" onClick={resetMemorize} className="text-[11px] underline" style={{ color: "#7a6852" }}>
              Reset
            </button>
          )}
        </div>
      </div>
      {"modelWord" in chart && <p className="text-xs mb-2" style={{ color: "#7a6852" }}>{chart.modelWord}</p>}
      <p className="text-xs mb-3 rounded-lg px-2.5 py-1.5" style={{ background: "#1f1712", color: "#a08b73" }}>
        <span className="font-semibold" style={{ color: "#c17a3a" }}>The pattern: </span>
        {chart.formationRule}
      </p>

      {chart.kind === "verb" && (
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {chart.rows.map((cell, i) => (
              <tr key={i} style={i < 5 ? rowBorder : undefined}>
                <td className={td} style={{ color: "#7a6852", width: "30%" }}>{PRONOUNS[i]}</td>
                <td className={td}><Cell cellKey={`${chart.id}-${i}`} latin={cell.latin} /></td>
                <td className={td} style={{ color: "#a08b73" }}>{cell.english}</td>
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
                <td className={td} style={{ color: "#7a6852" }}>{c}</td>
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
              <p className="text-xs font-semibold mb-1" style={{ color: "#c17a3a" }}>{g.gender}</p>
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
                      <td className={td} style={{ color: "#7a6852" }}>{c}</td>
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
          <p className="text-xs font-semibold mb-1" style={{ color: "#c98a5a" }}>Irregular — memorize individually:</p>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {chart.irregulars.map((v, ri) => (
                <tr key={v.latin} style={ri < chart.irregulars.length - 1 ? rowBorder : undefined}>
                  <td className={td} style={{ color: "#a08b73", width: "20%" }}>{v.english}</td>
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
                <td className={td} style={{ color: "#7a6852", width: "10%" }}>{num.value}</td>
                <td className={td}><Cell cellKey={`${chart.id}-${num.value}`} latin={num.latin} /></td>
                <td className={td} style={{ color: "#a08b73" }}>{num.english}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
