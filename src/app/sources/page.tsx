"use client";

import { useState, useEffect, useRef } from "react";

type Source = {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  charCount: number;
};

type Highlight = {
  sourceId: string;
  text: string;
  note: string;
  createdAt: string;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [annotating, setAnnotating] = useState(false);
  const [annotationNote, setAnnotationNote] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-sources");
      if (saved) setSources(JSON.parse(saved));
      const savedH = localStorage.getItem("meta-tutor-highlights");
      if (savedH) setHighlights(JSON.parse(savedH));
    } catch {}
  }, []);

  function saveSources(s: Source[]) {
    setSources(s);
    localStorage.setItem("meta-tutor-sources", JSON.stringify(s));
  }

  function saveHighlights(h: Highlight[]) {
    setHighlights(h);
    localStorage.setItem("meta-tutor-highlights", JSON.stringify(h));
  }

  function addSource() {
    if (!content.trim()) return;
    const source: Source = {
      id: Date.now().toString(),
      title: title.trim() || "Untitled",
      author: author.trim() || "Unknown",
      content: content.trim(),
      createdAt: new Date().toLocaleDateString(),
      charCount: content.trim().length,
    };
    saveSources([source, ...sources]);
    resetForm();
  }

  function updateSource(id: string) {
    saveSources(
      sources.map((s) =>
        s.id === id
          ? { ...s, title, author, content, charCount: content.length }
          : s
      )
    );
    resetForm();
  }

  function deleteSource(id: string) {
    saveSources(sources.filter((s) => s.id !== id));
    saveHighlights(highlights.filter((h) => h.sourceId !== id));
    if (viewingId === id) setViewingId(null);
  }

  function resetForm() {
    setAdding(false);
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setContent("");
  }

  function startEdit(s: Source) {
    setEditingId(s.id);
    setTitle(s.title);
    setAuthor(s.author);
    setContent(s.content);
    setAdding(false);
    setViewingId(null);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      setContent(text);
      setAdding(true);
      setViewingId(null);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleTextSelect() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
      setAnnotating(true);
    }
  }

  function saveAnnotation() {
    if (!viewingId || !selectedText) return;
    saveHighlights([
      ...highlights,
      {
        sourceId: viewingId,
        text: selectedText,
        note: annotationNote.trim(),
        createdAt: new Date().toLocaleString(),
      },
    ]);
    setAnnotating(false);
    setAnnotationNote("");
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  }

  const viewingSource = sources.find((s) => s.id === viewingId);
  const sourceHighlights = highlights.filter((h) => h.sourceId === viewingId);

  // Source reader view
  if (viewingSource) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => setViewingId(null)}
            className="text-sm font-medium flex items-center gap-1 mb-4"
            style={{ color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to sources
          </button>

          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            {viewingSource.title}
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            {viewingSource.author} &middot; {viewingSource.charCount.toLocaleString()} chars
          </p>

          <p className="text-xs mb-3" style={{ color: "var(--accent)" }}>
            Select text to highlight and annotate
          </p>

          {/* Annotation popup */}
          {annotating && (
            <div
              className="rounded-xl p-4 mb-4"
              style={{ background: "#fef9e7", border: "1px solid #d4a843" }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: "#8a6d20" }}>
                Highlight: &ldquo;{selectedText.slice(0, 100)}{selectedText.length > 100 ? "..." : ""}&rdquo;
              </p>
              <input
                type="text"
                value={annotationNote}
                onChange={(e) => setAnnotationNote(e.target.value)}
                placeholder="Add a note (optional)..."
                className="w-full rounded-lg px-3 py-2 text-sm outline-none mt-2 mb-2"
                style={{ background: "#fff", border: "1px solid #e8e4df" }}
                onKeyDown={(e) => e.key === "Enter" && saveAnnotation()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveAnnotation}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Save highlight
                </button>
                <button
                  onClick={() => { setAnnotating(false); setSelectedText(""); }}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Highlights */}
          {sourceHighlights.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Your highlights ({sourceHighlights.length})
              </p>
              <div className="space-y-1.5">
                {sourceHighlights.map((h, i) => (
                  <div
                    key={i}
                    className="rounded-lg px-3 py-2 text-xs flex items-start justify-between gap-2"
                    style={{ background: "#fef9e7", border: "1px solid #f0e6c0" }}
                  >
                    <div>
                      <p style={{ color: "#8a6d20" }}>
                        &ldquo;{h.text.slice(0, 120)}{h.text.length > 120 ? "..." : ""}&rdquo;
                      </p>
                      {h.note && (
                        <p className="mt-0.5" style={{ color: "var(--muted)" }}>
                          Note: {h.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        saveHighlights(highlights.filter((_, j) => !(_.sourceId === viewingId && j === highlights.indexOf(_))))
                      }
                      className="shrink-0 hover:opacity-60"
                      style={{ color: "var(--muted)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source text */}
          <div
            className="rounded-xl p-5 text-sm leading-[1.8] whitespace-pre-wrap"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
            onMouseUp={handleTextSelect}
          >
            {search
              ? viewingSource.content
                  .split("\n")
                  .filter((l) => l.toLowerCase().includes(search.toLowerCase()))
                  .join("\n")
              : viewingSource.content}
          </div>
        </div>
      </div>
    );
  }

  // Source list view
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Source Library
          </h1>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.text"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "var(--surface)", color: "var(--accent)", border: "1px solid var(--border)" }}
            >
              Upload file
            </button>
            <button
              onClick={() => { setAdding(true); setEditingId(null); resetForm(); setAdding(true); }}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              + Add source
            </button>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Add primary texts (Summa Theologiae, Aristotle&apos;s Metaphysics, etc.). The tutor will quote directly from these instead of paraphrasing.
        </p>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sources..."
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-4"
          style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        />

        {/* Add/edit form */}
        {(adding || editingId) && (
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (e.g., Summa Theologiae I, Q.2)"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              />
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author (e.g., Thomas Aquinas)"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the full text here..."
              rows={12}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y mb-3 font-mono leading-relaxed"
              style={{ background: "var(--background)", border: "1px solid var(--border)" }}
            />
            <div className="flex gap-2 justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {content.length.toLocaleString()} characters
              </span>
              <div className="flex gap-2">
                <button onClick={resetForm} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ color: "var(--muted)" }}>
                  Cancel
                </button>
                <button
                  onClick={() => (editingId ? updateSource(editingId) : addSource())}
                  disabled={!content.trim()}
                  className="text-xs px-4 py-1.5 rounded-full font-medium disabled:opacity-40"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {editingId ? "Save changes" : "Add source"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Source list */}
        <div className="space-y-2">
          {sources.length === 0 && !adding && (
            <div className="text-center py-12">
              <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>No sources yet</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Add primary texts so the tutor can quote them directly.
              </p>
            </div>
          )}
          {sources
            .filter(
              (s) =>
                !search ||
                s.title.toLowerCase().includes(search.toLowerCase()) ||
                s.author.toLowerCase().includes(search.toLowerCase()) ||
                s.content.toLowerCase().includes(search.toLowerCase())
            )
            .map((s) => (
              <div
                key={s.id}
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    onClick={() => setViewingId(s.id)}
                    className="text-left flex-1"
                  >
                    <h3 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {s.title}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {s.author} &middot; {s.charCount.toLocaleString()} chars &middot; Added {s.createdAt}
                      {highlights.filter((h) => h.sourceId === s.id).length > 0 &&
                        ` · ${highlights.filter((h) => h.sourceId === s.id).length} highlights`}
                    </p>
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setViewingId(s.id)} className="p-1.5 rounded-lg hover:opacity-60" style={{ color: "var(--accent)" }} title="Read">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg hover:opacity-60" style={{ color: "var(--muted)" }} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button onClick={() => deleteSource(s.id)} className="p-1.5 rounded-lg hover:opacity-60" style={{ color: "var(--error)" }} title="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
