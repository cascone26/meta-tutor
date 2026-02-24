"use client";

import { useState } from "react";
import { comparisons } from "@/lib/comparisons";

export default function ComparePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = comparisons.find((c) => c.id === activeId);

  const colors = ["#6b8fbf", "#bf8f6b", "#6ab070", "#c4737a", "#9a8a6b"];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Compare
        </h1>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Side-by-side comparisons of key philosophical positions.
        </p>

        {/* Topic picker */}
        <div className="flex gap-2 flex-wrap mb-6">
          {comparisons.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(activeId === c.id ? null : c.id)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: activeId === c.id ? "var(--accent)" : "var(--surface)",
                color: activeId === c.id ? "#fff" : "var(--muted)",
                border: `1px solid ${activeId === c.id ? "transparent" : "var(--border)"}`,
              }}
            >
              {c.topic}
            </button>
          ))}
        </div>

        {/* Comparison display */}
        {active ? (
          <div>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
              {active.topic}
            </h2>
            <div className={`grid gap-3 ${active.sides.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
              {active.sides.map((side, i) => (
                <div
                  key={side.label}
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--surface)",
                    border: `2px solid ${colors[i % colors.length]}30`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: colors[i % colors.length] }}
                    />
                    <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      {side.label}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {side.points.map((point, j) => (
                      <li
                        key={j}
                        className="text-sm leading-relaxed flex gap-2"
                        style={{ color: "var(--muted)" }}
                      >
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: colors[i % colors.length] + "80" }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comparisons.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className="text-left rounded-xl p-4 transition-all"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors[i % colors.length])}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
                  {c.topic}
                </h3>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {c.sides.map((s) => s.label).join(" vs ")}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
