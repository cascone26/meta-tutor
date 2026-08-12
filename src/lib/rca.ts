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

// Real calendar events that override the generic Mon/Thu pattern — training
// days, setup days, orientation, etc. Sourced from Dr. Jennings' KSC staff
// emails (2026-08-10 "Staff Training This Week", 2026-08-11 "Schedules and
// students in FACTS"), not guessed. Add to this as new emails come in.
export type RcaEvent = { date: string; label: string; detail: string; time: string };

export const rcaEvents: RcaEvent[] = [
  {
    date: "2026-08-12",
    label: "All-Staff Training",
    detail: "Mandatory for all staff. Bring: lunch, notebook, phone (2-step verification for clock-in), iSolved login, laptop.",
    time: "8:00 AM – 5:00 PM",
  },
  {
    date: "2026-08-13",
    label: "Lead Tutor Training + Center Set-Up + Meet & Greet",
    detail: "Training 8-5. Center Set-Up at 1:00 PM (come help if not already there). Tutor Meet & Greet at 4:00 PM. Parent Orientation follows, ~5:00 PM.",
    time: "8:00 AM – 5:00 PM",
  },
  {
    date: "2026-08-14",
    label: "Optional Prep Day",
    detail: "Not mandatory. Set up your classroom (plan to put everything back at day's end), adapt lesson plans, copy materials, prep FACTS gradebooks — at the center or from home.",
    time: "Optional",
  },
];

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
    summary: "Narration-essay writing cycles (8/year) + poetry memorization (4 poems, stanza-by-stanza with recitation quizzes).",
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
    summary: "Baltimore Catechism memory work + sequential Gospel reading — Mark in the fall, Luke in the spring.",
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
    summary: "Ancient Egypt (fall) then Ancient Near East/Israel (spring) — maps, paragraph writing, and a research paper each semester.",
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
    summary: "Behold and See 6 — matter/forces/machines (fall), biomes and astronomy (spring), plus a Science Fair project.",
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

export type ScheduleItem =
  | { kind: "event"; date: Date; label: string; detail: string; time: string; isToday: boolean }
  | { kind: "teaching"; date: Date; isToday: boolean };

/** What's actually happening next — checks real calendar events (training week,
 * setup day, etc.) BEFORE falling back to the generic Mon/Thu teaching pattern,
 * and refuses to claim a "teaching day" before the term has actually started.
 * This replaces the old nextTeachingDay(), which just always returned the next
 * Mon/Thu regardless of whether that day was actually a normal teaching day —
 * that's how "Next teaching day: Thursday" got shown during staff training week. */
export function getNextScheduleItem(today: Date = new Date()): ScheduleItem {
  const todayKey = today.toISOString().slice(0, 10);
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");

  const upcoming = [...rcaEvents].sort((a, b) => a.date.localeCompare(b.date)).find((ev) => ev.date >= todayKey);
  if (upcoming) {
    return {
      kind: "event",
      date: new Date(upcoming.date + "T00:00:00"),
      label: upcoming.label,
      detail: upcoming.detail,
      time: upcoming.time,
      isToday: upcoming.date === todayKey,
    };
  }

  if (today < termStart) {
    return { kind: "teaching", date: termStart, isToday: false };
  }

  const day = today.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu
  const daysUntilMon = (1 - day + 7) % 7;
  const daysUntilThu = (4 - day + 7) % 7;
  const offset = Math.min(daysUntilMon, daysUntilThu);
  const next = new Date(today);
  next.setDate(today.getDate() + offset);
  return { kind: "teaching", date: next, isToday: offset === 0 };
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
