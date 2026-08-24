"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type WidgetId,
  WIDGET_LABELS,
  DEFAULT_WIDGET_ORDER,
  getLayoutPrefs,
  saveLayoutPrefs,
  resetLayoutPrefs,
} from "@/lib/rca-layout-prefs";

function GridIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

// Floating "Customize" drawer for one RCA class page — drag to reorder (or use
// the up/down buttons, which work identically and are the accessible/tested
// fallback), checkbox to show/hide, all persisted per class. Same drawer-panel
// idiom as CalendarPopup/RcaNotes (fixed bottom-left, so it doesn't compete
// with Notes/Assistant at bottom-right or the theme/calendar controls up top).
export default function LayoutDrawer({
  classId,
  onChange,
}: {
  classId: string;
  onChange: (order: WidgetId[], hidden: WidgetId[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<WidgetId[]>(DEFAULT_WIDGET_ORDER);
  const [hidden, setHidden] = useState<Set<WidgetId>>(new Set());
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  // This component is rendered from inside RcaClassBody, which lives inside
  // [slug]/page.tsx's `style={{ animation: "fadeUpIn ... both" }}` wrapper —
  // any ancestor with a running/fill-mode CSS `transform` animation becomes a
  // new containing block for `position: fixed` descendants (same trap
  // CalendarPopup's own code comment already documents, worked around there
  // by rendering as a header SIBLING instead). Found live 2026-08-24: the
  // button rendered at roughly x=424 instead of the intended 20px from the
  // real viewport edge, landing directly on top of the last widget's text.
  // Portal to document.body so this always escapes to the real viewport
  // regardless of what animates around it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prefs = getLayoutPrefs(classId);
    setOrder(prefs.order);
    setHidden(new Set(prefs.hidden));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  useEffect(() => {
    onChange(order, [...hidden]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, hidden]);

  function persist(nextOrder: WidgetId[], nextHidden: Set<WidgetId>) {
    setOrder(nextOrder);
    setHidden(nextHidden);
    saveLayoutPrefs(classId, { order: nextOrder, hidden: [...nextHidden] });
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next, hidden);
  }

  function toggleHidden(id: WidgetId) {
    const next = new Set(hidden);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persist(order, next);
  }

  function reset() {
    resetLayoutPrefs(classId);
    persist(DEFAULT_WIDGET_ORDER, new Set());
  }

  function onDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) {
      dragIndex.current = null;
      setDragOverIndex(null);
      return;
    }
    const next = [...order];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = null;
    setDragOverIndex(null);
    persist(next, hidden);
  }

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close layout customizer" : "Customize this page's layout"}
        title="Customize layout"
        // bottom-20, not bottom-5 — Next.js's own dev-mode route indicator
        // badge (route/bundler info, "next dev" only, never present in the
        // real production build) claims the bottom-LEFT corner at bottom-5
        // too; found this colliding with it live while testing. Sitting
        // higher keeps it clear of that badge during local dev without
        // needing a different corner (top-right is calendar+theme,
        // bottom-right is notes+assistant — bottom-left is the only side
        // left, just shifted up).
        className="fixed bottom-20 left-5 z-30 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
        style={{ width: 40, height: 40, background: "#6b8e5a", color: "#fff" }}
      >
        <GridIcon size={17} />
      </button>

      {open && (
        <div
          className="fixed bottom-[128px] left-5 z-40 flex flex-col rounded-2xl shadow-xl overflow-hidden"
          style={{ width: "min(320px, calc(100vw - 2.5rem))", maxHeight: "70vh", background: "#fbf8f0", border: "1px solid #d9e4d3" }}
          data-testid="layout-drawer"
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#eef2e2", borderBottom: "1px solid #d9e4d3" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#2f5e7a" }}>Customize this page</p>
              <p className="text-[11px]" style={{ color: "#6b8e9a" }}>Drag, or use the arrows, to reorder. Uncheck to hide.</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "#3f7ea6" }} aria-label="Close">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {order.map((id, i) => (
              <div
                key={id}
                draggable
                onDragStart={() => { dragIndex.current = i; }}
                onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i); }}
                onDragLeave={() => setDragOverIndex((v) => (v === i ? null : v))}
                onDrop={(e) => { e.preventDefault(); onDrop(i); }}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 mb-1 cursor-move"
                style={{
                  background: dragOverIndex === i ? "rgba(63,126,166,0.12)" : "#fff",
                  border: `1px solid ${dragOverIndex === i ? "#3f7ea6" : "#e6e0d0"}`,
                  opacity: hidden.has(id) ? 0.5 : 1,
                }}
                data-widget-row={id}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#c4cbb8", flexShrink: 0 }}>
                  <circle cx="8" cy="6" r="1.5" /><circle cx="16" cy="6" r="1.5" />
                  <circle cx="8" cy="12" r="1.5" /><circle cx="16" cy="12" r="1.5" />
                  <circle cx="8" cy="18" r="1.5" /><circle cx="16" cy="18" r="1.5" />
                </svg>
                <input
                  type="checkbox"
                  checked={!hidden.has(id)}
                  onChange={() => toggleHidden(id)}
                  aria-label={`Show ${WIDGET_LABELS[id]}`}
                  className="shrink-0"
                />
                <span className="text-sm flex-1" style={{ color: "#33402c" }}>{WIDGET_LABELS[id]}</span>
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-20" style={{ color: "#3f7ea6" }} aria-label={`Move ${WIDGET_LABELS[id]} up`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="disabled:opacity-20" style={{ color: "#3f7ea6" }} aria-label={`Move ${WIDGET_LABELS[id]} down`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 9l7 7 7-7" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-2.5" style={{ borderTop: "1px solid #d9e4d3" }}>
            <button onClick={reset} className="text-xs font-medium" style={{ color: "#8a9a7c" }}>
              Reset to default layout
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
