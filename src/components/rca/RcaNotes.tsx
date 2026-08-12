"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { rcaClasses, getRcaClass } from "@/lib/rca";
import { formatMarkdown } from "@/lib/sanitize-markdown";

type RcaNote = {
  id: string;
  title: string;
  content: string;
  classId: string; // "general" or an rcaClasses id
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "meta-tutor-rca-notes";
const MAX_NOTE_SIZE = 20000; // quick notes, not document dumps — keep it snappy

function classLabel(classId: string) {
  if (classId === "general") return "General";
  return getRcaClass(classId)?.name ?? "General";
}

function NoteIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h13l3 3v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M17 4v4h4" />
      <path d="M7 12h9M7 16h6" />
    </svg>
  );
}

// Always-available quick-notes panel for the whole /rca umbrella — same
// pattern as RcaAssistant (a floating button + slide-up panel that survives
// navigation, living in rca/layout.tsx). Separate from the general /notes
// page: these are fast scratch notes tagged to a class, not long course docs.
export default function RcaNotes() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<RcaNote[]>([]);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classId, setClassId] = useState("general");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const slug = pathname.startsWith("/rca/") ? pathname.split("/")[2] : undefined;
  const currentClass = slug ? getRcaClass(slug) : undefined;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  // Only one of the two floating panels (this + RcaAssistant) can be open at
  // a time — see the matching effect in RcaAssistant.tsx for why.
  useEffect(() => {
    function onOtherPanelOpen(e: Event) {
      if ((e as CustomEvent).detail !== "notes") setOpen(false);
    }
    window.addEventListener("rca-panel-open", onOtherPanelOpen);
    return () => window.removeEventListener("rca-panel-open", onOtherPanelOpen);
  }, []);

  function toggleOpen() {
    setOpen((v) => {
      const next = !v;
      if (next) window.dispatchEvent(new CustomEvent("rca-panel-open", { detail: "notes" }));
      return next;
    });
  }

  function persist(next: RcaNote[]) {
    setNotes(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save RCA notes:", e);
    }
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    setTitle("");
    setContent("");
    setClassId(currentClass?.id ?? "general");
    setPreview(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function startEdit(note: RcaNote) {
    setEditingId(note.id);
    setAdding(false);
    setTitle(note.title);
    setContent(note.content);
    setClassId(note.classId);
    setPreview(false);
  }

  function cancelForm() {
    setAdding(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setPreview(false);
  }

  // Inserts/wraps markdown syntax around the current selection (or a
  // placeholder, if nothing's selected) — same markdown flavor the rest of
  // the app already renders (formatMarkdown/prose, used for AI feedback), so
  // notes get real formatting without building a separate rich-text editor.
  function applyFormat(type: "bold" | "italic" | "underline" | "heading" | "bullet" | "numbered") {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    let insertText = selected;

    if (type === "bold") insertText = `**${selected || "bold text"}**`;
    else if (type === "italic") insertText = `*${selected || "italic text"}*`;
    else if (type === "underline") insertText = `__${selected || "underlined text"}__`;
    else if (type === "heading") insertText = `## ${selected || "Heading"}`;
    else if (type === "bullet") insertText = (selected || "list item").split("\n").map((l) => `- ${l}`).join("\n");
    else if (type === "numbered") insertText = (selected || "list item").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n");

    const next = content.slice(0, start) + insertText + content.slice(end);
    setContent(next);
    setTimeout(() => {
      ta.focus();
      const pos = start + insertText.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  }

  function save() {
    if (!content.trim()) return;
    if (content.length > MAX_NOTE_SIZE) {
      alert(`Note is too long (${Math.round(content.length / 1000)}KB). Keep quick notes under ${MAX_NOTE_SIZE / 1000}KB — for longer docs use the full Notes page.`);
      return;
    }
    const now = Date.now();
    if (editingId) {
      persist(notes.map((n) => (n.id === editingId ? { ...n, title: title.trim() || "Untitled", content: content.trim(), classId, updatedAt: now } : n)));
    } else {
      const note: RcaNote = { id: now.toString(), title: title.trim() || "Untitled", content: content.trim(), classId, pinned: false, createdAt: now, updatedAt: now };
      persist([note, ...notes]);
    }
    cancelForm();
  }

  function remove(id: string) {
    persist(notes.filter((n) => n.id !== id));
  }

  function togglePin(id: string) {
    persist(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  const filtered = useMemo(() => {
    return notes
      .filter((n) => filterClass === "all" || n.classId === filterClass)
      .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.pinned === b.pinned ? b.updatedAt - a.updatedAt : a.pinned ? -1 : 1));
  }, [notes, search, filterClass]);

  const usedClassIds = useMemo(() => Array.from(new Set(notes.map((n) => n.classId))), [notes]);

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={open ? "Close notes" : "Open notes"}
        className="fixed bottom-5 z-30 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
        style={{ right: 80, width: 52, height: 52, background: "#6b8e5a", color: "#fff" }}
      >
        <NoteIcon size={20} />
        {notes.length > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold"
            style={{ width: 18, height: 18, background: "#c9843a", color: "#fff" }}
          >
            {notes.length > 99 ? "99+" : notes.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-[76px] z-30 flex flex-col rounded-2xl shadow-xl overflow-hidden"
          style={{ right: 20, width: "min(380px, calc(100vw - 2.5rem))", maxHeight: "75vh", background: "#fbf8f0", border: "1px solid #d9e4d3" }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#eef2e2", borderBottom: "1px solid #d9e4d3" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#4f6a41" }}>Quick notes</p>
              <p className="text-xs" style={{ color: "#6b8e6a" }}>{notes.length} saved, always here</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startAdd}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "#6b8e5a", color: "#fff" }}
              >
                + New
              </button>
              <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "#6b8e6a" }} aria-label="Close">✕</button>
            </div>
          </div>

          {(adding || editingId) ? (
            <div className="p-3 flex flex-col gap-2" style={{ borderBottom: "1px solid #d9e4d3" }}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
              />
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="rounded-lg px-3 py-2 text-xs outline-none"
                style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
              >
                <option value="general">General</option>
                {rcaClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {/* Formatting toolbar — inserts the same markdown syntax the
                  rest of the app already renders (formatMarkdown), so notes
                  get real bold/italic/underline/headings/lists without a
                  separate rich-text editor. Preview toggle shows the actual
                  rendered result before saving. */}
              <div className="flex items-center gap-1 flex-wrap">
                <button type="button" onClick={() => applyFormat("bold")} className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Bold">B</button>
                <button type="button" onClick={() => applyFormat("italic")} className="text-xs italic px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Italic">I</button>
                <button type="button" onClick={() => applyFormat("underline")} className="text-xs underline px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Underline">U</button>
                <button type="button" onClick={() => applyFormat("heading")} className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Heading">H</button>
                <button type="button" onClick={() => applyFormat("bullet")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Bullet list">• List</button>
                <button type="button" onClick={() => applyFormat("numbered")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Numbered list">1. List</button>
                <button
                  type="button"
                  onClick={() => setPreview((v) => !v)}
                  className="text-xs px-2 py-1 rounded-md ml-auto font-medium"
                  style={{ background: preview ? "#6b8e5a" : "#eef2e2", color: preview ? "#fff" : "#4f6a41" }}
                >
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
              {preview ? (
                <div
                  className="prose rounded-lg px-3 py-2 text-sm overflow-y-auto"
                  style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a", minHeight: 132, maxHeight: 220 }}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(content) || "<p style='opacity:0.5'>Nothing to preview yet.</p>" }}
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Jot it down… **bold**, *italic*, __underline__, - bullets, ## headings"
                  rows={6}
                  className="rounded-lg px-3 py-2 text-sm outline-none resize-y"
                  style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
                />
              )}
              <div className="flex gap-2 justify-end">
                <button onClick={cancelForm} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ color: "#8a9a7c" }}>
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!content.trim()}
                  className="text-xs px-4 py-1.5 rounded-full font-medium disabled:opacity-40"
                  style={{ background: "#6b8e5a", color: "#fff" }}
                >
                  {editingId ? "Save changes" : "Add note"}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-3 pt-3 flex flex-col gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes…"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
              />
              {usedClassIds.length > 1 && (
                <div className="flex gap-1.5 flex-wrap pb-1">
                  <button
                    onClick={() => setFilterClass("all")}
                    className="text-[11px] px-2 py-1 rounded-full font-medium"
                    style={{ background: filterClass === "all" ? "#6b8e5a" : "#fff", color: filterClass === "all" ? "#fff" : "#6b8e6a", border: "1px solid #d9e4d3" }}
                  >
                    All
                  </button>
                  {usedClassIds.map((cid) => (
                    <button
                      key={cid}
                      onClick={() => setFilterClass(cid)}
                      className="text-[11px] px-2 py-1 rounded-full font-medium"
                      style={{ background: filterClass === cid ? "#6b8e5a" : "#fff", color: filterClass === cid ? "#fff" : "#6b8e6a", border: "1px solid #d9e4d3" }}
                    >
                      {classLabel(cid)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 80 }}>
            {filtered.length === 0 && !adding && !editingId && (
              <div className="text-center py-10">
                <p className="text-sm mb-1" style={{ color: "#8a9a7c" }}>
                  {notes.length === 0 ? "No notes yet" : "No matches"}
                </p>
                <p className="text-xs" style={{ color: "#8a9a7c" }}>
                  {notes.length === 0 ? "Tap + New to jot something down — it's here on every RCA page." : "Try a different search or class filter."}
                </p>
              </div>
            )}
            {filtered.map((n) => (
              <div key={n.id} className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #d9e4d3" }}>
                <div className="flex items-start justify-between px-3 py-2 gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-medium text-sm truncate" style={{ color: "#2f3a2a" }}>{n.title}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide shrink-0" style={{ background: "#eef2e2", color: "#6b8e6a" }}>
                        {classLabel(n.classId)}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#8a9a7c" }}>{n.content}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <button onClick={() => togglePin(n.id)} className="p-1 rounded-lg hover:opacity-60" style={{ color: n.pinned ? "#c9843a" : "#c4cbb8" }} title={n.pinned ? "Unpin" : "Pin"}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={n.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path d="M12 2l2 7h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" /></svg>
                    </button>
                    <button onClick={() => startEdit(n)} className="p-1 rounded-lg hover:opacity-60" style={{ color: "#8a9a7c" }} title="Edit">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button onClick={() => remove(n.id)} className="p-1 rounded-lg hover:opacity-60" style={{ color: "#c47a7a" }} title="Delete">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
