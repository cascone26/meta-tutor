"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { lessonById, nextLesson } from "@/lib/guitar/curriculum";
import { songById } from "@/lib/guitar/songs";
import { getCompletedLessons, isLessonUnlocked, markLessonComplete, logPracticeResult } from "@/lib/guitar/progress";
import ChordTrainer from "@/components/guitar/ChordTrainer";
import Metronome from "@/components/guitar/Metronome";
import PlayAlong from "@/components/guitar/PlayAlong";
import Tuner from "@/components/guitar/Tuner";

export default function LessonPage() {
  const params = useParams<{ slug: string }>();
  const lesson = lessonById(params.slug);
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    setUnlocked(isLessonUnlocked(lesson.id));
    setDone(getCompletedLessons().has(lesson.id));
    setMounted(true);
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="max-w-md mx-auto px-5 py-10 text-center">
        <p style={{ color: "var(--g-muted)" }}>Lesson not found.</p>
        <Link href="/guitar/lessons" className="g-btn-ghost inline-flex mt-3">Back to lessons</Link>
      </div>
    );
  }

  function complete() {
    markLessonComplete(lesson!.id);
    setDone(true);
  }

  const upNext = nextLesson(lesson.id);

  return (
    <div className="max-w-md mx-auto px-5 py-6">
      <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--g-text)" }}>{lesson.title}</h1>
      <p className="text-sm mb-3" style={{ color: "var(--g-muted)" }}>{lesson.summary}</p>

      {lesson.objectives.length > 0 && (
        <ul className="text-sm mb-5 list-disc pl-5" style={{ color: "var(--g-text)" }}>
          {lesson.objectives.map((o) => <li key={o}>{o}</li>)}
        </ul>
      )}

      {lesson.resource && (
        <p className="text-xs mb-5" style={{ color: "var(--g-muted)" }}>
          For a deeper video walkthrough, see{" "}
          <a href={lesson.resource.url} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--g-accent-dark)" }}>
            {lesson.resource.label}
          </a>.
        </p>
      )}

      {mounted && !unlocked && (
        <p className="text-sm" style={{ color: "var(--g-danger)" }}>Complete the previous lesson first.</p>
      )}

      {mounted && unlocked && !done && (
        <div className="-mx-5">
          {lesson.practiceType === "read" && (
            <div className="px-5">
              <button onClick={complete} className="g-btn">Got it — mark complete</button>
            </div>
          )}

          {lesson.practiceType === "tuning" && (
            <div>
              <Tuner />
              <div className="px-5 text-center">
                <button onClick={complete} className="g-btn">All 6 strings in tune — mark complete</button>
              </div>
            </div>
          )}

          {(lesson.practiceType === "chord-drill" || lesson.practiceType === "transition") && lesson.chordIds && (
            <ChordTrainer chordIds={lesson.chordIds} mode={lesson.practiceType} onAllComplete={complete} />
          )}

          {lesson.practiceType === "strum" && (
            <div>
              <Metronome initialBpm={80} showTimeSignature={false} />
              <div className="px-5 text-center">
                <button
                  onClick={() => {
                    logPracticeResult("strum", 1, 1);
                    complete();
                  }}
                  className="g-btn"
                >
                  Practiced it — mark complete
                </button>
              </div>
            </div>
          )}

          {lesson.practiceType === "play-along" && lesson.songId && songById(lesson.songId) && (
            <PlayAlong song={songById(lesson.songId)!} onComplete={complete} />
          )}
        </div>
      )}

      {done && (
        <div className="text-center">
          <p className="text-sm mb-3" style={{ color: "var(--g-success)" }}>✓ Lesson complete (+{lesson.xp} XP)</p>
          {upNext ? (
            <Link href={`/guitar/lessons/${upNext.id}`} className="g-btn inline-flex">Next: {upNext.title} →</Link>
          ) : (
            <p className="text-sm" style={{ color: "var(--g-muted)" }}>That&apos;s the whole curriculum — nice work.</p>
          )}
        </div>
      )}
    </div>
  );
}
