"use client";

import { useState, useEffect } from "react";
import { glossary, categories } from "@/lib/glossary";
import { questions } from "@/lib/questions";
import { getSRData, getTermStats, getDueTerms } from "@/lib/spaced-repetition";
import { getHistory, getWeakAreas } from "@/lib/study-history";
import Link from "next/link";

export default function DashboardPage() {
  const [srStats, setSrStats] = useState({ total: 0, due: 0, learning: 0, reviewing: 0, mastered: 0 });
  const [dueTerms, setDueTerms] = useState<string[]>([]);
  const [history, setHistory] = useState<ReturnType<typeof getHistory>>([]);
  const [weakAreas, setWeakAreas] = useState<ReturnType<typeof getWeakAreas>>({ terms: [], categories: [] });
  const [confidence, setConfidence] = useState<Record<number, string>>({});
  const [practiced, setPracticed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const sr = getSRData();
    setSrStats(getTermStats(sr));
    setDueTerms(getDueTerms(sr));
    setHistory(getHistory());
    setWeakAreas(getWeakAreas());
    try {
      const c = localStorage.getItem("meta-tutor-confidence");
      if (c) setConfidence(JSON.parse(c));
      const p = localStorage.getItem("meta-tutor-practiced");
      if (p) setPracticed(new Set(JSON.parse(p)));
    } catch {}
  }, []);

  const confCounts = {
    "got-it": Object.values(confidence).filter((v) => v === "got-it").length,
    shaky: Object.values(confidence).filter((v) => v === "shaky").length,
    "no-clue": Object.values(confidence).filter((v) => v === "no-clue").length,
  };

  const recentHistory = history.slice(0, 5);
  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / history.length)
    : 0;

  // Category mastery from SR data
  const srData = getSRData();
  const catMastery = categories.map((cat) => {
    const catTerms = glossary.filter((g) => g.category === cat);
    const mastered = catTerms.filter((t) => srData[t.term]?.reps >= 3).length;
    return { category: cat, total: catTerms.length, mastered, pct: catTerms.length > 0 ? Math.round((mastered / catTerms.length) * 100) : 0 };
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Progress
          </h1>
          <button
            onClick={() => {
              const printWin = window.open("", "_blank");
              if (!printWin) return;
              printWin.document.write(`<!DOCTYPE html><html><head><title>Study Progress Report</title>
                <style>
                  body{font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;color:#2d2d2d}
                  h1{font-size:20px;margin-bottom:4px} h2{font-size:15px;margin-top:24px;border-bottom:1px solid #e8e4df;padding-bottom:6px}
                  .stat{display:inline-block;width:140px;margin:8px 12px 8px 0;padding:10px;border:1px solid #e8e4df;border-radius:8px}
                  .stat .val{font-size:22px;font-weight:700;color:#7c6b9a} .stat .lbl{font-size:11px;color:#8a8580}
                  .bar-wrap{background:#e8e4df;height:8px;border-radius:4px;margin:4px 0 12px}
                  .bar{height:100%;border-radius:4px;background:#7c6b9a}
                  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
                  td,th{padding:6px 8px;text-align:left;border-bottom:1px solid #e8e4df}
                  .tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;background:#f0ecf5;color:#7c6b9a;margin:2px}
                  .date{font-size:11px;color:#8a8580}
                  @media print{body{padding:20px}}
                </style></head><body>
                <h1>Study Progress Report</h1>
                <p class="date">Generated ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>

                <div>
                  <div class="stat"><div class="val">${srStats.total}</div><div class="lbl">Terms studied (of ${glossary.length})</div></div>
                  <div class="stat"><div class="val">${dueTerms.length}</div><div class="lbl">Due for review</div></div>
                  <div class="stat"><div class="val">${practiced.size}</div><div class="lbl">Questions practiced (of ${questions.length})</div></div>
                  <div class="stat"><div class="val">${avgScore}%</div><div class="lbl">Avg quiz score (${history.length} quizzes)</div></div>
                </div>

                <h2>Category Mastery</h2>
                ${catMastery.map(c => `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>${c.category}</span><span>${c.mastered}/${c.total} (${c.pct}%)</span></div><div class="bar-wrap"><div class="bar" style="width:${c.pct}%"></div></div></div>`).join("")}

                <h2>Exam Question Confidence</h2>
                <p style="font-size:13px">Got it: ${confCounts["got-it"]} | Shaky: ${confCounts.shaky} | No clue: ${confCounts["no-clue"]} | Unrated: ${questions.length - Object.keys(confidence).length}</p>

                ${weakAreas.terms.length > 0 ? `<h2>Focus Areas</h2><div>${weakAreas.terms.map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}

                ${recentHistory.length > 0 ? `<h2>Recent Activity</h2><table><tr><th>Mode</th><th>Date</th><th>Score</th></tr>${recentHistory.map(h => `<tr><td>${h.mode}</td><td>${h.date}</td><td>${h.percentage}%</td></tr>`).join("")}</table>` : ""}

              </body></html>`);
              printWin.document.close();
              setTimeout(() => printWin.print(), 300);
            }}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Export PDF
          </button>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Your study progress at a glance.
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {[
            { label: "Terms studied", value: srStats.total, sub: `of ${glossary.length}`, color: "var(--accent)" },
            { label: "Due for review", value: dueTerms.length, sub: "today", color: dueTerms.length > 0 ? "#c96b6b" : "#6ab070" },
            { label: "Questions practiced", value: practiced.size, sub: `of ${questions.length}`, color: "var(--accent)" },
            { label: "Avg quiz score", value: `${avgScore}%`, sub: `${history.length} quizzes`, color: avgScore >= 80 ? "#6ab070" : avgScore >= 60 ? "#d4a843" : "#c96b6b" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {stat.label}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Due for review */}
        {dueTerms.length > 0 && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "#fce4ec30", border: "1px solid #c96b6b30" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm" style={{ color: "#c96b6b" }}>
                Due for review ({dueTerms.length})
              </h3>
              <Link
                href="/study"
                className="text-xs font-medium"
                style={{ color: "var(--accent)" }}
              >
                Study now
              </Link>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {dueTerms.slice(0, 15).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                >
                  {t}
                </span>
              ))}
              {dueTerms.length > 15 && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  +{dueTerms.length - 15} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Category mastery */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--foreground)" }}>
            Mastery by category
          </h3>
          <div className="space-y-3">
            {catMastery.map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--foreground)" }}>{c.category}</span>
                  <span style={{ color: "var(--muted)" }}>{c.mastered}/{c.total} ({c.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      background: c.pct >= 80 ? "#6ab070" : c.pct >= 50 ? "#d4a843" : "var(--accent)",
                      width: `${c.pct}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam question confidence */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--foreground)" }}>
            Exam question confidence
          </h3>
          <div className="flex gap-4 mb-3">
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#6ab070" }}>{confCounts["got-it"]}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Got it</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#d4a843" }}>{confCounts.shaky}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Shaky</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#c96b6b" }}>{confCounts["no-clue"]}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>No clue</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "var(--muted)" }}>{questions.length - Object.keys(confidence).length}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Unrated</p>
            </div>
          </div>
          <div className="w-full h-3 rounded-full flex overflow-hidden" style={{ background: "var(--border)" }}>
            {confCounts["got-it"] > 0 && <div style={{ background: "#6ab070", width: `${(confCounts["got-it"] / questions.length) * 100}%` }} />}
            {confCounts.shaky > 0 && <div style={{ background: "#d4a843", width: `${(confCounts.shaky / questions.length) * 100}%` }} />}
            {confCounts["no-clue"] > 0 && <div style={{ background: "#c96b6b", width: `${(confCounts["no-clue"] / questions.length) * 100}%` }} />}
          </div>
        </div>

        {/* Weak areas */}
        {weakAreas.terms.length > 0 && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--foreground)" }}>
              Focus areas
            </h3>
            <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
              Terms you&apos;ve gotten wrong most often recently:
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {weakAreas.terms.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#fce4ec", color: "#c96b6b" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent quizzes */}
        {recentHistory.length > 0 && (
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--foreground)" }}>
              Recent activity
            </h3>
            <div className="space-y-2">
              {recentHistory.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-1.5"
                  style={{ borderBottom: i < recentHistory.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <div>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>
                      {h.mode}
                    </span>
                    <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>
                      {h.date}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: h.percentage >= 80 ? "#6ab070" : h.percentage >= 60 ? "#d4a843" : "#c96b6b" }}
                  >
                    {h.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
