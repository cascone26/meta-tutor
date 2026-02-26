"use client";

import { useState, useRef } from "react";
import { recordStudySession } from "@/lib/streaks";

type Question = { question: string; answer: string };
type QuizState = { questions: Question[]; current: number; input: string; revealed: boolean; score: number; done: boolean };

const builtInPassages = [
  {
    id: 1,
    title: "Aristotle on Being as Being",
    source: "Aristotle, Metaphysics IV.1",
    text: "There is a science which investigates being as being and the attributes which belong to this in virtue of its own nature. Now this is not the same as any of the so-called special sciences; for none of these others treats universally of being as being. They cut off a part of being and investigate the attribute of this part; this is what the mathematical sciences for instance do. Now since we are seeking the first principles and the highest causes, clearly there must be some thing to which these belong in virtue of its own nature.",
  },
  {
    id: 2,
    title: "Plato's Allegory of the Cave (excerpt)",
    source: "Plato, Republic VII, 514a-515a",
    text: "Behold! human beings living in an underground cave, which has a mouth open towards the light and reaching all along the cave; here they have been from their childhood, and have their legs and necks chained so that they cannot move, and can only see before them, being prevented by the chains from turning round their heads. Above and behind them a fire is blazing at a distance, and between the fire and the prisoners there is a raised way; and you will see, if you look, a low wall built along the way, like the screen which marionette players have in front of them, over which they show the puppets.",
  },
  {
    id: 3,
    title: "Aquinas on Act and Potency",
    source: "Thomas Aquinas, De Principiis Naturae",
    text: "It should be noted that something can be, even though it is not, and something can be that already is. That which can be but is not, is said to be in potency; that which already is, is said to be in act. But being is twofold: namely the essential being of a thing, or substantial being, as for example to be a man; and this is being simply. The other is accidental being, as for example for a man to be white; and this is being in a certain respect.",
  },
  {
    id: 4,
    title: "Aristotle on the Syllogism",
    source: "Aristotle, Prior Analytics I.1",
    text: "A syllogism is discourse in which, certain things being stated, something other than what is stated follows of necessity from their being so. I mean by the last phrase that they produce the consequence, and by this, that no further term is required from without in order to make the consequence necessary. I call that a perfect syllogism which needs nothing other than what has been stated to make plain what necessarily follows; a syllogism is imperfect if it needs either one or more propositions, which are indeed the necessary consequences of the terms set down, but have not been expressly stated as premises.",
  },
  {
    id: 5,
    title: "Aquinas on the Transcendentals",
    source: "Thomas Aquinas, De Veritate, Q.1, A.1",
    text: "The first thing that the intellect conceives as most known, and into which it resolves all its conceptions, is being. Consequently, all the other conceptions of the intellect are had by additions to being. But nothing can be added to being as though it were something not already included in being — in the way that a difference is added to a genus or an accident to a subject — for every reality is essentially a being. Something is said to be added to being inasmuch as it expresses a mode of being not expressed by the term being itself.",
  },
];

export default function ReadingComp({ onBack }: { onBack: () => void }) {
  const [passage, setPassage] = useState<typeof builtInPassages[0] | null>(null);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function startQuiz(p: typeof builtInPassages[0]) {
    setPassage(p);
    setLoading(true);
    recordStudySession();

    try {
      const res = await fetch("/api/reading-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: p.text, source: p.source }),
      });
      const data = await res.json();
      setQuiz({ questions: data.questions, current: 0, input: "", revealed: false, score: 0, done: false });
    } catch {
      setQuiz({
        questions: [
          { question: "What is the main subject of this passage?", answer: "The passage discusses key metaphysical concepts." },
          { question: "What key distinction does the author make?", answer: "The author distinguishes between different modes of being." },
        ],
        current: 0, input: "", revealed: false, score: 0, done: false,
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function reveal() {
    if (!quiz) return;
    setQuiz({ ...quiz, revealed: true });
  }

  function markCorrect(correct: boolean) {
    if (!quiz) return;
    const newScore = correct ? quiz.score + 1 : quiz.score;
    if (quiz.current + 1 >= quiz.questions.length) {
      setQuiz({ ...quiz, score: newScore, done: true });
    } else {
      setQuiz({ ...quiz, current: quiz.current + 1, input: "", revealed: false, score: newScore });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  if (!passage) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Reading Comprehension</h1>
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Read a primary source passage, then answer questions about what it says.
          </p>
          <div className="space-y-2">
            {builtInPassages.map((p) => (
              <button key={p.id} onClick={() => startQuiz(p)} className="w-full text-left rounded-xl p-4 transition-all" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                <h3 className="text-sm font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>{p.title}</h3>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{p.source}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>Generating questions...</p>
      </div>
    );
  }

  if (quiz?.done) {
    const pct = quiz.questions.length > 0 ? Math.round((quiz.score / quiz.questions.length) * 100) : 0;
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: pct >= 80 ? "#6ab070" : pct >= 60 ? "#d4a843" : "#c96b6b" }}>{pct}%</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{quiz.score} of {quiz.questions.length} correct on &quot;{passage.title}&quot;</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => startQuiz(passage)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Try again</button>
            <button onClick={() => { setPassage(null); setQuiz(null); }} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}>Pick another</button>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz?.questions[quiz.current];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setPassage(null); setQuiz(null); }} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
          {quiz && <span className="text-xs" style={{ color: "var(--muted)" }}>Q{quiz.current + 1} of {quiz.questions.length}</span>}
        </div>

        {/* Passage */}
        <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-xs font-semibold mb-0.5" style={{ color: "var(--accent)" }}>{passage.title}</h3>
          <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{passage.source}</p>
          <p className="text-sm italic" style={{ color: "var(--foreground)", lineHeight: 1.7 }}>{passage.text}</p>
        </div>

        {/* Question */}
        {q && (
          <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>{q.question}</p>
            <input
              ref={inputRef}
              value={quiz?.input || ""}
              onChange={(e) => quiz && setQuiz({ ...quiz, input: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter" && !quiz?.revealed) reveal(); }}
              disabled={quiz?.revealed}
              placeholder="Your answer..."
              className="w-full rounded-lg px-3 py-2 text-sm mb-3"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />

            {!quiz?.revealed ? (
              <button onClick={reveal} disabled={!quiz?.input.trim()} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: quiz?.input.trim() ? "var(--accent)" : "var(--border)", color: quiz?.input.trim() ? "#fff" : "var(--muted)" }}>Check</button>
            ) : (
              <div>
                <div className="rounded-lg p-3 mb-3" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Expected answer:</p>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>{q.answer}</p>
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>How did you do?</p>
                <div className="flex gap-2">
                  <button onClick={() => markCorrect(true)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#6ab07018", color: "#6ab070", border: "1px solid #6ab07040" }}>Got it right</button>
                  <button onClick={() => markCorrect(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c96b6b18", color: "#c96b6b", border: "1px solid #c96b6b40" }}>Missed it</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
