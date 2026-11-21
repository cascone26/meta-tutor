"use client";

import { useState } from "react";

/** A tiny inline "?" mark next to a specific term — tap to expand a one-line explanation
 *  right there, tap again to collapse. Deliberately inline (not a floating tooltip) so it
 *  never clips off-screen or fights z-index on mobile. */
export default function HelpTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-block align-middle">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="What does this mean?"
        className="inline-flex items-center justify-center rounded-full text-[10px] font-bold ml-1"
        style={{ width: 16, height: 16, background: "var(--g-accent-wash)", color: "var(--g-accent-dark)", verticalAlign: "middle" }}
      >
        ?
      </button>
      {open && (
        <span
          className="block text-xs mt-1 mb-1 px-2.5 py-1.5 rounded-lg"
          style={{ background: "var(--g-accent-wash)", color: "var(--g-text)", border: "1px solid var(--g-border)" }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
