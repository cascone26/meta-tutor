"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Highlight,
  addHighlight,
  getHighlightsForPage,
  deleteHighlight,
  updateHighlightNote,
} from "@/lib/veritas/highlights";

const COLORS: { key: Highlight["color"]; bg: string; ring: string; mark: string }[] = [
  { key: "yellow", bg: "bg-yellow-400", ring: "ring-yellow-400", mark: "bg-yellow-400/30" },
  { key: "green", bg: "bg-green-400", ring: "ring-green-400", mark: "bg-green-400/30" },
  { key: "blue", bg: "bg-blue-400", ring: "ring-blue-400", mark: "bg-blue-400/30" },
  { key: "pink", bg: "bg-pink-400", ring: "ring-pink-400", mark: "bg-pink-400/30" },
];

function colorToCss(color: Highlight["color"]): string {
  const map: Record<string, string> = {
    yellow: "rgba(250,204,21,0.3)",
    green: "rgba(74,222,128,0.3)",
    blue: "rgba(96,165,250,0.3)",
    pink: "rgba(244,114,182,0.3)",
  };
  return map[color] || map.yellow;
}

export default function HighlightManager({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [toolbar, setToolbar] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [pendingColor, setPendingColor] = useState<Highlight["color"] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);

  const pageUrl = typeof window !== "undefined" ? window.location.pathname : "";

  const loadHighlights = useCallback(() => {
    if (pageUrl) {
      setHighlights(getHighlightsForPage(pageUrl));
    }
  }, [pageUrl]);

  useEffect(() => {
    loadHighlights();
  }, [loadHighlights]);

  // Apply highlight marks to content
  useEffect(() => {
    if (!contentRef.current || highlights.length === 0) return;

    // Remove old marks
    const existing = contentRef.current.querySelectorAll("mark[data-highlight-id]");
    existing.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
        parent.normalize();
      }
    });

    // Apply highlights
    for (const h of highlights) {
      applyMarkToContent(contentRef.current, h);
    }
  }, [highlights, contentRef]);

  function applyMarkToContent(container: HTMLElement, h: Highlight) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const searchText = h.selectedText;
    let node: Text | null;

    while ((node = walker.nextNode() as Text | null)) {
      const idx = node.textContent?.indexOf(searchText) ?? -1;
      if (idx === -1) continue;

      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + searchText.length);

      const mark = document.createElement("mark");
      mark.setAttribute("data-highlight-id", h.id);
      mark.style.backgroundColor = colorToCss(h.color);
      mark.style.borderRadius = "2px";
      mark.style.padding = "0 1px";
      mark.style.cursor = "pointer";
      mark.title = h.note || "";

      range.surroundContents(mark);
      break;
    }
  }

  // Listen for text selection
  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      // Ignore clicks in our own toolbar/sidebar
      if (toolbarRef.current?.contains(e.target as Node)) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        // Small delay to allow click handlers to fire
        setTimeout(() => {
          if (!noteMode) {
            setToolbar(null);
          }
        }, 200);
        return;
      }

      const text = sel.toString().trim();
      if (text.length < 3) return;

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setToolbar({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        text,
      });
      setNoteMode(false);
      setNoteText("");
      setPendingColor(null);
    }

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp as EventListener);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp as EventListener);
    };
  }, [noteMode]);

  function handleColorClick(color: Highlight["color"]) {
    if (!toolbar) return;
    addHighlight(pageUrl, toolbar.text, color);
    setToolbar(null);
    window.getSelection()?.removeAllRanges();
    loadHighlights();
  }

  function handleNoteClick() {
    setNoteMode(true);
  }

  function handleNoteSave() {
    if (!toolbar || !pendingColor) return;
    addHighlight(pageUrl, toolbar.text, pendingColor, noteText);
    setToolbar(null);
    setNoteMode(false);
    setNoteText("");
    setPendingColor(null);
    window.getSelection()?.removeAllRanges();
    loadHighlights();
  }

  function handleDelete(id: string) {
    deleteHighlight(id);
    loadHighlights();
  }

  function handleSaveEditNote(id: string) {
    updateHighlightNote(id, editNoteText);
    setEditingNote(null);
    loadHighlights();
  }

  return (
    <>
      {/* Floating toolbar */}
      {toolbar && (
        <div
          ref={toolbarRef}
          className="fixed z-[60] flex flex-col items-center"
          style={{
            left: `${toolbar.x}px`,
            top: `${toolbar.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="flex items-center gap-1 rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 shadow-xl">
            {!noteMode ? (
              <>
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleColorClick(c.key)}
                    className={`h-6 w-6 rounded-full ${c.bg} transition-transform hover:scale-110`}
                    title={c.key}
                  />
                ))}
                <div className="mx-1 h-5 w-px bg-stone-700" />
                <button
                  onClick={handleNoteClick}
                  className="flex h-6 w-6 items-center justify-center rounded text-stone-400 hover:text-stone-200"
                  title="Add note"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-1">
                  {COLORS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setPendingColor(c.key)}
                      className={`h-6 w-6 rounded-full ${c.bg} ${
                        pendingColor === c.key ? "ring-2 ring-offset-1 ring-offset-stone-900 " + c.ring : ""
                      } transition-transform hover:scale-110`}
                    />
                  ))}
                </div>
                <textarea
                  className="w-48 rounded border border-stone-700 bg-stone-800 p-2 text-xs text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none"
                  rows={2}
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => {
                      setNoteMode(false);
                      setToolbar(null);
                    }}
                    className="rounded px-2 py-1 text-[10px] text-stone-500 hover:text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNoteSave}
                    disabled={!pendingColor}
                    className="rounded bg-amber-600/30 px-2 py-1 text-[10px] text-amber-400 hover:bg-amber-600/40 disabled:opacity-40"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar toggle */}
      {highlights.length > 0 && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed bottom-6 right-20 z-50 flex h-10 items-center gap-1.5 rounded-full border border-stone-700 bg-stone-900 px-3 text-xs text-stone-400 shadow-lg transition-colors hover:bg-stone-800 hover:text-stone-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {highlights.length}
        </button>
      )}

      {/* Sidebar panel */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 z-[56] w-80 overflow-y-auto border-l border-stone-800 bg-stone-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 px-4 py-3">
              <h3 className="text-sm font-semibold text-stone-200">
                My Highlights ({highlights.length})
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-stone-500 hover:text-stone-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="divide-y divide-stone-800">
              {highlights.map((h) => (
                <div key={h.id} className="px-4 py-3">
                  <div
                    className="rounded px-2 py-1 text-sm text-stone-300 leading-relaxed"
                    style={{ backgroundColor: colorToCss(h.color) }}
                  >
                    &ldquo;{h.selectedText.length > 120 ? h.selectedText.slice(0, 120) + "..." : h.selectedText}&rdquo;
                  </div>
                  {editingNote === h.id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full rounded border border-stone-700 bg-stone-800 p-2 text-xs text-stone-200 focus:border-amber-600 focus:outline-none"
                        rows={2}
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        autoFocus
                      />
                      <div className="mt-1 flex gap-1 justify-end">
                        <button
                          onClick={() => setEditingNote(null)}
                          className="text-[10px] text-stone-500 hover:text-stone-300 px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditNote(h.id)}
                          className="text-[10px] text-amber-400 bg-amber-600/20 px-2 py-1 rounded hover:bg-amber-600/30"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    h.note && (
                      <p className="mt-1 text-xs text-stone-500 italic">{h.note}</p>
                    )
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-stone-600">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingNote(h.id);
                          setEditNoteText(h.note);
                        }}
                        className="text-[10px] text-stone-500 hover:text-stone-300"
                      >
                        {h.note ? "Edit note" : "Add note"}
                      </button>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="text-[10px] text-red-500/60 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
