"use client";

import { useState, useMemo } from "react";
import { baltimoreCatechism2, type CatechismLesson } from "@/lib/rca-content/baltimore-catechism";

export default function CatechismReference() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return baltimoreCatechism2;

    const query = searchQuery.toLowerCase();
    return baltimoreCatechism2.map((lesson) => ({
      ...lesson,
      questions: lesson.questions.filter(
        (qa) =>
          qa.q.toLowerCase().includes(query) ||
          qa.a.toLowerCase().includes(query)
      ),
    })).filter((lesson) => lesson.questions.length > 0);
  }, [searchQuery]);

  const toggleLesson = (lessonNum: number) => {
    const newSet = new Set(expandedLessons);
    if (newSet.has(lessonNum)) {
      newSet.delete(lessonNum);
    } else {
      newSet.add(lessonNum);
    }
    setExpandedLessons(newSet);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Search */}
      <div className="sticky top-0 bg-white z-10 pb-4">
        <input
          type="text"
          placeholder="Search catechism... (question or answer)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-[#d9e4d3] rounded-lg bg-[#fbf8f0] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3f7ea6]"
        />
      </div>

      {/* Results */}
      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No results found for "{searchQuery}"
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((lesson) => (
            <div
              key={lesson.lesson}
              className="border border-[#d9e4d3] rounded-lg bg-[#fbf8f0] overflow-hidden"
            >
              {/* Lesson Header */}
              <button
                onClick={() => toggleLesson(lesson.lesson)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Lesson {lesson.lesson}: {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lesson.questions.length} question{lesson.questions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-[#3f7ea6] text-lg">
                  {expandedLessons.has(lesson.lesson) ? "▼" : "▶"}
                </div>
              </button>

              {/* Questions */}
              {expandedLessons.has(lesson.lesson) && (
                <div className="border-t border-[#d9e4d3] divide-y divide-[#d9e4d3]">
                  {lesson.questions.map((qa) => (
                    <div key={qa.n} className="px-4 py-3 space-y-2 hover:bg-gray-50">
                      <div className="flex gap-3">
                        <span className="text-[#3f7ea6] font-semibold text-sm min-w-8">
                          Q{qa.n}
                        </span>
                        <p className="text-gray-900">{qa.q}</p>
                      </div>
                      <div className="flex gap-3 ml-8">
                        <span className="text-[#6b8e5a] font-semibold text-sm">A</span>
                        <p className="text-gray-700">{qa.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
