// Saxon 7/6 — transcribed/condensed from RCA's official master lesson plan doc (the 2025-2026 copy —
// 2026-2027's hasn't been issued yet), pulled 2026-08-09. The source doc is genuinely a pacing
// checklist ("Teach Lessons 1, 2, 3" + a checkbox per lesson) rather than a topic-by-topic teaching
// guide — Saxon's actual lesson content lives in the textbook itself, not this planning doc. The
// week/date labels below (e.g. "Week 1 (Aug 18-22)") are last year's calendar dates, carried over as-is —
// treat the WEEK NUMBERS as reliable pacing, not the literal dates, until 2026-2027's center calendar
// is in hand.

import type { SubjectContent } from "./types";

export const saxon76Content: SubjectContent = {
  totalWeeks: 33,
  overview:
    "Saxon Math 7/6: 120 lessons organized over 33 teaching weeks. RCA classes meet Mon/Thu; typically " +
    "2-3 lessons taught per week with daily homework, weekly investigations, 9 unit tests, and 11 homework " +
    "checks. Textbook: Saxon Math 7/6 (tutor + student editions). Daily structure: introduce/teach concepts, " +
    "problem sets, mixed practice. Investigations are hands-on/exploratory projects. Homework checked at " +
    "intervals; tests review cumulative material. NOTE: week labels/dates below are from the 2025-2026 " +
    "source doc (2026-2027's hasn't been sent yet) — trust the week NUMBER for pacing, not the literal date.",

  lessons: [
    // Week 1: Aug 18-22
    { n: 1, sections: [{ label: "Week 1 (Aug 18-22)", text: "Monday — introduce textbook, teach concepts. Daily problem set." }] },
    { n: 2, sections: [{ label: "Week 1 (Aug 18-22)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 3, sections: [{ label: "Week 1 (Aug 18-22)", text: "Wednesday — continue lesson plan, problem set." }] },
    { n: 4, sections: [{ label: "Week 1 (Aug 18-22)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 5, sections: [{ label: "Week 1 (Aug 18-22)", text: "Friday — complete lesson, problem set." }] },

    // Week 2: Aug 25-29
    { n: 6, sections: [{ label: "Week 2 (Aug 25-29)", text: "Monday — teach concepts, problem set." }] },
    { n: 7, sections: [{ label: "Week 2 (Aug 25-29)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 8, sections: [{ label: "Week 2 (Aug 25-29)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 9, sections: [{ label: "Week 2 (Aug 25-29)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 10, sections: [{ label: "Week 2 (Aug 25-29)", text: "Friday — complete lesson, problem set." }] },

    // Week 3: Sep 1-5 (Labor Day closure Mon)
    { n: 11, sections: [{ label: "Week 3 (Sep 1-5)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 12, sections: [{ label: "Week 3 (Sep 1-5)", text: "Wednesday — prepare homework packet, mixed practice." }] },
    { n: 13, sections: [{ label: "Week 3 (Sep 1-5)", text: "Friday — teach new concepts, problem set." }], note: "Thursday: Math Test 1 (material through Lesson 6); Homework Check 1 (Lessons 2, 3, 5, 7, 8, 10, 11, 12)" },

    // Week 4: Sep 8-12
    { n: 14, sections: [{ label: "Week 4 (Sep 8-12)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 15, sections: [{ label: "Week 4 (Sep 8-12)", text: "Wednesday — continue lessons, mixed practice." }] },
    { n: 16, sections: [{ label: "Week 4 (Sep 8-12)", text: "Thursday — teach new concepts, problem set." }] },
    { n: 17, sections: [{ label: "Week 4 (Sep 8-12)", text: "Friday — complete lesson, problem set." }], note: "Monday: Investigation 1 (exploratory project)" },

    // Week 5: Sep 15-19
    { n: 18, sections: [{ label: "Week 5 (Sep 15-19)", text: "Monday — teach concepts, problem set." }] },
    { n: 19, sections: [{ label: "Week 5 (Sep 15-19)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 20, sections: [{ label: "Week 5 (Sep 15-19)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 21, sections: [{ label: "Week 5 (Sep 15-19)", text: "Friday — prepare homework packet, problem set." }], note: "Thursday: Investigation 2 (exploratory project)" },

    // Week 6: Sep 22-26
    { n: 22, sections: [{ label: "Week 6 (Sep 22-26)", text: "Monday — teach concepts, problem set." }] },
    { n: 23, sections: [{ label: "Week 6 (Sep 22-26)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 24, sections: [{ label: "Week 6 (Sep 22-26)", text: "Wednesday — continue lessons, problem set." }], note: "Homework Check 2 (Lessons 13, 14, 15, 17, 19, 20, 21) occurs; Thursday: Math Test 2 (material through Lesson 19)" },

    // Week 7: Oct 6-10 (Fall break before)
    { n: 25, sections: [{ label: "Week 7 (Oct 6-10)", text: "Monday — welcome back from fall break, teach concepts, problem set." }] },
    { n: 26, sections: [{ label: "Week 7 (Oct 6-10)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 27, sections: [{ label: "Week 7 (Oct 6-10)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 28, sections: [{ label: "Week 7 (Oct 6-10)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 29, sections: [{ label: "Week 7 (Oct 6-10)", text: "Friday — complete lesson, problem set." }] },

    // Week 8: Oct 13-17
    { n: 30, sections: [{ label: "Week 8 (Oct 13-17)", text: "Monday — teach concepts, problem set." }] },
    { n: 31, sections: [{ label: "Week 8 (Oct 13-17)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 32, sections: [{ label: "Week 8 (Oct 13-17)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 33, sections: [{ label: "Week 8 (Oct 13-17)", text: "Friday — prepare homework packet, problem set." }], note: "Thursday: Investigation 3 (exploratory project)" },

    // Week 9: Oct 20-24
    { n: 34, sections: [{ label: "Week 9 (Oct 20-24)", text: "Tuesday — teach concepts, problem set." }], note: "Monday: Homework Check 3 (Lessons 23, 24, 26, 27, 29, 31, 32, 33)" },
    { n: 35, sections: [{ label: "Week 9 (Oct 20-24)", text: "Wednesday — teach new concepts, mixed practice." }] },
    { n: 36, sections: [{ label: "Week 9 (Oct 20-24)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 3 (material through Lesson 31)" },

    // Week 10: Oct 27-31
    { n: 37, sections: [{ label: "Week 10 (Oct 27-31)", text: "Monday — teach concepts, problem set." }] },
    { n: 38, sections: [{ label: "Week 10 (Oct 27-31)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 39, sections: [{ label: "Week 10 (Oct 27-31)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 40, sections: [{ label: "Week 10 (Oct 27-31)", text: "Friday — complete lesson, problem set." }], note: "Thursday: All Saints' Day Celebration; Investigation 4 (exploratory project)" },

    // Week 11: Nov 3-7
    { n: 41, sections: [{ label: "Week 11 (Nov 3-7)", text: "Monday — teach concepts, problem set." }] },
    { n: 42, sections: [{ label: "Week 11 (Nov 3-7)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 43, sections: [{ label: "Week 11 (Nov 3-7)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 44, sections: [{ label: "Week 11 (Nov 3-7)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 45, sections: [{ label: "Week 11 (Nov 3-7)", text: "Friday — prepare homework packet, problem set." }] },

    // Week 12: Nov 10-14
    { n: 46, sections: [{ label: "Week 12 (Nov 10-14)", text: "Monday — teach concepts, problem set." }], note: "Homework Check 4 (Lessons 34, 35, 36, 38, 39, 40, 42, 43, 45)" },
    { n: 47, sections: [{ label: "Week 12 (Nov 10-14)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 48, sections: [{ label: "Week 12 (Nov 10-14)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 49, sections: [{ label: "Week 12 (Nov 10-14)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 4 (material through Lesson 43)" },

    // Week 13: Nov 17-21 (Thanksgiving break after)
    { n: 50, sections: [{ label: "Week 13 (Nov 17-21)", text: "Monday — teach concepts, problem set." }] },
    { n: 51, sections: [{ label: "Week 13 (Nov 17-21)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 52, sections: [{ label: "Week 13 (Nov 17-21)", text: "Wednesday — continue lessons, problem set." }], note: "Thursday: Thanksgiving Program; Investigation 5 (exploratory project); RCA closed next week for Thanksgiving break" },

    // Week 14: Dec 1-5 (after Thanksgiving break)
    { n: 53, sections: [{ label: "Week 14 (Dec 1-5)", text: "Monday — welcome back from Thanksgiving break, teach concepts, problem set." }] },
    { n: 54, sections: [{ label: "Week 14 (Dec 1-5)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 55, sections: [{ label: "Week 14 (Dec 1-5)", text: "Wednesday — prepare homework packet, problem set." }] },
    { n: 56, sections: [{ label: "Week 14 (Dec 1-5)", text: "Thursday — teach new concepts, mixed practice." }], note: "Homework Check 5 (Lessons 47, 48, 49, 51, 52, 54, 55)" },
    { n: 57, sections: [{ label: "Week 14 (Dec 1-5)", text: "Friday — complete lesson, problem set." }] },

    // Week 15: Dec 8-12 (Immaculate Conception closure Mon)
    { n: 58, sections: [{ label: "Week 15 (Dec 8-12)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 59, sections: [{ label: "Week 15 (Dec 8-12)", text: "Wednesday — teach new concepts, mixed practice." }] },
    { n: 60, sections: [{ label: "Week 15 (Dec 8-12)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 5 (material through Lesson 52)" },

    // Week 16: Dec 15-19 (Christmas break after)
    { n: 61, sections: [{ label: "Week 16 (Dec 15-19)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 62, sections: [{ label: "Week 16 (Dec 15-19)", text: "Wednesday — prepare homework packet, mixed practice." }] },
    { n: 63, sections: [{ label: "Week 16 (Dec 15-19)", text: "Thursday — teach new concepts, problem set." }], note: "End of fall semester (grades due); Homework Check 6 (Lessons 57, 58, 59, 60, 61, 62); RCA closed for Christmas break; Monday: Investigation 6 (exploratory project)" },

    // Week 17: Jan 12-16 (after Christmas break)
    { n: 64, sections: [{ label: "Week 17 (Jan 12-16)", text: "Monday — welcome back from Christmas break, teach concepts, problem set." }] },
    { n: 65, sections: [{ label: "Week 17 (Jan 12-16)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 66, sections: [{ label: "Week 17 (Jan 12-16)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 67, sections: [{ label: "Week 17 (Jan 12-16)", text: "Thursday — teach new concepts, mixed practice." }], note: "Fall semester report cards sent" },
    { n: 68, sections: [{ label: "Week 17 (Jan 12-16)", text: "Friday — complete lesson, problem set." }] },

    // Week 18: Jan 19-23
    { n: 69, sections: [{ label: "Week 18 (Jan 19-23)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 70, sections: [{ label: "Week 18 (Jan 19-23)", text: "Wednesday — teach new concepts, mixed practice." }] },
    { n: 71, sections: [{ label: "Week 18 (Jan 19-23)", text: "Friday — prepare homework packet, problem set." }], note: "Thursday: Investigation 7 (exploratory project)" },

    // Week 19: Jan 26-30
    { n: 72, sections: [{ label: "Week 19 (Jan 26-30)", text: "Monday — teach concepts, problem set." }], note: "Homework Check 7 (Lessons 65, 66, 68, 69, 70, 71)" },
    { n: 73, sections: [{ label: "Week 19 (Jan 26-30)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 74, sections: [{ label: "Week 19 (Jan 26-30)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 75, sections: [{ label: "Week 19 (Jan 26-30)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 6 (material through Lesson 62)" },

    // Week 20: Feb 2-6
    { n: 76, sections: [{ label: "Week 20 (Feb 2-6)", text: "Monday — teach concepts, problem set." }] },
    { n: 77, sections: [{ label: "Week 20 (Feb 2-6)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 78, sections: [{ label: "Week 20 (Feb 2-6)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 79, sections: [{ label: "Week 20 (Feb 2-6)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 80, sections: [{ label: "Week 20 (Feb 2-6)", text: "Friday — complete lesson, problem set." }] },

    // Week 21: Feb 9-13 (Mid-Winter break after)
    { n: 81, sections: [{ label: "Week 21 (Feb 9-13)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 82, sections: [{ label: "Week 21 (Feb 9-13)", text: "Wednesday — teach new concepts, mixed practice." }] },
    { n: 83, sections: [{ label: "Week 21 (Feb 9-13)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 84, sections: [{ label: "Week 21 (Feb 9-13)", text: "Friday — prepare homework packet, problem set." }], note: "Monday: Investigation 8 (exploratory project); RCA closed for Mid-Winter break" },

    // Week 22: Feb 23-27 (after Mid-Winter break)
    { n: 85, sections: [{ label: "Week 22 (Feb 23-27)", text: "Monday — welcome back from Mid-Winter break, teach concepts, problem set." }], note: "Homework Check 8 (Lessons 73, 74, 75, 77, 78, 80, 81, 82, 84)" },
    { n: 86, sections: [{ label: "Week 22 (Feb 23-27)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 87, sections: [{ label: "Week 22 (Feb 23-27)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 88, sections: [{ label: "Week 22 (Feb 23-27)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 7 (material through Lesson 72)" },

    // Week 23: Mar 2-6
    { n: 89, sections: [{ label: "Week 23 (Mar 2-6)", text: "Monday — teach concepts, problem set." }] },
    { n: 90, sections: [{ label: "Week 23 (Mar 2-6)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 91, sections: [{ label: "Week 23 (Mar 2-6)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 92, sections: [{ label: "Week 23 (Mar 2-6)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Investigation 9 (exploratory project)" },

    // Week 24: Mar 9-13
    { n: 93, sections: [{ label: "Week 24 (Mar 9-13)", text: "Monday — teach concepts, problem set." }] },
    { n: 94, sections: [{ label: "Week 24 (Mar 9-13)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 95, sections: [{ label: "Week 24 (Mar 9-13)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 96, sections: [{ label: "Week 24 (Mar 9-13)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 97, sections: [{ label: "Week 24 (Mar 9-13)", text: "Friday — prepare homework packet, problem set." }] },

    // Week 25: Mar 16-20
    { n: 98, sections: [{ label: "Week 25 (Mar 16-20)", text: "Tuesday — teach concepts, problem set." }], note: "Monday: Homework Check 9 (Lessons 86, 87, 88, 90, 91, 92, 94, 95, 97)" },
    { n: 99, sections: [{ label: "Week 25 (Mar 16-20)", text: "Wednesday — teach new concepts, mixed practice." }] },
    { n: 100, sections: [{ label: "Week 25 (Mar 16-20)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 8 (material through Lesson 85)" },

    // Week 26: Mar 23-27
    { n: 101, sections: [{ label: "Week 26 (Mar 23-27)", text: "Tuesday — teach concepts, problem set." }] },
    { n: 102, sections: [{ label: "Week 26 (Mar 23-27)", text: "Wednesday — teach new concepts, mixed practice." }] },
    { n: 103, sections: [{ label: "Week 26 (Mar 23-27)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 104, sections: [{ label: "Week 26 (Mar 23-27)", text: "Friday — complete lesson, problem set." }], note: "Monday: Investigation 10 (exploratory project); RCA closed for Holy Week & Easter" },

    // Week 27-28: Mar 30 - Apr 10 (Holy Week & Easter break — no work)
    // (Lessons 105-109 resume after break)

    // Week 29: Apr 13-17 (after Easter break)
    { n: 105, sections: [{ label: "Week 29 (Apr 13-17)", text: "Monday — welcome back from Easter break, teach concepts (CLT Practice Test in morning), problem set." }] },
    { n: 106, sections: [{ label: "Week 29 (Apr 13-17)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 107, sections: [{ label: "Week 29 (Apr 13-17)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 108, sections: [{ label: "Week 29 (Apr 13-17)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 109, sections: [{ label: "Week 29 (Apr 13-17)", text: "Friday — complete lesson, problem set." }] },

    // Week 30: Apr 20-24 (CLT testing)
    { n: 110, sections: [{ label: "Week 30 (Apr 20-24)", text: "Tuesday — teach concepts, problem set." }], note: "Monday & Thursday: CLT testing (3rd-6th grades & 7th-10th grades); no new lessons on test days; Friday: review day" },
    { n: 111, sections: [{ label: "Week 30 (Apr 20-24)", text: "Wednesday — teach new concepts, mixed practice." }] },

    // Week 31: Apr 27-May 1
    { n: 112, sections: [{ label: "Week 31 (Apr 27-May 1)", text: "Monday — teach concepts, problem set." }], note: "Homework Check 10 (Lessons 98, 99, 100, 101, 102, 104, 106, 107, 109, 110, 111)" },
    { n: 113, sections: [{ label: "Week 31 (Apr 27-May 1)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 114, sections: [{ label: "Week 31 (Apr 27-May 1)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 115, sections: [{ label: "Week 31 (Apr 27-May 1)", text: "Friday — complete lesson, problem set." }], note: "Thursday: Math Test 9 (material through Lesson 100)" },

    // Week 32: May 4-8
    { n: 116, sections: [{ label: "Week 32 (May 4-8)", text: "Monday — teach concepts, problem set (seniors' last day)." }] },
    { n: 117, sections: [{ label: "Week 32 (May 4-8)", text: "Tuesday — teach new concepts, mixed practice." }] },
    { n: 118, sections: [{ label: "Week 32 (May 4-8)", text: "Wednesday — continue lessons, problem set." }] },
    { n: 119, sections: [{ label: "Week 32 (May 4-8)", text: "Thursday — teach new concepts, mixed practice." }] },
    { n: 120, sections: [{ label: "Week 32 (May 4-8)", text: "Friday — prepare homework packet, problem set." }] },
  ],
};
