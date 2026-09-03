"use client";

import { useEffect, useState } from "react";

export type RosterStudent = { id: string; name: string; notes: string | null; present: boolean | null };

// Today's date as YYYY-MM-DD in the browser's local timezone (not UTC —
// attendance is a same-day fact from Jacob's own perspective sitting in class).
export function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useRcaRoster(subjectId: string, date: string) {
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    fetch(`/api/rca-roster?subjectId=${encodeURIComponent(subjectId)}&date=${encodeURIComponent(date)}`)
      .then((r) => (r.ok ? r.json() : { students: [] }))
      .then((d) => setStudents(d.students || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [subjectId, date]);

  async function addStudent(name: string) {
    try {
      const res = await fetch("/api/rca-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addStudent", subjectId, name }),
      });
      if (!res.ok) return;
      const { student } = await res.json();
      setStudents((prev) => [...prev, student]);
    } catch {
      // failed to persist — student just won't show up; no optimistic add without a real id
    }
  }

  async function removeStudent(studentId: string) {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    try {
      await fetch("/api/rca-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeStudent", studentId }),
      });
    } catch {
      // optimistic removal already applied
    }
  }

  async function markAttendance(studentId: string, present: boolean) {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, present } : s)));
    try {
      await fetch("/api/rca-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAttendance", studentId, date, present }),
      });
    } catch {
      // optimistic update already applied; a failed save just doesn't persist
    }
  }

  return { students, loaded, addStudent, removeStudent, markAttendance };
}
