"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SPIRITUAL_BOOKS } from "@/data/veritas/spiritual-reading";
import ReaderSettings, { useReaderSettings, themeClasses } from "@/components/veritas/ReaderSettings";
import HighlightManager from "@/components/veritas/HighlightManager";

interface Chapter {
  title: string;
  content: string;
  wordCount: number;
  readingMinutes: number;
}

function parseChapters(markdown: string): Chapter[] {
  const lines = markdown.split("\n");
  const chapters: Chapter[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  const pushChapter = () => {
    if (currentTitle || currentLines.length > 0) {
      const content = currentLines.join("\n").trim();
      const words = content.split(/\s+/).filter(Boolean).length;
      chapters.push({
        title: currentTitle || "Introduction",
        content,
        wordCount: words,
        readingMinutes: Math.max(1, Math.round(words / 250)),
      });
    }
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      pushChapter();
      currentTitle = line.replace(/^##\s+/, "");
      currentLines = [];
    } else if (chapters.length === 0 && line.startsWith("# ")) {
      continue;
    } else {
      currentLines.push(line);
    }
  }
  pushChapter();

  return chapters;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-stone-200 mt-6 mb-2">$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-stone-300 mt-4 mb-2">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-stone-200 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-amber-700 pl-4 my-3 text-stone-400 italic">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-stone-800 my-6" />')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">');
}

export default function BookReaderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const book = SPIRITUAL_BOOKS.find((b) => b.slug === slug);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { settings, update: updateSettings } = useReaderSettings();
  const theme = themeClasses(settings.theme);

  const storageKey = `veritas-reading-progress-${slug}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentChapter(data.chapter || 0);
      } catch {
        // ignore
      }
    }
  }, [storageKey]);

  useEffect(() => {
    fetch(`/veritas-books/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((text) => {
        const parsed = parseChapters(text);
        if (parsed.length === 0) throw new Error("Empty");
        setChapters(parsed);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const saveProgress = useCallback(
    (chapter: number, scrollPercent: number) => {
      localStorage.setItem(storageKey, JSON.stringify({ chapter, scrollPercent, updatedAt: Date.now() }));
    },
    [storageKey]
  );

  const goToChapter = useCallback(
    (index: number) => {
      setCurrentChapter(index);
      setSidebarOpen(false);
      saveProgress(index, 0);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    },
    [saveProgress]
  );

  const handleScroll = useCallback(() => {
    if (!contentRef.current || chapters.length === 0) return;
    const el = contentRef.current;
    const scrollPercent = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
    const chapterProgress = (currentChapter + scrollPercent) / chapters.length;
    setProgress(Math.min(1, chapterProgress));
    saveProgress(currentChapter, scrollPercent);
  }, [currentChapter, chapters.length, saveProgress]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (chapters.length > 0) {
      setProgress(currentChapter / chapters.length);
    }
  }, [currentChapter, chapters.length]);

  if (!book) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-stone-950">
        <p className="text-stone-500 mb-4">Book not found.</p>
        <Link href="/veritas/library" className="text-sm text-amber-500 hover:text-amber-400">
          Back to reading list
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-stone-950">
        <div className="text-stone-600 text-sm">Loading...</div>
      </div>
    );
  }

  if (error || chapters.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-stone-950 px-6">
        <h2 className="text-lg font-semibold text-stone-200 mb-2">Coming Soon</h2>
        <p className="text-sm text-stone-500 text-center max-w-md mb-6">
          The full text of <span className="text-stone-300">{book.title}</span> by {book.author} is not yet available on site. Check back later.
        </p>
        <Link href="/veritas/library" className="text-sm text-amber-500 hover:text-amber-400">
          Back to reading list
        </Link>
      </div>
    );
  }

  const chapter = chapters[currentChapter];

  return (
    <div className={`flex h-full flex-col ${theme.bg || "bg-stone-950"}`}>
      <div className="h-1 w-full bg-stone-900 shrink-0">
        <div className="h-full bg-amber-600 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2 shrink-0">
        <Link href="/veritas/library" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
          &larr; Back
        </Link>
        <div className="text-center">
          <p className={`text-xs font-semibold truncate max-w-[200px] sm:max-w-none ${theme.text || "text-stone-300"}`}>{book.title}</p>
          <p className={`text-[10px] ${theme.mutedText || "text-stone-600"}`}>{book.author}</p>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
          Ch. {currentChapter + 1}/{chapters.length}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <>
            <div className="absolute inset-0 bg-black/50 z-10 sm:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 z-20 w-72 border-r border-stone-800 bg-stone-950 overflow-y-auto sm:relative sm:w-64">
              <div className="p-3 border-b border-stone-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Chapters</p>
              </div>
              <div className="py-1">
                {chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => goToChapter(i)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      i === currentChapter
                        ? "bg-amber-900/20 text-amber-400 border-l-2 border-amber-600"
                        : "text-stone-400 hover:bg-stone-900 hover:text-stone-300 border-l-2 border-transparent"
                    }`}
                  >
                    <span className="text-[10px] text-stone-600 mr-2">{i + 1}</span>
                    <span className="truncate">{ch.title}</span>
                    <span className="block text-[10px] text-stone-600 ml-5">{ch.readingMinutes} min read</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div ref={contentRef} className={`flex-1 overflow-y-auto ${theme.bg || ""}`}>
          <div className="mx-auto px-6 py-8" style={{ maxWidth: `${settings.lineWidth}px` }}>
            <h2 className={`text-xl font-semibold mb-2 ${theme.text || "text-stone-100"}`}>{chapter.title}</h2>
            <div className={`flex items-center gap-3 text-[11px] mb-8 ${theme.mutedText || "text-stone-600"}`}>
              <span>{chapter.wordCount.toLocaleString()} words</span>
              <span>|</span>
              <span>{chapter.readingMinutes} min read</span>
            </div>
            <div
              className={`prose-veritas leading-[1.8] ${theme.text || "text-stone-300"}`}
              style={{ fontSize: `${settings.fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: `<p class="mb-4 leading-relaxed">${renderMarkdown(chapter.content)}</p>` }}
            />
          </div>

          <div className="mx-auto px-6 pb-12" style={{ maxWidth: `${settings.lineWidth}px` }}>
            <div className="flex items-center justify-between border-t border-stone-800 pt-6">
              {currentChapter > 0 ? (
                <button onClick={() => goToChapter(currentChapter - 1)} className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
                  &larr; {chapters[currentChapter - 1].title}
                </button>
              ) : (
                <div />
              )}
              {currentChapter < chapters.length - 1 ? (
                <button onClick={() => goToChapter(currentChapter + 1)} className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                  {chapters[currentChapter + 1].title} &rarr;
                </button>
              ) : (
                <Link href="/veritas/library" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                  Finished — back to list
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReaderSettings settings={settings} onUpdate={updateSettings} />
      <HighlightManager contentRef={contentRef} />
    </div>
  );
}
