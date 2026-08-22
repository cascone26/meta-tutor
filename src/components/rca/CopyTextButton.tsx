"use client";

import { useState } from "react";

// Same "read whatever's actually on screen" approach as ReadAloudButton, but
// copies to clipboard instead — a paste-ready text export for posting into
// FACTS or wherever, built from the real pacing-corrected content already
// rendered rather than a guess at FACTS' exact internal template (which
// nothing here has access to). A real starting draft, not a fabricated one.
export default function CopyTextButton({ targetId, label = "Copy" }: { targetId: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const el = document.getElementById(targetId);
    const text = el?.innerText?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission denied or unavailable — silently no-op, button just won't confirm
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs px-3 py-1.5 rounded-full border shrink-0"
      style={{ borderColor: "#bcd6e6", color: "#2f5e7a", background: "rgba(255,255,255,0.55)" }}
    >
      {copied ? "Copied ✓" : `${label} →`}
    </button>
  );
}
