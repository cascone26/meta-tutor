"use client";

import { useState, useEffect } from "react";

const steps = [
  {
    title: "Welcome to Meta Tutor",
    description: "Your personal study assistant for Thomistic Metaphysics. Here's a quick tour of what you can do.",
  },
  {
    title: "AI Chat",
    description: "Ask questions, get explanations, or switch to Quiz mode where the AI tests you instead of giving answers. Your notes and sources feed into the chat for personalized help.",
  },
  {
    title: "Study Modes",
    description: "9 ways to study: Learn (adaptive), Flashcards, Multiple Choice, Match (timed), Practice (essays), Essay Outliner, Teach-Back, Fill-in-the-Blank, Argument Reconstruction, and Timed Exam.",
  },
  {
    title: "Daily Review",
    description: "Check your personalized study plan each day. It shows what's due, your weak spots, and suggests what to study next.",
  },
  {
    title: "Wrong Answer Journal",
    description: "Every term you get wrong is automatically tracked. Drill your mistakes until they stick.",
  },
  {
    title: "Progress Dashboard",
    description: "Track your mastery, streaks, badges, study time, and progress over time. Export a PDF report anytime.",
  },
  {
    title: "Keyboard Shortcuts",
    description: "Press ? anywhere to see all keyboard shortcuts. Use D to toggle dark mode.",
  },
];

const KEY = "meta-tutor-onboarding-done";

export default function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(KEY);
    if (!done) setShow(true);
  }, []);

  function finish() {
    localStorage.setItem(KEY, "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative z-10 rounded-xl p-6 w-full max-w-md shadow-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i === step ? "var(--accent)" : "var(--border)", transform: i === step ? "scale(1.2)" : "scale(1)" }}
            />
          ))}
        </div>

        <h2 className="text-lg font-semibold text-center mb-2" style={{ color: "var(--foreground)" }}>
          {steps[step].title}
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          {steps[step].description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={finish}
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-4 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Get started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
