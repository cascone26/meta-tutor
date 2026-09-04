// Praxis 7001 — Elementary Education: Multiple Subjects
// Kansas-required licensure exam. Integrated into Meta Tutor from the
// existing exam-prep build (~/classpilot/exam-prep/praxis-7001).

export type PraxisSubtest = "reading" | "math" | "social" | "science";

export interface PraxisQuestion {
  id: string;
  subtest: PraxisSubtest;
  topic?: string;
  /** Optional reading passage / stimulus shown above the question. */
  passage?: string;
  question: string;
  options: string[];
  /** Index into options of the correct answer. */
  answer: number;
  explanation: string;
  /** false = machine-expanded, not yet human-reviewed. */
  verified: boolean;
}

export interface PraxisSubtestMeta {
  code: string;
  name: string;
  /** Kansas minimum passing scaled score. */
  passing: number;
  /** [min, max] of the reported scaled-score range. */
  scale: [number, number];
  blurb: string;
}

export const PRAXIS_SUBTESTS: Record<PraxisSubtest, PraxisSubtestMeta> = {
  reading: {
    code: "7002",
    name: "Reading & Language Arts",
    passing: 143,
    scale: [100, 200],
    blurb:
      "Foundational reading, comprehension, writing conventions, vocabulary, and literacy instruction.",
  },
  math: {
    code: "7003",
    name: "Mathematics",
    passing: 157,
    scale: [100, 200],
    blurb:
      "Number sense, operations, algebra, geometry & measurement, and data/statistics/probability.",
  },
  social: {
    code: "7004",
    name: "Social Studies",
    passing: 155,
    scale: [100, 200],
    blurb:
      "U.S. & world history, government/civics, geography, and economics.",
  },
  science: {
    code: "7005",
    name: "Science",
    passing: 159,
    scale: [100, 200],
    blurb:
      "Life science, physical science, earth & space science, and scientific inquiry.",
  },
};

export const PRAXIS_SUBTEST_ORDER: PraxisSubtest[] = [
  "reading",
  "math",
  "social",
  "science",
];

// Kansas Content Knowledge Exam deadline (per GCU FEC, new deadline after the
// missed Aug 2026 window). Used for the countdown.
export const PRAXIS_DEADLINE = "2027-02-01";

export const QUIZ_SIZES = [10, 15, 20, 25] as const;
export const TIMER_OPTIONS = [0, 30, 60, 90] as const; // seconds per question; 0 = untimed
