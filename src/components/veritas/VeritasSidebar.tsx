"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/data/veritas/stations";

export default function VeritasSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <nav className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-stone-800 bg-stone-950 px-3 py-4">
      <Link href="/veritas" onClick={onNavigate} className="mb-5 px-2 text-xl font-bold tracking-tight text-amber-500">
        VERITAS
      </Link>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isCollapsed = collapsed[section.id];
          return (
            <div key={section.id}>
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))}
                className="flex w-full items-center justify-between px-2 py-1 text-left"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">{section.label}</span>
                <span className="text-[9px] text-stone-700">{isCollapsed ? "▸" : "▾"}</span>
              </button>
              {!isCollapsed && (
                <div className="mt-0.5 space-y-0.5">
                  {section.stations.map((s) => {
                    const active = pathname === s.href || (s.href !== "/veritas" && pathname?.startsWith(s.href + "/"));
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                          active ? "bg-amber-900/30 text-amber-400" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
                        }`}
                      >
                        <span className="text-xs">{s.icon}</span>
                        <span className="truncate">{s.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <Link href="/" onClick={onNavigate} className="px-2 text-xs text-stone-600 hover:text-stone-400 transition-colors">
          ← Back to Hub
        </Link>
      </div>
    </nav>
  );
}
