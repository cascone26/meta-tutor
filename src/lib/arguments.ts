export type Argument = {
  id: number;
  philosopher: string;
  conclusion: string;
  premises: string[];
  explanation: string;
  topics: string[];
};

export const arguments_data: Argument[] = [
  {
    id: 1,
    philosopher: "Plato",
    conclusion: "True knowledge (episteme) is distinct from mere opinion (doxa).",
    premises: [
      "The objects of knowledge must be stable and unchanging.",
      "Sensory experience deals only with changing, particular things.",
      "The Forms are eternal, unchanging, and universal.",
      "Therefore, knowledge of the Forms through reason is true knowledge, while sense-based belief is merely opinion."
    ],
    explanation: "Plato distinguishes doxa (opinion from the visible realm) from episteme (knowledge from the intelligible realm) via the Divided Line. Since physical things change, they can only yield belief; the unchanging Forms yield genuine understanding.",
    topics: ["Plato", "Divided Line", "Episteme", "Doxa"],
  },
  {
    id: 2,
    philosopher: "Plato",
    conclusion: "Physical things participate in the Forms, which is why they have the properties they do.",
    premises: [
      "Physical things exhibit intelligible properties (beauty, justice, equality).",
      "These properties cannot originate from matter alone, which is in constant flux.",
      "There must exist perfect, eternal archetypes (Forms) that physical things resemble.",
      "Physical things have their properties by sharing in or imitating these Forms."
    ],
    explanation: "Plato's doctrine of participation explains why individual things have recognizable qualities — they derive those qualities from the perfect Forms they participate in.",
    topics: ["Plato", "Forms", "Participation"],
  },
  {
    id: 3,
    philosopher: "Aristotle",
    conclusion: "Metaphysics is the study of being as being and is rightly called wisdom.",
    premises: [
      "Every science studies a particular kind of being (physics studies natural being, math studies quantitative being).",
      "There must be a science that studies what is common to all beings — being as being.",
      "The highest science (wisdom) seeks the most universal and fundamental causes.",
      "Metaphysics examines the first principles and causes of all being, making it wisdom."
    ],
    explanation: "Aristotle establishes metaphysics as the most universal science because it alone examines what belongs to everything that exists, not just a particular domain.",
    topics: ["Aristotle", "Being as Being", "Wisdom"],
  },
  {
    id: 4,
    philosopher: "Aristotle",
    conclusion: "Forms cannot exist separately from material things (against Plato).",
    premises: [
      "We observe forms only in conjunction with matter — never independently.",
      "If Forms existed separately, there would need to be a 'third man' to explain the relation between a form and its copy (infinite regress).",
      "A separate realm of Forms cannot explain how forms cause change in the physical world.",
      "Therefore, form and matter are co-principles within individual substances, not separate realms."
    ],
    explanation: "This is Aristotle's central critique of Plato, leading to his hylomorphic view that form and matter always exist together in concrete substances.",
    topics: ["Aristotle", "Plato", "Hylomorphism", "Third Man"],
  },
  {
    id: 5,
    philosopher: "Aquinas/Aristotle",
    conclusion: "All material beings are composed of form and matter (hylomorphism).",
    premises: [
      "Material beings undergo substantial change (a seed becomes a tree).",
      "Change requires something that persists through the change (matter) and something new that comes to be (form).",
      "Neither form nor matter can exist independently — form gives actuality to matter, matter individuates form.",
      "Therefore, every material being is a composite of form and matter."
    ],
    explanation: "Hylomorphism explains both the unity and the changeability of material substances. Form makes a thing what it is; matter makes it this particular individual.",
    topics: ["Thomism", "Hylomorphism", "Form", "Matter"],
  },
  {
    id: 6,
    philosopher: "Aquinas",
    conclusion: "Act and potency are real, distinct principles in every finite being.",
    premises: [
      "Things change — what was potential becomes actual.",
      "If a being were pure act, it could not change or be limited in any way.",
      "Finite beings are limited and changeable, so they must have potency in addition to act.",
      "Therefore, every finite being is composed of act and potency."
    ],
    explanation: "The act-potency distinction is foundational for Thomism. It explains change (transition from potency to act), limitation (potency limits act), and the difference between God (pure act) and creatures.",
    topics: ["Thomism", "Act", "Potency", "Change"],
  },
  {
    id: 7,
    philosopher: "Aquinas",
    conclusion: "The principle of non-contradiction is the most fundamental law of all being and thought.",
    premises: [
      "Every judgment presupposes that contradictory statements cannot both be true.",
      "Without this principle, no assertion can be distinguished from its denial.",
      "All demonstration and reasoning depend on it — it cannot itself be demonstrated (since any proof would assume it).",
      "Therefore, it is the absolutely first principle, known per se."
    ],
    explanation: "Aquinas (following Aristotle) holds that non-contradiction is self-evident and foundational. It is not proved but rather presupposed by every act of knowing.",
    topics: ["Thomism", "Non-Contradiction", "First Principles"],
  },
  {
    id: 8,
    philosopher: "Aquinas",
    conclusion: "Every being is one (unity is a transcendental property of being).",
    premises: [
      "To exist is to be something determinate — a being with a specific nature.",
      "What is determinate is undivided in itself (if it were divided, it would be two beings, not one).",
      "Therefore, every being, insofar as it exists, is one — it has intrinsic unity.",
      "Unity is not something added to being but is convertible with it."
    ],
    explanation: "The transcendental 'one' means that every being has unity proportional to its existence. This doesn't add to being but reveals an aspect of it.",
    topics: ["Thomism", "Transcendentals", "Unity"],
  },
  {
    id: 9,
    philosopher: "Aristotle",
    conclusion: "Arguments from effect to cause are of special value in metaphysics.",
    premises: [
      "In our experience, we encounter effects before we know their causes.",
      "Metaphysical realities (substance, form, potency) are not directly observable.",
      "We can reason from observable effects to the existence and nature of their causes.",
      "Therefore, a posteriori reasoning (effect to cause) is especially valuable for reaching metaphysical truths."
    ],
    explanation: "While cause-to-effect reasoning is more certain, effect-to-cause reasoning is more practical in metaphysics because first principles are not given in sensory experience.",
    topics: ["Aristotle", "Methodology", "Cause and Effect"],
  },
  {
    id: 10,
    philosopher: "Aquinas",
    conclusion: "Prime matter serves as the principle of individuation for material substances.",
    premises: [
      "Two substances can share the same substantial form (two dogs are both 'dog').",
      "Form alone cannot explain why there are many individuals of the same kind.",
      "There must be a principle that makes this individual distinct from that individual.",
      "Designated (signate) matter — matter marked by quantity — individuates substances of the same form."
    ],
    explanation: "The Sphere Land thought experiment illustrates this: identical spheres sharing the same form can only be distinguished by their matter occupying different positions.",
    topics: ["Thomism", "Individuation", "Prime Matter", "Sphere Land"],
  },
];
