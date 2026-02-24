export type Comparison = {
  id: string;
  topic: string;
  sides: {
    label: string;
    points: string[];
  }[];
};

export const comparisons: Comparison[] = [
  {
    id: "forms",
    topic: "The Nature of Forms",
    sides: [
      {
        label: "Plato",
        points: [
          "Forms are separate, eternal, unchanging realities",
          "Physical things are imperfect copies that participate in Forms",
          "Forms are the source of all truth and knowledge",
          "Accessible only through reason/intellect, not the senses",
          "The Form of the Good is the highest Form",
        ],
      },
      {
        label: "Aristotle",
        points: [
          "Forms exist IN material things, not separately",
          "Substantial form makes a thing what it is",
          "Form and matter are co-principles — neither exists alone",
          "Knowledge begins with sense experience of formed matter",
          "Rejects the 'Third Man' problem of separate Forms",
        ],
      },
    ],
  },
  {
    id: "methodology",
    topic: "Philosophical Methodology",
    sides: [
      {
        label: "Plato",
        points: [
          "Dialectic: ascending from appearances to pure Forms through reason",
          "Distrusts sense experience as a source of knowledge",
          "Uses myths, allegories, and thought experiments (Cave, Divided Line)",
          "Doctrine-focused: what is metaphysically true",
          "Knowledge is recollection (anamnesis) of what the soul already knows",
        ],
      },
      {
        label: "Aristotle",
        points: [
          "Saving the Appearances: theories must account for common experience",
          "All knowledge begins with sense perception",
          "Syllogistic reasoning as primary logical tool",
          "Method-focused: how to investigate reality correctly",
          "Man comes to know truth through objects given in experience",
        ],
      },
    ],
  },
  {
    id: "metaphysics-nature",
    topic: "The Nature of Metaphysics",
    sides: [
      {
        label: "Plato",
        points: [
          "Philosophy aims to ascend from visible to intelligible realm",
          "True knowledge (episteme) is of the Forms",
          "The philosopher grasps eternal, unchanging truth",
          "Metaphysics reveals what is REALLY real beyond appearances",
        ],
      },
      {
        label: "Aristotle",
        points: [
          "Metaphysics is the study of being as being",
          "It is the highest wisdom — knowledge of first causes and principles",
          "Encompasses what is common to all existing things",
          "Connected to theology as the study of the highest being",
        ],
      },
    ],
  },
  {
    id: "knowledge",
    topic: "How We Know Things",
    sides: [
      {
        label: "Plato (Rationalism)",
        points: [
          "Senses give only opinion (doxa), not knowledge",
          "True knowledge comes from reason alone",
          "The soul has innate knowledge it must remember",
          "Mathematical reasoning is closer to truth than observation",
        ],
      },
      {
        label: "Aristotle (Empiricism+)",
        points: [
          "All knowledge originates in sense experience",
          "Perception is potentially intelligible",
          "The intellect abstracts universal concepts from particular experiences",
          "We know causes by reasoning from observed effects",
        ],
      },
    ],
  },
  {
    id: "one-many",
    topic: "The One and the Many",
    sides: [
      {
        label: "Radical Monism",
        points: [
          "Reality is fundamentally one",
          "All plurality is illusion (Parmenides)",
          "Change is impossible if reality is truly one",
          "Problem: contradicts obvious experience of distinct things",
        ],
      },
      {
        label: "Radical Pluralism",
        points: [
          "Reality consists entirely of separate, independent things",
          "No underlying unity connects things",
          "Problem: can't explain commonalities between things",
          "Problem: can't explain how we have universal concepts",
        ],
      },
      {
        label: "Thomistic View",
        points: [
          "Takes both unity and plurality seriously",
          "Participation: things share in being to different degrees",
          "Real distinction of essence and existence",
          "Unity and plurality are both genuine features of reality",
        ],
      },
    ],
  },
  {
    id: "being",
    topic: "Real Being vs. Mental Being",
    sides: [
      {
        label: "Real Being",
        points: [
          "Exists independently of the mind",
          "Has actual existence in the world",
          "Examples: trees, persons, atoms, electrons",
          "Remains whether or not anyone thinks about it",
        ],
      },
      {
        label: "Mental Being (Ens Rationis)",
        points: [
          "Exists only in the mind",
          "No existence outside of thought",
          "Examples: unicorns, logical relations, negations",
          "Ceases to exist without a mind thinking it",
        ],
      },
    ],
  },
  {
    id: "act-potency",
    topic: "Act and Potency in Different Frameworks",
    sides: [
      {
        label: "Thomistic View",
        points: [
          "Act: what a thing actually is (perfection/fulfillment)",
          "Potency: capacity for change, both open and closed",
          "Every finite being is a composition of act and potency",
          "Potency explains why things change and have capacities",
          "Connected to substance (act) and accident (potency)",
        ],
      },
      {
        label: "Empiricist View",
        points: [
          "Potency is inadmissible — not directly observable",
          "Only actual, measurable properties are real",
          "Cannot explain change, possibility, or capacities",
          "Fails to account for quantum states, chemical bonds",
          "Leads to problems explaining ordinary experience",
        ],
      },
    ],
  },
];
