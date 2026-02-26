export type FaithConnection = {
  id: number;
  concept: string;
  category: string;
  doctrine: string;
  connection: string;
  catechismRef?: string;
  scriptureRef?: string;
};

export const faithConnections: FaithConnection[] = [
  {
    id: 1,
    concept: "Hylomorphism",
    category: "Thomism",
    doctrine: "Transubstantiation (the Eucharist)",
    connection: "Hylomorphism — the unity of form and matter — is essential to understanding the Eucharist. In transubstantiation, the substance (form + matter) of the bread and wine is wholly converted into the substance of Christ's Body and Blood, while the accidents (appearances) remain. Without the Aristotelian-Thomistic distinction between substance and accidents, this central mystery of the faith cannot be philosophically articulated. The Council of Trent explicitly used this framework.",
    catechismRef: "CCC 1373-1377",
    scriptureRef: "Matthew 26:26 — \"This is my body.\"",
  },
  {
    id: 2,
    concept: "Act and Potency",
    category: "Thomism",
    doctrine: "God as Pure Act (Actus Purus)",
    connection: "If every finite being is composed of act and potency, then a being with no potency — no unrealized capacity, no limitation — would be infinite, unchanging, and perfect. Aquinas identifies this being as God: Pure Act with no admixture of potency. This is why God cannot change, cannot be improved, and is the source of all perfection. Every creature has potency (can change, is limited); God alone is fully actual.",
    catechismRef: "CCC 268-271",
    scriptureRef: "Exodus 3:14 — \"I AM WHO I AM.\"",
  },
  {
    id: 3,
    concept: "Forms (Eidos)",
    category: "Plato",
    doctrine: "Divine Ideas in the Mind of God",
    connection: "While the Church does not accept Plato's separate realm of Forms, the Augustinian-Thomistic tradition transforms this insight: the eternal archetypes of all things exist in the mind of God as divine ideas. God knows all possible creatures through His own essence, and these ideas are the exemplar causes of all created things. Plato glimpsed something true — eternal patterns behind changing things — but located them in the wrong place. They exist in God, not in a separate realm.",
    catechismRef: "CCC 295-301",
    scriptureRef: "John 1:3 — \"Through him all things were made.\"",
  },
  {
    id: 4,
    concept: "Transcendentals",
    category: "Thomism",
    doctrine: "The Beauty, Truth, and Goodness of God",
    connection: "Every being, insofar as it exists, is one, true, and good. These transcendental properties are convertible with being itself. Since God is the fullness of being (Pure Act), He is also the fullness of unity, truth, and goodness. Beauty is traditionally added as a fourth transcendental — the splendor of truth and goodness together. When we are drawn to beauty, truth, or goodness in any creature, we are being drawn toward God, who is their ultimate source.",
    catechismRef: "CCC 32, 41, 2500",
    scriptureRef: "Psalm 19:1 — \"The heavens declare the glory of God.\"",
  },
  {
    id: 5,
    concept: "Substance and Accident",
    category: "Thomism",
    doctrine: "The Human Person and the Soul",
    connection: "The distinction between substance (what a thing is in itself) and accident (properties it has) is essential to Catholic anthropology. The human soul is the substantial form of the body — not an accident, not a separate substance trapped in a body, but the very principle that makes a human being human. This is why the Church teaches bodily resurrection: the soul without the body is incomplete. The person is a unity of soul and body, not a ghost in a machine.",
    catechismRef: "CCC 362-368",
    scriptureRef: "Genesis 2:7 — \"The Lord God formed man from the dust of the ground and breathed into his nostrils the breath of life.\"",
  },
  {
    id: 6,
    concept: "Principle of Non-Contradiction",
    category: "Thomism",
    doctrine: "The Reliability of Divine Revelation",
    connection: "If contradictions could be true, then God's revelation would be meaningless — any statement and its denial could both hold. The principle of non-contradiction grounds the very possibility of divine truth being communicated to human minds. God, who is Truth itself, cannot contradict Himself. This is why faith and reason can never truly conflict: both come from the same God who is the source of all intelligibility.",
    catechismRef: "CCC 156-159",
    scriptureRef: "John 14:6 — \"I am the way, the truth, and the life.\"",
  },
  {
    id: 7,
    concept: "Drive to Know / Intelligibility",
    category: "Thomism",
    doctrine: "Natural Knowledge of God",
    connection: "The human drive to know and the intelligibility of all being together point toward God. If every being is intelligible (can be known), and if the human mind is naturally ordered toward knowing, then the mind is ultimately ordered toward knowing Being itself — God. Aquinas argues that natural reason can know God exists, even without revelation. The restlessness of the intellect, always seeking deeper understanding, finds its fulfillment only in the vision of God.",
    catechismRef: "CCC 27-35",
    scriptureRef: "Romans 1:20 — \"His invisible attributes... have been clearly perceived... in the things that have been made.\"",
  },
  {
    id: 8,
    concept: "Participation",
    category: "Plato",
    doctrine: "Creation as Participation in God's Being",
    connection: "Aquinas transformed Plato's participation doctrine: creatures do not participate in abstract Forms but in the very being of God. Every creature has being, but none IS being — only God is His own existence (ipsum esse subsistens). Creatures receive their existence from God and participate in His perfections in limited ways. A flower's beauty participates in God's beauty; a person's goodness participates in God's goodness. All of creation is a reflection of the Creator.",
    catechismRef: "CCC 293-295",
    scriptureRef: "Acts 17:28 — \"In him we live and move and have our being.\"",
  },
  {
    id: 9,
    concept: "Prime Matter / Individuation",
    category: "Thomism",
    doctrine: "The Uniqueness of Each Human Person",
    connection: "The principle of individuation explains why two beings with the same nature (e.g., two humans) are nevertheless distinct individuals. For Aquinas, designated matter individuates — but for angels (pure forms without matter), each angel is its own species. This has profound implications: each human person is not a replaceable instance of 'human nature' but a unique individual willed into existence by God. Your individuality is not an accident but part of God's creative intention.",
    catechismRef: "CCC 357, 2258",
    scriptureRef: "Jeremiah 1:5 — \"Before I formed you in the womb I knew you.\"",
  },
  {
    id: 10,
    concept: "Cause to Effect / Effect to Cause",
    category: "Aristotle",
    doctrine: "The Five Ways (Proofs for God's Existence)",
    connection: "Aquinas's Five Ways all use effect-to-cause reasoning — exactly the method Aristotle said was especially valuable in metaphysics. We observe motion, causation, contingency, degrees of perfection, and order in the world (effects), and reason back to a First Mover, First Cause, Necessary Being, Most Perfect Being, and Intelligent Designer (God). This is natural theology: reaching God through reason, starting from what we can observe.",
    catechismRef: "CCC 31-35",
    scriptureRef: "Wisdom 13:1-5 — \"From the greatness and beauty of created things comes a corresponding perception of their Creator.\"",
  },
  {
    id: 11,
    concept: "Being as Being",
    category: "Aristotle",
    doctrine: "Theology as the Queen of Sciences",
    connection: "If metaphysics studies being as being — the most universal subject — then it naturally points beyond itself to the highest being: God. Aquinas saw philosophy and theology as complementary: philosophy studies being by reason, theology studies God through revelation. Since God is the ultimate cause of all being, theology completes what metaphysics begins. This is why the Church has always valued philosophy — not as a rival to faith, but as its handmaid.",
    catechismRef: "CCC 156-159",
    scriptureRef: "Colossians 2:3 — \"In whom are hidden all the treasures of wisdom and knowledge.\"",
  },
  {
    id: 12,
    concept: "Allegory of the Cave",
    category: "Plato",
    doctrine: "Conversion and Enlightenment by Grace",
    connection: "The freed prisoner's painful journey from shadows to sunlight mirrors the soul's journey from sin to grace. Just as the prisoner must be 'turned around' (Plato's word is periagoge — conversion), the sinner must be converted by grace to see reality as it truly is. The 'sun' in Plato's allegory corresponds to the Form of the Good; for Christians, it corresponds to God Himself, who is the light that illuminates all truth. Coming to faith is like leaving the cave.",
    catechismRef: "CCC 1427-1429",
    scriptureRef: "John 8:12 — \"I am the light of the world.\"",
  },
];
