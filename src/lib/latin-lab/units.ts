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
  {
    id: "cena-familiae",
    order: 4,
    title: "The Family's Dinner",
    latinTitle: "Cēna Familiae",
    grammarFocus: ["Accusative singular, 1st declension (-am)", "Direct objects", "1st-conjugation transitive verbs (amat, laudat, portat, spectat, vocat)"],
    grammarTags: ["1st-decl-accusative-sg", "direct-object", "1conj-transitive-3rd-present"],
    newVocab: [
      { latin: "amare (amat)", english: "to love" },
      { latin: "laudare (laudat)", english: "to praise" },
      { latin: "portare (portat)", english: "to carry" },
      { latin: "spectare (spectat)", english: "to look at, watch" },
      { latin: "vocare (vocat)", english: "to call" },
      { latin: "cena", english: "dinner" },
    ],
    narrative: [
      "Claudia villam amat.",
      "Livia aquam portat.",
      "Marcus terram spectat.",
      "Claudia agricolam laudat.",
      "Tullia Claudiam vocat.",
      "Claudia Tulliam spectat.",
      "Femina cenam portat.",
      "Familia cenam laudat.",
      "Servus aquam portat. Agricola terram amat.",
      "Familia laeta villam et cenam amat.",
    ],
    narrativeGlossEN: [
      "Claudia loves the farmhouse.",
      "Livia carries the water.",
      "Marcus looks at the land.",
      "Claudia praises the farmer.",
      "Tullia calls Claudia.",
      "Claudia looks at Tullia.",
      "The woman carries the dinner.",
      "The family praises the dinner.",
      "The servant carries water. The farmer loves the land.",
      "The happy family loves the farmhouse and the dinner.",
    ],
    englishGloss:
      "Claudia loves the farmhouse. Livia carries the water. Marcus looks at the land. Claudia praises the farmer. Tullia calls Claudia. Claudia looks at Tullia. The woman carries the dinner. The family praises the dinner. The servant carries water; the farmer loves the land. The happy family loves the farmhouse and the dinner.",
    notes:
      "Accusative -am is drilled across common nouns (villam, terram, aquam, cenam), proper names (Claudiam, Tulliam), and the masculine-1st-declension exception (agricolam) — same ending regardless of gender or being a name, because -am marks the direct-object ROLE, not a noun class. All five new verbs are 1st-conjugation (-at, matching the already-known habitat/laborat pattern) — the only new structure this unit is subject-verb-OBJECT instead of subject-verb.",
  },
  {
    id: "familia-magna",
    order: 5,
    title: "A Big Family",
    latinTitle: "Familia Magna",
    grammarFocus: ["Numbers 1-10 (unus-decem)", "Accusative plural, 1st declension (-as)", "3rd person plural, 1st conjugation (-ant)"],
    grammarTags: ["numbers-1-10", "1st-decl-accusative-pl", "1conj-3rd-plural-present"],
    newVocab: [
      { latin: "unus, una", english: "one", note: "declines and agrees with its noun's gender (unus vir, una puella)" },
      { latin: "duo, duae", english: "two", note: "duo (masc.), duae (fem.) — duo agricolae is masculine agreement, even though agricolae LOOKS like a feminine 1st-declension form" },
      { latin: "tres", english: "three", note: "same form for masculine and feminine" },
      { latin: "quattuor", english: "four", note: "indeclinable — same in every case/gender, like all numbers 4-10" },
      { latin: "quinque", english: "five" },
      { latin: "sex", english: "six" },
      { latin: "septem", english: "seven" },
      { latin: "octo", english: "eight" },
      { latin: "novem", english: "nine" },
      { latin: "decem", english: "ten" },
      { latin: "rosa", english: "rose" },
    ],
    narrative: [
      "Marcus est unus vir in villā.",
      "In villā sunt duae puellae: Claudia et Tullia.",
      "Duo agricolae terram amant.",
      "Tres servi aquam portant.",
      "Claudia quattuor rosas spectat.",
      "Familia quinque rosas amat.",
      "Sex puellae in villā habitant.",
      "Septem familiae laetae sunt.",
      "Tullia octo fabulas laudat.",
      "Novem agricolae villas spectant.",
      "In terrā sunt decem villae laetae.",
    ],
    narrativeGlossEN: [
      "Marcus is one man in the farmhouse.",
      "In the farmhouse are two girls: Claudia and Tullia.",
      "Two farmers love the land.",
      "Three servants carry water.",
      "Claudia looks at four roses.",
      "The family loves five roses.",
      "Six girls live in the farmhouse.",
      "Seven families are happy.",
      "Tullia praises eight stories.",
      "Nine farmers look at farmhouses.",
      "In the land are ten happy farmhouses.",
    ],
    englishGloss:
      "Marcus is one man in the farmhouse. In the farmhouse are two girls: Claudia and Tullia. Two farmers love the land. Three servants carry water. Claudia looks at four roses. The family loves five roses. Six girls live in the farmhouse. Seven families are happy. Tullia praises eight stories. Nine farmers look at farmhouses. In the land are ten happy farmhouses.",
    notes:
      "Numbers 1-3 (unus/duo/tres) genuinely decline and agree with their noun's gender — 'duo agricolae' is masculine agreement despite the -ae-looking 1st-declension noun form, the same masculine-1st-declension trap from Unit 1, now tested against a numeral. 4-10 are indeclinable vocabulary, same in every sentence. Plural verbs (-ant, -ant) are the SAME ending already seen in Unit 1's habitant/laborant, not new morphology. Bonus subtlety: 'agricolae' meant 'of the farmer' (genitive singular) in Unit 3 and means 'farmers' (nominative plural) here — identical spelling, different job, resolved only by context.",
  },
  {
    id: "puer-et-magister",
    order: 6,
    title: "The Boy and the Teacher",
    latinTitle: "Puer et Magister",
    grammarFocus: ["2nd-declension masculine nouns, full nominative/accusative paradigm (sg & pl): puer, filius, magister", "Accusative singular (-um) and plural (-os), 2nd declension"],
    grammarTags: ["2nd-decl-nom-acc-sg", "2nd-decl-nom-acc-pl", "2nd-decl-er-nouns"],
    newVocab: [
      { latin: "puer, pueri", english: "boy", note: "keeps its 'e' in every form: puerum, pueri, pueros" },
      { latin: "filius", english: "son", note: "fully regular 2nd declension: filium, filii, filios" },
      { latin: "magister, magistri", english: "teacher, master", note: "DROPS the 'e' after puer — magistrum, NOT magisterum" },
    ],
    narrative: [
      "Puer in villā habitat.",
      "Filius agricolae puer est.",
      "Magister pueros laudat.",
      "Puer magistrum spectat.",
      "Servus filium agricolae vocat.",
      "Familia servos et pueros amat.",
      "Magister filios laudat.",
      "Puer et filius agricolae sunt laeti.",
      "Magistri villam spectant.",
      "Familia magistrum et pueros laudat.",
    ],
    narrativeGlossEN: [
      "The boy lives in the farmhouse.",
      "The farmer's son is a boy.",
      "The teacher praises the boys.",
      "The boy looks at the teacher.",
      "The servant calls the farmer's son.",
      "The family loves the servants and the boys.",
      "The teacher praises the sons.",
      "The boy and the farmer's son are happy.",
      "The teachers look at the farmhouse.",
      "The family praises the teacher and the boys.",
    ],
    englishGloss:
      "The boy lives in the farmhouse. The farmer's son is a boy. The teacher praises the boys. The boy looks at the teacher. The servant calls the farmer's son. The family loves the servants and the boys. The teacher praises the sons. The boy and the farmer's son are happy. The teachers look at the farmhouse. The family praises the teacher and the boys.",
    notes:
      "First full look at 2nd-declension masculine endings (-us/-um singular, -i/-os plural) on nouns you can picture: puer keeps its 'e' in every form (puerum, pueros); magister drops it (magistrum, never magisterum); filius is fully regular. The genitive -ae from Unit 3 gets a deliberate callback (filius agricolae, filium agricolae) so it doesn't go stale.",
  },
  {
    id: "puer-bonus",
    order: 7,
    title: "The Good Boy, the Small Servant",
    latinTitle: "Puer Bonus, Servus Parvus",
    grammarFocus: ["1st/2nd-declension adjective agreement, full paradigm", "Adjectives modifying 2nd-declension masculine nouns", "Cross-declension agreement (1st-declension masculine nouns + 2nd-declension adjective endings)"],
    grammarTags: ["1st-2nd-decl-adj-full-agreement", "adjective-cross-declension"],
    newVocab: [{ latin: "novus, nova", english: "new" }],
    narrative: [
      "Puer bonus est. Puer magnus est.",
      "Servus parvus laborat.",
      "Magister bonus pueros laudat.",
      "Filius agricolae malus non est; filius bonus est.",
      "Puella pulchra et puer pulcher in villā habitant.",
      "Servus novus villam magnam spectat.",
      "Magister novus pueros bonos laudat.",
      "Familia parva sed laeta est.",
      "Agricolae boni terram magnam amant.",
      "Familia villam novam amat: magna et pulchra est.",
    ],
    narrativeGlossEN: [
      "The boy is good. The boy is big.",
      "The small servant works.",
      "The good teacher praises the boys.",
      "The farmer's son is not bad; he is a good son.",
      "The beautiful girl and the handsome boy live in the farmhouse.",
      "The new servant looks at the big farmhouse.",
      "The new teacher praises the good boys.",
      "The family is small but happy.",
      "The good farmers love the big land.",
      "The family loves the new farmhouse: it is big and beautiful.",
    ],
    englishGloss:
      "The boy is good; the boy is big. The small servant works. The good teacher praises the boys. The farmer's son is not bad; he is a good son. The beautiful girl and the handsome boy live in the farmhouse. The new servant looks at the big farmhouse. The new teacher praises the good boys. The family is small but happy. The good farmers love the big land. The family loves the new farmhouse: it is big and beautiful.",
    notes:
      "Every adjective you already know (bonus/-a, magnus/-a, parvus/-a, malus/-a, laetus/-a, pulcher/pulchra) now applies to the masculine 2nd-declension nouns from Unit 6, including the single most-tested Latin agreement trap: 'agricolae boni' — agricola is grammatically masculine but 1st-declension in its noun form (agricolae, -ae), while its adjective still takes the 2nd-declension masculine ending (boni). Same gender, different-looking endings, because the noun and the adjective simply belong to different declensions — drilled here on purpose rather than avoided.",
  },
  {
    id: "dialogus-in-villa",
    order: 8,
    title: "A Conversation at the Farmhouse",
    latinTitle: "Dialogus in Villā",
    grammarFocus: ["1st-conjugation present, full six-person paradigm (amo, amas, amat, amamus, amatis, amant)", "Imperative — singular and plural commands", "Infinitive used as a naming form (subject of a sentence)"],
    grammarTags: ["1conj-full-present-paradigm", "imperative-2nd-sg-pl", "infinitive-naming-form"],
    newVocab: [
      { latin: "ego", english: "I", note: "Latin verb endings already show the person — ego only appears for emphasis/contrast, which is also the only time real Latin actually uses it" },
      { latin: "tu", english: "you (singular)" },
      { latin: "nos", english: "we" },
      { latin: "vos", english: "you (plural)" },
      { latin: "bene", english: "well, fine" },
    ],
    narrative: [
      "Claudia: \"Tullia, laboro. Et tu?\"",
      "Tullia: \"Ego quoque laboro. Aquam porto.\"",
      "Claudia: \"Nos duae in villā laboramus.\"",
      "Marcus: \"Vos laboratis; ego specto!\"",
      "Claudia: \"Marce, labora!\"",
      "Marcus: \"Bene, laboro.\"",
      "Magister: \"Pueri, laborate!\"",
      "Laborare bonum est.",
      "Claudia: \"Villam amo.\"",
      "Familia laborat. Familia laeta est.",
    ],
    narrativeGlossEN: [
      "Claudia: \"Tullia, I am working. And you?\"",
      "Tullia: \"I too am working. I am carrying water.\"",
      "Claudia: \"We two are working in the farmhouse.\"",
      "Marcus: \"You all are working; I am watching!\"",
      "Claudia: \"Marcus, work!\"",
      "Marcus: \"Fine, I'm working.\"",
      "Teacher: \"Boys, work!\"",
      "To work is good.",
      "Claudia: \"I love the farmhouse.\" (object-first word order — still the same meaning)",
      "The family works. The family is happy.",
    ],
    englishGloss:
      "Claudia: \"Tullia, I am working. And you?\" Tullia: \"I too am working. I am carrying water.\" Claudia: \"We two are working in the farmhouse.\" Marcus: \"You all are working; I am watching!\" Claudia: \"Marcus, work!\" Marcus: \"Fine, I'm working.\" Teacher: \"Boys, work!\" To work is good. Claudia: \"I love the farmhouse.\" The family works; the family is happy.",
    notes:
      "This unit switches briefly to dialogue because 1st/2nd-person verb forms sound natural in conversation, not narration. Imperative (labora!/laborate!) and the infinitive-as-subject (Laborare bonum est — a real, classical construction) are both just NEW FORMS of verbs you already know (laborare, amare, spectare, portare); no new verbs this unit. Bonus detail: 'Marce' is Marcus's name in the vocative (direct-address) case — not tested, just something worth noticing.",
  },
  {
    id: "villa-olim",
    order: 9,
    title: "The Farmhouse, Long Ago",
    latinTitle: "Villa Ōlim",
    grammarFocus: ["Imperfect tense, 1st conjugation (-abat/-abant)", "Imperfect of sum/esse (erat/erant)", "Past, ongoing-action narrative"],
    grammarTags: ["1conj-imperfect", "sum-esse-imperfect", "past-narrative"],
    newVocab: [
      { latin: "olim", english: "once, long ago", note: "the traditional Latin story-opening word — a signal that past tense is coming" },
      { latin: "tum", english: "then" },
      { latin: "semper", english: "always" },
    ],
    narrative: [
      "Olim familia in villā habitabat.",
      "Claudia parva erat.",
      "Marcus semper laborabat.",
      "Livia aquam portabat, et Claudia terram spectabat.",
      "Tum Tullia in villā erat.",
      "Puellae fabulas laudabant.",
      "Agricolae terram amabant, et servi laborabant.",
      "Magister pueros semper laudabat.",
      "Villa magna erat; familia laeta erat.",
      "Familia olim parva erat, sed laeta semper erat.",
    ],
    narrativeGlossEN: [
      "Once, the family lived in the farmhouse.",
      "Claudia was small.",
      "Marcus always used to work.",
      "Livia was carrying water, and Claudia was watching the land.",
      "Then Tullia was in the farmhouse.",
      "The girls used to praise stories.",
      "The farmers loved the land, and the servants used to work.",
      "The teacher always used to praise the boys.",
      "The farmhouse was big; the family was happy.",
      "The family was once small, but was always happy.",
    ],
    englishGloss:
      "Once, the family lived in the farmhouse. Claudia was small. Marcus always used to work. Livia was carrying water, and Claudia was watching the land. Then Tullia was in the farmhouse. The girls used to praise stories. The farmers loved the land, and the servants used to work. The teacher always used to praise the boys. The farmhouse was big; the family was happy. The family was once small, but was always happy.",
    notes:
      "Same world, same characters, new tense — almost every sentence here is a Unit 1-4 present-tense sentence with -ba- inserted before the personal ending (habitat → habitabat, laborat → laborabat) and est/sunt swapped for erat/erant. That's genuinely how the imperfect works: built on the present stem, not a new vocabulary set.",
  },
  {
    id: "quis-quid-ubi",
    order: 10,
    title: "Reading Checkpoint: Who, What, Where",
    latinTitle: "Quis, Quid, Ubi?",
    grammarFocus: ["Interrogatives: quis (who), quid (what), ubi (where), cur (why)", "Reading-fluency checkpoint — reviews grammar from every prior unit in one passage"],
    grammarTags: ["interrogatives", "reading-fluency-checkpoint"],
    newVocab: [
      { latin: "quis", english: "who" },
      { latin: "quid", english: "what" },
      { latin: "ubi", english: "where" },
      { latin: "cur", english: "why" },
      { latin: "quia", english: "because" },
      { latin: "narrare (narrat)", english: "to tell, narrate" },
      { latin: "verus, vera", english: "true" },
    ],
    narrative: [
      "Quis in villā habitat? Familia Claudiae in villā habitat.",
      "Ubi est villa? Villa in terrā lata est.",
      "Quid Marcus portat? Marcus aquam portat.",
      "Cur familia laeta est? Familia laeta est quia villa pulchra est.",
      "Quis pueros laudat? Magister bonus pueros laudat.",
      "Quid Claudia amat? Claudia fabulas et rosas amat.",
      "Ubi olim familia habitabat? Familia olim in villā parvā habitabat.",
      "Cur Tullia laeta est? Tullia laeta est quia Claudiam amat.",
      "Quis fabulam Claudiae narrat? Livia fabulam Claudiae narrat.",
      "Familia tota fabulam amat: fabula bona et vera est.",
    ],
    narrativeGlossEN: [
      "Who lives in the farmhouse? Claudia's family lives in the farmhouse.",
      "Where is the farmhouse? The farmhouse is on the wide land.",
      "What does Marcus carry? Marcus carries water.",
      "Why is the family happy? The family is happy because the farmhouse is beautiful.",
      "Who praises the boys? The good teacher praises the boys.",
      "What does Claudia love? Claudia loves stories and roses.",
      "Where did the family live long ago? The family once lived in a small farmhouse.",
      "Why is Tullia happy? Tullia is happy because she loves Claudia.",
      "Who tells Claudia's story? Livia tells Claudia's story.",
      "The whole family loves the story: the story is good and true.",
    ],
    englishGloss:
      "Who lives in the farmhouse? Claudia's family lives in the farmhouse. Where is the farmhouse? The farmhouse is on the wide land. What does Marcus carry? Marcus carries water. Why is the family happy? The family is happy because the farmhouse is beautiful. Who praises the boys? The good teacher praises the boys. What does Claudia love? Claudia loves stories and roses. Where did the family live long ago? The family once lived in a small farmhouse. Why is Tullia happy? Tullia is happy because she loves Claudia. Who tells Claudia's story? Livia tells Claudia's story. The whole family loves the story: the story is good and true.",
    notes:
      "This unit is a checkpoint, not new grammar to memorize in isolation — every ANSWER sentence reuses vocabulary and forms from Units 1-9 (nominative, genitive, accusative singular/plural, 2nd declension, adjective agreement, imperfect tense), so answering each question is really a review drill wearing a question's clothing. The four question words (quis/quid/ubi/cur) plus quia are the only genuinely new pieces.",
  },
];

// Roadmap only — NOT built yet (2026-09-09). Units 1-10 (nominative through imperfect
// tense + interrogatives) are fully authored above; this is the NEXT stretch, kept here
// so it slots in without re-deriving the sequence.
export const latinUnitsRoadmap = [
  "Unit 11 — Dative case, indirect objects (dat, monstrat + dative)",
  "Unit 12 — Ablative case core: means/manner, place-where prepositions (in + abl., cum + abl.)",
  "Unit 13 — Perfect tense (1st conjugation + sum/esse), narrating completed past events",
  "Unit 14 — Relative pronouns (qui/quae/quod), longer connected reading",
  "Unit 15 — Cumulative review + mastery checkpoint covering Units 1-14",
];

export function getLatinUnit(id: string): LatinUnit | undefined {
  return latinUnits.find((u) => u.id === id);
}
