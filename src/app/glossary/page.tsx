"use client";

import { useState } from "react";
import { glossary, categories } from "@/lib/glossary";
import Link from "next/link";

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = glossary.filter((g) => {
    const matchesSearch =
      !search ||
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Key Terms
        </h1>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          {glossary.length} terms from your course notes. Tap any term to expand.
        </p>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-3"
          style={{
            background: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        />

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
            style={{
              background: !activeCategory ? "var(--accent)" : "var(--surface)",
              color: !activeCategory ? "#fff" : "var(--muted)",
              border: `1px solid ${!activeCategory ? "transparent" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
              style={{
                background: activeCategory === cat ? "var(--accent)" : "var(--surface)",
                color: activeCategory === cat ? "#fff" : "var(--muted)",
                border: `1px solid ${activeCategory === cat ? "transparent" : "var(--border)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          {filtered.map((g) => (
            <div
              key={g.term}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setExpanded(expanded === g.term ? null : g.term)}
                className="w-full text-left px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                    {g.term}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                  >
                    {g.category}
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform"
                  style={{
                    color: "var(--muted)",
                    transform: expanded === g.term ? "rotate(180deg)" : "rotate(0)",
                  }}
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expanded === g.term && (
                <div
                  className="px-4 pb-3 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  <p className="mb-2">{g.definition}</p>
                  <Link
                    href={`/?q=${encodeURIComponent(`Explain "${g.term}" in more detail and give examples`)}`}
                    className="text-xs font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                    style={{ color: "var(--accent)" }}
                  >
                    Ask tutor about this
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "var(--muted)" }}>
            No terms match your search.
          </p>
        )}
      </div>
    </div>
  );
}
