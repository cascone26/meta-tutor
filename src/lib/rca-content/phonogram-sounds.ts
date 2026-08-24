// Phonogram sound reference for LOE Essentials C (loe-essentials-c). This is
// STANDARD published phonics content (the Logic of English "basic phonograms"
// list is public teaching material, not a transcription of RCA's or LOE's
// copyrighted lesson-plan prose) — built from well-established phonics
// knowledge, not pulled from a specific RCA/LOE source doc. Cross-check
// against your physical LOE Essentials C phonogram flash cards before
// teaching a specific sound as "the" sound if a card ever seems to disagree
// (multi-sound phonograms in particular — LOE's own card order for e.g. "a"
// or "i" is the authority, this list gives every sound LOE teaches but may
// not always match their exact spoken-order convention).
//
// Every sound carries a real English keyword word (not an isolated phoneme)
// because that's both the LOE teaching method itself ("A says /ă/ as in
// apple") AND the only thing generic text-to-speech can pronounce reliably —
// TTS engines mangle bare phonemes ("th" alone often gets spelled out as
// letter names) but say real words correctly every time. Audio is
// pre-generated per keyword word (see scripts/gen-phonogram-audio.mjs) into
// public/audio/phonograms/<slug>.mp3, not synthesized live in the browser —
// consistent quality regardless of the device/browser a student is on.

export type PhonogramSound = {
  ipa: string;
  keyword: string; // real word carrying the sound, used for audio + as the teaching example
  note?: string;
};

export type Phonogram = {
  spelling: string;
  category: "single-letter vowel" | "single-letter consonant" | "multi-letter";
  sounds: PhonogramSound[];
};

export const phonograms: Phonogram[] = [
  // --- Single-letter vowels ---
  { spelling: "a", category: "single-letter vowel", sounds: [
    { ipa: "ă", keyword: "apple" }, { ipa: "ā", keyword: "acorn" }, { ipa: "ä", keyword: "father" },
  ]},
  { spelling: "e", category: "single-letter vowel", sounds: [
    { ipa: "ĕ", keyword: "elephant" }, { ipa: "ē", keyword: "eagle" },
  ]},
  { spelling: "i", category: "single-letter vowel", sounds: [
    { ipa: "ĭ", keyword: "igloo" }, { ipa: "ī", keyword: "ivy" },
    { ipa: "y", keyword: "onion", note: "consonant-y sound, rare — LOE's third sound for i" },
  ]},
  { spelling: "o", category: "single-letter vowel", sounds: [
    { ipa: "ŏ", keyword: "octopus" }, { ipa: "ō", keyword: "open" }, { ipa: "ö", keyword: "to" },
  ]},
  { spelling: "u", category: "single-letter vowel", sounds: [
    { ipa: "ŭ", keyword: "umbrella" }, { ipa: "ū", keyword: "unicorn" }, { ipa: "ü", keyword: "put" },
  ]},
  { spelling: "y", category: "single-letter vowel", sounds: [
    { ipa: "y", keyword: "yellow" }, { ipa: "ĭ", keyword: "gym" }, { ipa: "ī", keyword: "fly" },
  ]},

  // --- Single-letter consonants ---
  { spelling: "b", category: "single-letter consonant", sounds: [{ ipa: "b", keyword: "bat" }] },
  { spelling: "c", category: "single-letter consonant", sounds: [{ ipa: "k", keyword: "cat" }, { ipa: "s", keyword: "city" }] },
  { spelling: "d", category: "single-letter consonant", sounds: [{ ipa: "d", keyword: "dog" }] },
  { spelling: "f", category: "single-letter consonant", sounds: [{ ipa: "f", keyword: "fish" }] },
  { spelling: "g", category: "single-letter consonant", sounds: [{ ipa: "g", keyword: "gum" }, { ipa: "j", keyword: "giant" }] },
  { spelling: "h", category: "single-letter consonant", sounds: [{ ipa: "h", keyword: "hat" }] },
  { spelling: "j", category: "single-letter consonant", sounds: [{ ipa: "j", keyword: "jump" }] },
  { spelling: "k", category: "single-letter consonant", sounds: [{ ipa: "k", keyword: "kite" }] },
  { spelling: "l", category: "single-letter consonant", sounds: [{ ipa: "l", keyword: "lion" }] },
  { spelling: "m", category: "single-letter consonant", sounds: [{ ipa: "m", keyword: "moon" }] },
  { spelling: "n", category: "single-letter consonant", sounds: [{ ipa: "n", keyword: "nest" }] },
  { spelling: "p", category: "single-letter consonant", sounds: [{ ipa: "p", keyword: "pig" }] },
  { spelling: "qu", category: "single-letter consonant", sounds: [{ ipa: "kw", keyword: "queen" }] },
  { spelling: "r", category: "single-letter consonant", sounds: [{ ipa: "r", keyword: "rabbit" }] },
  { spelling: "s", category: "single-letter consonant", sounds: [{ ipa: "s", keyword: "sun" }, { ipa: "z", keyword: "rose" }] },
  { spelling: "t", category: "single-letter consonant", sounds: [{ ipa: "t", keyword: "top" }] },
  { spelling: "v", category: "single-letter consonant", sounds: [{ ipa: "v", keyword: "van" }] },
  { spelling: "w", category: "single-letter consonant", sounds: [{ ipa: "w", keyword: "wind" }] },
  { spelling: "x", category: "single-letter consonant", sounds: [{ ipa: "ks", keyword: "fox" }, { ipa: "z", keyword: "xylophone", note: "rare, word-initial only" }] },
  { spelling: "z", category: "single-letter consonant", sounds: [{ ipa: "z", keyword: "zebra" }] },

  // --- Multi-letter phonograms ---
  { spelling: "th", category: "multi-letter", sounds: [{ ipa: "th (unvoiced)", keyword: "think" }, { ipa: "th (voiced)", keyword: "the" }] },
  { spelling: "sh", category: "multi-letter", sounds: [{ ipa: "sh", keyword: "ship" }] },
  { spelling: "ch", category: "multi-letter", sounds: [{ ipa: "ch", keyword: "chip" }, { ipa: "k", keyword: "school" }, { ipa: "sh", keyword: "chef" }] },
  { spelling: "ph", category: "multi-letter", sounds: [{ ipa: "f", keyword: "phone" }] },
  { spelling: "wh", category: "multi-letter", sounds: [{ ipa: "w", keyword: "whale" }] },
  { spelling: "ck", category: "multi-letter", sounds: [{ ipa: "k", keyword: "duck" }] },
  { spelling: "ng", category: "multi-letter", sounds: [{ ipa: "ng", keyword: "sing" }] },
  { spelling: "nk", category: "multi-letter", sounds: [{ ipa: "ngk", keyword: "pink" }] },
  { spelling: "dge", category: "multi-letter", sounds: [{ ipa: "j", keyword: "bridge" }] },
  { spelling: "tch", category: "multi-letter", sounds: [{ ipa: "ch", keyword: "watch" }] },
  { spelling: "kn", category: "multi-letter", sounds: [{ ipa: "n", keyword: "knee" }] },
  { spelling: "wr", category: "multi-letter", sounds: [{ ipa: "r", keyword: "write" }] },
  { spelling: "gn", category: "multi-letter", sounds: [{ ipa: "n", keyword: "sign" }] },
  { spelling: "mb", category: "multi-letter", sounds: [{ ipa: "m", keyword: "comb" }] },
  { spelling: "ai", category: "multi-letter", sounds: [{ ipa: "ā", keyword: "rain" }] },
  { spelling: "ay", category: "multi-letter", sounds: [{ ipa: "ā", keyword: "day" }] },
  { spelling: "ee", category: "multi-letter", sounds: [{ ipa: "ē", keyword: "bee" }] },
  { spelling: "ea", category: "multi-letter", sounds: [{ ipa: "ē", keyword: "eat" }, { ipa: "ĕ", keyword: "bread" }, { ipa: "ā", keyword: "steak" }] },
  { spelling: "oa", category: "multi-letter", sounds: [{ ipa: "ō", keyword: "boat" }] },
  { spelling: "oe", category: "multi-letter", sounds: [{ ipa: "ō", keyword: "toe" }] },
  { spelling: "ow", category: "multi-letter", sounds: [{ ipa: "ō", keyword: "snow" }, { ipa: "ow", keyword: "cow" }] },
  { spelling: "ou", category: "multi-letter", sounds: [{ ipa: "ow", keyword: "loud" }, { ipa: "ū", keyword: "soup" }, { ipa: "ŭ", keyword: "country" }, { ipa: "ō", keyword: "soul" }] },
  { spelling: "oi", category: "multi-letter", sounds: [{ ipa: "oy", keyword: "coin" }] },
  { spelling: "oy", category: "multi-letter", sounds: [{ ipa: "oy", keyword: "boy" }] },
  { spelling: "oo", category: "multi-letter", sounds: [{ ipa: "ü", keyword: "moon" }, { ipa: "oo (short)", keyword: "book" }] },
  { spelling: "au", category: "multi-letter", sounds: [{ ipa: "aw", keyword: "author" }] },
  { spelling: "aw", category: "multi-letter", sounds: [{ ipa: "aw", keyword: "saw" }] },
  { spelling: "augh", category: "multi-letter", sounds: [{ ipa: "aw", keyword: "caught" }] },
  { spelling: "ough", category: "multi-letter", sounds: [{ ipa: "ō", keyword: "though" }, { ipa: "ü", keyword: "through" }, { ipa: "aw", keyword: "thought" }, { ipa: "ow", keyword: "plough" }, { ipa: "ŭf", keyword: "enough" }, { ipa: "ŏf", keyword: "cough" }] },
  { spelling: "ie", category: "multi-letter", sounds: [{ ipa: "ē", keyword: "chief" }, { ipa: "ī", keyword: "pie" }] },
  { spelling: "igh", category: "multi-letter", sounds: [{ ipa: "ī", keyword: "night" }] },
  { spelling: "ar", category: "multi-letter", sounds: [{ ipa: "är", keyword: "car" }] },
  { spelling: "or", category: "multi-letter", sounds: [{ ipa: "ör", keyword: "for" }] },
  { spelling: "er", category: "multi-letter", sounds: [{ ipa: "er", keyword: "her" }] },
  { spelling: "ir", category: "multi-letter", sounds: [{ ipa: "er", keyword: "bird" }] },
  { spelling: "ur", category: "multi-letter", sounds: [{ ipa: "er", keyword: "hurt" }] },
  { spelling: "ear", category: "multi-letter", sounds: [{ ipa: "er", keyword: "learn" }, { ipa: "ēr", keyword: "hear" }, { ipa: "ār", keyword: "bear" }] },
  { spelling: "tion", category: "multi-letter", sounds: [{ ipa: "shŭn", keyword: "nation" }] },
  { spelling: "sion", category: "multi-letter", sounds: [{ ipa: "zhŭn", keyword: "vision" }, { ipa: "shŭn", keyword: "mission" }] },
  { spelling: "eigh", category: "multi-letter", sounds: [{ ipa: "ā", keyword: "eight" }] },
  { spelling: "kn (silent k)", category: "multi-letter", sounds: [{ ipa: "n", keyword: "know" }] },
  { spelling: "dg", category: "multi-letter", sounds: [{ ipa: "j", keyword: "edge" }] },
  { spelling: "ce", category: "multi-letter", sounds: [{ ipa: "s", keyword: "dance", note: "c softened by a following silent e" }] },
  { spelling: "ge", category: "multi-letter", sounds: [{ ipa: "j", keyword: "cage", note: "g softened by a following silent e" }] },
];

// Flat, deduped list of every keyword word used above — this is exactly the
// audio-generation manifest (scripts/gen-phonogram-audio.mjs reads this).
export const phonogramKeywords: string[] = [
  ...new Set(phonograms.flatMap((p) => p.sounds.map((s) => s.keyword))),
];
