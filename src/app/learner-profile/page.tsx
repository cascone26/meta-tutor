"use client";

import { useEffect, useState } from "react";
import { getLearnerProfile } from "@/lib/tutor-core/profile-client";
import type { LearnerProfile } from "@/lib/tutor-core/types";
import ProfileStats from "@/components/learner-profile/ProfileStats";
import WeakAreasList from "@/components/learner-profile/WeakAreasList";
import SubjectBreakdown from "@/components/learner-profile/SubjectBreakdown";
import AmbientInsights from "@/components/learner-profile/AmbientInsights";
import { subjectLabel } from "@/components/learner-profile/subject-label";

function recommend(profile: LearnerProfile): string | null {
  const withDue = [...profile.subjects].filter((s) => s.dueCount > 0).sort((a, b) => b.dueCount - a.dueCount)[0];
  if (withDue) return `${withDue.dueCount} due in ${subjectLabel(withDue.subjectId)} — start there.`;

  const weakest = [...profile.subjects]
    .filter((s) => s.accuracy !== null && s.sampleSize > 0)
    .sort((a, b) => (a.accuracy as number) - (b.accuracy as number))[0];
  if (weakest) return `${subjectLabel(weakest.subjectId)} is your softest spot right now (${Math.round((weakest.accuracy as number) * 100)}%).`;

  return null;
}

export default function LearnerProfilePage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setProfile(null);
    getLearnerProfile().then((p) => (p ? setProfile(p) : setError(true)));
  }

  useEffect(load, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#e8e6f0" }}>Learning Profile</h1>
      <p className="text-sm mb-5" style={{ color: "#8087a0" }}>
        One place, everything you're working on — pulled from Latin Lab and RCA so far, more subjects join as they adopt it.
      </p>

      {error && (
        <div className="text-center py-10">
          <p className="text-sm mb-3" style={{ color: "#d88a8a" }}>Couldn&apos;t load your profile — try again.</p>
          <button onClick={load} className="text-sm underline" style={{ color: "#8a9bd8" }}>Retry</button>
        </div>
      )}

      {!error && !profile && <p className="text-sm text-center py-10" style={{ color: "#8087a0" }}>Loading…</p>}

      {!error && profile && (
        <>
          <ProfileStats profile={profile} />
          {recommend(profile) && (
            <div className="rounded-xl p-4 mb-4" style={{ background: "#1f2438", border: "1px solid #3a4066" }}>
              <p className="text-sm" style={{ color: "#c3cbf0" }}>{recommend(profile)}</p>
            </div>
          )}
          <AmbientInsights insight={profile.ambientInsight} />
          <WeakAreasList profile={profile} />
          <SubjectBreakdown profile={profile} />
        </>
      )}
    </div>
  );
}
