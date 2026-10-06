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
  /** RTI/MTSS Tier 1–3 differentiation strategies grounded in K-12 intervention research,
   * adapted to this lesson's specific content. Tier 1 = whole-class; Tier 2 = small-group
   * reteach; Tier 3 = intensive individual. Optional — only present if differentiation
   * applies to this lesson. Sourced from Tony's estate (Rick RIB pass, 2026-08-11).  */
  differentiation?: {
    tier1?: string;
    tier2?: string;
    tier3?: string;
  };
};

export const latinTeacherGuide: LatinLessonGuide[] = [
  {
    n: 1, roman: "I", title: "First Conjugation Present Tense",
    concept: "A Latin verb is a stem (the root meaning) plus a personal ending, and the ending alone tells you who's doing the action — amō/amās/amat/amāmus/amātis/amant each already mean \"I/you/he/we/y'all/they love\" with no separate subject word needed. English needs \"I love\" as two words; Latin folds the subject into the verb ending. That single fact is the whole engine behind everything else this year — case endings on nouns work the same way, telling you a noun's JOB instead of relying on word order.",
    teachingTip: "(R5 clinical supervision pre-conference: establish the focus upfront — 'today we're locking down the stem/ending split; that's the ONE thing that matters.') Build the chart live on the board rather than showing it finished — write the English pronouns (I, you, he/she/it, we, you-all, they) first, then only after that add the Latin stem (ama-) and point to each personal ending as it goes on, so the stem/ending split is visibly separate from day one. (R5: making the model visible before releasing to practice reduces cognitive load — don't skip the live modeling.)",
    watchFor: "The only irregular-looking form in the whole present tense is 1st singular amō (not \"amoō\") — the stem vowel a and the ending ō just contract. Everything else is a clean stem+ending glue job.",
    differentiation: {
      tier1: "Model the stem/ending split explicitly by physically pointing at each part as you say it aloud. Have students repeat each form back-to-back (all six), then identify the stem and ending separately in random order (precorrection before quiz). Frequent opportunities to respond: \"Tell me the we-form,\" \"What does this ending tell you?\" rather than lectures.",
      tier2: "Small-group reteach: use physical index cards for stem (ama-) and endings (-ō, -s, -t, -mus, -tis, -nt) that students slide together to build forms. Repeat the form while sliding (motor+verbal memory). Start with just present-tense endings, no imperfect yet. Daily drills on the six forms.",
      tier3: "Individual diagnostic: ask \"show me the 1st-person plural\" without a chart. If the student can't build it, check: (1) Do they know which ending = plural? (2) Do they know which ending = 1st person? (3) Can they say the full form aloud even if they can't write it? Target whichever gap exists.",
    },
  },
  {
    n: 2, roman: "II", title: "First Conjugation Imperfect Tense",
    concept: "Imperfect means \"not finished\" in Latin, and describes a repeated, ongoing, or interrupted past action — \"I was loving\" / \"I used to love,\" never a one-time completed action. It's built by inserting the tense sign -ba- between the stem and the SAME personal endings already learned in Lesson I: amābam, amābās, amābat, amābāmus, amābātis, amābant.",
    teachingTip: "Don't teach this as a new chart to memorize from scratch — literally take the present-tense chart already on the board from Lesson I and insert -ba- into every slot in front of the class, so imperfect visibly IS the present chart plus one inserted syllable.",
    watchFor: "English blurs this distinction (\"I loved\" could mean either a single event or a habit), so the reliable gloss to teach is \"was ___ing\" — if a student's English translation can take \"was/were ___ing,\" it's imperfect.",
    differentiation: {
      tier1: "(R5: model-then-release, not discovery.) Write the present tense from Lesson I on the board: amō, amās, amat, amāmus, amātis, amant. Say: 'Now I'm adding -ba- before the personal endings.' Insert it into EACH form on the board visibly: amāBam, amāBās, amāBat, amāBāmus, amāBātis, amāBant. Say: 'Imperfect is PRESENT plus -ba-. That's it.' Have students repeat the forms aloud. Do a second verb (say, laudo) the same way, inserting -ba-.",
      tier2: "Small-group: take the present-tense chart they've already learned. Provide a card with the -ba- tense sign. Have students insert it into each present form to build the imperfect. Use monō (present: monēo, monēs...) as the second example. Drill: say the present, then the imperfect with -ba-.",
      tier3: "Diagnostic: ask 'What's the imperfect of amāre, 1st plural?' If they hesitate, prompt: 'What's the present 1st plural?' (amāmus) 'Now add -ba-' (amābāmus). Teach: imperfect = present stem + -ba- + ending. Spaced drills on present → imperfect conversion 3x weekly.",
    },
  },
  {
    n: 3, roman: "III", title: "First Conjugation Future Tense",
    concept: "Future tense sign is -bi- (with two irregular spots: -bo in 1st singular, -bu- in 3rd plural): amābō, amābis, amābit, amābimus, amābitis, amābunt.",
    teachingTip: "(R5 technique: establish a pre-agreed focus on the ONE tense-sign difference. 'Today we're locking down the -a- vs -i- ear training for imperfect vs. future.') Since -ba- (imperfect) and -bi-/-bo-/-bu- (future) look and sound similar, build both tense charts side by side on the board and have students say them aloud back-to-back — the ear catches the difference faster than the eye does. (R5: reflective-questioning approach — ask 'is this -a- or -i-?' as an ear-check, not just a right/wrong visual check.)",
    watchFor: "This is the single most common tense-sign mix-up in First Form: students write amābat (imperfect, \"he was loving\") when they mean amābit (future, \"he will love\"), because -a- and -i- are easy to blur when reciting quickly.",
    differentiation: {
      tier1: "Oral drill comparing all three present-system tenses side by side: say the forms aloud rapidly in a pattern (present → imperfect → future, 1st singular only first). Have students listen for the -a- vs -i- difference. Color-code the tense signs on the board (-s = present, -ba- = imperfect, -bi/bo/bu = future).",
      tier2: "Small-group practice: give students a verb form (e.g., \"amāt\") and ask them to name the tense BEFORE checking the chart. Start with the tense signs in isolation (-ba- is imperfect, -bi- is future) before full forms. Use manipulatives if helpful: write each tense sign on a card and have students sort forms into three piles.",
      tier3: "Diagnostic: ask \"translate amābit into English\" and listen to whether they say \"was loving\" (imperfect confusion) or \"will love\" (correct). If imperfect error: focus on ear-training (say -i- tense forms aloud 10 times daily) + written identification drills (circle the tense sign in written forms).",
    },
  },
  {
    n: 4, roman: "IV", title: "Present System Review + the Infinitive & Principal Parts",
    concept: "The infinitive (amāre, \"to love\") is a verb's dictionary form — the one a Latin dictionary lists first, the way an English dictionary entry for \"walk\" implies walked/walked/walking. Recognizing which of the (eventually four) conjugations a verb belongs to is entirely about the infinitive ending: -āre means 1st conjugation, full stop.",
    teachingTip: "Build a small chart of English irregular verbs (walk/walked/walked vs. see/saw/seen) first, so students already have the idea of \"a verb has multiple required forms\" in their own language before principal parts get introduced as Latin's version of the same idea.",
    watchFor: "Students will try to memorize principal parts as isolated forms instead of building them off the present-tense stem they already know — keep tying every new form back to the amō chart already on the wall.",
    differentiation: {
      tier1: "(R5: start with English to make the concept transferable.) Write on the board: English: walk/walked/walked, see/saw/seen. Say: 'Verbs have multiple forms. Latin is the same.' Write: amō/amāre/amāvī/amātus. Say: 'amō = I love (1st singular present), amāre = to love (infinitive — the dictionary form), amāvī = I loved (1st singular perfect), amātus = loved (past participle).' The infinitive ending (-āre) tells the conjugation: -āre = 1st conj, -ēre = 2nd conj.",
      tier2: "Small-group: provide cards with principal parts of familiar 1st-conjugation verbs (amō, amāre, amāvī, amātus; laudō, laudāre, laudāvī, laudātus). Have students identify the infinitive (always the 2nd part) and name the conjugation based on the infinitive ending.",
      tier3: "Diagnostic: show a verb and ask 'What conjugation is this?' If uncertain, ask 'What's the infinitive?' Then: 'Infinitive ends in -āre? 1st conjugation.' Once infinitive is identified, all principal parts follow patterns students will learn later. Daily practice on 5–10 verbs, identifying infinitive and conjugation.",
    },
  },
  {
    n: 5, roman: "V", title: "Irregular Verb sum (Present System)",
    concept: "Sum (\"to be\") is irregular because its stem isn't stable across tenses the way amō's is — sum, es, est, sumus, estis, sunt. It's also the single most common verb students will meet for the rest of the year (every predicate-nominative sentence — \"the girl IS good\" — runs through it), so it earns being over-drilled now.",
    teachingTip: "(R5 technique: establish the focus — 'sum is a closed set of six unrelated forms; there is no pattern to discover; our job is to lock them in memory.') Explicitly contrast sum with amō on the board: point out that amō's stem (ama-) never changes, but sum's forms don't share an obvious common stem at all — that's literally what \"irregular\" means here, made visible rather than just asserted. (R5: don't let students waste cognitive effort looking for a pattern that doesn't exist; state explicitly that this is rote memory work.)",
    watchFor: "Students default to translating sum's forms with amō's personal-ending logic (assuming -s always means \"you,\" etc.) instead of just memorizing the sum forms as their own small, closed set.",
    differentiation: {
      tier1: "Teach sum as a *closed set* of six unrelated forms, not a pattern-following verb. Have students write the six forms on one index card (one side Latin, one side English). Frequent drills: hold up random forms and ask \"who?\" (es = you, est = he, etc.). Model before quizzes: \"Here's the card again, say all six with me.\"",
      tier2: "Small-group: start with written drills (supply the English for a random form), then spoken. Use TPR (Total Physical Response) if helpful: gesture for each person (point to self for 1st, to student for 2nd, away for 3rd) while saying the form. Daily practice on the six sum forms before moving to imperfect/future.",
      tier3: "Diagnostic: ask \"What's the 3rd-plural form of sum?\" If incorrect (or if they try to apply amō's stem logic), the intervention is **isolation + rote memorization**, not pattern-discovery. Pair with spaced-retrieval practice: test all six forms at least 3x weekly, with 1–2 day gaps.",
    },
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
    teachingTip: "(R5 technique: establish two distinct focuses — ONE session on the regular rule, a SEPARATE focus on the four irregulars. Don't try to teach both at once.) This is the lesson where \"why do I need four forms per verb\" finally has a real payoff — parts 1-2 are what students already have; parts 3-4 are the KEY that unlocks perfect/pluperfect/future perfect starting next lesson. Say that connection out loud rather than letting it feel like more rote memorization. (R5: model the regular rule derivation live on the board (amāre → drop -re → add -vī, -tus) before releasing to practice.)",
    watchFor: "The four irregular verbs (do, sto, juvo, lavo) need to be said aloud repeatedly and separately from the regular pattern — mixing them into general drilling lets students quietly assume they follow the regular rule, which they don't.",
    differentiation: {
      tier1: "Teach the rule live on the board: take the infinitive (amāre), drop -re, add -vī and -tus. Have students write out the derivation themselves (don't just show the answer). Do this for 3–4 verbs before quizzing, so the rule is modeled and practiced, not just stated. Separate the four irregular verbs into a distinct color/location on the board.",
      tier2: "Small-group: give students the infinitive and have them derive parts 3–4 on a worksheet before checking. For irregular verbs (do, sto, juvo, lavo), provide the forms on an index card and have them copy + repeat 5× aloud daily. Build one irregular verb at a time (this week = do, do, dedī, datus) before adding the next.",
      tier3: "Diagnostic: give an infinitive (e.g., paro) and ask them to write parts 3–4. If wrong, check: (1) Do they know to drop -re first? (2) Do they know to add -vī? (3) Do they know to add -tus? Error-drill just the failed step. For irregular verbs, pure rote memorization + daily retrieval practice (spaced 1–2 days apart).",
    },
  },
  {
    n: 8, roman: "VIII", title: "First Conjugation Perfect Tense",
    concept: "Perfect tense describes a one-time, completed past action (\"I loved\" / \"I have loved\") — built by dropping the -ī from the 3rd principal part to get the perfect stem, then adding a NEW set of endings (-ī, -istī, -it, -imus, -istis, -ērunt) that are different from every other tense's personal endings: amāvī, amāvistī, amāvit, amāvimus, amāvistis, amāvērunt.",
    teachingTip: "(R5 technique: make the two-stem system visibly distinct from day one. Use color, spacing, or size to show that amāv- is a separate object from ama-.) Write the perfect stem (amāv-) next to the present stem (ama-) so the two-stem system is visible from the start — everything built on the perfect stem for the rest of the year (pluperfect, future perfect) will reuse amāv-, never ama-. (R5: this is explicit modeling of the conceptual structure before releasing to practice.)",
    watchFor: "The Teacher Guide specifically flags the 2nd person forms (-istī singular vs. -istis plural) as easily confused by students, and separately notes the 3rd plural's English helping verb is \"have,\" not \"has,\" even though \"they\" is plural — a small English-side trap, not a Latin one.",
    differentiation: {
      tier1: "Model the formation on the board: start with principal part 3 (amāvī), drop the -ī, then add the perfect personal endings one at a time. Have students write out the derivation for 2–3 verbs before quizzing. Explicitly teach the two-stem system: \"ama- for present system, amāv- for perfect system.\" Use color or spacing to make the stems visibly different.",
      tier2: "Small-group: give students the infinitive → they look up principal parts → they derive all six perfect forms on a worksheet. Start slowly with 1–2 verbs, then gradually add more. Focus specifically on -istī vs. -istis (2nd singular vs. 2nd plural): write them side-by-side and have students say them aloud repeatedly to differentiate by ear.",
      tier3: "Diagnostic: ask \"Give me the 2nd plural perfect of amare.\" If wrong (especially if -istī when -istis is needed), drill the 2nd person forms in isolation: amāvistī vs. amāvistis, repeated aloud 5–10 times daily. Teach the memory bridge: \"-istis = you-all,\" with the extra -s matching the plural idea.",
    },
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
    teachingTip: "(R5 technique: establish the ONE focus before starting — 'we lock down the case order first using the mnemonic, THEN we attach case meanings.' Avoid trying to teach cases, meanings, endings, and gender all at once.') Teach the case order with the mnemonic the Teacher Guide itself uses: \"Never Good Dogs Go Around\" for Nominative-Genitive-Dative-Accusative-Ablative. This is worth having memorized cold before Lesson XIV even starts, since every declension from here on gets taught in this exact case order. (R5: model the mnemonic explicitly and drill it audibly before moving to meanings.)",
    watchFor: "1st declension nouns are USUALLY feminine by grammatical gender — but agricola (farmer) is a deliberately-placed early exception, masculine because it names a male person (natural gender always trumps the declension's default gender). Flag this explicitly rather than letting students assume 1st declension = always feminine.",
    differentiation: {
      tier1: "(R5: establish ONE focus first — case order via mnemonic, defer gender and meanings to next lesson.) Write the case names vertically on the board: Nominative, Genitive, Dative, Accusative, Ablative. Teach the mnemonic aloud: 'Never Good Dogs Go Around' (each first letter = case). Have the class repeat it 5 times. Write mensa's case endings: -a, -ae, -ae, -am, -ā. Label each with the mnemonic. Say: 'Each lesson, we'll attach meanings to these cases, but FIRST everyone memorizes this mnemonic cold.' Do NOT layer gender/meanings yet.",
      tier2: "Small-group: provide the case-order mnemonic written out. Drill: call out a case (e.g., 'accusative'), students respond with the ending and the mnemonic word ('accusative = -am, fourth in 'Never Good Dogs Go Around'). Once the order is solid, introduce one case meaning at a time (nominative = subject, genitive = possessive, etc.), always tied to the case order they've learned.",
      tier3: "Diagnostic: ask 'Recite the five cases in order.' If they hesitate, teach the mnemonic: 'Never Good Dogs Go Around.' Have them write it down and repeat it 10 times. Then: 'Write the endings for mensa in case order: -a, -ae, -ae, -am, -ā.' Daily mnemonic drill before any case-meaning work. Once order is automatic, introduce meanings one case at a time.",
    },
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
    differentiation: {
      tier1: "Write the bellum chart on the board and immediately state the rule: 'In EVERY neuter noun, nominative and accusative are IDENTICAL. The plural is -a, not -ī.' Point to bellum (singular nominative and accusative both -um), and bella (plural nominative and accusative both -a). Say: 'This rule applies to EVERY neuter noun in Latin. Mark it down: neuter = nom/acc always the same.'",
      tier2: "Small-group: provide neuter-noun charts (bellum, puer for comparison, a 3rd-decl neuter). For each neuter, have students circle the nominative and accusative singular — they're identical. Check the plural: it's -a. Use the English hook: 'Data, media, curricula are all Latin neuter plurals — that -a ending tells you they're plural.'",
      tier3: "Diagnostic: show a neuter noun's case chart with a nominative/accusative form different from each other. Ask 'Is this right?' Answer: no, neuter means they're always the same. Teach: 'If it's neuter, nom and acc match.' Spaced drills on 5–10 neuter nouns, checking that nom/acc are identical.",
    },
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
    differentiation: {
      tier1: "(R5: establish the ONE focus — agreement is NOT about endings, it's about matching gender/number/case.) Write on the board: puella bona (good girl). Point to puella (nominative singular feminine, 1st decl). Point to bona (nominative singular feminine, 1st/2nd adj). Say: 'They match in gender (feminine), number (singular), and case (nominative). THAT'S agreement. The declension family doesn't have to match — only gender/number/case.' Show a 3rd-decl noun: rex bonus (good king). Point: 'Rex is nominative singular masculine, bonus is nominative singular masculine — they agree, even though rex is 3rd declension and bonus is 1st/2nd.'",
      tier2: "Small-group: provide noun+adjective pairs (some agreeing, some not). For each, students check: 'Do they have the same gender? Same number? Same case?' If yes to all three, they agree. If no, they don't, even if they're in the same declension. Use consistent language: 'Agreement means same gender, number, and case, not same declension.'",
      tier3: "Diagnostic: show a sentence with a mismatched adjective (e.g., puella malus, boy is masculine but should be feminine like puella). Ask 'Does this agree?' If yes, teach: 'Check gender (puella = feminine, malus = masculine). They don't match, so no agreement.' Drill: 10 sentences, mark agreeing vs. non-agreeing pairs, focusing on gender/number/case, not declension.",
    },
  },
  {
    n: 19, roman: "XIX", title: "Numbers 1-10; Predicate Nominative",
    concept: "Cardinal numbers (one, two, three...) are mostly indeclinable at this level except ūnus/duo/trēs; ordinal numbers (first, second...) decline like a regular 1st/2nd adjective. This lesson also introduces the predicate nominative: with a linking verb like sum, BOTH sides of \"is\" are nominative (\"Puella est bona\" — the girl IS good — bona is nominative, not accusative, because it renames/describes the subject rather than receiving the action).",
    teachingTip: "Diagram a predicate-nominative sentence on the board (subject — linking verb — predicate adjective) so students see visually why the second word isn't a direct object, before they meet an actual direct object sentence to contrast it against.",
    watchFor: "Students default to assuming the word right after the verb is always a direct object (accusative) — flag explicitly that sum is the exception this year: it's a linking verb, so nothing after it can be a direct object.",
    differentiation: {
      tier1: "Draw two sentence diagrams: (1) Puella est bona. Draw: [puella] — [est] — [bona], all on the same baseline because both are nominative ('is' links them). Say: 'Puella (nominative subject) IS bona (nominative predicate adjective). BOTH nominative.' (2) Puella amō. Draw: [I] — [love] → [puella], with puella as direct object. Say: 'Puella here is accusative (direct object of amō). Different case, different structure.' Drill: label the case of words after est vs. after amō.",
      tier2: "Small-group: provide sentences with sum (puella est bona, magister est bonus) and action verbs (amō puellam, vīdēs magistrum). For each, identify: Is it a linking verb (sum)? If yes, both sides are nominative. Is it an action verb? The object is accusative. Check the case of the word after the verb.",
      tier3: "Diagnostic: show 'Puella est magister' (nominative predicate nom). Ask: 'Is magister nominative or accusative?' If accusative, ask: 'What verb do we have? est (sum). Is sum a linking verb? Yes — so both sides are nominative.' Teach: sum links equals, both nominative. Daily practice on 5–10 sentences, marking predicate nominatives vs. direct objects.",
    },
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
    teachingTip: "(R5 technique: pre-empt the misconception upfront. State explicitly: 'For 3rd declension, the nominative ending alone doesn't tell you the declension. You MUST memorize BOTH the nominative AND genitive together; the genitive ending (-is) is what reveals the stem. This is different from 1st/2nd declensions.') This is the lesson where \"always memorize the genitive singular form, not just the nominative\" stops being optional advice and becomes load-bearing — from here on, the genitive singular is the ONLY reliable way to find a noun's stem and confirm its declension.",
    watchFor: "Students will try to apply 1st/2nd declension's \"look at the ending, know the declension\" instinct here and get burned — there's no shortcut for 3rd declension; the vocabulary list format itself (nominative + genitive together) is the teaching tool.",
    differentiation: {
      tier1: "(R5: pre-empt the misconception UPFRONT.) Say directly: 'For 1st declension, all nominatives are -a. For 2nd, all are -us or -um. For 3rd — the nominative can be ANYTHING: pater, mater, rex, lex. You CANNOT tell the declension from the nominative alone. You MUST have the genitive to find the stem.' Write pater, patris on the board. Say: 'Drop -is from the genitive → patr-. That's the stem for all other cases.' Drill: give pater, patris; students find stem by dropping -is from genitive.",
      tier2: "Small-group: provide vocabulary with 3rd-decl nouns listed nominative + genitive (pater, patris; rex, regis; mater, matris). For each, drop the -is to find the stem, then decline the noun. Emphasize: 'The nominative is useless without the genitive. Always list them together.'",
      tier3: "Diagnostic: show pater (nominative only) and ask 'What declension?' If they guess, ask: 'How do you know? The nominative could be 1st, 2nd, or 3rd. We NEED the genitive.' Give patris, ask: 'Now what declension?' (3rd, because genitive -is means 3rd.) Teach: 'If vocab list doesn't show nominative + genitive for 3rd decl, write them down yourself.' Spaced drills on 10 3rd-decl nouns, always including both nominative and genitive.",
    },
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
    differentiation: {
      tier1: "Write two columns: 2ND DECLENSION | 4TH DECLENSION. Under each write the nominative and genitive: servus, servī | portus, portūs. Say: 'They LOOK the same (both -us), but the genitive tells the difference. servī (short i) = 2nd declension. portūs (LONG u, macron) = 4th declension.' Have students circle the macron on portūs. Say: 'Always check the genitive. The long u is the marker.'",
      tier2: "Small-group: provide mixed vocabulary with 2nd and 4th declension -us nouns (servus, servī; portus, portūs; amicus, amicī; fructus, fructūs). Have students identify which are 2nd (short i in genitive) and which are 4th (long u in genitive). Check each word's genitive first.",
      tier3: "Diagnostic: show portus without the genitive, ask 'What declension?' If they guess 2nd, say 'Check the genitive: portūs (long u). That's 4th declension.' Teach: 'Never trust the nominative alone when it's -us. Genitive is the real marker.' Spaced drills on mixed 2nd/4th -us nouns, always checking genitive.",
    },
  },
  {
    n: 26, roman: "XXVI", title: "Fifth Declension",
    concept: "Model noun rēs (thing) — the smallest, rarest declension, mostly feminine, genitive singular ends in -eī (a run of consecutive vowels that makes stem-finding trickier here than anywhere else).",
    teachingTip: "Give the practical shortcut directly: instead of the general \"drop the genitive ending\" rule, it's easier to think of 5th declension as \"drop -ēs from the nominative and add -eī\" — fewer places for the vowel cluster to trip someone up.",
    watchFor: "This is the last of the five declensions — a good moment to remind students they now only have two grammar families left to master all year (2nd conjugation), since noun declensions are done after Lesson XXVIII.",
    differentiation: {
      tier1: "Write rēs, reī on the board. Say: 'The vowel cluster -eī is the marker for 5th declension. When you see -eī in the genitive, you know it's 5th declension.' Decline rēs with students: nom rēs, gen reī, dat reī, acc rem, abl rē. Point out: '-eī is small but unmistakable.' Do one more (diēs, diēī — day) the same way.",
      tier2: "Small-group: provide 5th-decl nouns (rēs, reī; diēs, diēī). Have students write out the full declension, paying attention to the -eī genitive. Use a vowel-cluster pronunciation guide if the -eī is hard to say aloud.",
      tier3: "Diagnostic: show a 5th-decl noun's genitive ending in -eī and ask 'What declension?' (5th). If they're unsure, say: 'The -eī is the marker. All 5th declensions have genitive -eī.' Spaced drills on all five declensions (one from each: mensa, servus, pater, portus, rēs) to consolidate the declension-identification reflex.",
    },
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
    differentiation: {
      tier1: "Write the 1st conjugation present (amō chart) and the 2nd conjugation present (moneō chart) side by side on the board. Say: 'Look at the pattern — it's the SAME, just the stem vowel changed from -a- to -ē-.' Point to each line: amō/moneō, amās/monēs, amat/monet. Say: 'Swap the vowel, get the new verb. That's it.' Do not teach 2nd as brand new; teach it as \"1st conjugation with a different vowel.\"",
      tier2: "Small-group: provide 1st conj chart (amō) as reference. For each 2nd conj verb (moneō, valeō, timeō), have students predict the forms by swapping -a- for -ē-. Then write them out. Emphasize: 'It's the same pattern.'",
      tier3: "Diagnostic: ask for the 2nd person singular of moneō. If they hesitate, remind: 'Look at amō's 2nd person (amās). Now change the vowel: monēs.' Teach: transfer not from scratch. Spaced drills on mixed 1st/2nd conj present forms, emphasizing the vowel as the ONLY difference.",
    },
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
    differentiation: {
      tier1: "(R5: establish ONE focus — these 13 are pure rote memory, not logic.) Say: 'The regular pattern (drop -re, add -uī, -itus) WORKS for most 2nd conjugation verbs. But these 13 are irregular — you CANNOT guess them. You must memorize them.' Write the 13 on a card with principal parts side by side (timeō, timuī, etc.). Say them aloud 10 times as a class. Emphasize: 'These do not follow the rule. Memorize them.'",
      tier2: "Small-group: provide cards with the 13 irregular verbs and their principal parts. Have students say them aloud repeatedly (10× each). Use index cards: cover part 3 and 4, have students recall them. Make this pure drills — not pattern-discovery.",
      tier3: "Diagnostic: ask for the 3rd person singular perfect of timeō. If they guess timuō (by analogy to the regular pattern), stop: 'No — timeō is one of the 13 irregulars. The principal parts are timeō, timuī, not timēō, timuī.' Drill: say the 13 verbs and their principal parts daily until automatic. Spaced retrieval 3–4 times per week.",
    },
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
