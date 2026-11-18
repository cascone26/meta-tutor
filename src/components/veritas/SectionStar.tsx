"use client";

import { useEffect, useState } from "react";
import { isStarred, toggleStar } from "@/lib/veritas/stars";

interface SectionStarProps {
  page: string;
  href: string;
  sectionId: string;
  title: string;
  summary: string;
  className?: string;
}

export default function SectionStar({ page, href, sectionId, title, summary, className }: SectionStarProps) {
  const key = `${page}:${sectionId}`;
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isStarred(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setStarred(toggleStar({ key, page, href, title, summary }));
      }}
      title={starred ? "Remove star" : "Star — mark this as important"}
      className={`shrink-0 text-base leading-none transition-colors ${
        starred ? "text-amber-500" : "text-stone-700 hover:text-amber-500"
      } ${className ?? ""}`}
    >
      {starred ? "★" : "☆"}
    </button>
  );
}
