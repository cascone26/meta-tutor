"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MODULES, lessonsByModule } from "@/lib/guitar/curriculum";
import { getCompletedLessons, isLessonUnlocked, getXpStats } from "@/lib/guitar/progress";
import { CheckIcon, LockIcon } from "./GuitarIcons";

export default function CurriculumTree() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [xpStats, setXpStats] = useState({ xp: 0, totalXp: 0, pct: 0 });

  useEffect(() => {
    setCompleted(getCompletedLessons());
    setXpStats(getXpStats());
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="g-card p-4 mb-6">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--g-muted)" }}>
          <span>{xpStats.xp} / {xpStats.totalXp} XP</span>
          <span>{xpStats.pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--g-border)" }}>
          <div className="h-full rounded-full" style={{ width: `${xpStats.pct}%`, background: "linear-gradient(90deg, var(--g-accent), var(--g-accent-dark))" }} />
        </div>
      </div>

      {MODULES.map((mod) => {
        const lessons = lessonsByModule(mod.id);
        return (
          <div key={mod.id} className="mb-8">
            <h2 className="text-sm font-semibold mb-0.5" style={{ color: "var(--g-text)" }}>{mod.title}</h2>
            <p className="text-xs mb-3" style={{ color: "var(--g-muted)" }}>{mod.description}</p>

            <div>
              {lessons.map((lesson, i) => {
                const done = completed.has(lesson.id);
                const unlocked = isLessonUnlocked(lesson.id);
                const current = unlocked && !done;
                const isLast = i === lessons.length - 1;

                const node = (
                  <div className="flex flex-col items-center shrink-0" style={{ width: 32 }}>
                    <div
                      className="rounded-full flex items-center justify-center shrink-0"
                      style={{
                        width: 30, height: 30,
                        background: done ? "var(--g-success)" : current ? "linear-gradient(135deg, var(--g-accent), var(--g-accent-dark))" : "var(--g-surface)",
                        border: `1.5px solid ${done ? "var(--g-success)" : current ? "var(--g-accent)" : "var(--g-border)"}`,
                        color: done || current ? "#fff" : "var(--g-muted)",
                        boxShadow: current ? "var(--g-shadow)" : "none",
                      }}
                    >
                      {done ? <CheckIcon size={14} /> : unlocked ? <span className="text-[11px] font-semibold">{i + 1}</span> : <LockIcon size={13} />}
                    </div>
                    {!isLast && <div className="w-0.5 flex-1" style={{ minHeight: 14, background: done ? "var(--g-success)" : "var(--g-border)" }} />}
                  </div>
                );

                const card = (
                  <div
                    className="flex-1 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm mb-1"
                    style={{
                      background: current ? "var(--g-accent-wash)" : "var(--g-surface)",
                      border: `1px solid ${current ? "var(--g-accent)" : "var(--g-border)"}`,
                      opacity: unlocked ? 1 : 0.55,
                    }}
                  >
                    <span style={{ color: "var(--g-text)", fontWeight: current ? 600 : 500 }}>{lesson.title}</span>
                    <span className="text-xs shrink-0 ml-2" style={{ color: done ? "var(--g-success)" : "var(--g-muted)" }}>
                      {done ? "done" : unlocked ? `+${lesson.xp} xp` : "locked"}
                    </span>
                  </div>
                );

                return (
                  <div key={lesson.id} className="flex gap-3">
                    {node}
                    <div className="flex-1 pt-0.5">
                      {unlocked ? <Link href={`/guitar/lessons/${lesson.id}`}>{card}</Link> : card}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
