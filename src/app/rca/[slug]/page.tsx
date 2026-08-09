"use client";

import { useState, use } from "react";
import Link from "next/link";
import { getRcaClass, currentLessonNumber } from "@/lib/rca";
import { music34Lessons, music34Overview } from "@/lib/rca-content/music-3-4";
import RcaLessonChat from "@/components/rca/RcaLessonChat";

export default function RcaClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cls = getRcaClass(slug);

  if (!cls) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8">
        <p className="text-sm" style={{ color: "#c7bd97" }}>Unknown class &quot;{slug}&quot;.</p>
        <Link href="/rca" className="text-sm underline" style={{ color: "#c9a227" }}>← Back to RCA</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <Link href="/rca" className="text-xs" style={{ color: "#c9a227", opacity: 0.8 }}>← All RCA classes</Link>
      <h1 className="text-xl font-semibold mt-2 mb-1">{cls.name}</h1>
      <p className="text-sm mb-4" style={{ color: "#a89968" }}>{cls.grade} · {cls.area}</p>
      <p className="text-sm mb-4" style={{ color: "#c7bd97" }}>{cls.summary}</p>

      {cls.books.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7d7455" }}>Books</h2>
          <ul className="text-sm" style={{ color: "#c7bd97" }}>
            {cls.books.map((b) => <li key={b}>— {b}</li>)}
          </ul>
        </div>
      )}

      {(cls.lessonPlanUrl || (cls.driveUrls && cls.driveUrls.length > 0)) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {cls.lessonPlanUrl && (
            <a href={cls.lessonPlanUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#c9a227" }}>
              Master lesson plan →
            </a>
          )}
          {cls.driveUrls?.map((d) => (
            <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#c9a227" }}>
              {d.label} →
            </a>
          ))}
        </div>
      )}

      {cls.hasStructuredContent && cls.id === "music-34" && <MusicLessonViewer />}

      {!cls.hasStructuredContent && (
        <div className="rounded-xl p-4 mb-6" style={{ background: "#1a2138", border: "1px solid #2a3350" }}>
          <p className="text-sm" style={{ color: "#8a8060" }}>
            {cls.lessonPlanUrl
              ? "Full lesson-by-lesson content hasn't been pulled into the app yet — use the master lesson plan link above for now."
              : "No curriculum resources on file yet for 2026-2027."}
          </p>
        </div>
      )}

      <RcaLessonChat subjectId={cls.id} subjectName={cls.name} />
    </div>
  );
}

function MusicLessonViewer() {
  const total = music34Lessons.length;
  const [n, setN] = useState(() => currentLessonNumber(total));
  const lesson = music34Lessons.find((l) => l.n === n);

  return (
    <div className="rounded-xl p-4 mb-6" style={{ background: "#1a2138", border: "1px solid #2a3350" }}>
      <p className="text-xs mb-3" style={{ color: "#8a8060" }}>{music34Overview}</p>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setN((v) => Math.max(1, v - 1))}
          disabled={n <= 1}
          className="text-sm px-2 py-1 rounded disabled:opacity-30"
          style={{ color: "#c9a227" }}
        >
          ← Prev
        </button>
        <span className="text-sm font-semibold">Lesson {n} of {total}</span>
        <button
          onClick={() => setN((v) => Math.min(total, v + 1))}
          disabled={n >= total}
          className="text-sm px-2 py-1 rounded disabled:opacity-30"
          style={{ color: "#c9a227" }}
        >
          Next →
        </button>
      </div>

      {lesson && (
        <div className="text-sm space-y-2" style={{ color: "#c7bd97" }}>
          {lesson.note && (
            <p className="text-xs font-semibold" style={{ color: "#c9a227" }}>{lesson.note}</p>
          )}
          <p><span className="font-semibold" style={{ color: "#eee6cf" }}>Choral Warm-up: </span>{lesson.warmup}</p>
          <p><span className="font-semibold" style={{ color: "#eee6cf" }}>Hymns and Chants: </span>{lesson.hymnsChants}</p>
          <p><span className="font-semibold" style={{ color: "#eee6cf" }}>Recorder: </span>{lesson.recorder}</p>
        </div>
      )}
    </div>
  );
}
