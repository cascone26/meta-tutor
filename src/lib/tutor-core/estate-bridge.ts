// Formats a LearnerProfile as markdown readable by a Claude Code session with the fleet
// memory organ in context (Tutor Core Phase 10 — "Meta Tutor as one room in the Cobo
// Estate," per Jacob's framing). Pure formatting only — no I/O. The actual sync that
// writes this into the fleet memory directory runs as a LOCAL script
// (~/.filament/estate-bridge/sync-learning-profile.py), same reasoning as Phase 9's
// ambient correlator: Vercel can't reach the local filesystem, so this stays a function
// the local script's logic mirrors, not something the deployed app calls directly.
import type { LearnerProfile } from "./types";
import { subjectLabel } from "@/components/learner-profile/subject-label";

export function formatProfileAsMarkdown(profile: LearnerProfile): string {
  const lines: string[] = [];
  lines.push(`Learner profile for ${profile.userEmail}, synced ${profile.updatedAt}.`);
  lines.push("");

  for (const s of profile.subjects) {
    if (s.sampleSize === 0 && s.dueCount === 0) continue;
    lines.push(`## ${subjectLabel(s.subjectId)}`);
    if (s.accuracy !== null) lines.push(`Accuracy: ${Math.round(s.accuracy * 100)}% over ${s.sampleSize} attempts.`);
    if (s.dueCount > 0) lines.push(`${s.dueCount} items due for review.`);
    if (s.weakAreas.length > 0) {
      lines.push(`Weak areas: ${s.weakAreas.map((w) => `${w.label} (${w.missCount}×)`).join(", ")}.`);
    }
    lines.push("");
  }

  if (profile.ambientInsight && profile.ambientInsight.sampleDays > 0) {
    const a = profile.ambientInsight;
    lines.push("## Focus pattern");
    if (a.peakFocusHour !== null) lines.push(`Peak focus hour (local time): ${a.peakFocusHour}:00.`);
    if (a.avgSessionMinutes !== null) lines.push(`Typical session length: ~${Math.round(a.avgSessionMinutes)} minutes.`);
    lines.push(`Based on ${a.sampleDays} day(s) of ambient activity data.`);
  }

  return lines.join("\n").trim();
}
