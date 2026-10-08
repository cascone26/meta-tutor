"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import Onboarding from "@/components/Onboarding";
import SessionTimer from "@/components/SessionTimer";
import Prayer from "@/components/Prayer";
import ErrorBoundary from "@/components/ErrorBoundary";

// Public, unauthenticated marketing/showcase pages render as plain documents —
// no in-app nav, onboarding modal, session timer, or prayer widget, none of
// which make sense outside a logged-in session.
const PUBLIC_PREFIXES = ["/showcase"];

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname?.startsWith(p));

  if (isPublic) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <>
      <ErrorBoundary>
        <div className="flex flex-col h-dvh overflow-hidden">
          <Nav />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </ErrorBoundary>
      <KeyboardShortcuts />
      <Onboarding />
      <SessionTimer />
      <Prayer />
    </>
  );
}
