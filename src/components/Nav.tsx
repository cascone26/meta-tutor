"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const mainTabs = [
  {
    href: "/review",
    label: "Today",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  },
  {
    href: "/",
    label: "Chat",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
  {
    href: "/study",
    label: "Study",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>,
  },
  {
    href: "/dashboard",
    label: "Progress",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18M7 16l4-4 4 4 6-6" /></svg>,
  },
];

const moreTabs = [
  { href: "/journal", label: "Journal" },
  { href: "/faith", label: "Faith" },
  { href: "/timeline", label: "Timeline" },
  { href: "/countdown", label: "Countdown" },
  { href: "/schedule", label: "Schedule" },
  { href: "/notes", label: "Notes" },
  { href: "/sources", label: "Sources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/compare", label: "Compare" },
  { href: "/map", label: "Map" },
];

export default function Nav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = moreTabs.some((t) => pathname.startsWith(t.href));

  return (
    <nav
      className="flex items-center justify-around md:justify-center md:gap-1 px-2 py-2 border-b shrink-0 relative"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {mainTabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
            style={{
              background: active ? "var(--accent-light)" : "transparent",
              color: active ? "var(--accent)" : "var(--muted)",
            }}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}

      {/* More dropdown */}
      <div className="relative">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
          style={{
            background: isMoreActive ? "var(--accent-light)" : "transparent",
            color: isMoreActive ? "var(--accent)" : "var(--muted)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
          </svg>
          More
        </button>
        {moreOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
            <div
              className="absolute right-0 top-full mt-1 z-50 rounded-xl py-1 min-w-[140px] shadow-lg"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {moreTabs.map((tab) => {
                const active = pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{
                      color: active ? "var(--accent)" : "var(--foreground)",
                      background: active ? "var(--accent-light)" : "transparent",
                    }}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ThemeToggle />
    </nav>
  );
}
