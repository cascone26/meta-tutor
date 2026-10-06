"use client";

import { useState } from "react";
import Link from "next/link";
import { ethicsGlossary, ethicsGlossaryCategories } from "@/lib/ethics-glossary";

export default function EthicsGlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = ethicsGlossary.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.term.toLowerCase().includes(search.toLowerCase()) ||
      entry.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="shrink-0 px-4 py-4 border-b"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
              Ethics Glossary
            </h1>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {filtered.length} / {ethicsGlossary.length} terms
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: "var(--muted)" }}
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms or definitions..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                background: activeCategory === null ? "var(--accent)" : "var(--background)",
                color: activeCategory === null ? "#fff" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              All
            </button>
            {ethicsGlossaryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className="text-xs px-3 py-1 rounded-full transition-colors"
                style={{
                  background: activeCategory === cat ? "var(--accent)" : "var(--background)",
                  color: activeCategory === cat ? "#fff" : "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-sm py-8" style={{ color: "var(--muted)" }}>
              No terms match your search.
            </p>
          )}
          {filtered.map((entry) => {
            const isOpen = expanded === entry.term;
            return (
              <div
                key={entry.term}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : entry.term)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  style={{ color: "var(--foreground)" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-sm truncate">{entry.term}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                    >
                      {entry.category}
                    </span>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="shrink-0 ml-2 transition-transform"
                    style={{
                      color: "var(--muted)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    className="px-4 pb-4 pt-0 text-sm leading-relaxed"
                    style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}
                  >
                    <p className="pt-3">{entry.definition}</p>
                    <Link
                      href={`/ethics?q=${encodeURIComponent(`Explain the term "${entry.term}" and give me a T/F question about it`)}`}
                      className="inline-block mt-3 text-xs font-medium underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Ask about this term →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
