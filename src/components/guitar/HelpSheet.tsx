"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { helpForPath } from "@/lib/guitar/help-content";
import { HelpIcon, CloseIcon } from "./GuitarIcons";

/** A persistent "?" button fixed at the bottom of every Guitar page — tap it and a sheet
 *  slides up from the bottom with plain-English answers for whatever page you're currently
 *  on. Pure static content, no AI/API calls, so it's instant and never wrong about costing
 *  anything. Mounted once in guitar/layout.tsx so it's always reachable. */
export default function HelpSheet() {
  const pathname = usePathname() ?? "/guitar";
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const entries = helpForPath(pathname);

  useEffect(() => {
    setExpanded(0);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Help"
        className="fixed z-40 flex items-center justify-center rounded-full"
        style={{
          width: 48, height: 48, right: 16, bottom: 16,
          background: "linear-gradient(135deg, var(--g-accent) 0%, var(--g-accent-dark) 100%)",
          color: "#fff", boxShadow: "var(--g-shadow)",
        }}
      >
        <HelpIcon size={22} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(20,14,8,0.45)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl p-5"
            style={{ background: "var(--g-surface)", border: "1px solid var(--g-border)", borderBottom: "none", maxHeight: "75vh", overflowY: "auto", animation: "fadeUpIn 0.2s ease both" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--g-text)" }}>
                <HelpIcon size={16} /> Help for this page
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close help" className="g-icon-btn">
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-1.5">
              {entries.map((e, i) => (
                <div key={i} className="g-card" style={{ overflow: "hidden" }}>
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full text-left px-3.5 py-2.5 text-sm font-medium"
                    style={{ color: "var(--g-text)" }}
                  >
                    {e.q}
                  </button>
                  {expanded === i && (
                    <p className="px-3.5 pb-3 text-sm leading-relaxed" style={{ color: "var(--g-muted)" }}>{e.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
