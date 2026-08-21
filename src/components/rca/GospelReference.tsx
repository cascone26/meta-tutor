"use client";

import { useState, useMemo } from "react";
import { gospelMark, type GospelChapter } from "@/lib/rca-content/gospel-mark";
import { gospelLuke } from "@/lib/rca-content/gospel-luke";

export default function GospelReference({ book, data }: { book: string; data: GospelChapter[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data
      .map((chapter) => ({
        ...chapter,
        verses: chapter.verses.filter((v) => v.text.toLowerCase().includes(query)),
      }))
      .filter((chapter) => chapter.verses.length > 0);
  }, [searchQuery, data]);

  const toggleChapter = (chapterNum: number) => {
    const newSet = new Set(expandedChapters);
    if (newSet.has(chapterNum)) {
      newSet.delete(chapterNum);
    } else {
      newSet.add(chapterNum);
    }
    setExpandedChapters(newSet);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="sticky top-0 bg-white z-10 pb-4">
        <input
          type="text"
          placeholder={`Search ${book}... (verse text)`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-[#d9e4d3] rounded-lg bg-[#fbf8f0] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3f7ea6]"
        />
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No results found for "{searchQuery}"
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((chapter) => (
            <div
              key={chapter.chapter}
              className="border border-[#d9e4d3] rounded-lg bg-[#fbf8f0] overflow-hidden"
            >
              <button
                onClick={() => toggleChapter(chapter.chapter)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Chapter {chapter.chapter}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {chapter.verses.length} verse{chapter.verses.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-[#3f7ea6] text-lg">
                  {expandedChapters.has(chapter.chapter) ? "▼" : "▶"}
                </div>
              </button>

              {expandedChapters.has(chapter.chapter) && (
                <div className="border-t border-[#d9e4d3] px-4 py-3">
                  <p className="text-gray-800 leading-relaxed">
                    {chapter.verses.map((v) => (
                      <span key={v.verse}>
                        <sup className="text-[#3f7ea6] font-semibold mr-0.5">{v.verse}</sup>
                        {v.text}{" "}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GospelMarkReference() {
  return <GospelReference book="the Gospel of Mark" data={gospelMark} />;
}

export function GospelLukeReference() {
  return <GospelReference book="the Gospel of Luke" data={gospelLuke} />;
}
