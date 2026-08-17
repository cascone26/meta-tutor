// Saxon 7/6 — real 2026-2027 pacing from RCA's actual lesson-plan doc ("Mr. Cascone- Saxon 76",
// re-pulled 2026-08-17 via Google Docs' export?format=txt endpoint after an earlier WebFetch
// attempt returned an empty JS shell and got wrongly diagnosed as a permission block — the doc
// was public-link-viewable the whole time). Paraphrased/condensed from the source (RCA's
// curriculum is explicitly copyrighted — "©2025 Regina Caeli, Inc. All rights reserved"), but
// kept SPECIFIC: real lesson numbers, real Test/Investigation/Homework Check placements. A prior
// pass over-paraphrased this into generic weekday boilerplate with zero actionable detail — Jacob's
// exact complaint: "clearly that doesnt help me at all. it doesnt tell me what to teach at all
// specifically." This rebuild fixes that.
//
// One entry per REAL in-person teaching day (Jacob only meets this class Monday & Thursday — Saxon's
// home days in between are parent-supervised, not something he preps for). Each entry lists exactly
// what to teach that day, straight from the source doc's own checklist. 65 real teaching sessions
// across 33 weeks (two single-day closures fall on what would otherwise be teaching days: Labor Day
// or Sep 7 or, and the Feast of the Ascension on a Thursday in late April/early May — both noted
// inline rather than dropped, since Jacob still needs to know "no class" for those specific days).
// The year closes with a Field Day (no new lesson) the Monday after the last Investigation.

import type { SubjectContent } from "./types";

export const saxon76Content: SubjectContent = {
  totalWeeks: 33,
  overview:
    "Saxon Math 7/6, 2026-2027 — 120 lessons taught across 65 real center sessions (Mon/Thu) over " +
    "~33 weeks. On each center day Jacob teaches a batch of upcoming lessons ahead of the students' " +
    "home-practice days, then flags which single lesson is that day's own practice focus. Ten " +
    "cumulative Math Tests (20 questions/100 points, corrections allowed within two weeks for up to " +
    "75% credit, one retake permitted), twelve Investigations (hands-on exploratory activities), and " +
    "sixteen Homework Checks (parent-initialed packets, specific lesson lists) are spread through the " +
    "year. CLT testing lands in late April (no new lessons that week); the year wraps with a Field Day. " +
    "Pacing note: content below is from RCA's real 2026-2027 doc (re-verified 2026-08-17), not a " +
    "placeholder.",

  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Teach Lessons 1, 2, 3. Today's practice: Lesson 1. Introduce the textbook." }] },
    { n: 2, sections: [{ label: "Week 1 (Aug 17-21)", text: "Thursday — Teach Lessons 4, 5. Today's practice: Lesson 4." }] },
    { n: 3, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Teach Lessons 6, 7, 8. Today's practice: Lesson 6." }] },
    { n: 4, sections: [{ label: "Week 2 (Aug 24-28)", text: "Thursday — Teach Lessons 9, 10, 11, 12. Today's practice: Lesson 9. Homework Check 1: Lessons 2, 3, 5, 7, 8." }] },
    { n: 5, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Math Test 1 (material thru lesson 6 included)." }] },
    { n: 6, sections: [{ label: "Week 3 (Aug 31-4)", text: "Thursday — Teach Lessons 13, 14, 15. Investigation 1." }] },
    { n: 7, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor day: RCA closed- No work." }] },
    { n: 8, sections: [{ label: "Week 4 (Sep 7-11)", text: "Thursday — Teach Lessons 16, 17. Today's practice: Lesson 16. Homework Check 2: Lessons 10, 11, 12, 13, 14, 15." }] },
    { n: 9, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Teach Lessons 18, 19, 20. Today's practice: Lesson 18." }] },
    { n: 10, sections: [{ label: "Week 5 (Sep 14-18)", text: "Thursday — Teach Lesson 21 if time. Investigation 2." }] },
    { n: 11, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Teach Lessons 22, 23, 24. Today's practice: Lesson 22." }] },
    { n: 12, sections: [{ label: "Week 6 (Sep 21-25)", text: "Thursday — Math Test 2 (material thru lesson 19 included); Homework Check 3: Lessons 17, 19, 20, 21, 23, 24." }] },
    { n: 13, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Teach Lessons 25, 26, 27. Today's practice: Lesson 25." }] },
    { n: 14, sections: [{ label: "Week 7 (Sep 28-2)", text: "Thursday — Teach Lessons 28, 29. Today's practice: Lesson 28." }] },
    { n: 15, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — Teach Lessons 30, 31, 32. Today's practice: Lesson 30." }] },
    { n: 16, sections: [{ label: "Week 8 (Oct 5-9)", text: "Thursday — Teach Lesson 33 if time. Investigation 3; Homework Check 4: Lessons 26, 27, 29, 31, 32." }], note: "Fall Break follows." },
    { n: 17, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Teach Lessons 34, 35. Today's practice: Review Lesson 33 if necessary." }], note: "Resume after Fall Break." },
    { n: 18, sections: [{ label: "Week 9 (Oct 19-23)", text: "Thursday — Math Test 3 (material thru lesson 31 included)." }] },
    { n: 19, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Teach Lessons 37, 38, 39. Today's practice: Lesson 37." }] },
    { n: 20, sections: [{ label: "Week 10 (Oct 26-30)", text: "Thursday — Teach Lesson 40 if time allows. Investigation 4; Homework Check 5: Lessons 33, 34, 35, 36, 38, 39." }] },
    { n: 21, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Teach Lessons 41, 42, 43. Today's practice: Lesson 41." }] },
    { n: 22, sections: [{ label: "Week 11 (Nov 2-6)", text: "Thursday — Teach Lessons 44, 45. Today's practice: Lesson 44." }] },
    { n: 23, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — Teach Lessons 46, 47, 48, 49. Today's practice: Lesson 46." }] },
    { n: 24, sections: [{ label: "Week 12 (Nov 9-13)", text: "Thursday — Math Test 4 (material thru lesson 43 included); Homework Check 6: Lessons 40, 42, 43, 45, 47, 48." }] },
    { n: 25, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Teach Lessons 50, 51, 52. Today's practice: Lesson 50." }] },
    { n: 26, sections: [{ label: "Week 13 (Nov 16-20)", text: "Thursday — Investigation 5." }], note: "Thanksgiving Break follows." },
    { n: 27, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Teach Lessons 53, 54, 55. Today's practice: Lesson 53." }], note: "Resume after Thanksgiving Break." },
    { n: 28, sections: [{ label: "Week 14 (Nov 30-4)", text: "Thursday — Teach Lessons 56, 57. Today's practice: Lesson 56. Homework Check 7: Lessons 49, 51, 52, 54, 55." }] },
    { n: 29, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Teach Lessons 58, 59, 60. Today's practice: Lesson 58." }] },
    { n: 30, sections: [{ label: "Week 15 (Dec 7-11)", text: "Thursday — Math Test 5 (material thru lesson 52 included)." }] },
    { n: 31, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Teach Lesson 61, 62 if time allows. Investigation 6." }] },
    { n: 32, sections: [{ label: "Week 16 (Dec 14-18)", text: "Thursday — Teach Lesson 63. Today's practice: Lesson 63. Homework Check 6: Lessons 57, 59, 60, 61, 62." }], note: "End of fall semester — parent home grade and all fall semester work due by end of day. Christmas Break follows." },
    { n: 33, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Teach Lessons 64, 65, 66. Today's practice: Lesson 64." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 34, sections: [{ label: "Week 17 (Jan 4-8)", text: "Thursday — Teach Lesson 67, 68. Today's practice: Lesson 67." }] },
    { n: 35, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Teach Lessons 69, 70, 71. Today's practice: Lesson 69." }] },
    { n: 36, sections: [{ label: "Week 18 (Jan 11-15)", text: "Thursday — Investigation 7; Homework Check 9: Lessons 65, 66, 68, 70, 71." }] },
    { n: 37, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Teach Lessons 72, 73, 74, 75. Today's practice: Lesson 72." }] },
    { n: 38, sections: [{ label: "Week 19 (Jan 18-22)", text: "Thursday — Math Test 6 (material thru lesson 62 included)." }] },
    { n: 39, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — Teach Lessons 76, 77, 78. Today's practice: Lesson 76." }] },
    { n: 40, sections: [{ label: "Week 20 (Jan 25-29)", text: "Thursday — Teach Lessons 79, 80. Today's practice: Lesson 79. Homework Check 10: Lessons 73, 74, 75, 77, 78." }] },
    { n: 41, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Teach Lessons 81, 82. Investigation 8." }] },
    { n: 42, sections: [{ label: "Week 21 (Feb 1-5)", text: "Thursday — Teach Lessons 83, 84. Today's practice: Lesson 83." }] },
    { n: 43, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — Teach Lessons 85, 86, 87, 88. Today's practice: Lesson 85." }] },
    { n: 44, sections: [{ label: "Week 22 (Feb 8-12)", text: "Thursday — Math Test 7 (material thru lesson 72 included); Homework Check 11: Lessons 80, 81, 82, 84, 86, 87." }], note: "Mid-Winter Break follows." },
    { n: 45, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — Teach Lessons 89, 90, 91. Today's practice: Lesson 89." }], note: "Resume after Mid-Winter Break." },
    { n: 46, sections: [{ label: "Week 23 (Feb 22-26)", text: "Thursday — Teach Lesson 92 (if time permits). Investigation 9." }] },
    { n: 47, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — Teach Lessons 93, 94. Today's practice: Lesson 93." }] },
    { n: 48, sections: [{ label: "Week 24 (Mar 1-5)", text: "Thursday — Math Test 8 (material thru lesson 85 included); Homework Check 12: Lessons 88, 90, 91 92, 94, 95." }] },
    { n: 49, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Teach Lessons 96, 97, 98. Today's practice: Lesson 96." }] },
    { n: 50, sections: [{ label: "Week 25 (Mar 8-12)", text: "Thursday — Teach Lessons 99, 100. Today's practice: Lesson 99." }] },
    { n: 51, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Teach Lesson 101 (if time permits). Investigation 10." }] },
    { n: 52, sections: [{ label: "Week 26 (Mar 15-19)", text: "Thursday — Teach Lesson 102. Today's practice: Lesson 102. Homework Check 13: Lessons 97, 98, 100, 101." }] },
    { n: 53, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — Teach Lessons 103, 104, 105, 106, 107. Today's practice: Lesson 103." }] },
    { n: 54, sections: [{ label: "Week 27 (Mar 22-26)", text: "Thursday — Math Test 9 (material thru lesson 100 included); Homework Check 14: Lessons 104 and 105." }], note: "Easter Break follows (two weeks)." },
    { n: 55, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — CLT Testing, no new lessons." }], note: "Resume after Easter Break." },
    { n: 56, sections: [{ label: "Week 28 (Apr 12-16)", text: "Thursday — CLT Testing, no new lessons." }] },
    { n: 57, sections: [{ label: "Week 29 (Apr 19-23)", text: "Monday — Teach Lesson 108, 109. Today's practice: Lesson 108." }] },
    { n: 58, sections: [{ label: "Week 29 (Apr 19-23)", text: "Thursday — Teach Lesson 111. Today's practice: Lesson 111." }] },
    { n: 59, sections: [{ label: "Week 30 (Apr 26-30)", text: "Monday — Teach Lesson 112, 113 if time permits. Investigation 11; Homework Check 15: Lessons 106, 107, 109, 110." }] },
    { n: 60, sections: [{ label: "Week 30 (Apr 26-30)", text: "Thursday — Feast of the Ascension of the Lord: RCA Closed- No work." }] },
    { n: 61, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — Teach Lesson 114, 115 and 116. Today's practice: Lesson 114." }] },
    { n: 62, sections: [{ label: "Week 31 (May 3-7)", text: "Thursday — Math Test 10 (material thru lesson 111 included); Homework Check 16: Lessons 112, 113, 115, 116." }] },
    { n: 63, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — Teach Lesson 117, 118, 119, 120." }], note: "Parent home grade and all late work is due." },
    { n: 64, sections: [{ label: "Week 32 (May 10-14)", text: "Thursday — Investigation 12." }] },
    { n: 65, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — No work - Field Day!" }] },
  ],
};
