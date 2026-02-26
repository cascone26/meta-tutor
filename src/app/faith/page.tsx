"use client";

import { useState } from "react";

type Connection = {
  concept: string;
  category: string;
  doctrine: string;
  scripture: string;
  ccc: string;
  explanation: string;
};

const connections: Connection[] = [
  {
    concept: "Hylomorphism",
    category: "Thomism",
    doctrine: "Transubstantiation (the Eucharist)",
    scripture: "Matthew 26:26",
    ccc: "CCC 1376",
    explanation:
      "Transubstantiation is only intelligible through hylomorphism. In the Eucharist, the accidents (appearance, taste, smell) of bread and wine remain, but the substance is truly changed into the Body and Blood of Christ. Without the form/matter distinction, this doctrine cannot be coherently stated — it would collapse into either a merely symbolic presence or a crude physical replacement.",
  },
  {
    concept: "Act and Potency",
    category: "Thomism",
    doctrine: "God as Pure Act (Actus Purus)",
    scripture: "Exodus 3:14",
    ccc: "CCC 202",
    explanation:
      "God reveals His name as 'I AM WHO AM' — He is existence itself, not a being that receives existence. In Thomistic terms, God is Pure Act: He has no potency, no unrealized capacity, no dependence on anything outside Himself. Every creature is a mixture of act and potency — it IS something, but it could be otherwise. God alone is wholly actual, and this is why He is the uncaused cause and why He cannot change or cease to be.",
  },
  {
    concept: "Forms (Eidos)",
    category: "Plato",
    doctrine: "Divine Ideas in the Mind of God",
    scripture: "John 1:3",
    ccc: "CCC 295",
    explanation:
      "Plato held that the Forms are eternal, perfect archetypes that exist independently. Christian philosophy baptized this insight: the eternal archetypes exist not as a separate realm, but as ideas in the mind of God. 'All things were made through Him' (John 1:3) — creation follows the divine ideas. God knows what a dog is perfectly because He knows His own essence as imitable in that way. This grounding gives the Forms a personal home rather than an impersonal Platonic heaven.",
  },
  {
    concept: "Transcendentals",
    category: "Thomism",
    doctrine: "The Beauty, Truth, and Goodness of God",
    scripture: "Psalm 19:1",
    ccc: "CCC 41",
    explanation:
      "Being, one, true, good, and beautiful are convertible — wherever there is being, there are these properties. God, as the fullness of being (ipsum esse subsistens), is therefore infinite truth, infinite goodness, and infinite beauty. Creation reflects these transcendentals imperfectly: 'The heavens declare the glory of God' (Ps 19:1). The natural human drive toward beauty, truth, and goodness is ultimately a drive toward God, whether or not the person recognizes it as such.",
  },
  {
    concept: "Substance and Accident",
    category: "Thomism",
    doctrine: "The Human Person and the Soul",
    scripture: "Genesis 2:7",
    ccc: "CCC 362–365",
    explanation:
      "The human person is a substantial unity of body and soul — not a soul imprisoned in a body, but a single hylomorphic substance. The soul is the substantial form of the body. Death is the violent separation of these co-principles. The resurrection is the restoration of the full substance — not just the soul's continuation but the body's reunion with it. This grounds the Catholic insistence that bodily life, health, and the resurrection of the body are not peripheral but essential to human dignity.",
  },
  {
    concept: "Principle of Non-Contradiction",
    category: "Thomism",
    doctrine: "The Reliability of Divine Revelation",
    scripture: "John 14:6",
    ccc: "CCC 215",
    explanation:
      "God is truth itself ('I am the way, the truth, and the life') and cannot contradict Himself. The Principle of Non-Contradiction — that a thing cannot both be and not be — is not merely a human logical rule but is grounded in being itself, and God is the fullness of being. This is why divine revelation cannot contradict itself and why faith and reason cannot ultimately conflict: both have their origin in the God who is truth.",
  },
  {
    concept: "Drive to Know / Intelligibility",
    category: "Thomism",
    doctrine: "Natural Knowledge of God",
    scripture: "Romans 1:20",
    ccc: "CCC 36",
    explanation:
      "'Ever since the creation of the world His invisible nature... has been clearly perceived in the things that have been made' (Rom 1:20). The drive to know, which demands the intelligibility of being, naturally leads the mind from effect to cause — from the intelligible order of creation to its intelligent source. The Church teaches that God can be known with certainty by natural reason from created things. Metaphysics is the philosophical foundation of this natural theology.",
  },
  {
    concept: "Participation",
    category: "Plato / Thomism",
    doctrine: "Creation as Participation in God's Being",
    scripture: "Acts 17:28",
    ccc: "CCC 294",
    explanation:
      "'In Him we live and move and have our being' (Acts 17:28). Aquinas developed the Platonic notion of participation: creatures do not have existence of themselves but receive it from God, who alone IS existence. Every creature participates in being — it has existence as a gift, not as a possession. This is the deepest meaning of creation: not that God made things and stepped back, but that creatures are continually sustained in being by participation in God's act of being.",
  },
  {
    concept: "Prime Matter / Individuation",
    category: "Thomism",
    doctrine: "The Uniqueness of Each Human Person",
    scripture: "Jeremiah 1:5",
    ccc: "CCC 357",
    explanation:
      "'Before I formed you in the womb I knew you' (Jer 1:5). Prime matter as the principle of individuation explains why Socrates and Plato, though both human, are distinct persons — each has their own matter. Applied theologically: each human person is a unique individual, known personally by God before creation. The immaterial intellect and will further distinguish persons, and angels — purely immaterial — are each their own species. God's personal love is directed to each unique individual, not just to human nature in the abstract.",
  },
  {
    concept: "Cause to Effect / Effect to Cause",
    category: "Aristotle",
    doctrine: "The Five Ways (Proofs for God's Existence)",
    scripture: "Wisdom 13:1–5",
    ccc: "CCC 31–32",
    explanation:
      "Aquinas's Five Ways are precisely arguments from effect to cause: from motion to an Unmoved Mover, from caused things to an Uncaused Cause, from contingent beings to a Necessary Being, from degrees of perfection to the Maximum, and from order in nature to an Intelligent Designer. Aristotle showed that reasoning from effect to cause is of special value in metaphysics because we encounter effects before their causes. The Five Ways apply this method to demonstrate God's existence from observable features of the world.",
  },
  {
    concept: "Being as Being",
    category: "Aristotle",
    doctrine: "Theology as the Queen of Sciences",
    scripture: "Colossians 2:3",
    ccc: "CCC 159",
    explanation:
      "Metaphysics studies being as being — the most universal and foundational science. Theology studies being as divinely revealed — it presupposes and perfects metaphysics. 'In Him are hidden all the treasures of wisdom and knowledge' (Col 2:3). Faith does not destroy reason but elevates it. The medievals called theology the Queen of Sciences not because it ignores reason, but because it takes the truths reason has discovered and illuminates them with the light of revelation, including truths reason could never reach on its own (the Trinity, the Incarnation).",
  },
  {
    concept: "Allegory of the Cave",
    category: "Plato",
    doctrine: "Conversion and Enlightenment by Grace",
    scripture: "John 8:12",
    ccc: "CCC 1697",
    explanation:
      "'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life' (John 8:12). The freed prisoner who ascends from the cave to the light of the sun prefigures the soul's journey from ignorance to truth. In the Christian reading, the Sun is Christ — the light that makes all things visible and the Form of the Good now personally encountered. Conversion (metanoia) is the turning of the whole person from shadows to light, from sin to truth. Grace is what enables the turn that the soul cannot make by its own power alone.",
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Thomism: { bg: "var(--accent-light)", text: "var(--accent)" },
  Plato: { bg: "#e8f0fe", text: "#4a7ab5" },
  "Plato / Thomism": { bg: "#f3e8fe", text: "#7a4ab5" },
  Aristotle: { bg: "#e8f5e9", text: "#2d6a30" },
};

export default function FaithPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Thomism", "Aristotle", "Plato", "Plato / Thomism"];
  const filtered = filter === "All" ? connections : connections.filter((c) => c.category === filter);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Philosophy &amp; Faith
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            How the concepts of metaphysics connect to Catholic doctrine and Sacred Scripture.
          </p>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{
                  background: filter === cat ? "var(--accent)" : "var(--surface)",
                  color: filter === cat ? "#fff" : "var(--muted)",
                  border: `1px solid ${filter === cat ? "transparent" : "var(--border)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Connections list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {filtered.map((conn, i) => {
            const color = categoryColors[conn.category] ?? { bg: "var(--accent-light)", text: "var(--accent)" };
            const isOpen = expanded === i;

            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all"
                style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full text-left px-4 py-3.5 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                        style={{ background: color.bg, color: color.text }}
                      >
                        {conn.category}
                      </span>
                      <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                        {conn.scripture}
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {conn.concept}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                      {conn.doctrine}
                    </p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 mt-1 transition-transform"
                    style={{
                      color: "var(--muted)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Expanded explanation */}
                {isOpen && (
                  <div
                    className="px-4 pb-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="rounded-lg p-3 mt-3 mb-3"
                      style={{ background: "var(--accent-light)" }}
                    >
                      <p className="text-xs font-medium" style={{ color: color.text }}>
                        {conn.ccc} &middot; {conn.scripture}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {conn.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
