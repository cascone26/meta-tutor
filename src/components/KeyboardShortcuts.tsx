"use client";

import { useState, useEffect } from "react";

const shortcuts = [
  { keys: ["?"], description: "Show this help" },
  { keys: ["Space", "Enter"], description: "Flip flashcard" },
  { keys: ["←", "→"], description: "Navigate flashcards" },
  { keys: ["K"], description: "Mark flashcard as known" },
  { keys: ["Enter"], description: "Submit answer (Learn, Fill-in-Blank)" },
  { keys: ["D"], description: "Toggle dark mode" },
  { keys: ["Esc"], description: "Close modal / go back" },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <div
        className="relative z-10 rounded-xl p-5 w-full max-w-sm shadow-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Keyboard Shortcuts</h2>
          <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "var(--muted)" }}>x</button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <span className="text-sm" style={{ color: "var(--foreground)" }}>{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--muted)" }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 text-center" style={{ color: "var(--muted)" }}>
          Press <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>?</kbd> to toggle
        </p>
      </div>
    </div>
  );
}
