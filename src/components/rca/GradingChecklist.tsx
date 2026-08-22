"use client";

import { useEffect, useState } from "react";
import { getGradableItems } from "@/lib/rca-upcoming";

export default function GradingChecklist({ subjectId }: { subjectId: string }) {
  const items = getGradableItems(subjectId);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    fetch(`/api/rca-grading?prefix=${encodeURIComponent(subjectId + "#")}`)
      .then((r) => (r.ok ? r.json() : { done: {} }))
      .then((d) => setDone(d.done || {}))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [subjectId, items.length]);

  if (items.length === 0) return null;

  const doneCount = items.filter((i) => done[i.key]).length;

  async function toggle(key: string) {
    const next = !done[key];
    setDone((prev) => ({ ...prev, [key]: next }));
    try {
      await fetch("/api/rca-grading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey: key, done: next }),
      });
    } catch {
      // optimistic UI already updated; a failed save just doesn't persist
    }
  }

  return (
    <div className="mb-6" style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-xl px-4 py-3"
        style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}
      >
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b8e5a" }}>
          Grading checklist — {doneCount}/{items.length} graded
        </span>
        <span className="text-[#3f7ea6] text-sm">{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <div className="rounded-xl mt-2 divide-y" style={{ background: "#fff", border: "1px solid #e8e4d5" }}>
          {items.map((item) => (
            <label key={item.key} className="flex items-start gap-2.5 px-4 py-2.5 text-sm cursor-pointer" style={{ color: "#3a4a34" }}>
              <input
                type="checkbox"
                checked={!!done[item.key]}
                onChange={() => toggle(item.key)}
                disabled={!loaded}
                className="mt-0.5"
              />
              <span className={done[item.key] ? "line-through opacity-50" : ""}>
                <span className="font-semibold">Lesson {item.lessonN}: </span>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
