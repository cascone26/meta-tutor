// Jacob's own (non-RCA) Latin learning timeline — researched 2026-09-09 against real
// external benchmarks, not invented. Every phase cites where its pacing/level claim
// comes from so this stays honest (Report-tier claims, clearly labeled) rather than
// presenting guesses as settled fact.
//
// Sources:
// - National Latin Exam (NLE) levels/syllabi: https://www.nle.org/nle-syllabus,
//   https://www.nle.org/what-is-the-national-latin-exam — 8 levels from "Introductory"
//   through advanced prose/poetry, each with a published grammar+vocab syllabus.
// - Standards for Classical Language Learning (American Classical League / ACTFL
//   National Standards Collaborative Board): https://www.aclclassics.org — Novice /
//   Intermediate / Advanced proficiency tiers (reading, the mode that matters most for
//   a self-taught reading-focused course like Latin Lab).
// - Hans Ørberg's Lingua Latina per se Illustrata (Familia Romana, 35 chapters) —
//   widely-documented self-study pacing of ~1 chapter/week for a from-zero learner
//   (Hackett Publishing; multiple self-study guides converge on this figure).
// - General self-study fluency research (LatinPerDiem, StoryLearning, and similar
//   language-learning-timeline analyses): ~600-650 total study hours, ~1-2 years of
//   steady study, to reach real reading fluency — consistent with FSI-style estimates
//   for morphologically complex classical languages.
//
// Latin Lab's own units are NOT a verified 1:1 chapter-for-chapter match to Familia
// Romana or an official NLE syllabus — they cover comparable grammar in a comparable
// order (nominative → genitive → accusative → 2nd declension → adjective agreement →
// full present system → imperfect), which is why they're described as "roughly
// parallel to" rather than "equivalent to" the external benchmark in each phase below.

export type TimelinePhase = {
  phase: number;
  title: string;
  timeframe: string;
  proficiencyLevel: string;
  latinLabUnits: string;
  whatYouShouldKnow: string[];
  externalBenchmark: string;
  source: string;
};

export const latinProficiencyTimeline: TimelinePhase[] = [
  {
    phase: 1,
    title: "Foundations",
    timeframe: "Months 1-2 (~40-60 study hours)",
    proficiencyLevel: "Novice-Low → Novice-Mid (ACTFL/ACL reading)",
    latinLabUnits: "Units 1-5",
    whatYouShouldKnow: [
      "1st declension nominative, genitive, accusative (singular)",
      "sum/esse present tense, basic adjective agreement",
      "1st-conjugation transitive verbs (amat, laudat, portat...)",
      "Numbers 1-10",
    ],
    externalBenchmark: "Roughly parallel to Familia Romana chs. 1-8 (Ørberg, ~1 ch/week self-study pace) and the low end of the NLE Introductory Latin Exam syllabus.",
    source: "nle.org syllabus; Ørberg self-study pacing guides",
  },
  {
    phase: 2,
    title: "Core Grammar",
    timeframe: "Months 3-4 (~40-60 more study hours)",
    proficiencyLevel: "Novice-Mid → Novice-High",
    latinLabUnits: "Units 6-10",
    whatYouShouldKnow: [
      "Full 2nd declension (masc. nom/gen/acc, sg & pl)",
      "1st/2nd-declension adjective agreement across declensions",
      "Full six-person present paradigm, imperative, infinitive-as-subject",
      "Imperfect tense (past, ongoing action)",
      "Interrogatives (quis/quid/ubi/cur) + a reading-fluency checkpoint",
    ],
    externalBenchmark: "Roughly parallel to Familia Romana chs. 9-20 and the NLE Introductory→Beginning Latin Exam boundary.",
    source: "nle.org syllabus; Ørberg self-study pacing guides",
  },
  {
    phase: 3,
    title: "Case System Complete",
    timeframe: "Months 5-8 (~80-120 study hours)",
    proficiencyLevel: "Intermediate-Low (ACTFL/ACL reading)",
    latinLabUnits: "Units 11-15 (roadmap — not yet built)",
    whatYouShouldKnow: [
      "Dative case, indirect objects",
      "Ablative case core (means/manner, place-where prepositions)",
      "Perfect tense (completed past events)",
      "Relative pronouns (qui/quae/quod), longer connected reading",
      "Cumulative review across the full case system",
    ],
    externalBenchmark: "Roughly parallel to finishing Familia Romana (all 35 chapters, ~8-9 months at 1 ch/week) and the NLE Beginning → Intermediate Latin Exam range.",
    source: "nle.org syllabus; Ørberg 35-chapter self-study timeline (Hackett Publishing)",
  },
  {
    phase: 4,
    title: "Real Connected Reading",
    timeframe: "Months 9-14 (~150-200 study hours; cumulative ~350-450 hours)",
    proficiencyLevel: "Intermediate-Mid → Intermediate-High",
    latinLabUnits: "Beyond Latin Lab's current roadmap — graded readers (Ørberg's Roma Aeterna or equivalent)",
    whatYouShouldKnow: [
      "Subjunctive mood (purpose/result clauses, indirect questions)",
      "Participles and ablative absolute",
      "Sustained reading of lightly-adapted continuous prose",
      "Vocabulary breadth: 1,000-1,500+ words at reasonable recall",
    ],
    externalBenchmark: "Matches the NLE Intermediate Latin Exam / Intermediate Reading Comprehension tier, and sits inside the general ~600-650-hour, 1-2-year reading-fluency benchmark from self-study research.",
    source: "nle.org syllabus; LatinPerDiem/StoryLearning self-study timeline research",
  },
  {
    phase: 5,
    title: "Reading Fluency",
    timeframe: "Year 2+ (~600-650+ cumulative study hours)",
    proficiencyLevel: "Advanced (ACTFL/ACL reading) — the commonly-cited \"fluent reader\" benchmark",
    latinLabUnits: "Real unadapted classical texts",
    whatYouShouldKnow: [
      "Read real classical prose (Caesar-level difficulty) with occasional dictionary use, not word-by-word decoding",
      "Recognize the major poetic meters (dactylic hexameter) well enough to scan a familiar passage",
      "Comfortable with the full subjunctive system, indirect statement, and complex subordination",
    ],
    externalBenchmark: "Matches the NLE Latin IV Prose / Latin V Poetry tier and the general 1-2-year / 600-650-hour reading-fluency estimate converged on across self-study timeline research.",
    source: "nle.org syllabus; general self-study fluency research (600-650hr / 1-2yr convergence)",
  },
];
