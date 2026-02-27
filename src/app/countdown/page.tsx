"use client";

import { useState, useEffect } from "react";
import { glossary } from "@/lib/glossary";
import { getSRData, getTermStats } from "@/lib/spaced-repetition";
import { getHistory } from "@/lib/study-history";

const KEY = "meta-tutor-exam-date";

export default function CountdownPage() {
  const [examDate, setExamDate] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [srStats, setSrStats] = useState({ total: 0, due: 0, learning: 0, reviewing: 0, mastered: 0 });
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setExamDate(saved);
    const sr = getSRData();
    setSrStats(getTermStats(sr));
    setQuizCount(getHistory().length);
  }, []);

  function saveDate() {
    if (!inputDate) return;
    localStorage.setItem(KEY, inputDate);
    setExamDate(inputDate);
  }

  function clearDate() {
    localStorage.removeItem(KEY);
    setExamDate("");
  }

  const daysLeft = examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;
  const masteryPct = glossary.length > 0 ? Math.round((srStats.mastered / glossary.length) * 100) : 0;

  // Milestones based on days left
  const getMilestones = () => {
    if (daysLeft === null) return [];
    const milestones: { text: string; done: boolean; urgent: boolean }[] = [];

    if (daysLeft > 14) {
      milestones.push({ text: "Start reviewing all categories", done: srStats.total >= 10, urgent: false });
      milestones.push({ text: "Complete at least 5 quizzes", done: quizCount >= 5, urgent: false });
      milestones.push({ text: `Study ${Math.ceil(glossary.length / 2)} terms`, done: srStats.total >= glossary.length / 2, urgent: false });
    }
    if (daysLeft <= 14) {
      milestones.push({ text: "All terms should be studied at least once", done: srStats.total >= glossary.length, urgent: daysLeft <= 7 });
      milestones.push({ text: "Master at least 50% of terms", done: masteryPct >= 50, urgent: daysLeft <= 7 });
      milestones.push({ text: "Complete 10+ quizzes", done: quizCount >= 10, urgent: false });
    }
    if (daysLeft <= 7) {
      milestones.push({ text: "Master at least 75% of terms", done: masteryPct >= 75, urgent: true });
      milestones.push({ text: "Take a full timed exam simulation", done: getHistory().some((h) => h.mode === "Timed Exam"), urgent: true });
      milestones.push({ text: "Review all weak areas", done: false, urgent: true });
    }
    if (daysLeft <= 3) {
      milestones.push({ text: "Final review — focus on weak spots only", done: false, urgent: true });
      milestones.push({ text: "Do one more timed exam", done: false, urgent: true });
      milestones.push({ text: "Get a good night's sleep", done: false, urgent: false });
    }

    return milestones;
  };

  const milestones = getMilestones();

  // Pace suggestion
  const getPace = () => {
    if (daysLeft === null) return "";
    const termsLeft = glossary.length - srStats.total;
    if (termsLeft <= 0) {
      if (masteryPct >= 80) return "You're in great shape. Focus on weak spots and take practice exams.";
      return "All terms studied. Now focus on mastering them — aim for 80%+ mastery.";
    }
    const perDay = Math.ceil(termsLeft / Math.max(daysLeft, 1));
    return `Study ~${perDay} new terms per day to cover everything before the exam.`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Exam Countdown</h1>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>Set your exam date and track your preparation milestones.</p>

        {!examDate ? (
          <div className="rounded-xl p-5 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>When is your exam?</p>
            <div className="flex items-center justify-center gap-2">
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
              <button onClick={saveDate} disabled={!inputDate} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: inputDate ? "var(--accent)" : "var(--border)", color: inputDate ? "#fff" : "var(--muted)" }}>Set</button>
            </div>
          </div>
        ) : (
          <>
            {/* Countdown */}
            <div className="rounded-xl p-6 mb-5 text-center" style={{ background: daysLeft !== null && daysLeft <= 3 ? "var(--error-bg)" : "var(--accent-light)", border: `1px solid ${daysLeft !== null && daysLeft <= 3 ? "var(--error-border)" : "var(--accent)"}30` }}>
              <p className="text-5xl font-bold mb-1" style={{ color: daysLeft !== null && daysLeft <= 3 ? "var(--error)" : "var(--accent)" }}>
                {daysLeft}
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {daysLeft === 0 ? "Exam day!" : daysLeft === 1 ? "day left" : "days left"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {new Date(examDate).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <button onClick={clearDate} className="text-xs mt-2" style={{ color: "var(--muted)" }}>Change date</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>{srStats.total}/{glossary.length}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Terms studied</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xl font-bold" style={{ color: masteryPct >= 75 ? "var(--success)" : masteryPct >= 50 ? "var(--warning)" : "var(--error)" }}>{masteryPct}%</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Mastery</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{quizCount}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Quizzes taken</p>
              </div>
            </div>

            {/* Pace */}
            <div className="rounded-xl p-4 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>Study pace</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{getPace()}</p>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Milestones</h3>
                <div className="space-y-2">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs" style={{ background: m.done ? "var(--success-bg)" : m.urgent ? "var(--error-bg)" : "var(--background)", border: `1px solid ${m.done ? "var(--success-border)" : m.urgent ? "var(--error-border)" : "var(--border)"}`, color: m.done ? "var(--success)" : m.urgent ? "var(--error)" : "var(--muted)" }}>
                        {m.done ? "✓" : ""}
                      </div>
                      <span className="text-sm" style={{ color: m.done ? "var(--muted)" : "var(--foreground)", textDecoration: m.done ? "line-through" : "none" }}>{m.text}</span>
                      {m.urgent && !m.done && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--error-bg)", color: "var(--error)" }}>urgent</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
