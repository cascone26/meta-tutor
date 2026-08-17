"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { rcaClasses, getRcaClass } from "@/lib/rca";

type RcaNote = {
  id: string;
  title: string;
  content: string; // sanitized HTML (contentEditable output), not markdown
  classId: string; // "general" or an rcaClasses id
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "meta-tutor-rca-notes";
const MAX_NOTE_SIZE = 20000; // quick notes, not document dumps — keep it snappy

// contentEditable is a real WYSIWYG surface (like Docs/Gmail), so formatting
// applies live instead of showing as literal "**bold**" markdown syntax in a
// plain textarea — that literal-syntax look is what read as "not working."
const ALLOWED_TAGS = ["b", "strong", "i", "em", "u", "s", "strike", "h1", "h2", "h3", "ul", "ol", "li", "br", "div", "p", "blockquote", "span", "a"];

function sanitizeHtml(html: string): string {
  // href is allowed (for Insert Link) — DOMPurify still blocks javascript:/data:
  // URI schemes on it by default, so this doesn't open an XSS hole.
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: ["href", "target", "rel"] });
}

function stripHtml(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "");
  const div = document.createElement("div");
  div.innerHTML = sanitizeHtml(html);
  return div.textContent || "";
}

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // Expand mode swaps the small floating panel for a near-fullscreen one with a
  // much taller editor — same editor/toolbar, just more room to actually write in.
  const [expanded, setExpanded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  // Snapshot of the form's state the moment it opened, so Cancel/Escape/
  // switching notes can tell whether there's actually unsaved work to warn
  // about — editing then bailing out should never silently lose text, the
  // same guarantee a real document editor gives you. State, not a ref: it
  // needs to participate in the isDirty comparison during render, and refs
  // aren't safe to read there.
  const [initialForm, setInitialForm] = useState({ title: "", content: "", classId: "general" });
  const isDirty = title !== initialForm.title || content !== initialForm.content || classId !== initialForm.classId;

  const slug = pathname.startsWith("/rca/") ? pathname.split("/")[2] : undefined;
  const currentClass = slug ? getRcaClass(slug) : undefined;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  // Both this panel and RcaAssistant can be open at once now — the assistant
  // button sits to this one's right (closer to the corner), so when its
  // panel is also open, shift this one further left to sit beside it instead
  // of stacking directly underneath (which is what "should still be able to
  // open both at once" was reacting to — an earlier version made them
  // mutually-exclusive instead of actually solving the overlap).
  const [assistantOpen, setAssistantOpen] = useState(false);
  useEffect(() => {
    function onPanelChange(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.source === "assistant") setAssistantOpen(detail.open);
    }
    window.addEventListener("rca-panel-change", onPanelChange);
    return () => window.removeEventListener("rca-panel-change", onPanelChange);
  }, []);

  function toggleOpen() {
    setOpen((v) => !v);
  }

  function persist(next: RcaNote[]) {
    setNotes(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save RCA notes:", e);
    }
  }

  // Both entry points into the form go through here so isDirty always has a
  // real baseline to compare against, and so switching straight from editing
  // one note to starting/opening another always asks first if there's
  // unsaved work (not just the Cancel button).
  function guardUnsaved(after: () => void) {
    if ((adding || editingId) && isDirty) {
      if (!window.confirm("Discard unsaved changes to this note?")) return;
    }
    after();
  }

  function startAdd() {
    guardUnsaved(() => {
      setAdding(true);
      setEditingId(null);
      setTitle("");
      setContent("");
      const initClassId = currentClass?.id ?? "general";
      setClassId(initClassId);
      setInitialForm({ title: "", content: "", classId: initClassId });
    });
  }

  function startEdit(note: RcaNote) {
    guardUnsaved(() => {
      setEditingId(note.id);
      setAdding(false);
      setTitle(note.title);
      setContent(note.content);
      setClassId(note.classId);
      setInitialForm({ title: note.title, content: note.content, classId: note.classId });
    });
  }

  function cancelForm(skipGuard = false) {
    if (!skipGuard && isDirty && !window.confirm("Discard unsaved changes to this note?")) return;
    setAdding(false);
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  // The editor is an uncontrolled contentEditable div — its innerHTML is only
  // ever pushed from React when the form actually opens (new note or switching
  // which note is being edited). Re-syncing on every keystroke would reset the
  // caret to the start on each character, which is the classic contentEditable
  // + React bug.
  useEffect(() => {
    if ((adding || editingId) && editorRef.current) {
      editorRef.current.innerHTML = content;
      if (adding) editorRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adding, editingId]);

  // Live WYSIWYG formatting via the browser's own rich-text commands — the
  // same primitive Docs/Gmail-style editors are built on. This is what makes
  // Bold/Italic/etc. actually SHOW as bold/italic immediately, instead of
  // inserting literal "**text**" syntax into a plain textarea.
  function exec(command: string, value?: string) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, value);
    setContent(sanitizeHtml(el.innerHTML));
  }

  // formatBlock wants the bracketed form ("<h1>") for reliable cross-browser
  // behavior (bare "h1" is Chrome-only) — "" switches back to a plain paragraph.
  function setHeading(level: "" | "h1" | "h2" | "h3") {
    exec("formatBlock", level ? `<${level}>` : "<p>");
  }

  function insertLink() {
    const url = window.prompt("Link URL:", "https://");
    if (!url) return;
    exec("createLink", url);
  }

  function clearFormat() {
    exec("removeFormat");
    exec("formatBlock", "<p>");
  }

  // Real keyboard shortcuts, including the actual Google Docs bindings for
  // lists (Cmd/Ctrl+Shift+7/8) — this is the headline ask: notes should feel
  // like a real editor, not a plain textarea with buttons bolted on.
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const mod = e.metaKey || e.ctrlKey;

    if (mod && !e.shiftKey && e.key.toLowerCase() === "b") { e.preventDefault(); exec("bold"); return; }
    if (mod && !e.shiftKey && e.key.toLowerCase() === "i") { e.preventDefault(); exec("italic"); return; }
    if (mod && !e.shiftKey && e.key.toLowerCase() === "u") { e.preventDefault(); exec("underline"); return; }
    if (mod && e.shiftKey && e.key.toLowerCase() === "x") { e.preventDefault(); exec("strikeThrough"); return; }
    if (mod && e.shiftKey && e.key === "8") { e.preventDefault(); exec("insertUnorderedList"); return; }
    if (mod && e.shiftKey && e.key === "7") { e.preventDefault(); exec("insertOrderedList"); return; }
    if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); insertLink(); return; }
    if (mod && e.key === "Enter") { e.preventDefault(); save(); return; }
    if (e.key === "Escape") { e.preventDefault(); cancelForm(); return; }
    if (e.key === "Tab") {
      // Real editors indent (nesting inside a list) on Tab instead of losing
      // focus to the next element, which is what a plain textarea does.
      e.preventDefault();
      exec(e.shiftKey ? "outdent" : "indent");
    }
  }

  function save() {
    const plainLength = stripHtml(content).trim().length;
    if (!plainLength) return;
    if (plainLength > MAX_NOTE_SIZE) {
      alert(`Note is too long (${Math.round(plainLength / 1000)}KB). Keep quick notes under ${MAX_NOTE_SIZE / 1000}KB — for longer docs use the full Notes page.`);
      return;
    }
    const cleanContent = sanitizeHtml(content);
    const now = Date.now();
    if (editingId) {
      persist(notes.map((n) => (n.id === editingId ? { ...n, title: title.trim() || "Untitled", content: cleanContent, classId, updatedAt: now } : n)));
    } else {
      const note: RcaNote = { id: now.toString(), title: title.trim() || "Untitled", content: cleanContent, classId, pinned: false, createdAt: now, updatedAt: now };
      persist([note, ...notes]);
    }
    cancelForm(true); // just saved — nothing left to discard, skip the unsaved-changes prompt
  }

  function remove(id: string) {
    persist(notes.filter((n) => n.id !== id));
    setConfirmDeleteId(null);
  }

  function requestDelete(id: string) {
    if (confirmDeleteId === id) {
      remove(id);
    } else {
      setConfirmDeleteId(id);
    }
  }

  function togglePin(id: string) {
    persist(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  const filtered = useMemo(() => {
    return notes
      .filter((n) => filterClass === "all" || n.classId === filterClass)
      .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || stripHtml(n.content).toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.pinned === b.pinned ? b.updatedAt - a.updatedAt : a.pinned ? -1 : 1));
  }, [notes, search, filterClass]);

  const usedClassIds = useMemo(() => Array.from(new Set(notes.map((n) => n.classId))), [notes]);

  // /rca/today is a deliberately distraction-free work-day reference page —
  // same reasoning/pattern as RcaAssistant's guard.
  if (pathname === "/rca/today") return null;

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
          className={expanded
            ? "fixed inset-4 md:inset-10 z-40 flex flex-col rounded-2xl shadow-xl overflow-hidden"
            : "fixed bottom-[76px] z-30 flex flex-col rounded-2xl shadow-xl overflow-hidden transition-[right] duration-200"}
          style={expanded
            ? { background: "#fbf8f0", border: "1px solid #d9e4d3" }
            : { right: assistantOpen ? 400 : 20, width: "min(380px, calc(100vw - 2.5rem))", maxHeight: "75vh", background: "#fbf8f0", border: "1px solid #d9e4d3" }}
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
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1 rounded-lg hover:opacity-60"
                style={{ color: "#6b8e6a" }}
                aria-label={expanded ? "Shrink notes panel" : "Expand notes panel"}
                title={expanded ? "Shrink" : "Expand — more room to write"}
              >
                {expanded ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                )}
              </button>
              <button
                onClick={() => guardUnsaved(() => { cancelForm(true); setOpen(false); setConfirmDeleteId(null); setExpanded(false); })}
                className="text-sm"
                style={{ color: "#6b8e6a" }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {(adding || editingId) ? (
            <div className={`p-3 flex flex-col gap-2 ${expanded ? "flex-1 min-h-0" : ""}`} style={{ borderBottom: "1px solid #d9e4d3" }}>
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
              {/* Formatting toolbar — a real WYSIWYG surface (document.execCommand,
                  the same primitive Docs/Gmail-style editors are built on), so
                  clicking Bold actually shows bold text immediately instead of
                  inserting literal "**text**" markdown syntax into a textarea.
                  Every button has a real keyboard shortcut behind it too
                  (handleKeyDown on the editor) — the same bindings Google Docs
                  uses for bold/italic/underline/lists, not made-up ones. */}
              <div className="flex items-center gap-1 flex-wrap">
                <select
                  onMouseDown={(e) => e.preventDefault()}
                  onChange={(e) => { setHeading(e.target.value as "" | "h1" | "h2" | "h3"); e.target.value = ""; }}
                  defaultValue=""
                  className="text-xs px-1.5 py-1 rounded-md outline-none font-medium"
                  style={{ background: "#eef2e2", color: "#4f6a41", border: "none" }}
                  title="Heading"
                >
                  <option value="">Normal text</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>
                <span className="w-px h-4 mx-0.5" style={{ background: "#d9e4d3" }} />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")} className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Bold (⌘B)">B</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")} className="text-xs italic px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Italic (⌘I)">I</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("underline")} className="text-xs underline px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Underline (⌘U)">U</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("strikeThrough")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41", textDecoration: "line-through" }} title="Strikethrough (⌘⇧X)">S</button>
                <span className="w-px h-4 mx-0.5" style={{ background: "#d9e4d3" }} />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Bullet list (⌘⇧8)">• List</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertOrderedList")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Numbered list (⌘⇧7)">1. List</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "<blockquote>")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Quote">&ldquo;&rdquo;</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={insertLink} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Insert link (⌘K)">🔗</button>
                <span className="w-px h-4 mx-0.5" style={{ background: "#d9e4d3" }} />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("undo")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Undo (⌘Z)">↶</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("redo")} className="text-xs px-2 py-1 rounded-md" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Redo (⌘⇧Z)">↷</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={clearFormat} className="text-xs px-2 py-1 rounded-md ml-auto" style={{ background: "#eef2e2", color: "#4f6a41" }} title="Clear formatting">Clear</button>
              </div>
              <div className="relative flex-1 min-h-0">
                {stripHtml(content).trim() === "" && (
                  <div className="absolute inset-0 px-3 py-2 text-sm pointer-events-none" style={{ color: "#a8b39c" }}>
                    Jot it down… ⌘B/⌘I/⌘U/⌘⇧X bold/italic/underline/strike · ⌘⇧8/⌘⇧7 lists · ⌘K link · ⌘↵ save · Esc cancel
                  </div>
                )}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setContent(sanitizeHtml((e.target as HTMLDivElement).innerHTML))}
                  onKeyDown={handleKeyDown}
                  className="rounded-lg px-3 py-2 text-sm outline-none overflow-y-auto"
                  style={{
                    background: "#fff",
                    border: "1px solid #d9e4d3",
                    color: "#2f3a2a",
                    height: expanded ? "100%" : undefined,
                    minHeight: expanded ? undefined : 132,
                    maxHeight: expanded ? undefined : 220,
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: stripHtml(content).length > MAX_NOTE_SIZE * 0.9 ? "#c47a7a" : "#a8b39c" }}>
                  {stripHtml(content).length.toLocaleString()} / {MAX_NOTE_SIZE.toLocaleString()} chars
                </span>
                <span className="text-[10px]" style={{ color: "#a8b39c" }}>⌘↵ to save · Esc to cancel</span>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => cancelForm()} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ color: "#8a9a7c" }}>
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!stripHtml(content).trim()}
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
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#8a9a7c" }}>{stripHtml(n.content)}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <button onClick={() => togglePin(n.id)} className="p-1 rounded-lg hover:opacity-60" style={{ color: n.pinned ? "#c9843a" : "#c4cbb8" }} title={n.pinned ? "Unpin" : "Pin"}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={n.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path d="M12 2l2 7h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" /></svg>
                    </button>
                    <button onClick={() => startEdit(n)} className="p-1 rounded-lg hover:opacity-60" style={{ color: "#8a9a7c" }} title="Edit">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    {confirmDeleteId === n.id ? (
                      <>
                        <button onClick={() => remove(n.id)} className="text-[10px] px-1.5 py-1 rounded-lg font-semibold" style={{ background: "#c47a7a", color: "#fff" }}>
                          Confirm?
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} className="p-1 rounded-lg hover:opacity-60" style={{ color: "#8a9a7c" }} title="Cancel delete">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </>
                    ) : (
                      <button onClick={() => requestDelete(n.id)} className="p-1 rounded-lg hover:opacity-60" style={{ color: "#c47a7a" }} title="Delete (click twice to confirm)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    )}
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
