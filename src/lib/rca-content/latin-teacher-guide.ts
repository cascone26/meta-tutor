// Real per-lesson teaching guide for First Form Latin 6 — built for JACOB, not the
// student-facing quiz generators. First Form Latin is a subject most RCA tutors are
// teaching one lesson ahead of their own mastery, so this exists to actually build
// Jacob's own understanding of the grammar alongside his prep, not just hand the AI
// tutor more facts to quiz students on (see science-6-experiments.ts, saxon-76.ts for
// that side of things — this file is the other half Jacob asked for directly,
// 2026-09-09: "did u use those resources to give me better learning and teaching and
// personal growth in those areas, particularly latin?").
//
// Sourced from Jacob's own physical copy of the Memoria Press First Form Latin
// Teacher Guide (photographed page-by-page, ~/Desktop/MT;RCAmaterial) — the real
// "Grammar - Chalk Talk" scripts, the specific mix-ups the guide itself calls out
// (e.g. Lesson X's perfect vs. future-perfect 3rd-plural confusion, Lesson XVIII's
// "the difficulty is in agreement, not new endings"), and real mnemonics it teaches
// (Never Good Dogs Go Around for case order, the Disappearing Line Technique for
// memorization). Paraphrased/condensed into original explanations, same
// paraphrase-not-copy approach as every other content file here — this is NOT a
// transcription of the copyrighted Teacher Guide text. Lesson XI wasn't among the
// photographed pages, so it's the one real gap here — left out rather than guessed.

export type LatinLessonGuide = {
  n: number; // Roman-numeral lesson number, matches "Lesson XIV" etc. in first-form-latin-6.ts's pacing text
  roman: string;
  title: string;
  /** Plain-English explanation of the grammar concept itself — written so Jacob genuinely
   * understands WHY the rule works, not just what to write on the board. */
  concept: string;
  /** The real teaching technique/emphasis from the Teacher Guide's own "Grammar - Chalk Talk"
   * section for this lesson — what to build on the board and in what order. */
  teachingTip: string;
  /** The specific mix-up the Teacher Guide itself flags for this lesson — what to watch for
   * when checking student work. */
  watchFor: string;
};

export const latinTeacherGuide: LatinLessonGuide[] = [
  {
    n: 1, roman: "I", title: "First Conjugation Present Tense",
    concept: "A Latin verb is a stem (the root meaning) plus a personal ending, and the ending alone tells you who's doing the action — amō/amās/amat/amāmus/amātis/amant each already mean \"I/you/he/we/y'all/they love\" with no separate subject word needed. English needs \"I love\" as two words; Latin folds the subject into the verb ending. That single fact is the whole engine behind everything else this year — case endings on nouns work the same way, telling you a noun's JOB instead of relying on word order.",
    teachingTip: "Build the chart live on the board rather than showing it finished — write the English pronouns (I, you, he/she/it, we, you-all, they) first, then only after that add the Latin stem (ama-) and point to each personal ending as it goes on, so the stem/ending split is visibly separate from day one.",
    watchFor: "The only irregular-looking form in the whole present tense is 1st singular amō (not \"amoō\") — the stem vowel a and the ending ō just contract. Everything else is a clean stem+ending glue job.",
  },
  {
    n: 2, roman: "II", title: "First Conjugation Imperfect Tense",
    concept: "Imperfect means \"not finished\" in Latin, and describes a repeated, ongoing, or interrupted past action — \"I was loving\" / \"I used to love,\" never a one-time completed action. It's built by inserting the tense sign -ba- between the stem and the SAME personal endings already learned in Lesson I: amābam, amābās, amābat, amābāmus, amābātis, amābant.",
    teachingTip: "Don't teach this as a new chart to memorize from scratch — literally take the present-tense chart already on the board from Lesson I and insert -ba- into every slot in front of the class, so imperfect visibly IS the present chart plus one inserted syllable.",
    watchFor: "English blurs this distinction (\"I loved\" could mean either a single event or a habit), so the reliable gloss to teach is \"was ___ing\" — if a student's English translation can take \"was/were ___ing,\" it's imperfect.",
  },
  {
    n: 3, roman: "III", title: "First Conjugation Future Tense",
    concept: "Future tense sign is -bi- (with two irregular spots: -bo in 1st singular, -bu- in 3rd plural): amābō, amābis, amābit, amābimus, amābitis, amābunt.",
    teachingTip: "Since -ba- (imperfect) and -bi-/-bo-/-bu- (future) look and sound similar, build both tense charts side by side on the board and have students say them aloud back-to-back — the ear catches the difference faster than the eye does.",
    watchFor: "This is the single most common tense-sign mix-up in First Form: students write amābat (imperfect, \"he was loving\") when they mean amābit (future, \"he will love\"), because -a- and -i- are easy to blur when reciting quickly.",
  },
  {
    n: 4, roman: "IV", title: "Present System Review + the Infinitive & Principal Parts",
    concept: "The infinitive (amāre, \"to love\") is a verb's dictionary form — the one a Latin dictionary lists first, the way an English dictionary entry for \"walk\" implies walked/walked/walking. Recognizing which of the (eventually four) conjugations a verb belongs to is entirely about the infinitive ending: -āre means 1st conjugation, full stop.",
    teachingTip: "Build a small chart of English irregular verbs (walk/walked/walked vs. see/saw/seen) first, so students already have the idea of \"a verb has multiple required forms\" in their own language before principal parts get introduced as Latin's version of the same idea.",
    watchFor: "Students will try to memorize principal parts as isolated forms instead of building them off the present-tense stem they already know — keep tying every new form back to the amō chart already on the wall.",
  },
  {
    n: 5, roman: "V", title: "Irregular Verb sum (Present System)",
    concept: "Sum (\"to be\") is irregular because its stem isn't stable across tenses the way amō's is — sum, es, est, sumus, estis, sunt. It's also the single most common verb students will meet for the rest of the year (every predicate-nominative sentence — \"the girl IS good\" — runs through it), so it earns being over-drilled now.",
    teachingTip: "Explicitly contrast sum with amō on the board: point out that amō's stem (ama-) never changes, but sum's forms don't share an obvious common stem at all — that's literally what \"irregular\" means here, made visible rather than just asserted.",
    watchFor: "Students default to translating sum's forms with amō's personal-ending logic (assuming -s always means \"you,\" etc.) instead of just memorizing the sum forms as their own small, closed set.",
  },
  {
    n: 6, roman: "VI", title: "Unit I Review — Milestone Marker 1",
    concept: "No new grammar — this is a consolidation and mastery-testing week for everything in Unit I: amō in all three present-system tenses (present/imperfect/future) plus sum in the same three tenses.",
    teachingTip: "The Teacher Guide frames this explicitly as a milestone to celebrate, not just a test — worth actually saying out loud to the class: \"three weeks ago you knew zero Latin, now you can recite 30 verbs in three tenses.\" That framing genuinely helps retention, not just morale.",
    watchFor: "Because this is pure review, the real risk is treating it as a throwaway week — the Teacher Guide's own mastery checklist (recite amō/any 1st-conj verb/sum with meanings, spell all 30 vocab words both directions, give a synopsis) is worth actually running as a real spot-check, not skipping.",
  },
  {
    n: 7, roman: "VII", title: "Principal Parts, First Conjugation",
    concept: "Every Latin verb has four principal parts (1st singular present, infinitive, 1st singular perfect, perfect passive participle). For REGULAR 1st-conjugation verbs, parts 3 and 4 are fully predictable from part 2: drop -re from the infinitive and add -vī and -tus — amō, amāre, amāvī, amātus. A handful of common verbs (do, sto, juvo, lavo) are irregular here and have to be memorized individually rather than derived.",
    teachingTip: "This is the lesson where \"why do I need four forms per verb\" finally has a real payoff — parts 1-2 are what students already have; parts 3-4 are the KEY that unlocks perfect/pluperfect/future perfect starting next lesson. Say that connection out loud rather than letting it feel like more rote memorization.",
    watchFor: "The four irregular verbs (do, sto, juvo, lavo) need to be said aloud repeatedly and separately from the regular pattern — mixing them into general drilling lets students quietly assume they follow the regular rule, which they don't.",
  },
  {
    n: 8, roman: "VIII", title: "First Conjugation Perfect Tense",
    concept: "Perfect tense describes a one-time, completed past action (\"I loved\" / \"I have loved\") — built by dropping the -ī from the 3rd principal part to get the perfect stem, then adding a NEW set of endings (-ī, -istī, -it, -imus, -istis, -ērunt) that are different from every other tense's personal endings: amāvī, amāvistī, amāvit, amāvimus, amāvistis, amāvērunt.",
    teachingTip: "Write the perfect stem (amāv-) next to the present stem (ama-) so the two-stem system is visible from the start — everything built on the perfect stem for the rest of the year (pluperfect, future perfect) will reuse amāv-, never ama-.",
    watchFor: "The Teacher Guide specifically flags the 2nd person forms (-istī singular vs. -istis plural) as easily confused by students, and separately notes the 3rd plural's English helping verb is \"have,\" not \"has,\" even though \"they\" is plural — a small English-side trap, not a Latin one.",
  },
  {
    n: 9, roman: "IX", title: "First Conjugation Pluperfect Tense",
    concept: "Pluperfect means \"had ___ed\" — a past action completed before ANOTHER past action (\"I had finished my homework before the doorbell rang\"). It uses the perfect stem plus endings identical to sum's imperfect: amāveram, amāverās, amāverat, amāverāmus, amāverātis, amāverant.",
    teachingTip: "Since these endings are literally sum's imperfect endings recycled, have students recite sum's imperfect first, then immediately recite the pluperfect right after — the echo makes the \"reused endings\" pattern obvious instead of feeling like new material.",
    watchFor: "Nothing new to confuse here structurally, but students who never solidly memorized sum's imperfect in Lesson V will feel this lesson as much harder than it is — worth a 2-minute sum-imperfect refresher before starting.",
  },
  {
    n: 10, roman: "X", title: "First Conjugation Future Perfect Tense",
    concept: "Future perfect means \"will have ___ed\" — a future action that will be completed before ANOTHER future action. Endings match sum's future tense, with ONE exception: 3rd person plural is -erint, not -erunt.",
    teachingTip: "The Teacher Guide calls this out directly as the lesson's core teaching point — put perfect (\"amāvērunt\"), pluperfect, and future perfect (\"amāverint\") 3rd-plural forms side by side on the board specifically to drill the -ērunt vs. -erint distinction, since they're one vowel apart and constantly confused.",
    watchFor: "This is the single named trouble spot in the whole First Conjugation sequence per the Teacher Guide itself — perfect 3rd plural -ērunt and future perfect 3rd plural -erint look and sound almost identical. Expect it, and check for it specifically on quizzes rather than assuming it'll sort itself out.",
  },
  {
    n: 12, roman: "XII", title: "Unit II Review — Perfect System (1st Conj. & sum)",
    concept: "Consolidation week: the full Perfect System (perfect/pluperfect/future perfect) of both amō and sum, all six tenses total now in play for 1st-conjugation verbs.",
    teachingTip: "Same milestone framing as Lesson VI — worth explicitly saying that students now know a regular verb in ALL SIX Latin tenses, which is more than most beginners get to in a full year of study.",
    watchFor: "Since Lesson XI (not photographed in this material) sits between Lesson X and this review, double-check Jacob's own lesson-plan doc for what XI actually covers before assuming this review is purely repetition of IX-X.",
  },
  {
    n: 13, roman: "XIII", title: "Units I & II Review — Milestone Marker 2",
    concept: "Full review of everything so far: amō and sum in all six tenses, all First Conjugation vocabulary and derivatives. Note: RCA's own pacing deliberately SKIPS this lesson number this year (see first-form-latin-6.ts) — it exists in the book but isn't taught in 2026-2027.",
    teachingTip: "Since this lesson is skipped in RCA's pacing, this entry is here for reference only (e.g. if a student needs the year-1 material summarized, or Jacob wants the milestone framing for his own sense of where the class actually stands after Lesson XII).",
    watchFor: "Don't accidentally teach this as if it were on the pacing calendar — the real jump this year goes from Lesson XII straight to Lesson XIV.",
  },
  {
    n: 14, roman: "XIV", title: "First Declension (Unit III Introduction)",
    concept: "Nouns belong to 5 \"declensions\" (families) the same way verbs belong to conjugations. The 1st declension model noun is mensa (table): stem mens-, with case endings nominative -a, genitive -ae, dative -ae, accusative -am, ablative -ā (long a), and plural -ae/-ārum/-īs/-ās/-īs. Cases replace what English does with word order and prepositions — they tell you a noun's JOB in the sentence (subject, possessive, indirect object, direct object, object of a preposition).",
    teachingTip: "Teach the case order with the mnemonic the Teacher Guide itself uses: \"Never Good Dogs Go Around\" for Nominative-Genitive-Dative-Accusative-Ablative. This is worth having memorized cold before Lesson XIV even starts, since every declension from here on gets taught in this exact case order.",
    watchFor: "1st declension nouns are USUALLY feminine by grammatical gender — but agricola (farmer) is a deliberately-placed early exception, masculine because it names a male person (natural gender always trumps the declension's default gender). Flag this explicitly rather than letting students assume 1st declension = always feminine.",
  },
  {
    n: 15, roman: "XV", title: "Second Declension (Masculine, -us/-ī)",
    concept: "Model noun servus (servant): stem serv-, singular endings -us/-ī/-ō/-um/-ō, plural -ī/-ōrum/-īs/-ōs/-īs.",
    teachingTip: "Point out the one pattern that holds across EVERY declension all year, starting now: the accusative singular always ends in -m. That's a genuine constant students can lean on even before they've memorized a specific declension's full chart.",
    watchFor: "Genitive singular and nominative plural are both -ī — visually and audibly identical. Students need context (is it modifying a noun, or standing alone as a subject?) to tell them apart, not the ending itself.",
  },
  {
    n: 16, roman: "XVI", title: "Second Declension Neuter (-um/-a)",
    concept: "Model noun bellum (war). This introduces \"the neuter rule,\" which holds in every declension all year: nominative and accusative forms are ALWAYS identical for a neuter noun, and the neuter plural nominative/accusative always ends in -a.",
    teachingTip: "State the neuter rule as a rule, explicitly, the first time it comes up — it's not a coincidence specific to bellum, it's a structural fact about Latin grammar that will keep reappearing (3rd, 4th declension neuters all follow it too).",
    watchFor: "English words that keep their Latin plural (\"data,\" \"media,\" \"curricula\") are neuter nouns' -a plural ending hiding in plain sight in English — a good derivative hook for making the neuter rule stick.",
  },
  {
    n: 17, roman: "XVII", title: "First & Second Declension Review",
    concept: "No new grammar — a full week purely for over-learning before 3rd-5th declension. The Teacher Guide is explicit about why: students who haven't solidly mastered 1st/2nd declension cannot successfully learn the harder declensions layered on top.",
    teachingTip: "Resist the urge to rush past this as \"just review\" — the Teacher Guide treats it as load-bearing, not filler, precisely because the payoff (or cost) shows up two lessons later.",
    watchFor: "This is the last easy week before 3rd declension's variable nominative endings arrive — worth using it to genuinely diagnose which students are shaky, not just to recite through material everyone already has.",
  },
  {
    n: 18, roman: "XVIII", title: "First & Second Declension Adjectives",
    concept: "A 1st/2nd declension adjective (bonus, bona, bonum) uses case endings students already know from mensa/servus/bellum — there is NOTHING NEW to memorize in the endings themselves. The actual difficulty is the concept of AGREEMENT: an adjective must match its noun in gender, number, and case, but NOT necessarily in declension (a 1st/2nd adjective can modify a 3rd declension noun just fine, as long as gender/number/case line up).",
    teachingTip: "Say this framing out loud to the class directly, since the Teacher Guide itself calls it out: \"there's actually nothing new to learn in this chart — the challenge is agreement, not endings.\" That reframing alone reduces a lot of unnecessary anxiety about an 18-form chart.",
    watchFor: "Students conflate \"agreement\" with \"same declension\" — an adjective agreeing with a noun means same gender/number/case, full stop, regardless of which declension family the noun itself belongs to.",
  },
  {
    n: 19, roman: "XIX", title: "Numbers 1-10; Predicate Nominative",
    concept: "Cardinal numbers (one, two, three...) are mostly indeclinable at this level except ūnus/duo/trēs; ordinal numbers (first, second...) decline like a regular 1st/2nd adjective. This lesson also introduces the predicate nominative: with a linking verb like sum, BOTH sides of \"is\" are nominative (\"Puella est bona\" — the girl IS good — bona is nominative, not accusative, because it renames/describes the subject rather than receiving the action).",
    teachingTip: "Diagram a predicate-nominative sentence on the board (subject — linking verb — predicate adjective) so students see visually why the second word isn't a direct object, before they meet an actual direct object sentence to contrast it against.",
    watchFor: "Students default to assuming the word right after the verb is always a direct object (accusative) — flag explicitly that sum is the exception this year: it's a linking verb, so nothing after it can be a direct object.",
  },
  {
    n: 20, roman: "XX", title: "Unit III Review — Mini-Milestone",
    concept: "Consolidation of the full 1st/2nd declension system: three model nouns (mensa, servus, bellum), 1st/2nd declension adjectives, and cardinal/ordinal numbers 1-10.",
    teachingTip: "The Teacher Guide frames this as a \"mini\"-milestone specifically because 3 of 5 declensions and 2 of 5 remain — worth naming that explicitly so students see concrete progress without over-claiming they're closer to done than they are.",
    watchFor: "Same discipline as every review week — use the Teacher Guide's own mastery checklist (decline all 3 model nouns from memory, spell all 30 nouns/adjectives both directions, recite the 5 cases in order) as a real diagnostic, not a formality.",
  },
  {
    n: 21, roman: "XXI", title: "Third Declension, Masculine & Feminine",
    concept: "3rd declension is the hardest declension because there is NO single characteristic nominative singular ending — unlike -a (1st) or -us (2nd), 3rd declension nominative forms are unpredictable (pater, mater, rex, lex — all different-looking, all 3rd declension). Model noun pater (father), stem patr-, found by dropping the genitive singular ending (-is).",
    teachingTip: "This is the lesson where \"always memorize the genitive singular form, not just the nominative\" stops being optional advice and becomes load-bearing — from here on, the genitive singular is the ONLY reliable way to find a noun's stem and confirm its declension.",
    watchFor: "Students will try to apply 1st/2nd declension's \"look at the ending, know the declension\" instinct here and get burned — there's no shortcut for 3rd declension; the vocabulary list format itself (nominative + genitive together) is the teaching tool.",
  },
  {
    n: 22, roman: "XXII", title: "Third Declension, Masc./Fem. (extra practice week)",
    concept: "No new grammar paradigm — this is a deliberate extra week on the exact same 3rd declension material as Lesson XXI, an explicit acknowledgment that 3rd declension needs more repetition than 1st/2nd did.",
    teachingTip: "Since there's nothing new to teach, use the week for the grammar appendix (sentence patterns, diagramming) and targeted vocabulary gender drilling rather than re-explaining the same chart a second time the same way.",
    watchFor: "3rd declension nouns don't have a gender-predicting ending the way 1st/2nd do — but a few real generalizations help: nouns ending in -x are feminine, natural gender always trumps grammatical rules (so rex is masculine despite looking feminine-shaped).",
  },
  {
    n: 23, roman: "XXIII", title: "Third Declension Neuter",
    concept: "Model noun nomen (name), stem nomin- (genitive singular nóminis). The neuter rule from Lesson XVI applies again here: nominative/accusative identical, plural -a.",
    teachingTip: "Explicitly connect this back to bellum's neuter rule from Lesson XVI — the rule doesn't change declension to declension, only the case-ending SHAPES around it change.",
    watchFor: "The genitive singular ending -is is shared with masculine/feminine 3rd declension nouns too — gender still has to be memorized per word here, the genitive ending alone won't tell you.",
  },
  {
    n: 24, roman: "XXIV", title: "Third Declension Review",
    concept: "Consolidation of all three 3rd-declension genders (masc./fem./neuter), plus continued Latin word-order flexibility practice (Latin marks subject/direct object with case endings, not position, so word order can vary far more freely than in English).",
    teachingTip: "Good week to explicitly contrast a scrambled-word-order Latin sentence against its fixed-order English translation, so students see WHY Latin can afford to shuffle word order (the case endings do the job English word order does).",
    watchFor: "Students sometimes assume Latin word order is totally random — it's flexible, not random; the Teacher Guide notes normal Latin order still tends toward subject-object-verb, just without the rigidity English requires.",
  },
  {
    n: 25, roman: "XXV", title: "Fourth Declension",
    concept: "Model noun portus (harbor/port) — nominative singular -us LOOKS like 2nd declension, but the genitive singular -ūs (long u) is the actual giveaway. Mostly masculine, a small, less-common declension.",
    teachingTip: "Put a 2nd declension -us noun and a 4th declension -us noun side by side with their genitives showing (servī vs. portūs) — the nominative alone is a trap, and showing the genitive is the only real fix.",
    watchFor: "Because portus and servus look identical in the nominative, students who skip checking the genitive will misdecline 4th declension nouns as if they were 2nd declension.",
  },
  {
    n: 26, roman: "XXVI", title: "Fifth Declension",
    concept: "Model noun rēs (thing) — the smallest, rarest declension, mostly feminine, genitive singular ends in -eī (a run of consecutive vowels that makes stem-finding trickier here than anywhere else).",
    teachingTip: "Give the practical shortcut directly: instead of the general \"drop the genitive ending\" rule, it's easier to think of 5th declension as \"drop -ēs from the nominative and add -eī\" — fewer places for the vowel cluster to trip someone up.",
    watchFor: "This is the last of the five declensions — a good moment to remind students they now only have two grammar families left to master all year (2nd conjugation), since noun declensions are done after Lesson XXVIII.",
  },
  {
    n: 27, roman: "XXVII", title: "Unit IV Review — 3rd, 4th, 5th Declensions",
    concept: "Consolidation of the three \"harder\" declensions together, plus 1st/2nd declension adjectives modifying nouns from ANY declension (agreement in gender/number/case, still never in declension).",
    teachingTip: "A good spot-check question straight from the Teacher Guide's own review style: given a noun's nominative AND genitive, can the student name its declension, gender, and correctly decline an adjective to modify it?",
    watchFor: "Note: RCA's own 2026-2027 pacing skips this lesson number most years but DOES reference it this year in one specific week (see first-form-latin-6.ts, Week 27) — double check Jacob's live pacing doc before assuming it's always skipped.",
  },
  {
    n: 28, roman: "XXVIII", title: "Units III & IV Review — The Five Declensions (Milestone Marker 3)",
    concept: "Full consolidation of ALL FIVE declensions and their model nouns/adjectives — a genuine landmark, since most people who ever study Latin never get all five declensions memorized as solidly as this class will have by this point.",
    teachingTip: "Worth saying directly to the class, per the Teacher Guide's own framing: unlike verb conjugations (four of them, all year), there's comparatively little grammar left to add to nouns from here — the heavy lifting on the noun side is essentially done.",
    watchFor: "The genuine risk at this milestone is complacency — nothing NEW is coming on the noun side, but retention across all five declensions simultaneously (not just the most recent one) is the actual skill being tested here.",
  },
  {
    n: 29, roman: "XXIX", title: "Second Conjugation Present Tense",
    concept: "2nd conjugation infinitive ends in -ēre (long e) instead of 1st conjugation's -āre. Model verb moneō (to warn): móneo, mones, monet, monēmus, monētis, monent — nearly IDENTICAL pattern to 1st conjugation, just swap the stem vowel from a to ē.",
    teachingTip: "This is a deliberate morale/pacing beat in the Teacher Guide's own framing: the hardest conceptual work of the whole year (all five declensions) is now behind the class, and 2nd conjugation is explicitly taught as easier and faster than 1st conjugation was — worth saying so out loud.",
    watchFor: "The only real new-sounding wrinkle is that mónes (2nd person singular) goes from 3 syllables (móneo) to 2 (mones) — a little awkward to say at first, purely a pronunciation adjustment, not a grammar one.",
  },
  {
    n: 30, roman: "XXX", title: "Second Conjugation Imperfect & Future Tenses",
    concept: "Same tense signs already learned in Lessons II-III (-ba- for imperfect, -bi-/-bo-/-bu- for future), just glued onto the 2nd conjugation stem instead of the 1st's: monēbam, monēbās... / monēbō, monēbis...",
    teachingTip: "Treat this explicitly as a transfer exercise rather than new material — have students predict the imperfect/future forms themselves before showing the chart, since they already know the pattern from Unit I.",
    watchFor: "Same imperfect/future mix-up risk as Lessons II-III (-ba- vs. -bi-/-bo-/-bu-) — it doesn't go away just because the conjugation changed.",
  },
  {
    n: 31, roman: "XXXI", title: "Second Conjugation Principal Parts",
    concept: "Regular 2nd conjugation principal parts follow docēre, delectāre, movēre's own pattern (drop -re, add -uī and -itus): moneō, monēre, monuī, monitus. But 13 common 2nd-conjugation verbs have genuinely irregular principal parts that must be individually memorized: timeō, váleo, dóceo, téneo, árdeo, júbeo, máneo, gáudeo, cáveo, sédeo, vídeo, respóndeo, móveo.",
    teachingTip: "The Teacher Guide is explicit that these 13 have to be said aloud, every day, until automatic — there's no shortcut or derivable pattern for this set the way there was for 1st conjugation's four irregulars (do/sto/juvo/lavo).",
    watchFor: "Students will try to guess these 13 verbs' 3rd/4th principal parts by analogy to the regular pattern and get it wrong more often than not — treat this list as pure memorization, not logic.",
  },
  {
    n: 32, roman: "XXXII", title: "Second Conjugation Perfect System",
    concept: "Perfect/pluperfect/future perfect built on the perfect stem exactly the same way 1st conjugation's was in Lessons VIII-X — the TENSE ENDINGS are identical across conjugations; only the STEM changes. \"Vēnī, vīdī, vīcī\" (I came, I saw, I conquered) is a real, famous example of 2nd/3rd conjugation perfect-tense forms in the wild.",
    teachingTip: "This is the payoff lesson for everything built in Lessons VIII-X — if a student solidly knows amāvī/amāvistī/amāvit's PATTERN, they already know monuī/monuistī/monuit's pattern too; the only new work is finding each verb's own perfect stem from its principal parts.",
    watchFor: "Same 3rd-plural perfect-vs-future-perfect mix-up flagged back in Lesson X (-ērunt vs. -erint) still applies here — it's a pattern across every conjugation, not a 1st-conjugation-only issue.",
  },
  {
    n: 33, roman: "XXXIII", title: "Unit V Review",
    concept: "Full review of the entire 2nd conjugation (all six tenses) alongside a cumulative review of the full year: five noun declensions, 1st/2nd declension adjectives, and now two full verb conjugations.",
    teachingTip: "The Teacher Guide's own closing framing is worth using directly with the class: they started the year knowing zero Latin and finish it able to recite two conjugations across six tenses and all five noun declensions — genuinely more than most people who ever attempt Latin achieve in a full year.",
    watchFor: "This is the last lesson with new review content before the year's final vocabulary/flashcard push (Lessons XXXIV's Milestone 4, not in RCA's pacing this year) — a good point to identify which of the five declensions or two conjugations is weakest across the class for summer-retention flashcard focus.",
  },
];

// weekText mentions Roman-numeral lesson numbers ("Teach Lesson XIV", "Practice Lesson
// XVI-XVII"), unlike the Baltimore Catechism guide's plain digits — same extraction
// SHAPE as extractCatechismLessonNumbers, different number system.
const ROMAN_MAP: [string, number][] = [
  ["XXXIV", 34], ["XXXIII", 33], ["XXXII", 32], ["XXXI", 31], ["XXX", 30],
  ["XXIX", 29], ["XXVIII", 28], ["XXVII", 27], ["XXVI", 26], ["XXV", 25],
  ["XXIV", 24], ["XXIII", 23], ["XXII", 22], ["XXI", 21], ["XX", 20],
  ["XIX", 19], ["XVIII", 18], ["XVII", 17], ["XVI", 16], ["XV", 15],
  ["XIV", 14], ["XIII", 13], ["XII", 12], ["XI", 11], ["X", 10],
  ["IX", 9], ["VIII", 8], ["VII", 7], ["VI", 6], ["V", 5],
  ["IV", 4], ["III", 3], ["II", 2], ["I", 1],
];

export function extractLatinLessonNumbers(weekText: string): number[] {
  const found = new Set<number>();
  const re = /Lesson\s+([IVXL]+)\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(weekText))) {
    const token = m[1];
    const hit = ROMAN_MAP.find(([roman]) => roman === token);
    if (hit) found.add(hit[1]);
  }
  return [...found].sort((a, b) => a - b);
}

export function getLatinLessonsForWeekText(weekText: string): LatinLessonGuide[] {
  return extractLatinLessonNumbers(weekText)
    .map((n) => latinTeacherGuide.find((g) => g.n === n))
    .filter((g): g is LatinLessonGuide => Boolean(g));
}
