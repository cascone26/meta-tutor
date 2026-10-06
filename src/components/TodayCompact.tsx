"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLearnerProfile } from "@/lib/tutor-core/profile-client";
import type { LearnerProfile } from "@/lib/tutor-core/types";
import { subjectLabel } from "@/components/learner-profile/subject-label";

type ThemeId = "dark" | "light";

interface TodayCompactProps {
  theme: ThemeId;
  themes: Record<ThemeId, {
    pageBg: string; text: string; eyebrow: string; muted: string; headlineGradient: string;
    cardBg: string; cardBorder: string; badgeBg: string; badgeText: string;
    toggleBg: string; toggleBorder: string; toggleIcon: string;
    orb1: string; orb2: string; orb3: string;
  }>;
}

function recommend(profile: LearnerProfile): string | null {
  const withDue = [...profile.subjects].filter((s) => s.dueCount > 0).sort((a, b) => b.dueCount - a.dueCount)[0];
  if (withDue) return `${withDue.dueCount} due in ${subjectLabel(withDue.subjectId)} — start there.`;

  const weakest = [...profile.subjects]
    .filter((s) => s.accuracy !== null && s.sampleSize > 0)
    .sort((a, b) => (a.accuracy as number) - (b.accuracy as number))[0];
  if (weakest) return `${subjectLabel(weakest.subjectId)} is your softest spot right now (${Math.round((weakest.accuracy as number) * 100)}%).`;

  return null;
}

export default function TodayCompact({ theme, themes }: TodayCompactProps) {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearnerProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const t = themes[theme];

  if (loading) {
    return (
      <div className="rounded-2xl p-5 mb-5" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
        <p className="text-xs text-center" style={{ color: t.muted }}>Loading your learning profile…</p>
      </div>
    );
  }

  if (!profile || profile.subjects.length === 0) {
    return null;
  }

  // Calculate stats
  const withData = profile.subjects.filter((s) => s.sampleSize > 0);
  const avgAccuracy =
    withData.length > 0 && withData.some((s) => s.accuracy !== null)
      ? withData.filter((s) => s.accuracy !== null).reduce((sum, s) => sum + (s.accuracy as number), 0) /
        withData.filter((s) => s.accuracy !== null).length
      : null;
  const totalDue = profile.subjects.reduce((sum, s) => sum + s.dueCount, 0);
  const recommendation = recommend(profile);

  return (
    <div className="mb-6 rounded-2xl p-5 transition-all duration-300" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: t.eyebrow }}>
          Today
        </p>
        <Link href="/learner-profile" className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: t.muted }}>
          Full profile →
        </Link>
      </div>

      {/* Quick stats: 3 columns */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center rounded-lg p-2" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
          <p className="text-lg font-bold" style={{ color: t.text }}>{withData.length}</p>
          <p className="text-xs" style={{ color: t.muted }}>Active</p>
        </div>
        <div className="text-center rounded-lg p-2" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
          <p className="text-lg font-bold" style={{ color: t.text }}>{avgAccuracy !== null ? `${Math.round(avgAccuracy * 100)}%` : "—"}</p>
          <p className="text-xs" style={{ color: t.muted }}>Accuracy</p>
        </div>
        <div className="text-center rounded-lg p-2" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
          <p className="text-lg font-bold" style={{ color: totalDue > 0 ? "#d88a8a" : t.text }}>{totalDue}</p>
          <p className="text-xs" style={{ color: t.muted }}>Due</p>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <p className="text-sm" style={{ color: t.text }}>
          <span style={{ color: t.eyebrow }}>→ </span>
          {recommendation}
        </p>
      )}
    </div>
  );
}
