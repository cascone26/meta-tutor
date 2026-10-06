"use client";

import { useEffect, useState } from "react";
import { getStreakData, badges, checkBadges, type BadgeStats } from "@/lib/streaks";

export default function StreakDisplay() {
  const [streakData, setStreakData] = useState(getStreakData());
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [badgeStats, setBadgeStats] = useState<BadgeStats>({
    totalQuizzes: 0,
    termsStudied: 0,
    termsMastered: 0,
    perfectQuizzes: 0,
    totalTerms: 0,
  });

  useEffect(() => {
    const data = getStreakData();
    setStreakData(data);
    // Recompute badges — stats would come from actual progress tracking; for now, just use the streaks
    const stats: BadgeStats = {
      totalQuizzes: data.studyDates.length,
      termsStudied: 0,
      termsMastered: 0,
      perfectQuizzes: 0,
      totalTerms: 0,
    };
    setBadgeStats(stats);
    setEarnedBadges(checkBadges(data, stats));
  }, []);

  const currentStreak = streakData.currentStreak;
  const longestStreak = streakData.longestStreak;
  const earnedCount = earnedBadges.length;
  const totalBadges = badges.length;

  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#1f2438", border: "1px solid #3a4066" }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "#c3cbf0" }}>Streaks & Badges</h3>

      {/* Current and Longest Streaks */}
      <div className="flex gap-6 mb-4">
        <div>
          <div className="text-2xl font-bold" style={{ color: "#f0a86a" }}>
            {currentStreak}
          </div>
          <p className="text-xs" style={{ color: "#8087a0" }}>Current streak</p>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: "#8a9bd8" }}>
            {longestStreak}
          </div>
          <p className="text-xs" style={{ color: "#8087a0" }}>Longest streak</p>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedCount > 0 && (
        <div>
          <p className="text-xs mb-2" style={{ color: "#8087a0" }}>
            {earnedCount} of {totalBadges} badges earned
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.filter((b) => earnedBadges.includes(b.id)).map((b) => (
              <div
                key={b.id}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg"
                style={{ background: "#2a3248" }}
                title={b.description}
              >
                <span className="text-lg">{b.icon}</span>
                <span className="text-xs text-center" style={{ color: "#8087a0" }}>
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges Preview */}
      {earnedCount < totalBadges && (
        <p className="text-xs mt-3" style={{ color: "#5a6078" }}>
          Keep studying to unlock {totalBadges - earnedCount} more badge{totalBadges - earnedCount === 1 ? "" : "s"}.
        </p>
      )}
    </div>
  );
}
