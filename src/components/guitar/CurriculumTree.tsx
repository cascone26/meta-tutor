"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MODULES, lessonsByModule } from "@/lib/guitar/curriculum";
import { getCompletedLessons, isLessonUnlocked, getXpStats } from "@/lib/guitar/progress";

export default function CurriculumTree() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [xpStats, setXpStats] = useState({ xp: 0, totalXp: 0, pct: 0 });

  useEffect(() => {
    setCompleted(getCompletedLessons());
    setXpStats(getXpStats());
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="rounded-xl p-4 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
          <span>{xpStats.xp} / {xpStats.totalXp} XP</span>
          <span>{xpStats.pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="h-full" style={{ width: `${xpStats.pct}%`, background: "var(--accent)" }} />
        </div>
      </div>

      {MODULES.map((mod) => {
        const lessons = lessonsByModule(mod.id);
        return (
          <div key={mod.id} className="mb-6">
            <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>{mod.title}</h2>
            <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{mod.description}</p>
            <div className="space-y-1.5">
              {lessons.map((lesson) => {
                const done = completed.has(lesson.id);
                const unlocked = isLessonUnlocked(lesson.id);
                const content = (
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      opacity: unlocked ? 1 : 0.5,
                    }}
                  >
                    <span style={{ color: "var(--foreground)" }}>{lesson.title}</span>
                    <span className="text-xs" style={{ color: done ? "var(--success)" : "var(--muted)" }}>
                      {done ? "✓ done" : unlocked ? `+${lesson.xp} xp` : "🔒 locked"}
                    </span>
                  </div>
                );
                return unlocked ? (
                  <Link key={lesson.id} href={`/guitar/lessons/${lesson.id}`} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={lesson.id}>{content}</div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
