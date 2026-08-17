// First Form Latin 6 — real 2026-2027 pacing from RCA's actual "6th Grade lesson
// plans" doc, re-pulled 2026-08-17 as a PDF download (curl's export?format=txt
// returns a genuine 401 on this multi-tab Google Doc even with identical "anyone
// with the link" sharing to Saxon/LOE — File > Download > PDF from Jacob's logged-in
// browser worked instead). Paraphrased/condensed (explicitly copyrighted — "©2025
// Regina Caeli, Inc. All rights reserved"), but kept SPECIFIC: real Roman-numeral
// lesson numbers, real exercise numbers, real quiz placements — a prior pass here
// gave only "Lesson I: pronunciation, conversational practice, exercises" with no
// indication of which lesson is actually current for any given week.
//
// One entry per real teaching week (33 weeks), Memoria Press First Form Latin.
// Monday usually teaches a new lesson (following the Teacher's Manual); Thursday
// usually practices the two most recent lessons together and runs the quiz +
// homework check on a roughly 2-week cadence. Lessons XIII and XXVII-XXVIII are
// deliberately skipped this year per RCA's own pacing.

import type { SubjectContent } from "./types";

export const firstFormLatin6Content: SubjectContent = {
  overview:
    "First Form Latin 6, 2026-2027 — 33 real teaching weeks (Memoria Press First Form Latin). " +
    "Begin each lesson with a memory-work review (flashcards, the Memoria Press App, or oral quizzing). " +
    "Monday typically introduces a new lesson from the Teacher's Manual; Thursday typically practices " +
    "the two most recent lessons together (saying, grammar forms, vocabulary) and runs a quiz + " +
    "homework check on a roughly 2-week cadence. Homework must be checked and corrected against the " +
    "Teacher Manual, with a parent initial for credit. Lessons XIII and XXVII-XXVIII are deliberately " +
    "skipped this year per RCA's own pacing. Pacing note: content below is from RCA's real 2026-2027 " +
    "doc (re-verified 2026-08-17), not a placeholder.",
  totalWeeks: 33,
  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Briefly go over pronunciation (pp. 6-7) by reading the examples. Read Conversational Latin and act some out! Teach Lesson I, following the Teacher's Manual." }, { label: "Week 1 (Aug 17-21)", text: "Thursday — Practice Lesson I — saying, grammar forms, & vocabulary. Teach students how to do Form Drills: together do half of each section of Lesson I - Ex. IV and V." }] },
    { n: 2, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Teach Lesson II, following the Teacher's Manual." }, { label: "Week 2 (Aug 24-28)", text: "Thursday — Practice Lesson I — saying, grammar forms, & vocabulary. Latin Quiz: Lesson I. HW Check: Lesson I - Ex. I, III, IV, V, VI. Together do several examples from each section of Lesson II - Ex. V and VI." }] },
    { n: 3, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Teach Lesson III, following the Teacher's Manual." }, { label: "Week 3 (Aug 31-4)", text: "Thursday — Practice Lesson II-III — saying, grammar forms, & vocabulary. Together do several examples from each section of Lesson III - Ex. IV and V (omit diagrams)." }] },
    { n: 4, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor Day — RCA closed, no work." }, { label: "Week 4 (Sep 7-11)", text: "Thursday — Practice Lesson II-III. Latin Quiz: Lesson II-III. HW Check: Lesson II - Ex. I, III, IV, V, VI & Lesson III - Ex. I, III, IV, V." }] },
    { n: 5, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Teach Lesson IV, following the Teacher's Manual." }, { label: "Week 5 (Sep 14-18)", text: "Thursday — Practice Lesson IV — saying, grammar forms, & vocabulary. Do Lesson IV - Ex. IV together." }] },
    { n: 6, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Teach Lesson V, following the Teacher's Manual. Do Lesson V — half of each section of Ex. IV and V." }, { label: "Week 6 (Sep 21-25)", text: "Thursday — Practice Lesson IV-V — saying, grammar forms, & vocabulary. Latin Quiz: Lesson IV-V. HW Check: Lesson IV - Ex. II, III, V & Lesson V - Ex. II, III, IV, V." }] },
    { n: 7, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Teach Lesson VI, following the Teacher's Manual. Do Lesson VI — half of each section of Ex. IV and V." }, { label: "Week 7 (Sep 28-2)", text: "Thursday — Practice Lesson VI — saying, grammar forms, & vocabulary. Latin Quiz: Lesson VI. HW Check: Lesson VI - Ex. II, III, second half of IV, V." }] },
    { n: 8, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — Teach Lesson VII, following the Teacher's Manual." }, { label: "Week 8 (Oct 5-9)", text: "Thursday — Practice Lesson VII-VIII — saying, grammar forms, & vocabulary. Do Lesson VIII - Ex. I and III, check and correct." }] },
    { n: 9, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Practice Lesson VII-VIII. Do Lesson VIII - Ex. VI and VII." }, { label: "Week 9 (Oct 19-23)", text: "Thursday — Practice Lesson VII-VIII. Latin Quiz: Lesson VII-VIII. HW Check: Lesson VII - Ex. II, III, V & Lesson VIII - Ex. I, III, IV, V." }] },
    { n: 10, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Teach Lesson IX, following the Teacher's Manual." }, { label: "Week 10 (Oct 26-30)", text: "Thursday — Do Lesson IX - Ex. V. Begin teaching Lesson X, following the Teacher's Manual." }] },
    { n: 11, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Review Lesson X. Do Lesson X - Ex. IV." }, { label: "Week 11 (Nov 2-6)", text: "Thursday — Practice Lesson IX-X — saying, grammar forms, & vocabulary. Latin Quiz: Lesson IX-X. HW Check: Lesson IX - Ex. I, III, IV, VII & Lesson X - Ex. I, III, V, VII." }] },
    { n: 12, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — Teach Lesson XI, following the Teacher's Manual." }, { label: "Week 12 (Nov 9-13)", text: "Thursday — Teach Lesson XII, following the Teacher's Manual." }] },
    { n: 13, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Review Lesson XII. Do Lesson XII - Ex. I (Grammar Charts only) & Ex. II." }, { label: "Week 13 (Nov 16-20)", text: "Thursday — Practice Lesson XI-XII — saying, grammar forms, & vocabulary. Latin Quiz: Lesson XI-XII. HW Check: Lesson XI - Ex. II, III, IV, V & Lesson XII - Ex. III, IV, V." }] },
    { n: 14, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Briefly discuss the Unit II Introduction. Teach Lesson XIV, following the Teacher's Manual (Lesson XIII is skipped this year)." }, { label: "Week 14 (Nov 30-4)", text: "Thursday — Teach Lesson XV, following the Teacher's Manual." }] },
    { n: 15, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Practice Lesson XIV-XV — saying, grammar forms, & vocabulary. Do Lesson XV - Ex. IV, Drills A-C." }, { label: "Week 15 (Dec 7-11)", text: "Thursday — Practice Lesson XIV-XV. Latin Quiz: Lesson XIV-XV. HW Check: Lesson XIV - Ex. II, IV, V, VII & Lesson XV - Ex. I, III, IV, VI." }] },
    { n: 16, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Teach Lesson XVI, following the Teacher's Manual." }, { label: "Week 16 (Dec 14-18)", text: "Thursday — Practice Lesson XVI. Do Lesson XVI - Ex. IV, Drill D. Introduce Lesson XVII." }], note: "End of fall semester; Christmas Break follows." },
    { n: 17, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Teach Lesson XVII, following the Teacher's Manual. Work on the Mastery Goals (p. 47)." }, { label: "Week 17 (Jan 4-8)", text: "Thursday — Practice Lesson XVI-XVII. Latin Quiz: Lesson XVI-XVII. HW Check: Lesson XVI - Ex. I, III, IV, VI & Lesson XVII - Ex. II, III, V." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 18, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Teach Lesson XVIII, following the Teacher's Manual." }, { label: "Week 18 (Jan 11-15)", text: "Thursday — Practice Lesson XVIII. Introduce Lesson XIX." }] },
    { n: 19, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Teach Lesson XIX, following the Teacher's Manual." }, { label: "Week 19 (Jan 18-22)", text: "Thursday — Practice Lesson XVIII-XIX. Latin Quiz: Lesson XVIII-XIX. HW Check: Lesson XVIII - Ex. I, III, IV & Lesson XIX - Ex. I, III, IV, VI." }] },
    { n: 20, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — Teach Lesson XX, Unit III Review. Work on the Mastery Goals." }, { label: "Week 20 (Jan 25-29)", text: "Thursday — Practice Lesson XX. Latin Quiz: Lesson XX. HW Check: Lesson XX - Ex. III, IV, V, VI." }] },
    { n: 21, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Briefly discuss the Unit IV Introduction. Teach Lesson XXI, following the Teacher's Manual. Start Ex. III." }, { label: "Week 21 (Feb 1-5)", text: "Thursday — Practice Lesson XXI. Introduce Lesson XXII." }], note: "Mid-Winter Break follows." },
    { n: 22, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — Teach Lesson XXII, following the Teacher's Manual." }, { label: "Week 22 (Feb 8-12)", text: "Thursday — Practice Lesson XXI-XXII. Latin Quiz: Lesson XXI-XXII. HW Check: Lesson XXI - Ex. I, III, VI & Lesson XXII - Ex. I, II, V, VI." }], note: "Resume after Mid-Winter Break." },
    { n: 23, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — Teach Lesson XXIII, following the Teacher's Manual." }, { label: "Week 23 (Feb 22-26)", text: "Thursday — Practice Lesson XXIII. Do Lesson XXIII - Ex. VII. Introduce Lesson XXIV." }] },
    { n: 24, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — Teach Lesson XXIV, following the Teacher's Manual." }, { label: "Week 24 (Mar 1-5)", text: "Thursday — Practice Lesson XXIII-XXIV. Latin Quiz: Lesson XXIII-XXIV. HW Check: Lesson XXIII - Ex. I, III, IV, V & Lesson XXIV - Ex. II, III, V." }] },
    { n: 25, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Teach Lesson XXV, following the Teacher's Manual." }, { label: "Week 25 (Mar 8-12)", text: "Thursday — Practice Lesson XXV. Do Lesson XXV - Ex. IV and V, check and correct." }], note: "Easter Break follows (two weeks)." },
    { n: 26, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Teach Lesson XXVI, following the Teacher's Manual. Do Lesson XXVI - Ex. VI." }, { label: "Week 26 (Mar 15-19)", text: "Thursday — Practice Lesson XXV-XXVI. Latin Quiz: Lesson XXV-XXVI. HW Check: Lesson XXV - Ex. I, III, IV, V & Lesson XXVI - Ex. I, III, IV." }], note: "Resume after Easter Break." },
    { n: 27, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — Teach Lesson XXIX, following the Teacher's Manual (Lessons XXVII-XXVIII are skipped this year)." }, { label: "Week 27 (Mar 22-26)", text: "Thursday — Practice Lesson XXVII & XXIX. Latin Quiz: Lesson XXVII & XXIX. HW Check: Lesson XXVII - Ex. II, III, IV, V & Lesson XXIX - Ex. I, III, IV." }] },
    { n: 28, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — Teach Lesson XXX, following the Teacher's Manual." }, { label: "Week 28 (Apr 12-16)", text: "Thursday — Practice Lesson XXX. Introduce Lesson XXXI." }] },
    { n: 29, sections: [{ label: "Week 29 (Apr 19-23)", text: "Monday — No work — CLT Testing." }, { label: "Week 29 (Apr 19-23)", text: "Thursday — Practice Lesson XXX-XXXI." }] },
    { n: 30, sections: [{ label: "Week 30 (Apr 26-30)", text: "Monday — Teach Lesson XXXI, following the Teacher's Manual." }], note: "Feast of the Ascension Thursday: RCA closed, no work." },
    { n: 31, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — Practice Lesson XXX-XXXI. Latin Quiz: Lesson XXX-XXXI. HW Check: Lesson XXX - Ex. I, III, IV & Lesson XXXI - Ex. II, III, IV, V. Introduce Lesson XXXII." }, { label: "Week 31 (May 3-7)", text: "Thursday — Teach Lesson XXXII, following the Teacher's Manual." }] },
    { n: 32, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — Teach Lesson XXXIII, following the Teacher's Manual." }, { label: "Week 32 (May 10-14)", text: "Thursday — HW Check: Lesson XXXII - Ex. II, III, IV, V, VII & Lesson XXXIII - Ex. II, III, IV, V. Review all vocabulary on the Drill Sheets at the end of the Student Workbook — make it a game!" }] },
    { n: 33, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — Field Day, no new content." }] },
  ],
};
