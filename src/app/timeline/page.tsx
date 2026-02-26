"use client";

const philosophers = [
  {
    name: "Parmenides",
    years: "c. 515–450 BC",
    era: "Pre-Socratic",
    color: "#8b6ba7",
    key: "Reality is one, unchanging, and indivisible. Change is illusion.",
    concepts: ["Radical Monism", "Being vs. Non-Being", "The Way of Truth"],
    influence: "Challenged all later philosophers to account for change and multiplicity.",
  },
  {
    name: "Heraclitus",
    years: "c. 535–475 BC",
    era: "Pre-Socratic",
    color: "#c96b6b",
    key: "Everything is in flux. Unity emerges from the tension of opposites.",
    concepts: ["Flux", "Logos", "Unity of Opposites"],
    influence: "Highlighted the reality of change, which Aristotle would later reconcile with permanence.",
  },
  {
    name: "Plato",
    years: "c. 428–348 BC",
    era: "Classical",
    color: "#6b8fbf",
    key: "True reality consists of eternal, perfect Forms. The material world is a realm of imperfect copies.",
    concepts: ["Forms (Eidos)", "Divided Line", "Allegory of the Cave", "Participation", "Realm of Forms"],
    influence: "Established the fundamental distinction between appearance and reality. His theory of Forms shaped all subsequent metaphysics.",
  },
  {
    name: "Aristotle",
    years: "384–322 BC",
    era: "Classical",
    color: "#6ab070",
    key: "Being is said in many ways. Knowledge begins with experience. Form and matter together compose reality.",
    concepts: ["Being as Being", "Categories", "Hylomorphism", "Four Causes", "Act & Potency", "Syllogism"],
    influence: "Created the framework that Aquinas would baptize into Christian philosophy. His metaphysics remains the backbone of Thomistic thought.",
  },
  {
    name: "Plotinus",
    years: "204–270 AD",
    era: "Late Antiquity",
    color: "#bf8f6b",
    key: "All reality emanates from the One — an ineffable, transcendent source beyond being and thought.",
    concepts: ["The One", "Emanation", "Nous (Intellect)", "Soul", "Return to the One"],
    influence: "Neoplatonism deeply influenced Augustine and early Christian theology. His hierarchical metaphysics shaped medieval thought.",
  },
  {
    name: "St. Augustine",
    years: "354–430 AD",
    era: "Patristic",
    color: "#c67db7",
    key: "Truth is discovered through divine illumination. God is Being itself, the source of all that exists.",
    concepts: ["Divine Illumination", "Evil as Privation", "City of God", "Original Sin", "Free Will"],
    influence: "Synthesized Neoplatonism with Christianity. Dominated Western theology until the Aristotelian revival.",
  },
  {
    name: "Boethius",
    years: "c. 477–524 AD",
    era: "Late Antiquity",
    color: "#6b9fbf",
    key: "Translated and preserved Aristotelian logic for the Latin West. Explored the consolation of philosophy in suffering.",
    concepts: ["Universals", "Person as Individual Substance", "Providence vs. Fate", "Eternity vs. Time"],
    influence: "His translations made Aristotle's logic available to medieval thinkers. His definition of 'person' influenced Aquinas.",
  },
  {
    name: "St. Anselm",
    years: "1033–1109 AD",
    era: "Early Scholastic",
    color: "#d4a843",
    key: "God is that than which nothing greater can be thought. Faith seeking understanding.",
    concepts: ["Ontological Argument", "Fides Quaerens Intellectum", "Proslogion"],
    influence: "Pioneered rational theology. His ontological argument remains debated to this day.",
  },
  {
    name: "St. Thomas Aquinas",
    years: "1225–1274 AD",
    era: "High Scholastic",
    color: "#e07c4f",
    key: "Being is the first thing the intellect grasps. God is Ipsum Esse Subsistens — Subsistent Being Itself. Grace perfects nature.",
    concepts: ["Act & Potency", "Essence & Existence", "Five Ways", "Transcendentals", "Hylomorphism", "Analogy of Being", "Natural Law"],
    influence: "The Angelic Doctor. Synthesized Aristotelian philosophy with Christian revelation. His thought is the gold standard of Catholic philosophy.",
  },
  {
    name: "Bl. Duns Scotus",
    years: "1266–1308 AD",
    era: "Late Scholastic",
    color: "#7c6b9a",
    key: "Being is univocal — said in one sense of God and creatures. Individual things have a 'thisness' (haecceity).",
    concepts: ["Univocity of Being", "Haecceity", "Formal Distinction", "Immaculate Conception Defense"],
    influence: "Challenged Thomistic analogy with his univocity thesis. His haecceity offered an alternative to matter as principle of individuation.",
  },
  {
    name: "William of Ockham",
    years: "c. 1287–1347 AD",
    era: "Late Scholastic",
    color: "#9a7c6b",
    key: "Do not multiply entities beyond necessity. Universals are merely names — only individuals exist.",
    concepts: ["Ockham's Razor", "Nominalism", "Voluntarism"],
    influence: "His nominalism undercut the realist metaphysics of Aquinas and set the stage for modern philosophy's turn away from classical metaphysics.",
  },
];

export default function TimelinePage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Philosopher Timeline</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          From the Pre-Socratics to the Scholastics — the thinkers who built the metaphysical tradition.
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{ background: "var(--border)" }} />

          <div className="space-y-4">
            {philosophers.map((p, i) => (
              <div key={p.name} className="relative flex gap-4">
                {/* Dot */}
                <div
                  className="w-[37px] h-[37px] rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold"
                  style={{ background: p.color + "20", border: `2px solid ${p.color}`, color: p.color }}
                >
                  {i + 1}
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-xl p-4"
                  style={{ background: "var(--surface)", border: `1px solid var(--border)` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{p.name}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: p.color + "18", color: p.color }}>{p.era}</span>
                    </div>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{p.years}</p>
                  <p className="text-sm mb-3" style={{ color: "var(--foreground)", lineHeight: 1.6 }}>{p.key}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.concepts.map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{c}</span>
                    ))}
                  </div>

                  <p className="text-xs italic" style={{ color: "var(--muted)", lineHeight: 1.5 }}>{p.influence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
