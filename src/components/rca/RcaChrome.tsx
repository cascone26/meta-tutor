"use client";

import { useEffect, useState } from "react";
import RcaThemeShell from "@/components/rca/RcaThemeShell";
import DimModeToggle from "@/components/rca/DimModeToggle";

const STORAGE_KEY = "rca-dim-mode";

// Owns dim-mode state so RcaThemeShell (which applies the CSS filter) and
// DimModeToggle (the fixed-position button, deliberately rendered as a
// sibling — see its own comment) can share one source of truth instead of
// each keeping a local copy that could drift out of sync.
export default function RcaChrome({ children }: { children: React.ReactNode }) {
  const [dim, setDim] = useState(false);

  useEffect(() => {
    setDim(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function toggle() {
    const next = !dim;
    setDim(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

  return (
    <>
      <RcaThemeShell dim={dim}>{children}</RcaThemeShell>
      <DimModeToggle dim={dim} onToggle={toggle} />
    </>
  );
}
