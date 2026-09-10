// Real, hand-verified Latin paradigm charts for First Form Latin 6 — built to sit next to
// latin-teacher-guide.ts's prose explanations with an actual visual chart + a self-quiz
// memorization mode, per Jacob's ask 2026-09-10: "theres not rly resources moving along
// with me to help me with charts and memorizing and logic." The prose in latin-teacher-
// guide.ts already covers the LOGIC (why the pattern works); this file supplies the
// CHART (the actual paradigm table) and feeds a memorize/quiz UI — using the exact model
// words the Teacher Guide itself names per lesson (mensa, servus, bellum, pater, portus,
// rēs, amō/amāre, moneō/monēre, sum/esse), not invented substitutes. Standard First Form
// Latin / classical Latin morphology throughout — no non-standard forms.
//
// Keyed by the SAME lesson `n` (Roman-numeral lesson number) as latin-teacher-guide.ts,
// so it automatically follows whatever week/lesson the real pacing doc (first-form-
// latin-6.ts) says is current — never a separate, driftable schedule.

export type ChartCell = { latin: string; english: string };
export type ChartId =
  | "amo-present" | "amo-imperfect" | "amo-future"
  | "amo-perfect" | "amo-pluperfect" | "amo-futureperfect"
  | "amo-principal-parts"
  | "sum-present" | "sum-imperfect" | "sum-future"
  | "sum-perfect" | "sum-pluperfect" | "sum-futureperfect"
  | "moneo-present" | "moneo-imperfect" | "moneo-future"
  | "moneo-perfect" | "moneo-pluperfect" | "moneo-futureperfect"
  | "moneo-principal-parts"
  | "mensa-declension" | "servus-declension" | "bellum-declension"
  | "pater-declension" | "nomen-declension" | "portus-declension" | "res-declension"
  | "bonus-adjective" | "numbers-1-10";

export type VerbChart = {
  kind: "verb";
  id: ChartId;
  title: string;
  modelWord: string; // e.g. "amō, amāre — to love"
  formationRule: string; // the LOGIC — how this tense is built, one line
  rows: [ChartCell, ChartCell, ChartCell, ChartCell, ChartCell, ChartCell]; // 1sg,2sg,3sg,1pl,2pl,3pl
};

export type DeclensionChart = {
  kind: "noun";
  id: ChartId;
  title: string;
  modelWord: string; // e.g. "mensa, mensae, f. — table"
  formationRule: string;
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"];
  singular: [string, string, string, string, string];
  plural: [string, string, string, string, string];
};

export type AdjectiveChart = {
  kind: "adjective";
  id: ChartId;
  title: string;
  modelWord: string;
  formationRule: string;
  genders: {
    gender: "Masculine" | "Feminine" | "Neuter";
    singular: [string, string, string, string, string];
    plural: [string, string, string, string, string];
  }[];
};

export type PrincipalPartsChart = {
  kind: "principal-parts";
  id: ChartId;
  title: string;
  formationRule: string;
  regular: { parts: [string, string, string, string]; label: string };
  irregulars: { latin: string; parts: [string, string, string, string]; english: string }[];
};

export type NumbersChart = {
  kind: "numbers";
  id: ChartId;
  title: string;
  formationRule: string;
  numbers: { latin: string; english: string; value: number }[];
};

export type GrammarChart = VerbChart | DeclensionChart | AdjectiveChart | PrincipalPartsChart | NumbersChart;

// ---- 1st conjugation: amō, amāre, amāvī, amātus (to love) ----
const AMO_PRESENT: VerbChart = {
  kind: "verb", id: "amo-present", title: "1st Conjugation — Present Tense", modelWord: "amō, amāre — to love",
  formationRule: "Present stem (ama-) + personal ending. 1st sg. ama+ō contracts to amō — the only irregular-looking spot.",
  rows: [
    { latin: "amō", english: "I love" }, { latin: "amās", english: "you love" }, { latin: "amat", english: "he/she/it loves" },
    { latin: "amāmus", english: "we love" }, { latin: "amātis", english: "you (all) love" }, { latin: "amant", english: "they love" },
  ],
};
const AMO_IMPERFECT: VerbChart = {
  kind: "verb", id: "amo-imperfect", title: "1st Conjugation — Imperfect Tense", modelWord: "amō, amāre — to love",
  formationRule: "Present stem + -bā- (tense sign) + personal ending. \"Was/were ___ing.\"",
  rows: [
    { latin: "amābam", english: "I was loving" }, { latin: "amābās", english: "you were loving" }, { latin: "amābat", english: "he was loving" },
    { latin: "amābāmus", english: "we were loving" }, { latin: "amābātis", english: "you (all) were loving" }, { latin: "amābant", english: "they were loving" },
  ],
};
const AMO_FUTURE: VerbChart = {
  kind: "verb", id: "amo-future", title: "1st Conjugation — Future Tense", modelWord: "amō, amāre — to love",
  formationRule: "Present stem + -bi- (tense sign, but -bō in 1st sg. and -bu- in 3rd pl.) + personal ending.",
  rows: [
    { latin: "amābō", english: "I will love" }, { latin: "amābis", english: "you will love" }, { latin: "amābit", english: "he will love" },
    { latin: "amābimus", english: "we will love" }, { latin: "amābitis", english: "you (all) will love" }, { latin: "amābunt", english: "they will love" },
  ],
};
const AMO_PERFECT: VerbChart = {
  kind: "verb", id: "amo-perfect", title: "1st Conjugation — Perfect Tense", modelWord: "amō, amāre, amāvī — to love",
  formationRule: "Perfect stem (amāv-, from principal part 3) + perfect endings (different from every other tense).",
  rows: [
    { latin: "amāvī", english: "I loved / have loved" }, { latin: "amāvistī", english: "you loved" }, { latin: "amāvit", english: "he loved" },
    { latin: "amāvimus", english: "we loved" }, { latin: "amāvistis", english: "you (all) loved" }, { latin: "amāvērunt", english: "they loved" },
  ],
};
const AMO_PLUPERFECT: VerbChart = {
  kind: "verb", id: "amo-pluperfect", title: "1st Conjugation — Pluperfect Tense", modelWord: "amō, amāre, amāvī — to love",
  formationRule: "Perfect stem + endings identical to sum's imperfect (-eram, -erās...). \"Had ___ed.\"",
  rows: [
    { latin: "amāveram", english: "I had loved" }, { latin: "amāverās", english: "you had loved" }, { latin: "amāverat", english: "he had loved" },
    { latin: "amāverāmus", english: "we had loved" }, { latin: "amāverātis", english: "you (all) had loved" }, { latin: "amāverant", english: "they had loved" },
  ],
};
const AMO_FUTUREPERFECT: VerbChart = {
  kind: "verb", id: "amo-futureperfect", title: "1st Conjugation — Future Perfect Tense", modelWord: "amō, amāre, amāvī — to love",
  formationRule: "Perfect stem + endings matching sum's future — EXCEPT 3rd pl. is -erint, not -erunt. \"Will have ___ed.\"",
  rows: [
    { latin: "amāverō", english: "I will have loved" }, { latin: "amāveris", english: "you will have loved" }, { latin: "amāverit", english: "he will have loved" },
    { latin: "amāverimus", english: "we will have loved" }, { latin: "amāveritis", english: "you (all) will have loved" }, { latin: "amāverint", english: "they will have loved" },
  ],
};
const AMO_PRINCIPAL_PARTS: PrincipalPartsChart = {
  kind: "principal-parts", id: "amo-principal-parts", title: "1st Conjugation — Principal Parts",
  formationRule: "Regular 1st-conj.: drop -re from the infinitive, add -vī (perfect) and -tus (perfect passive participle).",
  regular: { parts: ["amō", "amāre", "amāvī", "amātus"], label: "amō (regular pattern)" },
  irregulars: [
    { latin: "dō", parts: ["dō", "dare", "dedī", "datus"], english: "to give" },
    { latin: "stō", parts: ["stō", "stāre", "stetī", "status"], english: "to stand" },
    { latin: "juvō", parts: ["juvō", "juvāre", "jūvī", "jūtus"], english: "to help" },
    { latin: "lavō", parts: ["lavō", "lavāre", "lāvī", "lautus"], english: "to wash" },
  ],
};

// ---- sum, esse, fuī (to be) — irregular ----
const SUM_PRESENT: VerbChart = {
  kind: "verb", id: "sum-present", title: "sum — Present Tense", modelWord: "sum, esse — to be",
  formationRule: "Irregular — no stable stem across tenses. Memorize as its own closed set, not by amō's ending logic.",
  rows: [
    { latin: "sum", english: "I am" }, { latin: "es", english: "you are" }, { latin: "est", english: "he/she/it is" },
    { latin: "sumus", english: "we are" }, { latin: "estis", english: "you (all) are" }, { latin: "sunt", english: "they are" },
  ],
};
const SUM_IMPERFECT: VerbChart = {
  kind: "verb", id: "sum-imperfect", title: "sum — Imperfect Tense", modelWord: "sum, esse — to be",
  formationRule: "Irregular imperfect stem er- + personal endings. These SAME endings get reused for amō's pluperfect.",
  rows: [
    { latin: "eram", english: "I was" }, { latin: "erās", english: "you were" }, { latin: "erat", english: "he was" },
    { latin: "erāmus", english: "we were" }, { latin: "erātis", english: "you (all) were" }, { latin: "erant", english: "they were" },
  ],
};
const SUM_FUTURE: VerbChart = {
  kind: "verb", id: "sum-future", title: "sum — Future Tense", modelWord: "sum, esse — to be",
  formationRule: "Irregular future stem er- + endings. These SAME endings get reused for amō's future perfect.",
  rows: [
    { latin: "erō", english: "I will be" }, { latin: "eris", english: "you will be" }, { latin: "erit", english: "he will be" },
    { latin: "erimus", english: "we will be" }, { latin: "eritis", english: "you (all) will be" }, { latin: "erunt", english: "they will be" },
  ],
};
const SUM_PERFECT: VerbChart = {
  kind: "verb", id: "sum-perfect", title: "sum — Perfect Tense", modelWord: "sum, esse, fuī — to be",
  formationRule: "Perfect stem fu- (from principal part fuī) + regular perfect endings.",
  rows: [
    { latin: "fuī", english: "I was / have been" }, { latin: "fuistī", english: "you were" }, { latin: "fuit", english: "he was" },
    { latin: "fuimus", english: "we were" }, { latin: "fuistis", english: "you (all) were" }, { latin: "fuērunt", english: "they were" },
  ],
};
const SUM_PLUPERFECT: VerbChart = {
  kind: "verb", id: "sum-pluperfect", title: "sum — Pluperfect Tense", modelWord: "sum, esse, fuī — to be",
  formationRule: "Perfect stem fu- + endings identical to sum's own imperfect. \"Had been.\"",
  rows: [
    { latin: "fueram", english: "I had been" }, { latin: "fuerās", english: "you had been" }, { latin: "fuerat", english: "he had been" },
    { latin: "fuerāmus", english: "we had been" }, { latin: "fuerātis", english: "you (all) had been" }, { latin: "fuerant", english: "they had been" },
  ],
};
const SUM_FUTUREPERFECT: VerbChart = {
  kind: "verb", id: "sum-futureperfect", title: "sum — Future Perfect Tense", modelWord: "sum, esse, fuī — to be",
  formationRule: "Perfect stem fu- + endings matching sum's own future, 3rd pl. -erint. \"Will have been.\"",
  rows: [
    { latin: "fuerō", english: "I will have been" }, { latin: "fueris", english: "you will have been" }, { latin: "fuerit", english: "he will have been" },
    { latin: "fuerimus", english: "we will have been" }, { latin: "fueritis", english: "you (all) will have been" }, { latin: "fuerint", english: "they will have been" },
  ],
};

// ---- 2nd conjugation: moneō, monēre, monuī, monitus (to warn) ----
const MONEO_PRESENT: VerbChart = {
  kind: "verb", id: "moneo-present", title: "2nd Conjugation — Present Tense", modelWord: "moneō, monēre — to warn",
  formationRule: "Same personal endings as amō — only the stem vowel changes (ā → ē). monet, not \"moniet.\"",
  rows: [
    { latin: "moneō", english: "I warn" }, { latin: "monēs", english: "you warn" }, { latin: "monet", english: "he warns" },
    { latin: "monēmus", english: "we warn" }, { latin: "monētis", english: "you (all) warn" }, { latin: "monent", english: "they warn" },
  ],
};
const MONEO_IMPERFECT: VerbChart = {
  kind: "verb", id: "moneo-imperfect", title: "2nd Conjugation — Imperfect Tense", modelWord: "moneō, monēre — to warn",
  formationRule: "Same -bā- tense sign as amō's imperfect, glued onto the monē- stem.",
  rows: [
    { latin: "monēbam", english: "I was warning" }, { latin: "monēbās", english: "you were warning" }, { latin: "monēbat", english: "he was warning" },
    { latin: "monēbāmus", english: "we were warning" }, { latin: "monēbātis", english: "you (all) were warning" }, { latin: "monēbant", english: "they were warning" },
  ],
};
const MONEO_FUTURE: VerbChart = {
  kind: "verb", id: "moneo-future", title: "2nd Conjugation — Future Tense", modelWord: "moneō, monēre — to warn",
  formationRule: "Same -bi-/-bō/-bu- tense sign as amō's future, glued onto the monē- stem.",
  rows: [
    { latin: "monēbō", english: "I will warn" }, { latin: "monēbis", english: "you will warn" }, { latin: "monēbit", english: "he will warn" },
    { latin: "monēbimus", english: "we will warn" }, { latin: "monēbitis", english: "you (all) will warn" }, { latin: "monēbunt", english: "they will warn" },
  ],
};
const MONEO_PERFECT: VerbChart = {
  kind: "verb", id: "moneo-perfect", title: "2nd Conjugation — Perfect Tense", modelWord: "moneō, monēre, monuī — to warn",
  formationRule: "Same perfect endings as amō's perfect — only the stem (monu-) differs.",
  rows: [
    { latin: "monuī", english: "I warned" }, { latin: "monuistī", english: "you warned" }, { latin: "monuit", english: "he warned" },
    { latin: "monuimus", english: "we warned" }, { latin: "monuistis", english: "you (all) warned" }, { latin: "monuērunt", english: "they warned" },
  ],
};
const MONEO_PLUPERFECT: VerbChart = {
  kind: "verb", id: "moneo-pluperfect", title: "2nd Conjugation — Pluperfect Tense", modelWord: "moneō, monēre, monuī — to warn",
  formationRule: "Perfect stem monu- + sum's imperfect endings — identical pattern to amō's pluperfect.",
  rows: [
    { latin: "monueram", english: "I had warned" }, { latin: "monuerās", english: "you had warned" }, { latin: "monuerat", english: "he had warned" },
    { latin: "monuerāmus", english: "we had warned" }, { latin: "monuerātis", english: "you (all) had warned" }, { latin: "monuerant", english: "they had warned" },
  ],
};
const MONEO_FUTUREPERFECT: VerbChart = {
  kind: "verb", id: "moneo-futureperfect", title: "2nd Conjugation — Future Perfect Tense", modelWord: "moneō, monēre, monuī — to warn",
  formationRule: "Perfect stem monu- + sum's future endings (3rd pl. -erint) — identical pattern to amō's future perfect.",
  rows: [
    { latin: "monuerō", english: "I will have warned" }, { latin: "monueris", english: "you will have warned" }, { latin: "monuerit", english: "he will have warned" },
    { latin: "monuerimus", english: "we will have warned" }, { latin: "monueritis", english: "you (all) will have warned" }, { latin: "monuerint", english: "they will have warned" },
  ],
};
const MONEO_PRINCIPAL_PARTS: PrincipalPartsChart = {
  kind: "principal-parts", id: "moneo-principal-parts", title: "2nd Conjugation — Principal Parts",
  formationRule: "Regular 2nd-conj.: drop -re from the infinitive, add -uī (perfect) and -itus (perfect passive participle).",
  regular: { parts: ["moneō", "monēre", "monuī", "monitus"], label: "moneō (regular pattern)" },
  irregulars: [
    { latin: "timeō", parts: ["timeō", "timēre", "timuī", "—"], english: "to fear" },
    { latin: "valeō", parts: ["valeō", "valēre", "valuī", "valitūrus"], english: "to be strong/well" },
    { latin: "doceō", parts: ["doceō", "docēre", "docuī", "doctus"], english: "to teach" },
    { latin: "teneō", parts: ["teneō", "tenēre", "tenuī", "tentus"], english: "to hold" },
    { latin: "ardeō", parts: ["ardeō", "ardēre", "arsī", "arsūrus"], english: "to burn" },
    { latin: "jubeō", parts: ["jubeō", "jubēre", "jussī", "jussus"], english: "to order" },
    { latin: "maneō", parts: ["maneō", "manēre", "mansī", "mansūrus"], english: "to remain" },
    { latin: "gaudeō", parts: ["gaudeō", "gaudēre", "gāvīsus sum", "—"], english: "to rejoice" },
    { latin: "caveō", parts: ["caveō", "cavēre", "cāvī", "cautus"], english: "to beware" },
    { latin: "sedeō", parts: ["sedeō", "sedēre", "sēdī", "sessūrus"], english: "to sit" },
    { latin: "videō", parts: ["videō", "vidēre", "vīdī", "vīsus"], english: "to see" },
    { latin: "respondeō", parts: ["respondeō", "respondēre", "respondī", "respōnsus"], english: "to answer" },
    { latin: "moveō", parts: ["moveō", "movēre", "mōvī", "mōtus"], english: "to move" },
  ],
};

// ---- Noun declensions ----
const MENSA_DECLENSION: DeclensionChart = {
  kind: "noun", id: "mensa-declension", title: "1st Declension", modelWord: "mensa, mensae, f. — table",
  formationRule: "Case endings replace English word order/prepositions — they mark a noun's JOB in the sentence. Case order: Never Good Dogs Go Around (Nom-Gen-Dat-Acc-Abl).",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["mensa", "mensae", "mensae", "mensam", "mensā"],
  plural: ["mensae", "mensārum", "mensīs", "mensās", "mensīs"],
};
const SERVUS_DECLENSION: DeclensionChart = {
  kind: "noun", id: "servus-declension", title: "2nd Declension (Masculine)", modelWord: "servus, servī, m. — servant",
  formationRule: "A constant that holds across EVERY declension: accusative singular always ends in -m.",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["servus", "servī", "servō", "servum", "servō"],
  plural: ["servī", "servōrum", "servīs", "servōs", "servīs"],
};
const BELLUM_DECLENSION: DeclensionChart = {
  kind: "noun", id: "bellum-declension", title: "2nd Declension (Neuter)", modelWord: "bellum, bellī, n. — war",
  formationRule: "The neuter rule (holds in every declension): nominative and accusative are always identical, and the plural of both always ends in -a.",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["bellum", "bellī", "bellō", "bellum", "bellō"],
  plural: ["bella", "bellōrum", "bellīs", "bella", "bellīs"],
};
const PATER_DECLENSION: DeclensionChart = {
  kind: "noun", id: "pater-declension", title: "3rd Declension (Masc./Fem.)", modelWord: "pater, patris, m. — father",
  formationRule: "No predictable nominative ending in 3rd declension — ALWAYS memorize the genitive singular (here, patris) to find the real stem (patr-).",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["pater", "patris", "patrī", "patrem", "patre"],
  plural: ["patrēs", "patrum", "patribus", "patrēs", "patribus"],
};
const NOMEN_DECLENSION: DeclensionChart = {
  kind: "noun", id: "nomen-declension", title: "3rd Declension (Neuter)", modelWord: "nōmen, nōminis, n. — name",
  formationRule: "Same neuter rule as bellum (nom./acc. identical, plural -a) — the case-ending SHAPES differ by declension, the rule doesn't.",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["nōmen", "nōminis", "nōminī", "nōmen", "nōmine"],
  plural: ["nōmina", "nōminum", "nōminibus", "nōmina", "nōminibus"],
};
const PORTUS_DECLENSION: DeclensionChart = {
  kind: "noun", id: "portus-declension", title: "4th Declension", modelWord: "portus, portūs, m. — harbor",
  formationRule: "Nominative -us LOOKS like 2nd declension — the genitive -ūs (long u) is the real giveaway. Always check the genitive.",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["portus", "portūs", "portuī", "portum", "portū"],
  plural: ["portūs", "portuum", "portibus", "portūs", "portibus"],
};
const RES_DECLENSION: DeclensionChart = {
  kind: "noun", id: "res-declension", title: "5th Declension", modelWord: "rēs, reī, f. — thing",
  formationRule: "Smallest, rarest declension. Easier to think of as \"drop -ēs from the nominative, add -eī\" than the general drop-the-genitive rule.",
  cases: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative"],
  singular: ["rēs", "reī", "reī", "rem", "rē"],
  plural: ["rēs", "rērum", "rēbus", "rēs", "rēbus"],
};

const BONUS_ADJECTIVE: AdjectiveChart = {
  kind: "adjective", id: "bonus-adjective", title: "1st/2nd Declension Adjective", modelWord: "bonus, bona, bonum — good",
  formationRule: "Nothing new in the endings themselves (same as mensa/servus/bellum) — the real skill is AGREEMENT: match gender, number, and case, never declension.",
  genders: [
    { gender: "Masculine", singular: ["bonus", "bonī", "bonō", "bonum", "bonō"], plural: ["bonī", "bonōrum", "bonīs", "bonōs", "bonīs"] },
    { gender: "Feminine", singular: ["bona", "bonae", "bonae", "bonam", "bonā"], plural: ["bonae", "bonārum", "bonīs", "bonās", "bonīs"] },
    { gender: "Neuter", singular: ["bonum", "bonī", "bonō", "bonum", "bonō"], plural: ["bona", "bonōrum", "bonīs", "bona", "bonīs"] },
  ],
};

const NUMBERS_1_10: NumbersChart = {
  kind: "numbers", id: "numbers-1-10", title: "Cardinal Numbers 1-10",
  formationRule: "1-3 (ūnus/duo/trēs) decline and agree with their noun's gender; 4-10 are indeclinable — same in every sentence.",
  numbers: [
    { latin: "ūnus, -a, -um", english: "one", value: 1 }, { latin: "duo, duae, duo", english: "two", value: 2 },
    { latin: "trēs, tria", english: "three", value: 3 }, { latin: "quattuor", english: "four", value: 4 },
    { latin: "quīnque", english: "five", value: 5 }, { latin: "sex", english: "six", value: 6 },
    { latin: "septem", english: "seven", value: 7 }, { latin: "octō", english: "eight", value: 8 },
    { latin: "novem", english: "nine", value: 9 }, { latin: "decem", english: "ten", value: 10 },
  ],
};

// Lesson n -> chart(s). Review weeks reference the SAME chart objects their component
// lessons already use (no duplicated data) so "review the last 3 weeks" genuinely shows
// the same charts, not a re-derived summary.
const LESSON_CHARTS: Record<number, GrammarChart[]> = {
  1: [AMO_PRESENT],
  2: [AMO_IMPERFECT],
  3: [AMO_FUTURE],
  4: [AMO_PRINCIPAL_PARTS],
  5: [SUM_PRESENT],
  6: [AMO_PRESENT, AMO_IMPERFECT, AMO_FUTURE, SUM_PRESENT, SUM_IMPERFECT, SUM_FUTURE],
  7: [AMO_PRINCIPAL_PARTS],
  8: [AMO_PERFECT],
  9: [AMO_PLUPERFECT],
  10: [AMO_FUTUREPERFECT],
  12: [AMO_PERFECT, AMO_PLUPERFECT, AMO_FUTUREPERFECT, SUM_PERFECT, SUM_PLUPERFECT, SUM_FUTUREPERFECT],
  14: [MENSA_DECLENSION],
  15: [SERVUS_DECLENSION],
  16: [BELLUM_DECLENSION],
  17: [MENSA_DECLENSION, SERVUS_DECLENSION, BELLUM_DECLENSION],
  18: [BONUS_ADJECTIVE],
  19: [NUMBERS_1_10],
  20: [MENSA_DECLENSION, SERVUS_DECLENSION, BELLUM_DECLENSION, BONUS_ADJECTIVE],
  21: [PATER_DECLENSION],
  22: [PATER_DECLENSION],
  23: [NOMEN_DECLENSION],
  24: [PATER_DECLENSION, NOMEN_DECLENSION],
  25: [PORTUS_DECLENSION],
  26: [RES_DECLENSION],
  27: [PATER_DECLENSION, NOMEN_DECLENSION, PORTUS_DECLENSION, RES_DECLENSION],
  28: [MENSA_DECLENSION, SERVUS_DECLENSION, BELLUM_DECLENSION, PATER_DECLENSION, NOMEN_DECLENSION, PORTUS_DECLENSION, RES_DECLENSION],
  29: [MONEO_PRESENT],
  30: [MONEO_IMPERFECT, MONEO_FUTURE],
  31: [MONEO_PRINCIPAL_PARTS],
  32: [MONEO_PERFECT, MONEO_PLUPERFECT, MONEO_FUTUREPERFECT],
  33: [AMO_PRESENT, AMO_IMPERFECT, AMO_FUTURE, AMO_PERFECT, AMO_PLUPERFECT, AMO_FUTUREPERFECT, MONEO_PRESENT, MONEO_IMPERFECT, MONEO_FUTURE, MONEO_PERFECT, MONEO_PLUPERFECT, MONEO_FUTUREPERFECT],
};

export function chartsForLesson(n: number): GrammarChart[] {
  return LESSON_CHARTS[n] ?? [];
}
