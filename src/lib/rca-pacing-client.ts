"use client";

import { useEffect, useState } from "react";

// Shared client-side fetch for per-subject pacing offsets (see
// /api/rca-pacing + supabase-schema-hub.sql's mt_rca_pacing_override). Used by
// both LessonViewer (per-class detail page) and /rca/today so a correction made
// in one place is reflected everywhere without re-deriving the fetch logic.
export function useRcaPacingOffsets() {
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/rca-pacing")
      .then((r) => (r.ok ? r.json() : { offsets: {} }))
      .then((d) => setOffsets(d.offsets || {}))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  async function setOffset(subjectId: string, offset: number) {
    setOffsets((prev) => ({ ...prev, [subjectId]: offset }));
    try {
      await fetch("/api/rca-pacing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, offset }),
      });
    } catch {
      // Best-effort — local state already updated optimistically; a failed save
      // just means the correction doesn't persist past this page load.
    }
  }

  return { offsets, loaded, setOffset };
}
