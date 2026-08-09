// Regina Caeli Academy (KSC — Kansas City, Overland Park KS) — Jacob's teaching umbrella.
// One "umbrella" can own many stations (classes); this mirrors the train-system
// metaphor in subjects.ts, just one level down. Personal-use only, not multi-tenant.

export type RcaClass = {
  id: string;
  name: string;
  grade: string;
  area: "Academic" | "Specials";
  summary: string;
  books: string[];
  lessonPlanUrl?: string;
  driveUrls?: { label: string; url: string }[];
};

export const rcaSchedule = {
  center: "KSC — Kansas City (Overland Park, KS)",
  address: "7700 W. 75th St., Overland Park, KS 66204",
  days: ["Monday", "Thursday"] as const,
  startTime: "9:00 AM",
  endTime: "3:30 PM",
  termStart: "2026-08-17", // first day for students
  termEnd: "2027-05-31",
};

export const gradingGuidelinesUrl =
  "https://docs.google.com/document/d/189zthhuCpUCKdGQ7JZoq3nkGx0LNHpYqyMIUTyh6ark/edit?usp=sharing";

const sixthGradeMasterDoc = "https://docs.google.com/document/d/1Fh3cXwTvXfbEExt8GWEzwyhMzlM7rfH4qQusUNYlvGQ/edit?usp=sharing";
const sixthGradeTrm = "https://docs.google.com/document/d/1d5_qq70xh_ooqeUA8icjxlfufnUPzbehHBHfxZ0zJMo/edit?usp=drive_link";
const sixthGradeTutorDrive = "https://drive.google.com/drive/folders/1eNbaFRqKbEENERe3ZYw8FAf8OktXuRSW?usp=drive_link";
const sixthGradeParentDrive = "https://drive.google.com/drive/folders/1d1F3iB0vl_nx6TL9vyAdkeKn04PBM7EG?usp=drive_link";

export const rcaClasses: RcaClass[] = [
  {
    id: "saxon-76",
    name: "Saxon 7/6",
    grade: "6th",
    area: "Academic",
    summary: "Saxon Math 7/6 — 120 lessons over 33 weeks: daily concepts, mixed practice, investigations, tests.",
    books: ["Saxon Math 7/6"],
    lessonPlanUrl: "https://docs.google.com/document/d/1HR-89Rkri-uCICMPVNaXhidS8NQ1QxO9pxtpLnc6fhc/edit?usp=sharing",
    driveUrls: [
      { label: "Tutor Resources", url: "https://drive.google.com/drive/folders/134sGerTmpk4Uxml9zxNAtv_A2lUfdsTd?usp=drive_link" },
      { label: "Parent & Tutor Folder", url: "https://drive.google.com/drive/folders/1g5JgqvINFeinxNur0z92LCbQbUJkkCCU?usp=drive_link" },
    ],
  },
  {
    id: "loe-essentials-c",
    name: "LOE Essentials C",
    grade: "6th",
    area: "Academic",
    summary: "Logic of English — phonograms, spelling rules, grammar, and vocabulary, one unit/week.",
    books: ["Logic of English Essentials"],
    lessonPlanUrl: "https://docs.google.com/document/d/1x76kbzJih9tjj1nHEUp9y6clScgyoC_H_WO0ZTP0ce4/edit?usp=sharing",
    driveUrls: [
      { label: "Tutor Resources", url: "https://drive.google.com/drive/folders/1EIYfu1k9G4QC--WmuNG7H5MROZY2rqHM?usp=drive_link" },
      { label: "Parent & Tutor Folder", url: "https://drive.google.com/drive/folders/1kx1O0lQO6MVxE0dM_HsnN4Dr8P-5v2Rm?usp=drive_link" },
    ],
  },
  {
    id: "classical-language-arts-6",
    name: "Classical Language Arts 6",
    grade: "6th",
    area: "Academic",
    summary: "Narration-essay writing cycles: outline, draft, self-edit, revise, submit for feedback.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "religion-6",
    name: "Religion 6",
    grade: "6th",
    area: "Academic",
    summary: "Baltimore Catechism memory work + Gospel of Mark, read sequentially across the year.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "history-6",
    name: "History 6",
    grade: "6th",
    area: "Academic",
    summary: "Ancient history — Book of the Ancient World, note-taking, maps, paragraph writing, timeline.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "science-6",
    name: "Science 6",
    grade: "6th",
    area: "Academic",
    summary: "Behold and See 6 — reading, workbook, hands-on experiments, Science Notebook.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "first-form-latin-6",
    name: "First Form Latin 6",
    grade: "6th",
    area: "Academic",
    summary: "First Form Latin — weekly lessons, memory work (sayings/grammar/vocab), Form Drills, quizzes every 2-3 weeks. Vocab/grammar drills and quizzing live here (folded in from the old standalone Latin station).",
    books: ["First Form Latin"],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "music-34",
    name: "Music 3-4",
    grade: "3rd-4th",
    area: "Specials",
    summary: "Singing (rounds + Latin hymns/chants) + recorder. Year B, 32 lessons, ~1 lesson/week.",
    books: ["Lingua Angelica Songbook (tutor only)", "Essential Elements — Recorder Classroom Method (tutor + students)"],
    lessonPlanUrl: "https://docs.google.com/document/d/1FupKLzgdbmjjpU6ifTUyCConhd5xmkpvGXBZXA_BGpM/edit?usp=sharing",
  },
];

export function getRcaClass(id: string): RcaClass | undefined {
  return rcaClasses.find((c) => c.id === id);
}

/** Monday & Thursday are the real deadlines — the only two days Jacob is actually on
 * campus teaching. Returns the next one (today counts if it's Mon/Thu). */
export function nextTeachingDay(today: Date = new Date()): Date {
  const day = today.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu
  const daysUntilMon = (1 - day + 7) % 7;
  const daysUntilThu = (4 - day + 7) % 7;
  const offset = Math.min(daysUntilMon, daysUntilThu);
  const next = new Date(today);
  next.setDate(today.getDate() + offset);
  return next;
}

/** Roughly which lesson we're on, given the term started `rcaSchedule.termStart` and these
 * lessons are paced across `totalWeeks` (defaults to 1 lesson/week if omitted). Clamped to
 * [1, totalLessons]. Does not account for holidays. */
export function currentLessonNumber(totalLessons: number, totalWeeks: number = totalLessons, today: Date = new Date()): number {
  const start = new Date(rcaSchedule.termStart + "T00:00:00");
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.floor((today.getTime() - start.getTime()) / msPerWeek);
  const week = Math.min(Math.max(weeksElapsed + 1, 1), totalWeeks);
  return Math.min(Math.max(Math.round((week / totalWeeks) * totalLessons), 1), totalLessons);
}
