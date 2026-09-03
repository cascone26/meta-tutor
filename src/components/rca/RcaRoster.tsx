"use client";

import { useState } from "react";
import { useRcaRoster, todayDateString } from "@/lib/rca-roster-client";
import { LeafIcon } from "./NatureIcons";

// First increment of per-student tracking (2026-09-02) — roster + attendance
// only. Deliberately not a gradebook yet; that's a real separate feature with
// a different data shape, not assumed here.
export default function RcaRoster({ subjectId }: { subjectId: string }) {
  const date = todayDateString();
  const { students, loaded, addStudent, removeStudent, markAttendance } = useRcaRoster(subjectId, date);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const presentCount = students.filter((s) => s.present === true).length;
  const markedCount = students.filter((s) => s.present !== null).length;

  async function handleAdd() {
    if (!newName.trim()) return;
    await addStudent(newName.trim());
    setNewName("");
  }

  return (
    <div className="mb-6" style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-xl px-4 py-3"
        style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}
      >
        <span className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: "#6b8e5a" }}>
          <LeafIcon size={12} />
          Roster{students.length > 0 ? ` — ${students.length} student${students.length === 1 ? "" : "s"}` : ""}
          {markedCount > 0 ? `, ${presentCount}/${markedCount} present today` : ""}
        </span>
        <span className="text-[#3f7ea6] text-sm">{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <div className="rounded-xl mt-2 p-3" style={{ background: "#fff", border: "1px solid #e8e4d5" }}>
          {students.length === 0 && loaded && (
            <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>No students added yet for this class.</p>
          )}

          <div className="divide-y" style={{ borderColor: "#e8e4d5" }}>
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 py-2 text-sm" style={{ color: "#3a4a34" }}>
                <span>{s.name}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => markAttendance(s.id, true)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: s.present === true ? "#6b8e5a" : "#f0efe6",
                      color: s.present === true ? "#fff" : "#8a9a7c",
                    }}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAttendance(s.id, false)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: s.present === false ? "#a04a4a" : "#f0efe6",
                      color: s.present === false ? "#fff" : "#8a9a7c",
                    }}
                  >
                    Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStudent(s.id)}
                    className="px-1.5 py-1 rounded-lg text-xs"
                    style={{ color: "#a04a4a" }}
                    title="Remove student"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: students.length > 0 ? "1px solid #e8e4d5" : "none" }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add student…"
              className="flex-1 rounded-lg px-3 py-1.5 text-sm"
              style={{ background: "#fbf8f0", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
              style={{ background: "#3f7ea6", color: "#fff" }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
