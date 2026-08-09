"use client";

import { use } from "react";
import Link from "next/link";
import { getRcaClass } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import LessonViewer from "@/components/rca/LessonViewer";
import { LeafIcon } from "@/components/rca/NatureIcons";

export default function RcaClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cls = getRcaClass(slug);

  if (!cls) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8">
        <p className="text-sm" style={{ color: "#5c6b52" }}>Unknown class &quot;{slug}&quot;.</p>
        <Link href="/rca" className="text-sm underline" style={{ color: "#3f7ea6" }}>← Back to RCA</Link>
      </div>
    );
  }

  const content = rcaContent[cls.id];

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-24">
      <Link href="/rca" className="text-xs" style={{ color: "#3f7ea6", opacity: 0.85 }}>← All RCA classes</Link>
      <h1 className="text-xl font-semibold mt-2 mb-1">{cls.name}</h1>
      <p className="text-sm mb-4" style={{ color: "#5c6b52" }}>{cls.grade} · {cls.area}</p>
      <p className="text-sm mb-4" style={{ color: "#3a4a34" }}>{cls.summary}</p>

      {cls.books.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: "#6b8e5a" }}>
            <LeafIcon size={12} />
            Books
          </h2>
          <ul className="text-sm" style={{ color: "#3a4a34" }}>
            {cls.books.map((b) => <li key={b}>— {b}</li>)}
          </ul>
        </div>
      )}

      {(cls.lessonPlanUrl || (cls.driveUrls && cls.driveUrls.length > 0)) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {cls.lessonPlanUrl && (
            <a href={cls.lessonPlanUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#3f7ea6" }}>
              Master lesson plan →
            </a>
          )}
          {cls.driveUrls?.map((d) => (
            <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#3f7ea6" }}>
              {d.label} →
            </a>
          ))}
        </div>
      )}

      {content ? (
        <LessonViewer content={content} />
      ) : (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
          <p className="text-sm" style={{ color: "#5c6b52" }}>
            {cls.lessonPlanUrl
              ? "Full lesson-by-lesson content hasn't been pulled into the app yet — use the master lesson plan link above for now, or ask the assistant (bottom right)."
              : "No curriculum resources on file yet for 2026-2027."}
          </p>
        </div>
      )}
    </div>
  );
}
