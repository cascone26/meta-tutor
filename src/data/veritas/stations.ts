export interface Station {
  href: string;
  title: string;
  desc: string;
  icon: string;
  glyph: string;
}

export interface Section {
  id: string;
  label: string;
  icon: string;
  glyph: string;
  stations: Station[];
}

export const SECTIONS: Section[] = [
  {
    id: "ai-tools",
    label: "AI Tools",
    icon: "💬",
    glyph: "spark",
    stations: [
      { href: "/veritas/ask", title: "Ask Aquinas", desc: "AI chat grounded in the complete works of Aquinas, with live citations", icon: "💬", glyph: "dot" },
      { href: "/veritas/daily", title: "Daily Question", desc: "A new theology question every day to sharpen your mind", icon: "📆", glyph: "frame" },
      { href: "/veritas/flashcards", title: "Flashcards", desc: "Generate and review with spaced repetition", icon: "🃏", glyph: "card" },
      { href: "/veritas/objection", title: "Objection Handler", desc: "Paste any anti-Catholic argument, get a structured Thomistic response", icon: "🛡️", glyph: "shield" },
      { href: "/veritas/debate", title: "Debate Prep", desc: "A full briefing on any topic against any opponent type", icon: "🎯", glyph: "rings" },
      { href: "/veritas/simulator", title: "Debate Simulator", desc: "Live back-and-forth chat with an AI opponent — atheist, Protestant, Muslim, Orthodox, or secular — who actually pushes back", icon: "⚔️", glyph: "chevrons" },
    ],
  },
  {
    id: "library",
    label: "Library & Full Texts",
    icon: "📖",
    glyph: "book",
    stations: [
      { href: "/veritas/library", title: "Library", desc: "210+ full texts on site — the complete Douay-Rheims Bible, Aquinas, Augustine, Aristotle, Summa Contra Gentiles, Catena Aurea, the Catechism, encyclicals, and the classical canon", icon: "📖", glyph: "book" },
      { href: "/veritas/summa", title: "Summa Theologiae", desc: "The complete Summa — 5 parts, 611 questions, 3,115 articles — browsable by Objection, Contrary, Answer, and Reply", icon: "🏛️", glyph: "hex" },
      { href: "/veritas/reading-guide", title: "Reading Guide", desc: "Where should I start? Three curated paths — beginner, intermediate, advanced — through the library", icon: "🧭", glyph: "triangle" },
    ],
  },
  {
    id: "deep-dives",
    label: "Deep Dives",
    icon: "🔬",
    glyph: "diamond",
    stations: [
      { href: "/veritas/catholic-vs-lutheran", title: "Catholic vs. Lutheran", desc: "Authority, justification, sacraments, the Eucharist — both sides' arguments, Aquinas, and the Catechism", icon: "⚔️", glyph: "chevrons" },
      { href: "/veritas/church-teaching/homosexuality", title: "Church Teaching: Homosexuality", desc: "CCC 2357-2359, Aquinas, magisterial documents, pastoral care, terminology, and honest objections", icon: "✝️", glyph: "cross" },
      { href: "/veritas/denominations", title: "Denominations", desc: "12 Christian traditions — beliefs, history, and how to engage each one", icon: "🌐", glyph: "venn" },
    ],
  },
  {
    id: "doctrine",
    label: "Doctrine & History",
    icon: "📜",
    glyph: "frame",
    stations: [
      { href: "/veritas/glossary", title: "Glossary", desc: "343 theological and philosophical terms, plain English with progressive depth", icon: "📚", glyph: "card" },
      { href: "/veritas/natural-law", title: "Natural Law", desc: "12 topics — from the existence of natural law to double effect — with Aquinas and modern application", icon: "⚖️", glyph: "brackets" },
      { href: "/veritas/virtues", title: "Virtues", desc: "The cardinal and theological virtues, and the vices opposed to them", icon: "👼", glyph: "diamond" },
      { href: "/veritas/sacraments", title: "Sacraments", desc: "All seven sacraments — matter, form, minister, and effects", icon: "✨", glyph: "rings" },
      { href: "/veritas/councils", title: "Ecumenical Councils", desc: "All 21 councils from Nicaea to Vatican II — what each one defined and why", icon: "📜", glyph: "hex" },
      { href: "/veritas/heresies", title: "Heresies", desc: "20 heresies, their core claims, and how the Church refuted each one", icon: "⚠️", glyph: "bolt" },
      { href: "/veritas/saints", title: "Doctors of the Church", desc: "36 Doctors — their lives, works, and theological contributions", icon: "⛪", glyph: "diamond" },
      { href: "/veritas/timeline", title: "Timeline", desc: "349 events across Church history — philosophy, councils, heresies, and the papacy, chronologically", icon: "📅", glyph: "bars" },
      { href: "/veritas/typology", title: "Typology", desc: "Old Testament types and their New Testament fulfillments", icon: "🔗", glyph: "venn" },
      { href: "/veritas/prophecy", title: "Prophecy", desc: "Messianic prophecies — Old Testament source, New Testament fulfillment", icon: "📯", glyph: "triangle" },
      { href: "/veritas/scripture-index", title: "Scripture Index", desc: "Disputed verses — the Protestant claim and the Catholic response, verse by verse", icon: "📑", glyph: "frame" },
      { href: "/veritas/aquinas-life", title: "Aquinas: Life & Works", desc: "A chronological life of St. Thomas plus his complete literary corpus", icon: "🪶", glyph: "dot" },
    ],
  },
  {
    id: "apologetics",
    label: "Apologetics Toolkit",
    icon: "🛡️",
    glyph: "shield",
    stations: [
      { href: "/veritas/debate-playbook", title: "Debate Playbook", desc: "Method, strategy, and tone for live apologetics — the Socratic method in practice", icon: "📘", glyph: "book" },
      { href: "/veritas/critics", title: "Critics & Responses", desc: "15 famous critics of the faith — from New Atheism to biblical scholarship — with Thomistic responses", icon: "🗣️", glyph: "chevrons" },
      { href: "/veritas/myths", title: "Myths Debunked", desc: "Common historical and doctrinal myths, corrected with sources", icon: "🔍", glyph: "rings" },
      { href: "/veritas/analogies", title: "Analogies", desc: "Teaching analogies for hard doctrines — with their limits and heresy warnings", icon: "🪞", glyph: "venn" },
      { href: "/veritas/oneliners", title: "One-Liners", desc: "Quick, quotable lines organized by topic", icon: "⚡", glyph: "bolt" },
      { href: "/veritas/grounding-arguments", title: "Grounding Arguments", desc: "22 arguments — the case you stand on when the feelings are gone", icon: "⚓", glyph: "brackets" },
      { href: "/veritas/quickdraw", title: "Quickdraw", desc: "Rapid-fire drill: objection in, short + full response out, with verses and Aquinas references", icon: "🏹", glyph: "bolt" },
    ],
  },
  {
    id: "growth",
    label: "Growth & Practice",
    icon: "🌱",
    glyph: "bars",
    stations: [
      { href: "/veritas/courses", title: "Courses", desc: "Structured learning paths, beginner through advanced, with lessons and study questions", icon: "🎓", glyph: "hex" },
      { href: "/veritas/doubt", title: "When You Doubt", desc: "Pastoral guidance for ten struggles — intellectual doubt, spiritual dryness, scandal, the problem of evil, and more", icon: "🙏", glyph: "rings" },
      { href: "/veritas/saved", title: "Saved Arguments", desc: "Your personal library of saved apologetics arguments", icon: "💾", glyph: "card" },
      { href: "/veritas/plans", title: "Reading Plans", desc: "Structured day-by-day study paths, from a week to ninety days", icon: "🗓️", glyph: "bars" },
    ],
  },
];
