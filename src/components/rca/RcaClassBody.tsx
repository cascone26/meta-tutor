"use client";

import { useState } from "react";
import Link from "next/link";
import type { RcaClass } from "@/lib/rca";
import type { SubjectContent } from "@/lib/rca-content/types";
import LessonViewer from "@/components/rca/LessonViewer";
import GradingChecklist from "@/components/rca/GradingChecklist";
import PracticeHub from "@/components/rca/PracticeHub";
import TeacherGuide from "@/components/rca/TeacherGuide";
import LayoutDrawer from "@/components/rca/LayoutDrawer";
import { LeafIcon } from "@/components/rca/NatureIcons";
import { DEFAULT_WIDGET_ORDER, type WidgetId } from "@/lib/rca-layout-prefs";

// Owns "which lesson is on screen" (mirrored from LessonViewer's own
// onLessonChange, so Practice/Teacher's Guide ground on whatever's actually
// being viewed — Jacob, 2026-08-24: "learning should really match the week
// and stuff im doing") and the widget order/visibility (the layout-drawer
// ask, same session). Everything below the class header in
// rca/[slug]/page.tsx routes through here.
export default function RcaClassBody({ cls, content }: { cls: RcaClass; content: SubjectContent | undefined }) {
  const [n, setN] = useState<number | null>(null); // null until LessonViewer reports its actual estimate
  const [order, setOrder] = useState<WidgetId[]>(DEFAULT_WIDGET_ORDER);
  const [hidden, setHidden] = useState<WidgetId[]>([]);
  const hiddenSet = new Set(hidden);

  if (!content) {
    return (
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3", backdropFilter: "blur(10px)" }}
      >
        <p className="text-sm" style={{ color: "#5c6b52" }}>
          {cls.lessonPlanUrl
            ? "Full lesson-by-lesson content hasn't been pulled into the app yet — use the master lesson plan link above for now, or ask the assistant (bottom right)."
            : "No curriculum resources on file yet for 2026-2027."}
        </p>
      </div>
    );
  }

  const widgetMap: Partial<Record<WidgetId, React.ReactNode>> = {
    books: cls.books.length > 0 && (
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: "#6b8e5a" }}>
          <LeafIcon size={12} />
          Books
        </h2>
        <ul className="text-sm" style={{ color: "#3a4a34" }}>
          {cls.books.map((b) => <li key={b}>— {b}</li>)}
        </ul>
      </div>
    ),
    referenceMaterials: cls.id === "religion-6" && (
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: "#6b8e5a" }}>
          <LeafIcon size={12} />
          Reference Materials
        </h2>
        <div className="space-y-1 text-xs">
          <Link href="/rca/religion-6/catechism" className="underline block" style={{ color: "#3f7ea6" }}>
            Baltimore Catechism No. 2 (complete reference) →
          </Link>
          <Link href="/rca/religion-6/gospel-mark" className="underline block" style={{ color: "#3f7ea6" }}>
            Gospel of Mark (complete text) →
          </Link>
          <Link href="/rca/religion-6/gospel-luke" className="underline block" style={{ color: "#3f7ea6" }}>
            Gospel of Luke (complete text) →
          </Link>
          <Link href="/rca/religion-6/materials" className="underline block" style={{ color: "#3f7ea6" }}>
            All course textbooks & links →
          </Link>
        </div>
      </div>
    ),
    yearBLink: cls.id === "music-34" && (
      <div className="mb-4">
        <Link href="/rca/music-34-year-b" className="underline text-xs" style={{ color: "#3f7ea6" }}>
          Year B (archived, for reference) →
        </Link>
      </div>
    ),
    links: (cls.lessonPlanUrl || (cls.driveUrls && cls.driveUrls.length > 0)) && (
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
    ),
    lesson: <LessonViewer content={content} classId={cls.id} onLessonChange={setN} />,
    gradingChecklist: <GradingChecklist subjectId={cls.id} />,
    practice: <PracticeHub subjectId={cls.id} subjectName={cls.name} lessonN={n ?? undefined} />,
    // Guard against a one-frame flash of "Lesson 1"'s guide before
    // LessonViewer's own onLessonChange reports its real estimate.
    teacherGuide: n !== null ? (
      <TeacherGuide subjectId={cls.id} lessonN={n} />
    ) : (
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3", minHeight: 60 }} />
    ),
  };

  return (
    <>
      <LayoutDrawer classId={cls.id} onChange={(o, h) => { setOrder(o); setHidden(h); }} />
      {order.filter((id) => !hiddenSet.has(id)).map((id) => (
        <div key={id}>{widgetMap[id]}</div>
      ))}
    </>
  );
}
