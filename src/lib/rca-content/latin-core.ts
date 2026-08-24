// Latin pronunciation + core vocabulary reference for First Form Latin 6
// (first-form-latin-6). Like phonogram-sounds.ts, this is STANDARD published
// Latin grammar/pronunciation content (2000+ years old, nobody owns "puella
// means girl" or "how classical Latin pronounces c") — not a transcription of
// Memoria Press's copyrighted lesson sequencing or exercises. Cross-check
// against your First Form Latin book's own pronunciation guide page before
// teaching: Memoria Press materials most commonly teach CLASSICAL
// pronunciation (below), but some Catholic classical schools use
// ECCLESIASTICAL (Church Latin) instead, especially where Latin also carries
// into hymns/chant — this file gives both systems side by side specifically
// so that check is fast.
//
// Every vocab/verb/noun entry carries an `english` phonetic respelling (not
// IPA) — real syllables a generic English TTS voice can read correctly,
// hand-built from the classical pronunciation rules below. This decouples
// correctness (the respelling, which I control) from playback (any TTS
// engine, which doesn't need to "know Latin"). Audio is pre-generated per
// respelling (see scripts/gen-latin-audio.mjs) into public/audio/latin/.

export type PronunciationRule = {
  letter: string;
  classical: string;
  ecclesiastical: string;
  example: string;
};

// Side-by-side classical vs ecclesiastical letter values — text reference,
// no audio needed here, just enough to sanity-check which system a given
// book/tutor uses.
export const pronunciationRules: PronunciationRule[] = [
  { letter: "c", classical: "always hard /k/ (\"cat\")", ecclesiastical: "soft \"ch\" before e/i/y/ae/oe (\"church\"), else hard /k/", example: "Cicero: classical KIH-keh-roh, ecclesiastical CHEE-cheh-roh" },
  { letter: "g", classical: "always hard /g/ (\"go\")", ecclesiastical: "soft \"j\" before e/i/y (\"giant\"), else hard /g/", example: "regina: classical reh-GEE-nah, ecclesiastical reh-JEE-nah" },
  { letter: "v", classical: "/w/ (\"wine\")", ecclesiastical: "/v/ (as in English)", example: "veni: classical WAY-nee, ecclesiastical VAY-nee" },
  { letter: "i (as consonant, between vowels)", classical: "/y/", ecclesiastical: "/y/", example: "iam: YAHM in both systems" },
  { letter: "ae", classical: "\"eye\" (like English \"eye\")", ecclesiastical: "\"eh\" (like café)", example: "puellae: classical poo-ELL-lye, ecclesiastical poo-ELL-leh" },
  { letter: "oe", classical: "\"oy\" (like \"boy\")", ecclesiastical: "\"eh\"", example: "poena: classical POY-nah, ecclesiastical PEH-nah" },
  { letter: "au", classical: "\"ow\" (like \"cow\")", ecclesiastical: "\"ow\" (same)", example: "aut: OWT in both systems" },
  { letter: "s", classical: "always unvoiced /s/ (\"sun\", never \"z\")", ecclesiastical: "/z/ between vowels", example: "rosa: classical ROH-sah, ecclesiastical ROH-zah" },
  { letter: "t", classical: "always /t/, even before \"i\" + vowel", ecclesiastical: "\"tsee\" before -tia/-tio (not after s/t/x)", example: "gratia: classical GRAH-tee-ah, ecclesiastical GRAH-tsee-ah" },
  { letter: "gn", classical: "hard /g/ + /n/", ecclesiastical: "\"ny\" (like Spanish ñ / \"canyon\")", example: "magnus: classical MAHG-nooss, ecclesiastical MAHN-yooss" },
  { letter: "h", classical: "silent or lightly breathed", ecclesiastical: "silent (except traditionally pronounced /k/ in mihi/nihil)", example: "mihi: classical MIH-hee, ecclesiastical traditionally MEE-kee" },
];

export type LatinItem = {
  latin: string;
  english: string; // meaning
  respelling: string; // classical pronunciation, English orthography, ALL-CAPS = stressed syllable
  note?: string;
};

// Core noun vocabulary — 1st declension (the group First Form Latin opens
// with), the most standard beginning-Latin word set there is.
export const latinNouns: LatinItem[] = [
  { latin: "puella", english: "girl", respelling: "poo-ELL-lah" },
  { latin: "agricola", english: "farmer", respelling: "ah-GRIH-koh-lah", note: "1st declension but masculine — a classic early exception taught on purpose" },
  { latin: "rosa", english: "rose", respelling: "ROH-sah" },
  { latin: "via", english: "road, way", respelling: "WEE-ah" },
  { latin: "aqua", english: "water", respelling: "AH-kwah" },
  { latin: "terra", english: "land, earth", respelling: "TEHR-rah" },
  { latin: "insula", english: "island", respelling: "IN-soo-lah" },
  { latin: "silva", english: "forest", respelling: "SIL-wah" },
  { latin: "fabula", english: "story", respelling: "FAH-boo-lah" },
  { latin: "regina", english: "queen", respelling: "reh-GEE-nah" },
  { latin: "femina", english: "woman", respelling: "FAY-mih-nah" },
  { latin: "familia", english: "family", respelling: "fah-MIH-lee-ah" },
  { latin: "patria", english: "fatherland, country", respelling: "PAH-tree-ah" },
  { latin: "villa", english: "country house", respelling: "WIL-lah" },
  { latin: "stella", english: "star", respelling: "STEL-lah" },
];

// Full 1st-declension case paradigm (puella) — standard grammar, applies
// regardless of which lesson introduces which case.
export const puellaDeclension = {
  singular: [
    { case: "Nominative", form: "puella", respelling: "poo-ELL-lah" },
    { case: "Genitive", form: "puellae", respelling: "poo-ELL-lye" },
    { case: "Dative", form: "puellae", respelling: "poo-ELL-lye" },
    { case: "Accusative", form: "puellam", respelling: "poo-ELL-lahm" },
    { case: "Ablative", form: "puellā", respelling: "poo-ELL-lah (long a)" },
  ],
  plural: [
    { case: "Nominative", form: "puellae", respelling: "poo-ELL-lye" },
    { case: "Genitive", form: "puellārum", respelling: "poo-ell-LAH-room" },
    { case: "Dative", form: "puellīs", respelling: "poo-ELL-leess" },
    { case: "Accusative", form: "puellās", respelling: "poo-ELL-lahss" },
    { case: "Ablative", form: "puellīs", respelling: "poo-ELL-leess" },
  ],
};

// sum (to be) — irregular, taught earliest of all.
export const sumConjugation: LatinItem[] = [
  { latin: "sum", english: "I am", respelling: "soom" },
  { latin: "es", english: "you (sg.) are", respelling: "ess" },
  { latin: "est", english: "he/she/it is", respelling: "est" },
  { latin: "sumus", english: "we are", respelling: "SOO-mooss" },
  { latin: "estis", english: "you (pl.) are", respelling: "ESS-tiss" },
  { latin: "sunt", english: "they are", respelling: "soont" },
  { latin: "esse", english: "to be (infinitive)", respelling: "ESS-seh" },
];

// amō (to love) — the model 1st-conjugation verb, and First Form Latin's own
// signature memory chant ("amo, amas, amat...").
export const amoConjugation: LatinItem[] = [
  { latin: "amō", english: "I love", respelling: "AH-moh" },
  { latin: "amās", english: "you (sg.) love", respelling: "AH-mahss" },
  { latin: "amat", english: "he/she/it loves", respelling: "AH-maht" },
  { latin: "amāmus", english: "we love", respelling: "ah-MAH-mooss" },
  { latin: "amātis", english: "you (pl.) love", respelling: "ah-MAH-tiss" },
  { latin: "amant", english: "they love", respelling: "AH-mahnt" },
  { latin: "amāre", english: "to love (infinitive)", respelling: "ah-MAH-reh" },
];

export const latinAdjectives: LatinItem[] = [
  { latin: "bonus, bona, bonum", english: "good", respelling: "BOH-nooss, BOH-nah, BOH-noom" },
  { latin: "magnus, magna, magnum", english: "great, big", respelling: "MAHG-nooss, MAHG-nah, MAHG-noom" },
  { latin: "parvus, parva, parvum", english: "small", respelling: "PAR-wooss, PAR-wah, PAR-woom" },
  { latin: "multus, multa, multum", english: "much, many", respelling: "MOOL-tooss, MOOL-tah, MOOL-toom" },
];

export const latinPrepositions: LatinItem[] = [
  { latin: "in", english: "in, into (+ abl./acc.)", respelling: "in" },
  { latin: "ad", english: "to, toward (+ acc.)", respelling: "ahd" },
  { latin: "cum", english: "with (+ abl.)", respelling: "koom" },
  { latin: "sine", english: "without (+ abl.)", respelling: "SIH-neh" },
  { latin: "dē", english: "down from, about (+ abl.)", respelling: "day" },
  { latin: "et", english: "and", respelling: "et" },
  { latin: "sed", english: "but", respelling: "sed" },
];

export const latinNumbers: LatinItem[] = [
  { latin: "unus", english: "one", respelling: "OO-nooss" },
  { latin: "duo", english: "two", respelling: "DOO-oh" },
  { latin: "trēs", english: "three", respelling: "trayss" },
  { latin: "quattuor", english: "four", respelling: "KWAH-too-or" },
  { latin: "quīnque", english: "five", respelling: "KWIN-kweh" },
  { latin: "sex", english: "six", respelling: "sex" },
  { latin: "septem", english: "seven", respelling: "SEP-tem" },
  { latin: "octō", english: "eight", respelling: "OK-toh" },
  { latin: "novem", english: "nine", respelling: "NOH-wem" },
  { latin: "decem", english: "ten", respelling: "DEH-kem" },
];

// Well-known Latin phrases (all public-domain classical Latin — Caesar,
// Horace, US national mottos — not claimed to be FFL's specific per-lesson
// sayings) kept here for extra pronunciation practice and classroom color.
export const latinSayings: LatinItem[] = [
  { latin: "Amō, amās, amat", english: "I love, you love, he/she loves", respelling: "AH-moh, AH-mahss, AH-maht", note: "the amō chant itself" },
  { latin: "Vēnī, vīdī, vīcī", english: "I came, I saw, I conquered", respelling: "WAY-nee, WEE-dee, WEE-kee", note: "Julius Caesar" },
  { latin: "Carpe diem", english: "seize the day", respelling: "KAR-peh DEE-em", note: "Horace" },
  { latin: "Ālea iacta est", english: "the die is cast", respelling: "AH-leh-ah YAHK-tah est", note: "Julius Caesar, crossing the Rubicon" },
  { latin: "Ē plūribus ūnum", english: "out of many, one", respelling: "ay PLOO-rih-booss OO-noom", note: "US national motto" },
];

// Flat, deduped list of every respelling used above — the audio-generation
// manifest (scripts/gen-latin-audio.mjs reads this).
export const latinAudioManifest: { respelling: string; label: string }[] = (() => {
  const seen = new Map<string, string>();
  const add = (items: LatinItem[]) => {
    for (const it of items) {
      const parts = it.respelling.split(",").map((s) => s.trim().replace(/\s*\(.*\)$/, ""));
      const latinParts = it.latin.split(",").map((s) => s.trim());
      parts.forEach((r, i) => { if (r && !seen.has(r)) seen.set(r, latinParts[i] ?? it.latin); });
    }
  };
  add(latinNouns);
  add(sumConjugation);
  add(amoConjugation);
  add(latinAdjectives);
  add(latinPrepositions);
  add(latinNumbers);
  add(latinSayings);
  puellaDeclension.singular.concat(puellaDeclension.plural).forEach((f) => {
    const r = f.respelling.replace(/\s*\(.*\)$/, "");
    if (!seen.has(r)) seen.set(r, f.form);
  });
  return [...seen.entries()].map(([respelling, label]) => ({ respelling, label }));
})();
