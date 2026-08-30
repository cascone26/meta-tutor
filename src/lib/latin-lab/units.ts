// Latin Lab course content — original text, classical pronunciation, built on the
// comprehensible-input (CI) method: Ørberg's "Lingua Latina per se Illustrata" is the
// strongest-evidenced approach for real reading fluency + retention (see research
// notes in STATUS.md, 2026-08-30 entry) — a graded narrative that introduces ONE new
// grammatical concept per unit through context, with heavy repetition of already-known
// vocabulary, rather than isolated grammar-translation drills. This is a genuinely
// separate course from RCA's First Form Latin 6 (src/lib/rca-content/latin-core.ts,
// ecclesiastical pronunciation, Memoria Press's specific 6th-grade sequencing) — this
// one is classical pronunciation and its own original narrative/vocabulary order.
//
// The narrative sentences below are 100% original composition (not a transcription of
// Ørberg's actual "Familia Romana" text, which is copyrighted) — only the PEDAGOGICAL
// STRUCTURE (grammar progression order, CI technique of unanalyzed vocab appearing
// ahead of its formal grammar unit) follows the same well-established, un-owned method
// any Latin course can use. Character names (Claudia, Livia, Marcus, Tullia) are
// generic Roman praenomina/cognomina used across countless independent courses.
//
// Comprehension-check QUESTIONS are deliberately NOT hand-written here — per the
// research, an LLM generates them per-learner from this narrative at three difficulty
// tiers (src/app/api/latin-lab/route.ts), selected by the learner's rolling accuracy,
// so no two attempts see identical questions and questions can't be memorized instead
// of actually read.

export type LatinVocabItem = {
  latin: string;
  english: string;
  note?: string; // e.g. gender/declension aside, irregular flag
};

export type LatinUnit = {
  id: string;
  order: number;
  title: string;
  latinTitle: string;
  grammarFocus: string[]; // human-readable, shown in the UI
  grammarTags: string[]; // stable tags used for weak-concept tracking
  newVocab: LatinVocabItem[];
  narrative: string[]; // one paragraph's sentences, in order
  narrativeGlossEN: string[]; // per-sentence English, same length/order as narrative — click-to-reveal in the UI
  englishGloss: string; // full-paragraph translation, for AI grounding
  notes: string; // pedagogical note shown under the unit (what's taught vs. previewed)
};

export const latinUnits: LatinUnit[] = [
  {
    id: "familia-in-villa",
    order: 1,
    title: "The Family at the Farmhouse",
    latinTitle: "Familia in Villā",
    grammarFocus: ["Nominative case (subject)", "sum/esse: est, sunt", "3rd person present, 1st conjugation (-at, -ant)"],
    grammarTags: ["1st-decl-nom-sg", "1st-decl-nom-pl", "sum-esse-present", "1conj-3rd-present"],
    newVocab: [
      { latin: "puella", english: "girl" },
      { latin: "femina", english: "woman" },
      { latin: "mater", english: "mother", note: "irregular declension — recognize it now, don't analyze the case endings yet" },
      { latin: "filia", english: "daughter" },
      { latin: "villa", english: "farmhouse, country estate" },
      { latin: "habitare (habitat, habitant)", english: "to live, dwell" },
      { latin: "agricola", english: "farmer", note: "1st declension but MASCULINE — the classic early exception" },
      { latin: "vir", english: "man" },
      { latin: "laborare (laborat)", english: "to work" },
      { latin: "laetus, laeta", english: "happy" },
      { latin: "magnus, magna", english: "big, great" },
      { latin: "pulcher, pulchra", english: "beautiful" },
      { latin: "aqua", english: "water" },
      { latin: "terra", english: "land, earth" },
      { latin: "latus, lata", english: "wide" },
      { latin: "familia", english: "family" },
      { latin: "et", english: "and" },
      { latin: "in + ablative", english: "in, on", note: "learn as a fixed chunk (\"in villā\" = \"in the farmhouse\") — the ablative case itself comes later" },
      { latin: "quoque", english: "also, too" },
    ],
    narrative: [
      "Claudia est puella.",
      "Livia est femina.",
      "Livia est mater. Claudia est filia.",
      "Claudia et Livia in villā habitant.",
      "Marcus est agricola. Marcus vir est.",
      "Marcus in villā laborat.",
      "Claudia et Marcus sunt laeti.",
      "Villa magna est. Villa pulchra est.",
      "Aqua in villā est. Terra lata est.",
      "Familia laeta est.",
    ],
    narrativeGlossEN: [
      "Claudia is a girl.",
      "Livia is a woman.",
      "Livia is the mother. Claudia is the daughter.",
      "Claudia and Livia live at the farmhouse.",
      "Marcus is a farmer. Marcus is a man.",
      "Marcus works at the farmhouse.",
      "Claudia and Marcus are happy.",
      "The farmhouse is big. The farmhouse is beautiful.",
      "There is water at the farmhouse. The land is wide.",
      "The family is happy.",
    ],
    englishGloss:
      "Claudia is a girl. Livia is a woman. Livia is the mother; Claudia is the daughter. Claudia and Livia live in the farmhouse. Marcus is a farmer; Marcus is a man. Marcus works at the farmhouse. Claudia and Marcus are happy. The farmhouse is big; the farmhouse is beautiful. There is water at the farmhouse; the land is wide. The family is happy.",
    notes:
      "Pure nominative case throughout — no direct objects, no possession. \"mater\" and \"in villā\" are given as recognizable chunks ahead of their formal grammar (3rd declension, ablative) so they don't block the story now.",
  },
  {
    id: "villa-et-casa",
    order: 2,
    title: "The Farmhouse and the Cottage",
    latinTitle: "Villa et Casa",
    grammarFocus: ["1st/2nd-declension adjective agreement (-us/-a)", "Predicate adjectives", "Nominative plural (-ae, -i)"],
    grammarTags: ["1st-2nd-decl-adj-agreement", "predicate-adjective", "1st-decl-nom-pl"],
    newVocab: [
      { latin: "casa", english: "small house, cottage" },
      { latin: "parvus, parva", english: "small" },
      { latin: "bonus, bona", english: "good" },
      { latin: "malus, mala", english: "bad" },
      { latin: "non", english: "not" },
      { latin: "servus", english: "(male) servant, slave", note: "2nd declension — vocabulary only for now, paradigm comes in a later unit" },
      { latin: "fabula", english: "story" },
      { latin: "sed", english: "but" },
      { latin: "Tullia", english: "(name)" },
    ],
    narrative: [
      "Villa magna est. Casa parva est.",
      "Marcus est vir bonus. Claudia est puella bona.",
      "Servus in villā laborat. Servus vir bonus est.",
      "Servi in villā laborant.",
      "Claudia et Tullia sunt puellae bonae.",
      "Fabula bona est. Fabula non mala est.",
      "Aqua bona est. Terra lata et pulchra est.",
      "Familia bona et laeta est.",
      "Villa magna, sed casa parva est.",
    ],
    narrativeGlossEN: [
      "The farmhouse is big. The cottage is small.",
      "Marcus is a good man. Claudia is a good girl.",
      "The servant works at the farmhouse. The servant is a good man.",
      "The servants work at the farmhouse.",
      "Claudia and Tullia are good girls.",
      "The story is good. The story is not bad.",
      "The water is good. The land is wide and beautiful.",
      "The family is good and happy.",
      "The farmhouse is big, but the cottage is small.",
    ],
    englishGloss:
      "The farmhouse is big; the cottage is small. Marcus is a good man; Claudia is a good girl. The servant works at the farmhouse; the servant is a good man. The servants work at the farmhouse. Claudia and Tullia are good girls. The story is good; the story is not bad. The water is good; the land is wide and beautiful. The family is good and happy. The farmhouse is big, but the cottage is small.",
    notes:
      "First adjective agreement (magnus/-a, bonus/-a, malus/-a, parvus/-a) against nouns already known from Unit 1, plus \"servi\" previews 2nd-declension nominative plural (-i) purely as pattern-recognition — the full paradigm isn't taught yet.",
  },
  {
    id: "fabula-claudiae",
    order: 3,
    title: "Claudia's Story",
    latinTitle: "Fabula Claudiae",
    grammarFocus: ["Genitive singular, 1st declension (-ae)", "Possession", "de + ablative"],
    grammarTags: ["1st-decl-genitive-sg", "genitive-possession", "de-ablative-chunk"],
    newVocab: [
      { latin: "haec est", english: "this is", note: "fixed idiom, feminine nominative demonstrative" },
      { latin: "frater", english: "brother", note: "3rd declension — vocabulary only, like \"mater\"" },
      { latin: "de + ablative", english: "about, concerning" },
    ],
    narrative: [
      "Haec est fabula Claudiae.",
      "Villa est villa Liviae.",
      "Casa Tulliae parva est.",
      "Aqua villae bona est.",
      "Marcus est frater Claudiae.",
      "Terra familiae lata est.",
      "Fabula agricolae bona est.",
      "Fabula Claudiae de villā est.",
      "Familia Claudiae laeta est.",
      "Fabula Claudiae bona et pulchra est.",
    ],
    narrativeGlossEN: [
      "This is Claudia's story.",
      "The farmhouse is Livia's farmhouse.",
      "Tullia's cottage is small.",
      "The farmhouse's water is good.",
      "Marcus is Claudia's brother.",
      "The family's land is wide.",
      "The farmer's story is good.",
      "Claudia's story is about the farmhouse.",
      "Claudia's family is happy.",
      "Claudia's story is good and beautiful.",
    ],
    englishGloss:
      "This is Claudia's story. The farmhouse is Livia's farmhouse. Tullia's cottage is small. The farmhouse's water is good. Marcus is Claudia's brother. The family's land is wide. The farmer's story is good. Claudia's story is about the farmhouse. Claudia's family is happy. Claudia's story is good and beautiful.",
    notes:
      "The genitive singular ending -ae is drilled across both feminine (Claudiae, Liviae, Tulliae, villae, familiae) and masculine (agricolae) 1st-declension nouns on purpose — same ending regardless of gender, which is the thing worth over-exposing early.",
  },
];

// Roadmap only — NOT built yet (2026-08-30). Keeping the planned order here so the
// next unit slots in without re-deriving the sequence. See STATUS.md for why the
// research stopped at 3 fully-authored units for this first pass.
export const latinUnitsRoadmap = [
  "Unit 4 — Accusative singular (1st decl.), direct objects, 1st-conj. transitive verbs (amat, laudat)",
  "Unit 5 — Numbers 1-20, accusative plural, plural verb forms",
  "Unit 6 — 2nd declension full paradigm (puer, filius, servus, magister)",
  "Unit 7 — 2nd declension adjectives, full agreement across declensions",
  "Unit 8 — More present forms (1st/2nd person singular), imperative, infinitive",
  "Unit 9 — Imperfect tense, past narrative",
  "Unit 10 — Interrogatives (quis, quid, ubi), reading-fluency checkpoint",
];

export function getLatinUnit(id: string): LatinUnit | undefined {
  return latinUnits.find((u) => u.id === id);
}
