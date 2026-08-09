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
  hasStructuredContent: boolean; // true only once we've actually pulled + transcribed the full lesson plan
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
    summary: "Math — Saxon Math 7/6.",
    books: ["Saxon Math 7/6"],
    lessonPlanUrl: "https://docs.google.com/document/d/1HR-89Rkri-uCICMPVNaXhidS8NQ1QxO9pxtpLnc6fhc/edit?usp=sharing",
    driveUrls: [
      { label: "Tutor Resources", url: "https://drive.google.com/drive/folders/134sGerTmpk4Uxml9zxNAtv_A2lUfdsTd?usp=drive_link" },
      { label: "Parent & Tutor Folder", url: "https://drive.google.com/drive/folders/1g5JgqvINFeinxNur0z92LCbQbUJkkCCU?usp=drive_link" },
    ],
    hasStructuredContent: false,
  },
  {
    id: "loe-essentials-c",
    name: "LOE Essentials C",
    grade: "6th",
    area: "Academic",
    summary: "Logic of English — Essentials C (language arts fundamentals).",
    books: ["Logic of English Essentials"],
    lessonPlanUrl: "https://docs.google.com/document/d/1x76kbzJih9tjj1nHEUp9y6clScgyoC_H_WO0ZTP0ce4/edit?usp=sharing",
    driveUrls: [
      { label: "Tutor Resources", url: "https://drive.google.com/drive/folders/1EIYfu1k9G4QC--WmuNG7H5MROZY2rqHM?usp=drive_link" },
      { label: "Parent & Tutor Folder", url: "https://drive.google.com/drive/folders/1kx1O0lQO6MVxE0dM_HsnN4Dr8P-5v2Rm?usp=drive_link" },
    ],
    hasStructuredContent: false,
  },
  {
    id: "classical-language-arts-6",
    name: "Classical Language Arts 6",
    grade: "6th",
    area: "Academic",
    summary: "Part of the 6th Grade core master lesson plans / TRM.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
    hasStructuredContent: false,
  },
  {
    id: "religion-6",
    name: "Religion 6",
    grade: "6th",
    area: "Academic",
    summary: "Part of the 6th Grade core master lesson plans / TRM.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
    hasStructuredContent: false,
  },
  {
    id: "history-6",
    name: "History 6",
    grade: "6th",
    area: "Academic",
    summary: "Part of the 6th Grade core master lesson plans / TRM.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
    hasStructuredContent: false,
  },
  {
    id: "science-6",
    name: "Science 6",
    grade: "6th",
    area: "Academic",
    summary: "Part of the 6th Grade core master lesson plans / TRM.",
    books: [],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
    hasStructuredContent: false,
  },
  {
    id: "first-form-latin-6",
    name: "First Form Latin 6",
    grade: "6th",
    area: "Academic",
    summary: "Part of the 6th Grade core master lesson plans / TRM. Vocab, grammar/declension drills, and quizzing live here (folded in from the old standalone Latin station).",
    books: ["First Form Latin"],
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
    hasStructuredContent: false,
  },
  {
    id: "music-34",
    name: "Music 3-4",
    grade: "3rd-4th",
    area: "Specials",
    summary: "Singing (rounds + Latin hymns/chants) + recorder. Year B, 32 lessons, ~1 lesson/week.",
    books: ["Lingua Angelica Songbook (tutor only)", "Essential Elements — Recorder Classroom Method (tutor + students)"],
    lessonPlanUrl: "https://docs.google.com/document/d/1FupKLzgdbmjjpU6ifTUyCConhd5xmkpvGXBZXA_BGpM/edit?usp=sharing",
    hasStructuredContent: true,
  },
  {
    id: "pe-34",
    name: "PE 3-4",
    grade: "3rd-4th",
    area: "Specials",
    summary: "Curriculum not yet issued by RCA for 2026-2027 (was also undocumented via email last year — likely handed out at Staff Training Aug 12-13).",
    books: [],
    hasStructuredContent: false,
  },
  {
    id: "pe-56",
    name: "PE 5-6",
    grade: "5th-6th",
    area: "Specials",
    summary: "Curriculum not yet issued by RCA for 2026-2027 (was also undocumented via email last year — likely handed out at Staff Training Aug 12-13).",
    books: [],
    hasStructuredContent: false,
  },
];

export function getRcaClass(id: string): RcaClass | undefined {
  return rcaClasses.find((c) => c.id === id);
}

/** Roughly which weekly lesson number we're on, given a class meets ~once/week and the term started `rcaSchedule.termStart`. Clamped to [1, totalLessons]. Does not account for holidays. */
export function currentLessonNumber(totalLessons: number, today: Date = new Date()): number {
  const start = new Date(rcaSchedule.termStart + "T00:00:00");
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.floor((today.getTime() - start.getTime()) / msPerWeek);
  return Math.min(Math.max(weeksElapsed + 1, 1), totalLessons);
}
