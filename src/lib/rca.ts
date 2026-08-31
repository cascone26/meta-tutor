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
  /** Real block time, from KSC's official 2026-2027 staff schedule (printed 2026-08-13). */
  block?: string;
  /** Real room assignment, same source. */
  room?: string;
  /** Which of rcaSchedule.days this class actually meets on, if not both — e.g. PE 5-6 is
   * Monday-only and Music 3-4 is Thursday-only on the real schedule (they share Block 6). */
  days?: readonly ("Monday" | "Thursday")[];
};

export const rcaSchedule = {
  center: "KSC — Kansas City (Overland Park, KS)",
  address: "7700 W. 75th St., Overland Park, KS 66204",
  days: ["Monday", "Thursday"] as const,
  startTime: "9:00 AM",
  endTime: "3:30 PM",
  termStart: "2026-08-17", // first day for students
  // Real last day is Field Day (2027-05-24, a Monday), confirmed against
  // Jacob's actual "KSC - Kansas City, KS Calendar" (macOS Calendar.app,
  // subscribed .ics — not Google Calendar, which doesn't have this feed).
  // 2027-05-31 was Memorial Day, a guess that happened to be a real closure
  // anyway but wasn't actually the last instructional day.
  termEnd: "2027-05-24",
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
  // Monthly lead-tutor staff meetings — from Dr. Jennings' 2026-08-24 KSC
  // "Staff Meetings" email. All Thursdays; start after Angelus in the St.
  // Rose classroom. Only lead tutors attend (Mr. Cascone as 6th-grade lead);
  // assistants wait in the lunchroom. Notes sent afterward. The email also
  // listed May 6, 2027, but that date is a verified RCA closure (Ascension),
  // so it's intentionally NOT added here pending Jacob's confirmation.
  { date: "2026-09-03", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2026-10-08", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2026-11-05", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2026-12-03", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2027-01-14", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2027-02-04", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2027-03-04", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
  { date: "2027-04-08", label: "Lead Tutor Staff Meeting", detail: "Monthly KSC staff meeting in the St. Rose classroom. Lead tutors attend; assistants wait in the lunchroom. Notes sent afterward.", time: "After Angelus" },
];

// Single source of truth for "when is RCA closed" beyond the training-week
// rcaEvents above — used by both getNextScheduleItem() below and the
// calendar view (rca-calendar.ts). Before this, that knowledge only
// existed as prose comments inside the Saxon lesson-pacing generator,
// invisible to the rest of the app — which is exactly why
// getNextScheduleItem() could show the wrong thing during a real break
// (found 2026-08-13, sick-him audit).
//
// CONFIRMED 2026-08-20 against Jacob's real "KSC - Kansas City, KS Calendar"
// (a subscribed .ics feed in macOS Calendar.app — read directly via
// `osascript`/Calendar.app, not Google Calendar, which doesn't carry this
// feed at all). Every "<X> - RCA Closed" event on that calendar for the
// 2026-2027 term is listed below verbatim. This replaced a REASONED-ESTIMATE
// list that had never been checked against a real RCA calendar — two of
// those estimates were wrong by a week or more (Fall Break, Easter Break),
// and two real single-day closures (both on real Mon/Thu teaching days)
// weren't modeled at all (Immaculate Conception, Ascension). Add to this
// list if RCA adds/moves a closure mid-year; re-pull via the same
// osascript route rather than re-guessing.
export type RcaClosure = { start: string; end: string; label: string; estimated: boolean };

export const RCA_CLOSURES: RcaClosure[] = [
  { start: "2026-08-15", end: "2026-08-15", label: "Solemnity of the Assumption of the BVM", estimated: false },
  { start: "2026-09-07", end: "2026-09-07", label: "Labor Day", estimated: false },
  { start: "2026-09-28", end: "2026-10-02", label: "Fall Break", estimated: false },
  { start: "2026-11-23", end: "2026-11-27", label: "Thanksgiving Break", estimated: false },
  { start: "2026-12-07", end: "2026-12-07", label: "Solemnity of the Immaculate Conception", estimated: false },
  { start: "2026-12-21", end: "2027-01-08", label: "Christmas Break", estimated: false },
  { start: "2027-02-15", end: "2027-02-19", label: "Mid-Winter Break", estimated: false },
  { start: "2027-03-22", end: "2027-04-02", label: "Easter Break", estimated: false },
  { start: "2027-05-06", end: "2027-05-06", label: "Solemnity of the Ascension of the Lord", estimated: false },
  { start: "2027-05-31", end: "2027-05-31", label: "Memorial Day", estimated: false },
];

// Informational, not a closure — classes still meet during these days. Real
// CLT testing days confirmed 2026-08-20 (11th grade Thu 4/15; 3rd-6th Day 1
// Mon 4/19; 10th/7th-8th/3rd-6th Day 2 all Thu 4/22) — not a uniform week,
// this range just spans the earliest to latest real testing day. Currently
// unused/not rendered anywhere yet.
export const CLT_TESTING_WEEK = { start: "2027-04-15", end: "2027-04-22", estimated: false };

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** RCA (Overland Park, KS) always runs on Central time — but a plain `new
 * Date()` reflects whatever timezone the CODE is running in, not KS. On the
 * client (Jacob's own browser) that's already Central, so it's harmless
 * there; on the server (Vercel functions default to UTC) it silently rolls
 * "today" over to tomorrow's date/weekday around 7pm Central, since UTC has
 * already crossed midnight. That mismatch between a server-computed weekday
 * and a client-computed one is exactly what produced a real live bug
 * (found 2026-08-30): /rca/today's server-rendered weekday said "Monday"
 * (already past midnight UTC) while the client-side lesson-pacing math still
 * used the real Central "Sunday," and the two got stitched together into a
 * lesson from two weeks earlier. Use this everywhere "today" means "the real
 * KS school day," server or client, so both sides always agree. */
export function centralToday(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return new Date(`${y}-${m}-${d}T00:00:00`);
}

/** Minutes since midnight, Central time, right now — for "up next" wall-clock
 * comparisons against block times. centralToday() is deliberately pinned to
 * midnight (it's a calendar-day key, not a clock), so it can't be reused for
 * this; this reads the real Central hour/minute directly instead. */
export function centralNowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")!.value);
  const m = Number(parts.find((p) => p.type === "minute")!.value);
  return h * 60 + m;
}

/** Is this date inside a real (or estimated) closure range? Checked by key
 * string comparison, not Date math, to sidestep timezone drift entirely. */
export function getClosure(date: Date): RcaClosure | undefined {
  const key = dateKey(date);
  return RCA_CLOSURES.find((c) => key >= c.start && key <= c.end);
}

export const gradingGuidelinesUrl =
  "https://docs.google.com/document/d/189zthhuCpUCKdGQ7JZoq3nkGx0LNHpYqyMIUTyh6ark/edit?usp=sharing";

const sixthGradeMasterDoc = "https://docs.google.com/document/d/1Fh3cXwTvXfbEExt8GWEzwyhMzlM7rfH4qQusUNYlvGQ/edit?usp=sharing";
const sixthGradeTrm = "https://docs.google.com/document/d/1d5_qq70xh_ooqeUA8icjxlfufnUPzbehHBHfxZ0zJMo/edit?usp=drive_link";
const sixthGradeTutorDrive = "https://drive.google.com/drive/folders/1eNbaFRqKbEENERe3ZYw8FAf8OktXuRSW?usp=drive_link";
const sixthGradeParentDrive = "https://drive.google.com/drive/folders/1d1F3iB0vl_nx6TL9vyAdkeKn04PBM7EG?usp=drive_link";

// Ordered by block start time (Jacob's actual daily walk-through order), not
// insertion order — the /rca hub and every other list built off this array
// should read top-to-bottom the way his day actually runs. Religion 6 and
// First Form Latin 6 share the same 10:10-10:55 block/room on the source
// schedule (unusual — flagged, not silently resolved); PE 1-2/PE 5-6 tie on
// time too but are Mon-only/Thu-only so they never actually land on the same
// real day.
export const rcaClasses: RcaClass[] = [
  {
    id: "saxon-76",
    name: "Saxon 7/6",
    grade: "6th",
    area: "Academic",
    summary: "Saxon Math 7/6 — 120 lessons over 33 weeks: daily concepts and mixed practice, 10 cumulative tests, 12 investigations, faith-reflection openers.",
    books: ["Saxon Math 7/6"],
    block: "9:00 – 9:55 AM",
    room: "St. Monica",
    lessonPlanUrl: "https://docs.google.com/document/d/1UvFCFhXCS-DoD4QZYBOrg7EMQx0vlu48XPg_NthdqI4/edit?usp=sharing",
    driveUrls: [
      { label: "Tutor Resources", url: "https://drive.google.com/drive/folders/134sGerTmpk4Uxml9zxNAtv_A2lUfdsTd?usp=drive_link" },
      { label: "Parent & Tutor Folder", url: "https://drive.google.com/drive/folders/1g5JgqvINFeinxNur0z92LCbQbUJkkCCU?usp=drive_link" },
    ],
  },
  {
    id: "religion-6",
    name: "Religion 6",
    grade: "6th",
    area: "Academic",
    summary: "Baltimore Catechism memory work + sequential Gospel reading — Mark in the fall, Luke in the spring.",
    books: ["Baltimore Catechism", "Bible (Gospel of Mark / Luke)"],
    block: "10:10 – 10:55 AM",
    room: "St. Monica",
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
    block: "10:10 – 10:55 AM",
    room: "St. Monica",
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "loe-essentials-c",
    name: "LOE Essentials C",
    grade: "6th",
    area: "Academic",
    summary: "Logic of English Essentials C — 30 units of phonograms, spelling, grammar, and vocabulary, with Thursday dictation assessments and concurrent cursive practice.",
    books: ["Logic of English Essentials"],
    block: "10:55 – 11:55 AM",
    room: "St. Monica",
    lessonPlanUrl: "https://docs.google.com/document/d/1_-48gBlz8-bdBnzyoH4rvSC5RBudEetZzOD7C0Nv0LI/edit?usp=sharing",
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
    block: "12:45 – 1:00 PM",
    room: "St. Monica",
    lessonPlanUrl: sixthGradeMasterDoc,
    driveUrls: [
      { label: "6th Grade Tutor Resource Manual", url: sixthGradeTrm },
      { label: "Tutor Resources", url: sixthGradeTutorDrive },
      { label: "Parent & Tutor Resources", url: sixthGradeParentDrive },
    ],
  },
  {
    id: "pe-1-2",
    name: "PE 1-2",
    grade: "1st-2nd",
    area: "Specials",
    summary: "Physical education for 1st-2nd grade — Monday only.",
    books: [],
    // Same "Option 2" schedule update as Music 3-4 below; room now literally "Gym" per the
    // email table (not the old "St. Sebastian" guess). Jacob leads, Harmon assists.
    // Block 4 time corrected AGAIN per Mrs. Uffman's 2026-08-20 follow-up ("Re: specials
    // changes and schedule update", confirmed with Dr. Jennings): Special 1 runs 1:00-1:45,
    // killing the 10-minute gap before Special 2 at 1:45. Supersedes the 12:50-1:35 in the
    // original Option 2 table. 12:45-1:00 is Classical Literature / chores time.
    block: "1:00 – 1:45 PM",
    room: "Gym",
    days: ["Monday"],
  },
  {
    id: "pe-5-6",
    name: "PE 5-6",
    grade: "5th-6th",
    area: "Specials",
    summary: "Physical education for 5th-6th grade — Thursday only.",
    books: [],
    // MOVED entirely under "Option 2": was Block 6 Monday (St. Sebastian), now Block 4
    // THURSDAY, room "Cafe" per the email table — different day AND different room from
    // what this file previously said. Source: Dr. Jennings' 2026-08-19/20 schedule emails.
    // Block 4 time corrected to 1:00-1:45 per Mrs. Uffman's 2026-08-20 follow-up (confirmed
    // with Dr. Jennings) — supersedes the 12:50-1:35 in the original Option 2 table.
    block: "1:00 – 1:45 PM",
    room: "Cafe",
    days: ["Thursday"],
  },
  {
    id: "history-6",
    name: "History 6",
    grade: "6th",
    area: "Academic",
    summary: "Ancient Egypt (fall) then Ancient Near East/Israel (spring) — maps, paragraph writing, and a research paper each semester.",
    books: ["Book of the Ancient World (BAW)"],
    block: "1:55 – 2:40 PM",
    room: "St. Monica",
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
    books: ["Behold and See 6"],
    block: "1:55 – 2:40 PM",
    room: "St. Monica",
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
    summary: "Singing (rounds + Latin hymns/chants) + composer study (Chopin, Handel, Beethoven, Mozart). Year A, 31 lessons, ~1 lesson/week.",
    books: ["Lingua Angelica Songbook (tutor only)"],
    // Real "Specials Schedule by Class: Option 2" from Dr. Jennings' 2026-08-19/20 emails
    // ("specials changes and schedule update" + follow-up), which superseded the original
    // printed staff schedule this file used to be sourced from. Block 6 shifted 2:40-3:25 ->
    // 2:30-3:15; room/day unchanged (Jacob leads, Schroeder assists, still Thursday, St.
    // Gianna). Explicitly labeled "Option 2" / "first week, working out the kinks" in the
    // source email — re-verify if a further correction email comes in.
    block: "2:30 – 3:15 PM",
    room: "St. Gianna",
    days: ["Thursday"],
    // The "3/4 LP" link from Dr. Jennings' 2026-08-20 "Music A lesson plan and music folder"
    // email. The previous link here (doc 1FupKLzg...) export-verified 2026-08-23 as titled
    // "Music 3-4 Year B" — the wrong curriculum year (this year is Year A). This doc is
    // RCA-login gated (anonymous export returns 401), so its content can't be re-verified
    // here, but it is the link the coordinator distributed and Jacob's login can open it.
    lessonPlanUrl: "https://docs.google.com/document/d/1hGGo5tM9xw7wN_g0nGT2vkV7QB5pue7aq0AZx1e35zc/edit?usp=sharing",
    driveUrls: [
      // "Tutor Folder" for Music 3/4, same 2026-08-20 email.
      { label: "Music 3/4 Tutor Folder", url: "https://drive.google.com/open?id=1EbSoma_qVItHeHUCpqK_YO4x-tArA6Wj" },
    ],
  },
];

export function getRcaClass(id: string): RcaClass | undefined {
  return rcaClasses.find((c) => c.id === id);
}

export type ScheduleItem =
  | { kind: "event"; date: Date; label: string; detail: string; time: string; isToday: boolean }
  | { kind: "closure"; date: Date; label: string; estimated: boolean; isToday: boolean }
  | { kind: "teaching"; date: Date; isToday: boolean }
  | { kind: "term-ended" };

/** What's actually happening next — checks real calendar events (training week,
 * setup day, etc.) BEFORE falling back to the generic Mon/Thu teaching pattern,
 * and refuses to claim a "teaching day" before the term has actually started.
 * This replaces the old nextTeachingDay(), which just always returned the next
 * Mon/Thu regardless of whether that day was actually a normal teaching day —
 * that's how "Next teaching day: Thursday" got shown during staff training week.
 *
 * Also checks RCA_CLOSURES now (fall break, Thanksgiving, etc.) — previously
 * this only knew about the 3-entry rcaEvents list, so opening the app during
 * an actual break (e.g. Thanksgiving week) would compute a "next teaching
 * day" INSIDE that break instead of recognizing it as closed (found
 * 2026-08-13, sick-him audit). */
export function getNextScheduleItem(today: Date = centralToday()): ScheduleItem {
  // Local date, NOT toISOString() — that converts to UTC, which silently
  // rolls "today" over to tomorrow's date in the evening (Central time
  // crosses UTC midnight around 7pm), comparing against rcaEvents' plain
  // local-calendar-date strings a day early.
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
  const termEnd = new Date(rcaSchedule.termEnd + "T00:00:00");

  // rcaSchedule.termEnd was defined but never actually checked anywhere —
  // without this, the Mon/Thu walk-forward below would happily keep
  // suggesting "next work day" indefinitely, even months after the real
  // school year ends (found 2026-08-13 auditing this function after fixing
  // the closure-day gap; won't manifest until summer 2027, fixed while the
  // context was fresh rather than left for later).
  if (today > termEnd) {
    return { kind: "term-ended" };
  }

  const upcoming = [...rcaEvents].sort((a, b) => a.date.localeCompare(b.date)).find((ev) => ev.date >= todayKey);

  // An rcaEvent happening TODAY always wins — it overrides whatever the day
  // would otherwise be (training day, a staff meeting instead of teaching, etc.)
  if (upcoming && upcoming.date === todayKey) {
    return { kind: "event", date: new Date(upcoming.date + "T00:00:00"), label: upcoming.label, detail: upcoming.detail, time: upcoming.time, isToday: true };
  }

  const todaysClosure = getClosure(today);
  if (todaysClosure) {
    return { kind: "closure", date: today, label: todaysClosure.label, estimated: todaysClosure.estimated, isToday: true };
  }

  if (today < termStart) {
    // Before the term starts there's no regular Mon/Thu pattern yet to compare
    // against, so any real upcoming event (training/setup days) just wins outright.
    if (upcoming) {
      return { kind: "event", date: new Date(upcoming.date + "T00:00:00"), label: upcoming.label, detail: upcoming.detail, time: upcoming.time, isToday: false };
    }
    return { kind: "teaching", date: termStart, isToday: false };
  }

  // Term is underway — find the next real teaching day (walk forward day-by-day,
  // not just Mon/Thu math, so a closure sitting in between is actually skipped
  // instead of silently landing inside it). Capped at termEnd.
  let nextTeaching: Date | null = null;
  for (let i = 0; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d > termEnd) break;
    const day = d.getDay();
    if (day !== 1 && day !== 4) continue; // Mon=1, Thu=4
    if (getClosure(d)) continue;
    nextTeaching = d;
    break;
  }

  // A future rcaEvent (e.g. the monthly Lead Tutor Staff Meeting) only preempts
  // the next teaching day if it actually falls ON or BEFORE it. Without this
  // comparison, an event weeks out would wrongly eclipse a completely normal
  // Mon/Thu class happening sooner (found 2026-08-30: the assistant told Jacob
  // "tomorrow" was training/setup week because of a staff meeting 4 days out,
  // when tomorrow was actually a normal Monday).
  if (upcoming && (!nextTeaching || upcoming.date <= dateKey(nextTeaching))) {
    return { kind: "event", date: new Date(upcoming.date + "T00:00:00"), label: upcoming.label, detail: upcoming.detail, time: upcoming.time, isToday: false };
  }

  if (nextTeaching) {
    return { kind: "teaching", date: nextTeaching, isToday: dateKey(nextTeaching) === todayKey };
  }
  return { kind: "term-ended" };
}

/** The next date Jacob will actually be teaching regular classes — today
 * itself if today qualifies, otherwise the next real Mon/Thu that isn't a
 * closure and isn't overridden by an rcaEvent (training day, staff meeting).
 * Used to pick WHICH lesson a per-class page should show. Without this,
 * currentLessonNumber()'s week-fraction estimate stayed pinned to the last
 * ACTUAL teaching day forever, so a class page kept showing last Thursday's
 * lesson all weekend instead of advancing to the upcoming one — backwards
 * for a page whose whole point is prepping ahead of the next class (found
 * 2026-08-30: Jacob expected Sunday-night prep to already show next week's
 * lesson, not last Thursday's). getNextScheduleItem() doesn't fit this need
 * on its own — its job is "what's on the calendar today" (so it correctly
 * returns kind "closure"/"event" on those days), not "which class-day should
 * lesson content be keyed to." */
export function nextTeachingDate(today: Date = centralToday()): Date | null {
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
  const termEnd = new Date(rcaSchedule.termEnd + "T00:00:00");
  const start = today < termStart ? termStart : today;
  for (let i = 0; i <= 21; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > termEnd) break;
    const day = d.getDay();
    if (day !== 1 && day !== 4) continue; // Mon=1, Thu=4
    if (getClosure(d)) continue;
    const key = dateKey(d);
    if (rcaEvents.some((e) => e.date === key)) continue;
    return d;
  }
  return null;
}

/** Roughly which lesson we're on, given the term started `rcaSchedule.termStart` and these
 * lessons are paced across `totalWeeks` (defaults to 1 lesson/week if omitted). Clamped to
 * [1, totalLessons]. Does not account for holidays. */
export function currentLessonNumber(totalLessons: number, totalWeeks: number = totalLessons, today: Date = centralToday()): number {
  const start = new Date(rcaSchedule.termStart + "T00:00:00");
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.floor((today.getTime() - start.getTime()) / msPerWeek);
  const week = Math.min(Math.max(weeksElapsed + 1, 1), totalWeeks);
  return Math.min(Math.max(Math.round((week / totalWeeks) * totalLessons), 1), totalLessons);
}

// currentLessonNumber() CLAMPS once real elapsed weeks pass a subject's
// totalWeeks, silently returning the last documented lesson forever after —
// which reads as "this is today's real lesson" with zero signal that the
// pacing data actually ran out. Several subjects' content only covers the
// first 25-33 of the term's real ~42 weeks (found 2026-08-16: doc access for
// the back half is still 401ing). This tells callers when that's happening
// so they can say so instead of presenting stale content as current.
export function isPacingCurrent(totalWeeks: number, today: Date = centralToday()): boolean {
  const start = new Date(rcaSchedule.termStart + "T00:00:00");
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.floor((today.getTime() - start.getTime()) / msPerWeek);
  return weeksElapsed + 1 <= totalWeeks;
}
