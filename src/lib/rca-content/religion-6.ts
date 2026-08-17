// Religion 6 — real 2026-2027 pacing from RCA's actual "6th Grade lesson plans" doc,
// re-pulled 2026-08-17 as a PDF download (Jacob's browser session — the plain
// export?format=txt curl technique that worked for Saxon/LOE returns a genuine 401
// on this doc even with identical "anyone with the link" sharing, likely because it's
// a newer multi-tab Google Doc; File > Download > PDF from the logged-in browser
// worked instead). Paraphrased/condensed from the source (explicitly copyrighted —
// "©2025 Regina Caeli, Inc. All rights reserved"), but kept SPECIFIC: real lesson
// numbers, real question ranges, real quiz placements — a prior pass here guessed
// generic Gospel chapter numbers ("Ch. 1-2", "Ch. 3-4"...) that don't match the real
// doc at all; this rebuild replaces that with what Jacob's own Monday/Thursday
// checklist actually says.
//
// One entry per real teaching week (33 weeks, matching Saxon's real calendar) with a
// Monday + Thursday section — Baltimore Catechism memory work (Lessons 15-32,
// continuing from a prior grade, not starting at Lesson 1) with a quiz most
// Thursdays, alongside sequential Gospel reading: Mark through the fall, switching to
// Luke in mid-December (Week 15).

import type { SubjectContent } from "./types";

export const religion6Content: SubjectContent = {
  overview:
    "Religion 6, 2026-2027 — 33 real teaching weeks. Core: Baltimore Catechism memory work " +
    "(Lessons 15 through 32, continuing from a prior grade), practiced through the week with a quiz " +
    "most Thursdays, alongside sequential Gospel reading — Gospel of Mark through the fall semester, " +
    "switching to Gospel of Luke starting Week 15 (mid-December). Religion tests are given orally: " +
    "tutor reads the question, student recites the answer word for word. Pacing note: content below " +
    "is from RCA's real 2026-2027 doc (re-verified 2026-08-17), not a placeholder.",
  totalWeeks: 33,
  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 15, pp. 94-100." }, { label: "Week 1 (Aug 17-21)", text: "Thursday — Practice Lesson 15 #188-189, 191-192, & 197; discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 2, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Practice Lesson 15 #188-189, 191-192, & 197; read and discuss the rest of Lesson 15; do the Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 2 (Aug 24-28)", text: "Thursday — Practice Lesson 15 #188-189, 191-192, & 197. Catechism Quiz: Lesson 15 #188-189, 191-192, & 197." }] },
    { n: 3, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Read and discuss Lesson 15 #195 — The Ten Commandments." }, { label: "Week 3 (Aug 31-4)", text: "Thursday — Practice Lesson 15 #195; discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 4, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor Day — RCA closed, no work." }, { label: "Week 4 (Sep 7-11)", text: "Thursday — Catechism Quiz: Lesson 15 #195 (Ten Commandments)." }] },
    { n: 5, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 16." }, { label: "Week 5 (Sep 14-18)", text: "Thursday — Practice Lesson 16 #198-203; discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 6, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Practice Lesson 16 #198-203; do the end-of-lesson Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 6 (Sep 21-25)", text: "Thursday — Practice Lesson 16 #198-203. Catechism Quiz: Lesson 16 #198-203." }] },
    { n: 7, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 17." }, { label: "Week 7 (Sep 28-2)", text: "Thursday — Discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 8, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — At the end of Lesson 17, do the Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 8 (Oct 5-9)", text: "Thursday — Discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 9, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 18." }, { label: "Week 9 (Oct 19-23)", text: "Thursday — Practice Lesson 18 #224-225, 234-238; discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 10, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Practice Lesson 18 #224-225, 234-238; do the end-of-lesson Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 10 (Oct 26-30)", text: "Thursday — Practice Lesson 18 #224-225, 234-238. Catechism Quiz: Lesson 18 #224-225, 234-238." }] },
    { n: 11, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 19 #241-243, 245, & 250." }, { label: "Week 11 (Nov 2-6)", text: "Thursday — Practice Lesson 19 #241-243, 245, & 250; discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 12, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — Practice Lesson 19 #241-243, 245, & 250; do the end-of-lesson Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 12 (Nov 9-13)", text: "Thursday — Practice Lesson 19 #241-243, 245, & 250. Catechism Quiz: Lesson 19 #241-243, 245, & 250." }] },
    { n: 13, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 19 #251-256." }, { label: "Week 13 (Nov 16-20)", text: "Thursday — Practice Lesson 19 #251-256; discuss this week's Gospel of Mark reading, write 3 main points on the board." }] },
    { n: 14, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Practice Lesson 19 #251-256; do the end-of-lesson Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 14 (Nov 30-4)", text: "Thursday — Practice Lesson 19 #251-256. Catechism Quiz: Lesson 19 #241-243, 245, & 250." }] },
    { n: 15, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 20." }, { label: "Week 15 (Dec 7-11)", text: "Thursday — Practice Lesson 20 #260-261, 265-266, 273, & 278; discuss this week's Gospel of Luke reading, write 3 main points on the board." }], note: "Switches from Gospel of Mark to Gospel of Luke this week." },
    { n: 16, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Practice Lesson 20 #260-261, 265-266, 273, & 278; do the end-of-lesson Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 16 (Dec 14-18)", text: "Thursday — Practice Lesson 20; Catechism Quiz: Lesson 20 #260-261, 265-266, 273, & 278." }], note: "End of fall semester; Christmas Break follows." },
    { n: 17, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 21." }, { label: "Week 17 (Jan 4-8)", text: "Thursday — Practice Lesson 21 #281 & 283; discuss this week's Gospel of Luke reading, write 3 main points on the board." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 18, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Practice Lesson 21 #281 & 283; do the end-of-lesson Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 18 (Jan 11-15)", text: "Thursday — Practice Lesson 21 #281 & 283. Catechism Quiz: Lesson 21 #281 & 283." }] },
    { n: 19, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 22." }, { label: "Week 19 (Jan 18-22)", text: "Thursday — Discuss this week's Gospel of Luke reading, write 3 main points on the board." }] },
    { n: 20, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — At the end of Lesson 22, do the Discussion Questions, True or False, and Fill in the Blanks orally as a class." }, { label: "Week 20 (Jan 25-29)", text: "Thursday — Discuss this week's Gospel of Luke reading, write 3 main points on the board." }] },
    { n: 21, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Discuss Friday's Gospel of Luke reading, write 3 main points on the board." }, { label: "Week 21 (Feb 1-5)", text: "Thursday — Discuss this week's Gospel of Luke reading, write 3 main points on the board." }], note: "Mid-Winter Break follows." },
    { n: 22, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 27 #357, 360-361, & 363." }, { label: "Week 22 (Feb 8-12)", text: "Thursday — Practice Lesson 27 #357, 360-361, & 363; discuss this week's Gospel of Luke reading, write 3 main points on the board." }], note: "Resume after Mid-Winter Break." },
    { n: 23, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — Practice Lesson 27 #357, 360-361, & 363; do the end-of-lesson Discussion Questions, Choose the Best Answer, and Fill in the Blanks orally as a class." }, { label: "Week 23 (Feb 22-26)", text: "Thursday — Practice Lesson 27 #357, 360-361, & 363." }] },
    { n: 24, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 28." }, { label: "Week 24 (Mar 1-5)", text: "Thursday — Practice Lesson 27 #357, 360-361, & 363 and Lesson 28 #366; discuss this week's Gospel of Luke reading, write 3 main points on the board." }] },
    { n: 25, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Practice Lesson 27 #357, 360-361, & 363 and Lesson 28 #366; do the end-of-lesson Discussion Questions, Choose the Best Answer, and Fill in the Blanks orally as a class." }, { label: "Week 25 (Mar 8-12)", text: "Thursday — Catechism Quiz: Lesson 27 #357, 360-361, & 363 and Lesson 28 #366." }], note: "Easter Break follows (two weeks)." },
    { n: 26, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 29 #379, 382, & 384." }, { label: "Week 26 (Mar 15-19)", text: "Thursday — Practice Lesson 29 #379, 382, & 384; discuss this week's Gospel of Luke reading, write 3 main points on the board." }], note: "Resume after Easter Break." },
    { n: 27, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — Practice Lesson 29 #379, 382, & 384; do the end-of-lesson Discussion Questions, Choose the Best Answer, and Fill in the Blanks orally as a class." }, { label: "Week 27 (Mar 22-26)", text: "Thursday — Practice Lesson 29 #379, 382, & 384." }] },
    { n: 28, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 30 #388." }, { label: "Week 28 (Apr 12-16)", text: "Thursday — Practice Lesson 29 #379, 382, & 384 and Lesson 30 #388; discuss this week's Gospel of Luke reading, write 3 main points on the board." }] },
    { n: 29, sections: [{ label: "Week 29 (Apr 19-23)", text: "Monday — No work — CLT 3-6 Testing." }, { label: "Week 29 (Apr 19-23)", text: "Thursday — No work — CLT 3-6 Testing." }] },
    { n: 30, sections: [{ label: "Week 30 (Apr 26-30)", text: "Monday — Practice Lesson 29 #379, 382, & 384 and Lesson 30 #388. Catechism Quiz: Lesson 29 #379, 382, & 384 and Lesson 30 #388." }], note: "Feast of the Ascension Thursday: RCA closed, no work." },
    { n: 31, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 31; at the end of Lesson 31, do the Discussion Questions, Choose the Best Answer, and Fill in the Blanks orally as a class." }, { label: "Week 31 (May 3-7)", text: "Thursday — Discuss this week's Gospel of Luke reading, write 3 main points on the board." }] },
    { n: 32, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — Read and discuss Baltimore Catechism, Lesson 32; at the end of Lesson 32, do the Discussion Questions, Choose the Best Answer, and Fill in the Blanks orally as a class." }, { label: "Week 32 (May 10-14)", text: "Thursday — Discuss this week's Gospel of Luke reading, write 3 main points on the board." }] },
    { n: 33, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — Field Day, no new content." }] },
  ],
};
