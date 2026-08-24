"use client";

import { use } from "react";
import { getRcaClass } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import BackLink from "@/components/rca/BackLink";
import RcaClassBody from "@/components/rca/RcaClassBody";

export default function RcaClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cls = getRcaClass(slug);

  if (!cls) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8">
        <p className="text-sm mb-3" style={{ color: "#5c6b52" }}>Unknown class &quot;{slug}&quot;.</p>
        <BackLink href="/rca" size="xs">All RCA classes</BackLink>
      </div>
    );
  }

  const content = rcaContent[cls.id];

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-40">
      {/* pb-40, not pb-24 — LayoutDrawer's fixed button needs clearance at
          true scroll-bottom (found live, 2026-08-24). */}
      <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
        {/* No "All RCA classes" pill here — the header above already shows it
            contextually whenever we're inside a class page (see
            HeaderBackLink), so this used to double up with it (Jacob,
            2026-08-24: "the '< Hub' button is not needed... if i am in a
            class section, that button should be replaced with the 'all rca
            classes' button" — the header now IS that button). */}
        <h1 className="text-2xl font-bold tracking-tight mb-1">{cls.name}</h1>
        <p className="text-sm mb-1" style={{ color: "#5c6b52" }}>{cls.grade} · {cls.area}</p>
        {(cls.block || cls.room) && (
          <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: "#3f7ea6" }}>
            {(cls.days ?? ["Monday", "Thursday"]).join(" & ")}{cls.block ? `, ${cls.block}` : ""}
            {cls.room && <span style={{ color: "#8a9a7c" }}>· {cls.room}</span>}
          </p>
        )}
        <p className="text-sm mb-4" style={{ color: "#3a4a34" }}>{cls.summary}</p>
      </div>

      <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 140ms both" }}>
        <RcaClassBody cls={cls} content={content} />
      </div>
    </div>
  );
}
