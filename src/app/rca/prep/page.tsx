"use client";

import { useEffect, useState } from "react";
import { LeafIcon } from "@/components/rca/NatureIcons";
import { rcaClasses } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";

type Assignment = {
  id: string;
  subject_id: string;
  lesson_n: number | null;
  task: string;
  rationale: string | null;
  due_date: string | null;
  done: boolean;
};

// Only subjects that actually have lesson content can be prepped against.
const PREPPABLE = rcaClasses.filter((c) => rcaContent[c.id]);
const NAME: Record<string, string> = Object.fromEntries(rcaClasses.map((c) => [c.id, c.name]));

function fmtDue(d: string | null): string {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function PrepPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subject, setSubject] = useState(PREPPABLE[0]?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const r = await fetch("/api/prep-assignments");
      if (!r.ok) throw new Error(await r.text());
      const d = await r.json();
      setAssignments(d.assignments || []);
    } catch {
      setError("Couldn't load your prep list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const r = await fetch("/api/prep-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId: subject }),
      });
      if (!r.ok) throw new Error(await r.text());
      await load();
    } catch {
      setError("Couldn't generate prep tasks — try again in a moment.");
    } finally {
      setGenerating(false);
    }
  }

  async function toggle(a: Assignment) {
    // Optimistic.
    setAssignments((prev) => prev.map((x) => (x.id === a.id ? { ...x, done: !x.done } : x)));
    try {
      await fetch("/api/prep-assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, done: !a.done }),
      });
    } catch {
      setAssignments((prev) => prev.map((x) => (x.id === a.id ? { ...x, done: a.done } : x)));
    }
  }

  async function remove(a: Assignment) {
    setAssignments((prev) => prev.filter((x) => x.id !== a.id));
    try {
      await fetch("/api/prep-assignments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id }),
      });
    } catch {
      load();
    }
  }

  const open = assignments.filter((a) => !a.done);
  const done = assignments.filter((a) => a.done);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <LeafIcon size={24} style={{ color: "#6b8e5a" }} />
            My prep assignments
          </h1>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            Homework for the teacher. Pick a class and it assigns you concrete prep for the lesson
            you should be a week ahead on — due before your next class.
          </p>
        </div>

        {/* Generator */}
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ border: "1px solid #cdd8c4", background: "#fff", color: "#33402c" }}
            >
              {PREPPABLE.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={generate}
              disabled={generating || !subject}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
              style={{ background: "#6b8e5a", color: "#fff" }}
            >
              {generating ? "Generating…" : "Assign me prep →"}
            </button>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: "#a04a4a" }}>{error}</p>}
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: "#8a9a7c" }}>Loading…</p>
        ) : (
          <>
            {open.length === 0 && done.length === 0 && (
              <p className="text-sm" style={{ color: "#8a9a7c" }}>
                No prep assigned yet. Pick a class above and get your first assignment.
              </p>
            )}

            {open.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6b8e5a" }}>
                  To do ({open.length})
                </h2>
                <div className="space-y-3">
                  {open.map((a) => (
                    <TaskCard key={a.id} a={a} onToggle={toggle} onRemove={remove} />
                  ))}
                </div>
              </div>
            )}

            {done.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8a9a7c" }}>
                  Done ({done.length})
                </h2>
                <div className="space-y-3">
                  {done.map((a) => (
                    <TaskCard key={a.id} a={a} onToggle={toggle} onRemove={remove} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  a,
  onToggle,
  onRemove,
}: {
  a: Assignment;
  onToggle: (a: Assignment) => void;
  onRemove: (a: Assignment) => void;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{ background: a.done ? "rgba(240,240,235,0.6)" : "#fff", border: "1px solid #e8e4d5", opacity: a.done ? 0.7 : 1 }}
    >
      <button
        onClick={() => onToggle(a)}
        aria-label={a.done ? "Mark not done" : "Mark done"}
        className="shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition"
        style={{
          border: a.done ? "1px solid #6b8e5a" : "1px solid #cdd8c4",
          background: a.done ? "#6b8e5a" : "#fff",
          color: "#fff",
        }}
      >
        {a.done ? "✓" : ""}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs" style={{ color: "#6b8e5a" }}>
            {NAME[a.subject_id] ?? a.subject_id}
            {a.lesson_n ? ` · Lesson ${a.lesson_n}` : ""}
          </p>
          {a.due_date && (
            <p className="text-xs shrink-0" style={{ color: "#8a6a45" }}>Due {fmtDue(a.due_date)}</p>
          )}
        </div>
        <p className="text-sm mt-1" style={{ color: "#33402c", textDecoration: a.done ? "line-through" : "none" }}>
          {a.task}
        </p>
        {a.rationale && (
          <p className="text-xs mt-1" style={{ color: "#8a9a7c" }}>{a.rationale}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(a)}
        aria-label="Remove"
        className="shrink-0 text-xs self-start"
        style={{ color: "#c0a0a0" }}
      >
        ✕
      </button>
    </div>
  );
}
