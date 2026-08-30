"use client";

import { useEffect, useState } from "react";

type ProgressData = {
  due: unknown[];
  stats: { new: number; learning: number; review: number; mastered: number };
  totalTracked: number;
  comprehensionAccuracy: { accuracy: number; sampleSize: number };
  weakGrammarTags: { tag: string; missCount: number }[];
};

export default function ProgressPanel() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch("/api/latin-progress")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <p className="text-sm text-center py-10" style={{ color: "#a08b73" }}>Loading…</p>;

  const { stats, totalTracked, comprehensionAccuracy, weakGrammarTags } = data;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "#221912", border: "1px solid #3a2d1f" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#c17a3a" }}>Vocabulary ({totalTracked} tracked)</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div><p className="text-lg font-bold" style={{ color: "#f0e6d8" }}>{stats.new}</p><p className="text-xs" style={{ color: "#7a6852" }}>New</p></div>
          <div><p className="text-lg font-bold" style={{ color: "#c2a06e" }}>{stats.learning}</p><p className="text-xs" style={{ color: "#7a6852" }}>Learning</p></div>
          <div><p className="text-lg font-bold" style={{ color: "#c17a3a" }}>{stats.review}</p><p className="text-xs" style={{ color: "#7a6852" }}>Review</p></div>
          <div><p className="text-lg font-bold" style={{ color: "#8fc26e" }}>{stats.mastered}</p><p className="text-xs" style={{ color: "#7a6852" }}>Mastered</p></div>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "#221912", border: "1px solid #3a2d1f" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#c17a3a" }}>Comprehension accuracy</p>
        {comprehensionAccuracy.sampleSize === 0 ? (
          <p className="text-sm" style={{ color: "#a08b73" }}>No comprehension checks yet — take one to start building your profile.</p>
        ) : (
          <p className="text-sm" style={{ color: "#f0e6d8" }}>
            {Math.round(comprehensionAccuracy.accuracy * 100)}% over your last {comprehensionAccuracy.sampleSize} checks
            {comprehensionAccuracy.sampleSize < 15 && <span style={{ color: "#7a6852" }}> — profile firms up after 15 checks</span>}
          </p>
        )}
      </div>

      <div className="rounded-xl p-4" style={{ background: "#221912", border: "1px solid #3a2d1f" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#c17a3a" }}>Where you're actually struggling</p>
        {weakGrammarTags.length === 0 ? (
          <p className="text-sm" style={{ color: "#a08b73" }}>Not enough missed questions yet to identify a pattern — this fills in as you use it.</p>
        ) : (
          <div className="space-y-1.5">
            {weakGrammarTags.map((w) => (
              <div key={w.tag} className="flex items-center justify-between text-sm">
                <span style={{ color: "#f0e6d8" }}>{w.tag.replace(/-/g, " ")}</span>
                <span style={{ color: "#c26e6e" }}>{w.missCount}×</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
