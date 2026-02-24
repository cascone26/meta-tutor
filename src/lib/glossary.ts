export type GlossaryTerm = {
  term: string;
  definition: string;
  category: string;
};

export const glossary: GlossaryTerm[] = [
  // Plato
  { term: "Eikasia", definition: "The state of illusion — the lowest section of Plato's Divided Line. The realm of shadows, reflections, and images; the furthest state from truth.", category: "Plato" },
  { term: "Pistis", definition: "The state of belief — the second section of the Divided Line. The realm of physical objects, animals, and man-made items perceived through the senses.", category: "Plato" },
  { term: "Dianoia", definition: "The state of mathematical reasoning — the third section of the Divided Line. The realm of mathematical forms and geometry; second closest to truth.", category: "Plato" },
  { term: "Noesis", definition: "The state of pure intelligence — the highest section of the Divided Line. The realm of pure ideas, the Forms (eidos), and philosophy; closest to truth.", category: "Plato" },
  { term: "Doxa", definition: "Opinion — the result of the visible realm (eikasia + pistis). Not true knowledge, but belief based on appearances.", category: "Plato" },
  { term: "Episteme", definition: "Knowledge — the result of the intelligible realm (dianoia + noesis). True, justified understanding reached through reason.", category: "Plato" },
  { term: "Divided Line", definition: "Plato's model from Republic Book 6 dividing reality into four levels: illusion, belief, mathematical reasoning, and pure intelligence — moving from appearances to truth.", category: "Plato" },
  { term: "Allegory of the Cave", definition: "Plato's parable from Republic Book 7 illustrating the journey from ignorance (shadows on a cave wall) to enlightenment (seeing the sun/Form of the Good).", category: "Plato" },
  { term: "Forms (Eidos)", definition: "For Plato, the eternal, unchanging, perfect archetypes of which physical things are imperfect copies. Accessible through the mind, not the senses.", category: "Plato" },
  { term: "Realm of Forms", definition: "The intelligible world of perfect, eternal realities that exist independently of the physical world. The source of all truth and knowledge for Plato.", category: "Plato" },
  { term: "Realm of Copies", definition: "The visible, material world of imperfect, changing things that participate in or imitate the Forms.", category: "Plato" },
  { term: "Participation", definition: "Plato's doctrine that physical things share in or participate in the Forms, which is why they have the properties they do.", category: "Plato" },

  // Aristotle
  { term: "Saving the Appearances", definition: "Aristotle's methodology: verifying philosophical claims by checking them against common beliefs and observable experience. A theory must account for what we actually observe.", category: "Aristotle" },
  { term: "Syllogism", definition: "A form of deductive reasoning consisting of two premises and a conclusion, each containing a subject, copula, and predicate. Aristotle's primary logical tool.", category: "Aristotle" },
  { term: "Subject", definition: "In a proposition, what the belief is about (e.g., 'Socrates' in 'Socrates is philosophical').", category: "Aristotle" },
  { term: "Copula", definition: "The 'is' in a proposition that links subject to predicate, expressing that the predicate is true of the subject.", category: "Aristotle" },
  { term: "Predicate", definition: "In a proposition, the property or attribute ascribed to the subject (e.g., 'philosophical' in 'Socrates is philosophical').", category: "Aristotle" },
  { term: "Categories of Being", definition: "Aristotle's classification of the basic kinds of being: substance, quantity, quality, relation, place, time, position, state, action, and passion.", category: "Aristotle" },
  { term: "Being as Being", definition: "Aristotle's definition of metaphysics: the study of being insofar as it is being — examining what is common to all things that exist, not just particular kinds.", category: "Aristotle" },
  { term: "Cause to Effect", definition: "Reasoning from a known cause to its effect (a priori reasoning). Starts with what is more knowable in itself.", category: "Aristotle" },
  { term: "Effect to Cause", definition: "Reasoning from an observed effect back to its cause (a posteriori reasoning). Especially valuable in metaphysics because we often encounter effects before their causes.", category: "Aristotle" },

  // Thomistic Metaphysics
  { term: "Hylomorphism", definition: "The Aristotelian-Thomistic doctrine that all material beings are composed of form (morphe) and matter (hyle) as co-principles.", category: "Thomism" },
  { term: "Substantial Form", definition: "The intrinsic principle that makes a thing the kind of thing it is. It determines a being's essential nature.", category: "Thomism" },
  { term: "Prime Matter", definition: "Pure potentiality with no form of its own. The underlying substrate that receives form. Cannot exist independently — it is the principle of individuation.", category: "Thomism" },
  { term: "Act (Actus)", definition: "The perfection or fulfillment of a being. That which a thing actually is. The complement of potency.", category: "Thomism" },
  { term: "Potency (Potentia)", definition: "The capacity or openness of a being to receive new perfections or undergo change. Explains both what a thing can become and what it cannot.", category: "Thomism" },
  { term: "Substance", definition: "A being that exists in itself and not in another. The underlying reality that supports accidents (e.g., a dog, a rock, a person).", category: "Thomism" },
  { term: "Accident", definition: "A being that exists in another (in a substance). Properties like color, size, shape that cannot exist on their own.", category: "Thomism" },
  { term: "Real Being", definition: "That which exists independently of the mind — it has actual existence in the world (e.g., a tree, a person, an electron).", category: "Thomism" },
  { term: "Mental Being (Ens Rationis)", definition: "That which exists only in the mind — it has no existence outside of thought (e.g., a unicorn, a logical relation, negation).", category: "Thomism" },
  { term: "Principle of Non-Contradiction", definition: "A thing cannot both be and not be in the same respect at the same time. One of the two foundational principles of all metaphysics.", category: "Thomism" },
  { term: "Principle of Intelligibility", definition: "All being is intelligible — capable of being known by the intellect. The complementary principle to the drive to know.", category: "Thomism" },
  { term: "Drive to Know", definition: "The innate human orientation toward understanding reality. Demands the complementary principle of the intelligibility of being.", category: "Thomism" },
  { term: "Intrinsic Unity", definition: "Unity that belongs to a being by its very nature — the parts form a genuine whole (e.g., a living organism).", category: "Thomism" },
  { term: "Extrinsic Unity", definition: "Unity imposed from outside — parts are grouped together but don't form a natural whole (e.g., a pile of rocks, an army).", category: "Thomism" },
  { term: "Transcendentals", definition: "Properties that belong to every being as being: one, true, good. They are convertible with being itself.", category: "Thomism" },
  { term: "Principle of Individuation", definition: "What makes one individual distinct from another of the same kind. In Thomism, this is designated (signate) matter.", category: "Thomism" },

  // Concepts & Logic
  { term: "Univocal Concept", definition: "A concept applied to different things in exactly the same sense (e.g., 'animal' applied to a dog and a cat).", category: "Concepts" },
  { term: "Equivocal Concept", definition: "A word applied to different things in completely different senses (e.g., 'bank' as riverbank vs. financial bank).", category: "Concepts" },
  { term: "Analogous Concept", definition: "A concept applied to different things in partly the same and partly different senses (e.g., 'healthy' applied to a person, food, and complexion).", category: "Concepts" },
  { term: "Analogy of Proper Proportionality", definition: "The type of analogy where the concept applies to each thing according to its own intrinsic proportion — essential for metaphysical concepts like 'being.'", category: "Concepts" },
  { term: "Intentional Definition", definition: "Defines what all things called by a term have in common — captures the essence (e.g., 'virtue is a stable disposition toward the good').", category: "Concepts" },
  { term: "Extensional Definition", definition: "Defines by listing examples of things the term applies to (e.g., 'virtues include courage, temperance, justice').", category: "Concepts" },
  { term: "Genus and Specific Difference", definition: "A method of definition: start with a broad category (genus) and narrow it with distinguishing features (specific difference).", category: "Concepts" },

  // Philosophical Positions
  { term: "Radical Monism", definition: "The view that reality is fundamentally one — all apparent plurality is illusion (e.g., Parmenides).", category: "Positions" },
  { term: "Mitigated Monism", definition: "The view that reality is fundamentally one but allows for some genuine plurality within that unity.", category: "Positions" },
  { term: "Radical Pluralism", definition: "The view that reality consists entirely of many separate, independent things with no underlying unity.", category: "Positions" },
  { term: "Materialistic Reductionism", definition: "The view that all reality can be reduced to material components. Overlooks formal causality, intrinsic unity, and the immaterial aspects of real beings.", category: "Positions" },
  { term: "Eliminativism", definition: "The view that certain common-sense entities (like minds or consciousness) don't really exist. Aristotle would say this fails to 'save the appearances.'", category: "Positions" },
  { term: "Sphere Land", definition: "A thought experiment showing that identical forms (spheres) require something besides form to be distinct individuals — pointing to the need for prime matter as principle of individuation.", category: "Positions" },
];

export const categories = [...new Set(glossary.map((g) => g.category))];
