"use client";

import { useState } from "react";
import { faithConnections } from "@/lib/faith-connections";

const cats = [...new Set(faithConnections.map((fc) => fc.category))];

export default function FaithPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? faithConnections.filter((fc) => fc.category === filter) : faithConnections;
  const active = selected !== null ? faithConnections.find((fc) => fc.id === selected) : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Philosophy &amp; Faith
        </h1>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          How the concepts of metaphysics connect to Catholic doctrine and Sacred Scripture.
        </p>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          <button
            onClick={() => setFilter(null)}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: !filter ? "var(--accent)" : "var(--surface)",
              color: !filter ? "#fff" : "var(--muted)",
              border: `1px solid ${!filter ? "var(--accent)" : "var(--border)"}`,
            }}
          >All</button>
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: filter === cat ? "var(--accent)" : "var(--surface)",
                color: filter === cat ? "#fff" : "var(--muted)",
                border: `1px solid ${filter === cat ? "var(--accent)" : "var(--border)"}`,
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Expanded view */}
        {active && (
          <div className="mb-5">
            <button
              onClick={() => setSelected(null)}
              className="text-sm mb-3"
              style={{ color: "var(--muted)" }}
            >&larr; Back to all</button>

            <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                  {active.category}
                </span>
              </div>

              <h2 className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
                {active.concept}
              </h2>
              <p className="text-sm font-medium mb-4" style={{ color: "var(--accent)" }}>
                → {active.doctrine}
              </p>

              <p className="text-sm mb-4" style={{ color: "var(--foreground)", lineHeight: 1.7 }}>
                {active.connection}
              </p>

              {active.scriptureRef && (
                <div className="rounded-lg p-4 mb-2" style={{ background: "var(--prayer-bg)", border: "1px solid var(--prayer-border)" }}>
                  <p className="text-xs font-semibold mb-1 tracking-wide uppercase" style={{ color: "var(--prayer)", letterSpacing: "0.08em" }}>Scripture</p>
                  <p className="text-sm italic leading-relaxed" style={{ color: "var(--foreground)" }}>{active.scriptureRef}</p>
                </div>
              )}

              {active.catechismRef && (
                <div className="rounded-lg p-4" style={{ background: "var(--prayer-bg)", border: "1px solid var(--prayer-border)" }}>
                  <p className="text-xs font-semibold mb-1 tracking-wide uppercase" style={{ color: "var(--prayer)", letterSpacing: "0.08em" }}>Catechism</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{active.catechismRef}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card list */}
        {!active && (
          <div className="space-y-2">
            {filtered.map((fc) => (
              <button
                key={fc.id}
                onClick={() => setSelected(fc.id)}
                className="w-full text-left rounded-xl p-4 transition-all"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                    {fc.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                  {fc.concept}
                </h3>
                <p className="text-xs" style={{ color: "var(--accent)" }}>
                  → {fc.doctrine}
                </p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>
                  {fc.connection.slice(0, 120)}...
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
