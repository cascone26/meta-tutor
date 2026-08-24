// Latin pronunciation + core vocabulary reference for First Form Latin 6
// (first-form-latin-6). Like phonogram-sounds.ts, this is STANDARD published
// Latin grammar content (2000+ years old, nobody owns "puella means girl") —
// not a transcription of Memoria Press's copyrighted lesson sequencing.
//
// RCA uses ECCLESIASTICAL (Church Latin) pronunciation, confirmed by Jacob —
// not classical. That's the only system below; classical is kept in the
// comparison table purely as a "here's the difference" reference in case a
// resource he's cross-checking against uses it.
//
// Audio is generated from a REAL Italian neural voice (edge-tts it-IT-*)
// reading each word's spelling adjusted for the 2 real gaps between Latin and
// Italian spelling (ae/oe -> e, ti+vowel -> zi — see
// src/lib/latin-ecclesiastical-spelling.ts for why that works) — not a
// hand-guessed English-orthography respelling read by an English voice,
// which is what produced unusable audio the first time around. Every
// generated file is verified by round-tripping it through Whisper speech
// recognition and checking the transcription actually matches (see
// scripts/gen-latin-audio.mjs) — that's the actual "listen and grade it"
// check, since Claude has no ears of its own.

export type PronunciationRule = {
  letter: string;
  ecclesiastical: string;
  classical: string;
  example: string;
};

export const pronunciationRules: PronunciationRule[] = [
  { letter: "c", ecclesiastical: "soft \"ch\" before e/i/y/ae/oe (\"church\"), else hard /k/", classical: "always hard /k/ (\"cat\")", example: "Cicero: ecclesiastical CHEE-cheh-roh, classical KIH-keh-roh" },
  { letter: "g", ecclesiastical: "soft \"j\" before e/i/y (\"giant\"), else hard /g/", classical: "always hard /g/ (\"go\")", example: "regina: ecclesiastical reh-JEE-nah, classical reh-GEE-nah" },
  { letter: "v", ecclesiastical: "/v/ (as in English)", classical: "/w/ (\"wine\")", example: "veni: ecclesiastical VAY-nee, classical WAY-nee" },
  { letter: "i (as consonant, between vowels)", ecclesiastical: "/y/", classical: "/y/", example: "iam: YAHM in both systems" },
  { letter: "ae", ecclesiastical: "\"eh\" (like café)", classical: "\"eye\" (like English \"eye\")", example: "puellae: ecclesiastical poo-ELL-leh, classical poo-ELL-lye" },
  { letter: "oe", ecclesiastical: "\"eh\"", classical: "\"oy\" (like \"boy\")", example: "poena: ecclesiastical PEH-nah, classical POY-nah" },
  { letter: "au", ecclesiastical: "\"ow\" (like \"cow\")", classical: "\"ow\" (same)", example: "aut: OWT in both systems" },
  { letter: "s", ecclesiastical: "/z/ between vowels", classical: "always unvoiced /s/ (\"sun\", never \"z\")", example: "rosa: ecclesiastical ROH-zah, classical ROH-sah" },
  { letter: "t", ecclesiastical: "\"tsee\" before -tia/-tio (not after s/t/x)", classical: "always /t/, even before \"i\" + vowel", example: "gratia: ecclesiastical GRAH-tsee-ah, classical GRAH-tee-ah" },
  { letter: "gn", ecclesiastical: "\"ny\" (like Spanish ñ / \"canyon\")", classical: "hard /g/ + /n/", example: "magnus: ecclesiastical MAHN-yooss, classical MAHG-nooss" },
  { letter: "h", ecclesiastical: "silent (except traditionally pronounced /k/ in mihi/nihil)", classical: "silent or lightly breathed", example: "mihi: ecclesiastical traditionally MEE-kee, classical MIH-hee" },
];

export type LatinItem = {
  latin: string;
  english: string; // meaning
  note?: string;
};

// Core noun vocabulary — 1st declension (the group First Form Latin opens
// with), the most standard beginning-Latin word set there is.
export const latinNouns: LatinItem[] = [
  { latin: "puella", english: "girl" },
  { latin: "agricola", english: "farmer", note: "1st declension but masculine — a classic early exception taught on purpose" },
  { latin: "rosa", english: "rose" },
  { latin: "via", english: "road, way" },
  { latin: "aqua", english: "water" },
  { latin: "terra", english: "land, earth" },
  { latin: "insula", english: "island" },
  { latin: "silva", english: "forest" },
  { latin: "fabula", english: "story" },
  { latin: "regina", english: "queen" },
  { latin: "femina", english: "woman" },
  { latin: "familia", english: "family" },
  { latin: "patria", english: "fatherland, country" },
  { latin: "villa", english: "country house" },
  { latin: "stella", english: "star" },
];

// Full 1st-declension case paradigm (puella) — standard grammar, applies
// regardless of which lesson introduces which case.
export const puellaDeclension = {
  singular: [
    { case: "Nominative", form: "puella" },
    { case: "Genitive", form: "puellae" },
    { case: "Dative", form: "puellae" },
    { case: "Accusative", form: "puellam" },
    { case: "Ablative", form: "puellā" },
  ],
  plural: [
    { case: "Nominative", form: "puellae" },
    { case: "Genitive", form: "puellārum" },
    { case: "Dative", form: "puellīs" },
    { case: "Accusative", form: "puellās" },
    { case: "Ablative", form: "puellīs" },
  ],
};

// sum (to be) — irregular, taught earliest of all.
export const sumConjugation: LatinItem[] = [
  { latin: "sum", english: "I am" },
  { latin: "es", english: "you (sg.) are" },
  { latin: "est", english: "he/she/it is" },
  { latin: "sumus", english: "we are" },
  { latin: "estis", english: "you (pl.) are" },
  { latin: "sunt", english: "they are" },
  { latin: "esse", english: "to be (infinitive)" },
];

// amō (to love) — the model 1st-conjugation verb, and First Form Latin's own
// signature memory chant ("amo, amas, amat...").
export const amoConjugation: LatinItem[] = [
  { latin: "amō", english: "I love" },
  { latin: "amās", english: "you (sg.) love" },
  { latin: "amat", english: "he/she/it loves" },
  { latin: "amāmus", english: "we love" },
  { latin: "amātis", english: "you (pl.) love" },
  { latin: "amant", english: "they love" },
  { latin: "amāre", english: "to love (infinitive)" },
];

export const latinAdjectives: LatinItem[] = [
  { latin: "bonus, bona, bonum", english: "good" },
  { latin: "magnus, magna, magnum", english: "great, big" },
  { latin: "parvus, parva, parvum", english: "small" },
  { latin: "multus, multa, multum", english: "much, many" },
];

export const latinPrepositions: LatinItem[] = [
  { latin: "in", english: "in, into (+ abl./acc.)" },
  { latin: "ad", english: "to, toward (+ acc.)" },
  { latin: "cum", english: "with (+ abl.)" },
  { latin: "sine", english: "without (+ abl.)" },
  { latin: "dē", english: "down from, about (+ abl.)" },
  { latin: "et", english: "and" },
  { latin: "sed", english: "but" },
];

export const latinNumbers: LatinItem[] = [
  { latin: "unus", english: "one" },
  { latin: "duo", english: "two" },
  { latin: "trēs", english: "three" },
  { latin: "quattuor", english: "four" },
  { latin: "quīnque", english: "five" },
  { latin: "sex", english: "six" },
  { latin: "septem", english: "seven" },
  { latin: "octō", english: "eight" },
  { latin: "novem", english: "nine" },
  { latin: "decem", english: "ten" },
];

// Well-known Latin phrases (all public-domain classical Latin — Caesar,
// Horace, US national mottos — not claimed to be FFL's specific per-lesson
// sayings) kept here for extra pronunciation practice and classroom color.
export const latinSayings: LatinItem[] = [
  { latin: "Amō, amās, amat", english: "I love, you love, he/she loves", note: "the amō chant itself" },
  { latin: "Vēnī, vīdī, vīcī", english: "I came, I saw, I conquered", note: "Julius Caesar" },
  { latin: "Carpe diem", english: "seize the day", note: "Horace" },
  { latin: "Ālea iacta est", english: "the die is cast", note: "Julius Caesar, crossing the Rubicon" },
  { latin: "Ē plūribus ūnum", english: "out of many, one", note: "US national motto" },
];

// Flat, deduped list of every distinct Latin form used above — the
// audio-generation manifest (scripts/gen-latin-audio.mjs reads this and
// derives each file's TTS spelling + expected-transcript check itself).
export const latinAudioManifest: string[] = (() => {
  const seen = new Set<string>();
  const add = (items: LatinItem[]) => {
    for (const it of items) {
      for (const form of it.latin.split(",").map((s) => s.trim())) seen.add(form);
    }
  };
  add(latinNouns);
  add(sumConjugation);
  add(amoConjugation);
  add(latinAdjectives);
  add(latinPrepositions);
  add(latinNumbers);
  add(latinSayings);
  puellaDeclension.singular.concat(puellaDeclension.plural).forEach((f) => seen.add(f.form));
  return [...seen];
})();
