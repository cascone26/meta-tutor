"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { DEBATE_PLAYBOOK } from "@/data/veritas/debate-playbook";

export default function DebatePlaybookPage() {
  const [expanded, setExpanded] = useState<string | null>(DEBATE_PLAYBOOK[0]?.id ?? null);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Debate Playbook" subtitle="Method, strategy, and tone for live apologetics" icon="📘" />
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {DEBATE_PLAYBOOK.map((s) => {
          const isOpen = expanded === s.id;
          return (
            <div key={s.id} className="rounded-xl border border-stone-800/60 bg-stone-900/30">
              <button onClick={() => setExpanded(isOpen ? null : s.id)} className="w-full px-4 py-3 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-stone-100">{s.title}</span>
                  <span className="shrink-0 text-xs text-stone-600">{isOpen ? "▾" : "▸"}</span>
                </div>
              </button>
              {isOpen && (
                <div className="space-y-3 border-t border-stone-800 px-4 py-4">
                  {s.content.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-stone-300">{p}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
