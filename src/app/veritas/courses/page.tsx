"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { COURSES } from "@/data/veritas/courses";

export default function VeritasCourses() {
  const [difficulty, setDifficulty] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = COURSES.filter((c) => difficulty === "all" || c.difficulty === difficulty).sort(
    (a, b) => a.title.localeCompare(b.title)
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Courses"
        subtitle="Structured learning paths — from introductions to deep dives"
        icon="🎓"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3">
          <div className="flex flex-wrap gap-1.5">
            {["all", "beginner", "intermediate", "advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  difficulty === d
                    ? "bg-amber-600/20 text-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-stone-600">{filtered.length} courses</p>
        </div>

        <div className="space-y-3 px-6 py-4">
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => setExpanded(expanded === course.id ? null : course.id)}
              className="w-full rounded-lg border border-stone-800/50 px-4 py-3 text-left transition-colors hover:border-stone-700 hover:bg-stone-900/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-200">{course.title}</span>
                    {course.recommended && (
                      <span className="rounded bg-amber-600/20 px-1.5 py-0.5 text-[10px] text-amber-400">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{course.subtitle}</p>
                </div>
                <span className="text-[10px] uppercase text-stone-700">{course.difficulty}</span>
              </div>

              {expanded === course.id ? (
                <div className="mt-3 space-y-3 border-t border-stone-800 pt-3">
                  <p className="text-sm text-stone-400">{course.description}</p>

                  <div>
                    <div className="text-xs font-semibold uppercase text-stone-500 mb-2">
                      Duration: {course.duration}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded bg-stone-800 px-2 py-1 text-[10px] text-stone-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {course.lessons.map((lesson, i) => (
                      <div key={i} className="rounded bg-stone-800/40 p-2.5">
                        <p className="text-xs font-semibold text-stone-200">{lesson.title}</p>
                        <p className="mt-1 text-[11px] text-stone-500">{lesson.description}</p>
                        {lesson.questions.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            <p className="text-[10px] uppercase text-stone-600">Questions:</p>
                            {lesson.questions.map((q, qi) => (
                              <p key={qi} className="text-[10px] text-stone-500">
                                • {q}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-xs text-stone-500 line-clamp-1">{course.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
