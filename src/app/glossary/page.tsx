"use client";

import { useState, useEffect } from "react";
import { glossary as baseGlossary } from "@/lib/glossary";
import {
  getCustomData,
  saveCustomData,
  type CustomGlossaryData,
  type GlossaryTerm,
} from "@/lib/custom-glossary";
import Link from "next/link";

type EffectiveEntry = GlossaryTerm & {
  _originalTerm: string;
  _isAdded: boolean;
  _isEdited: boolean;
};

function buildEntries(data: CustomGlossaryData): EffectiveEntry[] {
  const deletedSet = new Set(data.deleted);
  const base = baseGlossary
    .filter((g) => !deletedSet.has(g.term))
    .map((g) => ({
      ...(data.edited[g.term] ?? g),
      _originalTerm: g.term,
      _isAdded: false,
      _isEdited: g.term in data.edited,
    }));
  const added = data.added.map((g) => ({
    ...g,
    _originalTerm: g.term,
    _isAdded: true,
    _isEdited: false,
  }));
  return [...base, ...added];
}

const BLANK: GlossaryTerm = { term: "", definition: "", category: "" };

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; entry?: EffectiveEntry } | null>(null);
  const [form, setForm] = useState<GlossaryTerm>(BLANK);
  const [customData, setCustomData] = useState<CustomGlossaryData>({ added: [], edited: {}, deleted: [] });

  useEffect(() => {
    setCustomData(getCustomData());
  }, []);

  const entries = buildEntries(customData);
  const allCategories = [...new Set(entries.map((e) => e.category))];

  const filtered = entries.filter((e) => {
    const matchesSearch =
      !search ||
      e.term.toLowerCase().includes(search.toLowerCase()) ||
      e.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function persist(data: CustomGlossaryData) {
    saveCustomData(data);
    setCustomData({ ...data });
  }

  function openAdd() {
    setForm(BLANK);
    setModal({ mode: "add" });
  }

  function openEdit(entry: EffectiveEntry) {
    setForm({ term: entry.term, definition: entry.definition, category: entry.category });
    setModal({ mode: "edit", entry });
  }

  function handleSave() {
    const trimmed = {
      term: form.term.trim(),
      definition: form.definition.trim(),
      category: form.category.trim(),
    };
    if (!trimmed.term || !trimmed.definition || !trimmed.category) return;

    const data: CustomGlossaryData = {
      added: [...customData.added],
      edited: { ...customData.edited },
      deleted: [...customData.deleted],
    };

    if (modal?.mode === "add") {
      data.added.push(trimmed);
    } else if (modal?.mode === "edit" && modal.entry) {
      const { _originalTerm, _isAdded } = modal.entry;
      if (_isAdded) {
        const idx = data.added.findIndex((t) => t.term === _originalTerm);
        if (idx !== -1) data.added[idx] = trimmed;
      } else {
        data.edited[_originalTerm] = trimmed;
      }
    }

    persist(data);
    setModal(null);
  }

  function handleDelete(entry: EffectiveEntry) {
    const data: CustomGlossaryData = {
      added: [...customData.added],
      edited: { ...customData.edited },
      deleted: [...customData.deleted],
    };

    if (entry._isAdded) {
      data.added = data.added.filter((t) => t.term !== entry._originalTerm);
    } else {
      if (!data.deleted.includes(entry._originalTerm)) {
        data.deleted.push(entry._originalTerm);
      }
      delete data.edited[entry._originalTerm];
    }

    persist(data);
    setConfirmDelete(null);
    if (expanded === entry._originalTerm) setExpanded(null);
  }

  const entryKey = (e: EffectiveEntry) => e._originalTerm + (e._isAdded ? "-added" : "");

  return (
    <div className="h-full overflow-y-auto">
      {/* Add / Edit modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-5"
            style={{ background: "var(--background)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
              {modal.mode === "add" ? "Add term" : "Edit term"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                  Term
                </label>
                <input
                  type="text"
                  value={form.term}
                  onChange={(e) => setForm({ ...form, term: e.target.value })}
                  placeholder="e.g. Substance"
                  autoFocus
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                  Category
                </label>
                <input
                  list="category-options"
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Thomism"
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                />
                <datalist id="category-options">
                  {allCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                  Definition
                </label>
                <textarea
                  value={form.definition}
                  onChange={(e) => setForm({ ...form, definition: e.target.value })}
                  placeholder="Enter the definition..."
                  rows={4}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "var(--surface)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.term.trim() || !form.definition.trim() || !form.category.trim()}
                className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Key Terms
          </h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add term
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          {entries.length} terms · tap to expand
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
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              background: !activeCategory ? "var(--accent)" : "var(--surface)",
              color: !activeCategory ? "#fff" : "var(--muted)",
              border: `1px solid ${!activeCategory ? "transparent" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
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

        {/* Terms list */}
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div
              key={entryKey(entry)}
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {/* Row */}
              <div className="flex items-center gap-2 px-4 py-3">
                {/* Clickable label area */}
                <button
                  onClick={() =>
                    setExpanded(expanded === entryKey(entry) ? null : entryKey(entry))
                  }
                  className="flex-1 flex items-center gap-2 text-left min-w-0"
                >
                  <span
                    className="font-medium text-sm truncate"
                    style={{ color: "var(--foreground)" }}
                  >
                    {entry.term}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                  >
                    {entry.category}
                  </span>
                  {(entry._isAdded || entry._isEdited) && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: "var(--surface-hover)",
                        color: "var(--muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      custom
                    </span>
                  )}
                </button>

                {/* Actions */}
                {confirmDelete === entryKey(entry) ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>Delete?</span>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: "#fce4ec", color: "#c96b6b" }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: "var(--surface-hover)", color: "var(--muted)" }}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(entry)}
                      className="p-1.5 rounded-lg hover:opacity-60"
                      style={{ color: "var(--muted)" }}
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setConfirmDelete(entryKey(entry))}
                      className="p-1.5 rounded-lg hover:opacity-60"
                      style={{ color: "var(--muted)" }}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setExpanded(expanded === entryKey(entry) ? null : entryKey(entry))
                      }
                      className="p-1.5 rounded-lg hover:opacity-60"
                      style={{ color: "var(--muted)" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-transform"
                        style={{
                          transform:
                            expanded === entryKey(entry) ? "rotate(180deg)" : "rotate(0)",
                        }}
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded definition */}
              {expanded === entryKey(entry) && (
                <div
                  className="px-4 pb-3 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  <p className="mb-2">{entry.definition}</p>
                  <Link
                    href={`/?q=${encodeURIComponent(
                      `Explain "${entry.term}" in more detail and give examples`
                    )}`}
                    className="text-xs font-medium inline-flex items-center gap-1 hover:opacity-70"
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
