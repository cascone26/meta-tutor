"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/ethics", label: "Chat" },
  { href: "/ethics/study", label: "Study" },
  { href: "/ethics/glossary", label: "Glossary" },
];

export default function EthicsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-nav */}
      <div
        className="shrink-0 flex gap-1 px-3 py-2 border-b"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {tabs.map((tab) => {
          const active = tab.href === "/ethics" ? pathname === "/ethics" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
