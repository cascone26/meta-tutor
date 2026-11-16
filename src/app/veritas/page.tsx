"use client";

import { useState } from "react";
import Link from "next/link";

interface Station {
  href: string;
  title: string;
  desc: string;
  icon: string;
}

interface Section {
  id: string;
  label: string;
  icon: string;
  stations: Station[];
}

const SECTIONS: Section[] = [
  {
    id: "ai-tools",
    label: "AI Tools",
    icon: "💬",
    stations: [
      { href: "/veritas/ask", title: "Ask Aquinas", desc: "AI chat grounded in the complete works of Aquinas, with live citations", icon: "💬" },
      { href: "/veritas/daily", title: "Daily Question", desc: "A new theology question every day to sharpen your mind", icon: "📆" },
      { href: "/veritas/flashcards", title: "Flashcards", desc: "Generate and review with spaced repetition", icon: "🃏" },
      { href: "/veritas/objection", title: "Objection Handler", desc: "Paste any anti-Catholic argument, get a structured Thomistic response", icon: "🛡️" },
      { href: "/veritas/debate", title: "Debate Prep", desc: "A full briefing on any topic against any opponent type", icon: "🎯" },
      { href: "/veritas/simulator", title: "Debate Simulator", desc: "Live back-and-forth chat with an AI opponent — atheist, Protestant, Muslim, Orthodox, or secular — who actually pushes back", icon: "⚔️" },
    ],
  },
  {
    id: "library",
    label: "Library & Full Texts",
    icon: "📖",
    stations: [
      { href: "/veritas/library", title: "Library", desc: "210+ full texts on site — the complete Douay-Rheims Bible, Aquinas, Augustine, Aristotle, Summa Contra Gentiles, Catena Aurea, the Catechism, encyclicals, and the classical canon", icon: "📖" },
      { href: "/veritas/summa", title: "Summa Theologiae", desc: "The complete Summa — 5 parts, 611 questions, 3,115 articles — browsable by Objection, Contrary, Answer, and Reply", icon: "🏛️" },
      { href: "/veritas/reading-guide", title: "Reading Guide", desc: "Where should I start? Three curated paths — beginner, intermediate, advanced — through the library", icon: "🧭" },
    ],
  },
  {
    id: "deep-dives",
    label: "Deep Dives",
    icon: "🔬",
    stations: [
      { href: "/veritas/catholic-vs-lutheran", title: "Catholic vs. Lutheran", desc: "Authority, justification, sacraments, the Eucharist — both sides' arguments, Aquinas, and the Catechism", icon: "⚔️" },
      { href: "/veritas/church-teaching/homosexuality", title: "Church Teaching: Homosexuality", desc: "CCC 2357-2359, Aquinas, magisterial documents, pastoral care, terminology, and honest objections", icon: "✝️" },
      { href: "/veritas/denominations", title: "Denominations", desc: "12 Christian traditions — beliefs, history, and how to engage each one", icon: "🌐" },
    ],
  },
  {
    id: "doctrine",
    label: "Doctrine & History",
    icon: "📜",
    stations: [
      { href: "/veritas/glossary", title: "Glossary", desc: "343 theological and philosophical terms, plain English with progressive depth", icon: "📚" },
      { href: "/veritas/natural-law", title: "Natural Law", desc: "12 topics — from the existence of natural law to double effect — with Aquinas and modern application", icon: "⚖️" },
      { href: "/veritas/virtues", title: "Virtues", desc: "The cardinal and theological virtues, and the vices opposed to them", icon: "👼" },
      { href: "/veritas/sacraments", title: "Sacraments", desc: "All seven sacraments — matter, form, minister, and effects", icon: "✨" },
      { href: "/veritas/councils", title: "Ecumenical Councils", desc: "All 21 councils from Nicaea to Vatican II — what each one defined and why", icon: "📜" },
      { href: "/veritas/heresies", title: "Heresies", desc: "20 heresies, their core claims, and how the Church refuted each one", icon: "⚠️" },
      { href: "/veritas/saints", title: "Doctors of the Church", desc: "36 Doctors — their lives, works, and theological contributions", icon: "⛪" },
      { href: "/veritas/timeline", title: "Timeline", desc: "349 events across Church history — philosophy, councils, heresies, and the papacy, chronologically", icon: "📅" },
      { href: "/veritas/typology", title: "Typology", desc: "Old Testament types and their New Testament fulfillments", icon: "🔗" },
      { href: "/veritas/prophecy", title: "Prophecy", desc: "Messianic prophecies — Old Testament source, New Testament fulfillment", icon: "📯" },
      { href: "/veritas/scripture-index", title: "Scripture Index", desc: "Disputed verses — the Protestant claim and the Catholic response, verse by verse", icon: "📑" },
      { href: "/veritas/aquinas-life", title: "Aquinas: Life & Works", desc: "A chronological life of St. Thomas plus his complete literary corpus", icon: "🪶" },
    ],
  },
  {
    id: "apologetics",
    label: "Apologetics Toolkit",
    icon: "🛡️",
    stations: [
      { href: "/veritas/debate-playbook", title: "Debate Playbook", desc: "Method, strategy, and tone for live apologetics — the Socratic method in practice", icon: "📘" },
      { href: "/veritas/critics", title: "Critics & Responses", desc: "15 famous critics of the faith — from New Atheism to biblical scholarship — with Thomistic responses", icon: "🗣️" },
      { href: "/veritas/myths", title: "Myths Debunked", desc: "Common historical and doctrinal myths, corrected with sources", icon: "🔍" },
      { href: "/veritas/analogies", title: "Analogies", desc: "Teaching analogies for hard doctrines — with their limits and heresy warnings", icon: "🪞" },
      { href: "/veritas/oneliners", title: "One-Liners", desc: "Quick, quotable lines organized by topic", icon: "⚡" },
      { href: "/veritas/grounding-arguments", title: "Grounding Arguments", desc: "22 arguments — the case you stand on when the feelings are gone", icon: "⚓" },
      { href: "/veritas/quickdraw", title: "Quickdraw", desc: "Rapid-fire drill: objection in, short + full response out, with verses and Aquinas references", icon: "🏹" },
    ],
  },
  {
    id: "growth",
    label: "Growth & Practice",
    icon: "🌱",
    stations: [
      { href: "/veritas/courses", title: "Courses", desc: "Structured learning paths, beginner through advanced, with lessons and study questions", icon: "🎓" },
      { href: "/veritas/doubt", title: "When You Doubt", desc: "Pastoral guidance for ten struggles — intellectual doubt, spiritual dryness, scandal, the problem of evil, and more", icon: "🙏" },
      { href: "/veritas/saved", title: "Saved Arguments", desc: "Your personal library of saved apologetics arguments", icon: "💾" },
      { href: "/veritas/plans", title: "Reading Plans", desc: "Structured day-by-day study paths, from a week to ninety days", icon: "🗓️" },
    ],
  },
];

export default function VeritasHub() {
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const filteredSections = q
    ? SECTIONS.map((s) => ({
        ...s,
        stations: s.stations.filter(
          (st) => st.title.toLowerCase().includes(q) || st.desc.toLowerCase().includes(q)
        ),
      })).filter((s) => s.stations.length > 0)
    : SECTIONS;

  const totalStations = SECTIONS.reduce((n, s) => n + s.stations.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-stone-100 mb-1">Veritas</h1>
      <p className="text-sm text-stone-500 mb-5">
        Catholic theology &amp; apologetics, grounded in the complete works of St. Thomas Aquinas — {totalStations} stations across AI tools, full texts, and reference catalogs.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search all of Veritas..."
        className="mb-6 w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
      />

      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.id}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm">{section.icon}</span>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-600">{section.label}</h2>
              <span className="text-[10px] text-stone-700">{section.stations.length}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.stations.map((s) => (
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
        ))}
        {filteredSections.length === 0 && (
          <p className="text-sm text-stone-600">No stations match &ldquo;{search}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
