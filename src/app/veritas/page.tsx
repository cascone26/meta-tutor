import Link from "next/link";

const STATIONS = [
  { href: "/veritas/library", title: "Library", desc: "127 full texts — Aquinas, Augustine, Aristotle, Scripture, encyclicals, and the classical canon", icon: "📖" },
  { href: "/veritas/ask", title: "Ask Aquinas", desc: "AI chat grounded in the complete works of Aquinas, with live citations", icon: "💬" },
  { href: "/veritas/daily", title: "Daily Question", desc: "A new theology question every day to sharpen your mind", icon: "📆" },
  { href: "/veritas/flashcards", title: "Flashcards", desc: "Generate and review with spaced repetition", icon: "🃏" },
  { href: "/veritas/objection", title: "Objection Handler", desc: "Paste any anti-Catholic argument, get a structured Thomistic response", icon: "🛡️" },
  { href: "/veritas/debate", title: "Debate Prep", desc: "A full briefing on any topic against any opponent type", icon: "🎯" },
  { href: "/veritas/glossary", title: "Glossary", desc: "Theological and philosophical terms, plain English with progressive depth", icon: "📚" },
];

export default function VeritasHub() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-stone-100 mb-1">Veritas</h1>
      <p className="text-sm text-stone-500 mb-6">
        Catholic theology &amp; apologetics, grounded in the complete works of St. Thomas Aquinas.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {STATIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 transition-colors hover:border-amber-700/60 hover:bg-stone-900"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{s.icon}</span>
              <span className="font-semibold text-sm text-stone-100">{s.title}</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
