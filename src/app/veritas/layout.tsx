"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import VeritasSidebar from "@/components/veritas/VeritasSidebar";
import "./veritas-theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-veritas" });

export default function VeritasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/veritas";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isHome) {
    return (
      <div className={`${inter.variable} veritas-gold h-full overflow-y-auto bg-stone-950 text-stone-200`} style={{ fontFamily: "var(--font-veritas)" }}>
        <Link href="/" className="fixed left-4 top-4 z-20 text-xs text-stone-600 hover:text-stone-400 transition-colors">
          ← Hub
        </Link>
        {children}
      </div>
    );
  }

  return (
    <div className={`${inter.variable} veritas-gold flex h-full bg-stone-950 text-stone-200`} style={{ fontFamily: "var(--font-veritas)" }}>
      <div className="hidden lg:block">
        <VeritasSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-800 bg-stone-950 px-4 py-2.5 lg:hidden">
          <button onClick={() => setMobileNavOpen(true)} className="text-sm text-stone-400 hover:text-stone-200 transition-colors">
            ☰ Menu
          </button>
          <span className="text-sm font-semibold tracking-wide text-amber-500">VERITAS</span>
          <Link href="/" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
            Hub
          </Link>
        </header>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-30 flex lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="relative z-10">
              <VeritasSidebar onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
