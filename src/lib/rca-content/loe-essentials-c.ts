// LOE Essentials C — real 2026-2027 pacing from RCA's actual lesson-plan doc ("Mr. Cascone -
// Essentials A/B/C", re-pulled 2026-08-17 via Google Docs' export?format=txt endpoint after an
// earlier WebFetch attempt returned an empty JS shell and got wrongly diagnosed as a permission
// block — the doc was public-link-viewable the whole time). Paraphrased/condensed from the source
// (RCA's curriculum is explicitly copyrighted — "©2025 Regina Caeli, Inc. All rights reserved"),
// but kept SPECIFIC: real unit numbers, real dictation placements, real one-off schedule shifts.
// A prior pass had genericized this into the same boilerplate paragraph repeated across every
// unit — the same bug found and fixed in Saxon, since the underlying cause (over-paraphrasing)
// was identical.
//
// One entry per real teaching WEEK (32 weeks, not 30 — the source doc has two "review" weeks
// with no new unit: a post-Labor-Day catch-up week and a CLT-testing week) — LOE bundles a
// student's full week under one unit, so unlike Saxon, Jacob's Monday and Thursday sessions both
// belong to the SAME unit and are shown together. Monday = Parts 1 & 2 (introduces the week's new
// unit); Thursday = Parts 4 & 5 plus that unit's Dictation assessment (RCA's primary LOE grading
// tool). Two single-day closures land on what would otherwise be teaching days (Labor Day Monday,
// the Feast of the Ascension Thursday) and are noted inline.

import type { SubjectContent } from "./types";

export const loeEssentialsCContent: SubjectContent = {
  totalWeeks: 32,
  overview:
    "Logic of English Essentials C, 2026-2027 — 30 units over 32 real teaching weeks (two weeks are " +
    "review/catch-up with no new unit). Each unit's week: Monday — Parts 1 & 2 (new phonograms/spelling " +
    "rule/grammar segment introduced). Tue/Wed (home days) — spelling & phonogram review, Rhythm of " +
    "Handwriting practice, Part 3 grammar. Thursday — Parts 4 & 5, then that unit's Dictation assessment " +
    "(tutor reviews all phonograms first, grades on dictation accuracy only). Friday (home day) — correct " +
    "the PREVIOUS unit's dictation. Corrections are worth 75% credit back in Essentials C if turned in " +
    "within two weeks. Units 13, 14, 28, and 29's dictations are optional bonus credit, not required. " +
    "Pacing note: content below is from RCA's real 2026-2027 doc (re-verified 2026-08-17), not a " +
    "placeholder.",

  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Unit 1." }, { label: "Monday", text: "Parts 1 & 2 (Unit 1 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 1." }] },
    { n: 2, sections: [{ label: "Week 2 (Aug 24-28)", text: "Unit 2." }, { label: "Monday", text: "Parts 1 & 2 (Unit 2 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 2." }] },
    { n: 3, sections: [{ label: "Week 3 (Aug 31-4)", text: "Unit 3." }, { label: "Monday", text: "Parts 1 & 2 (Unit 3 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 3." }] },
    { n: 4, sections: [{ label: "Week 4 (Sep 7-11)", text: "Review week — no new unit." }, { label: "Monday", text: "Labor day: RCA closed, no work." }, { label: "Thursday", text: "Review Grammar Lessons (Part 3) Units 1-3." }] },
    { n: 5, sections: [{ label: "Week 5 (Sep 14-18)", text: "Unit 4." }, { label: "Monday", text: "Parts 1 & 2 (Unit 4 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 4." }] },
    { n: 6, sections: [{ label: "Week 6 (Sep 21-25)", text: "Unit 5." }, { label: "Monday", text: "Parts 1 & 2 (Unit 5 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 5." }] },
    { n: 7, sections: [{ label: "Week 7 (Sep 28-2)", text: "Unit 6." }, { label: "Monday", text: "Parts 1 & 2 (Unit 6 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 6." }] },
    { n: 8, sections: [{ label: "Week 8 (Oct 5-9)", text: "Unit 7." }, { label: "Monday", text: "Parts 1 & 2 (Unit 7 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Part 5 Dictation - Unit 7." }], note: "Fall Break follows." },
    { n: 9, sections: [{ label: "Week 9 (Oct 19-23)", text: "Unit 8." }, { label: "Monday", text: "Parts 1 & 2 (Unit 8 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 8." }], note: "Resume after Fall Break." },
    { n: 10, sections: [{ label: "Week 10 (Oct 26-30)", text: "Unit 9." }, { label: "Monday", text: "Parts 1 & 2 (Unit 9 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 9." }] },
    { n: 11, sections: [{ label: "Week 11 (Nov 2-6)", text: "Unit 10." }, { label: "Monday", text: "Parts 1 & 2 (Unit 10 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 10." }] },
    { n: 12, sections: [{ label: "Week 12 (Nov 9-13)", text: "Unit 11." }, { label: "Monday", text: "Parts 1 & 2 (Unit 11 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 11." }] },
    { n: 13, sections: [{ label: "Week 13 (Nov 16-20)", text: "Unit 12." }, { label: "Monday", text: "Parts 1 & 2 (Unit 12 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 12." }], note: "Thanksgiving Break follows." },
    { n: 14, sections: [{ label: "Week 14 (Nov 30-4)", text: "Unit 13." }, { label: "Monday", text: "Parts 1 & 2 (Unit 13 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 13 (do not collect)." }], note: "Resume after Thanksgiving Break." },
    { n: 15, sections: [{ label: "Week 15 (Dec 7-11)", text: "Unit 14." }, { label: "Monday", text: "Parts 1 & 2 (Unit 14 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 14 (do not collect)." }] },
    { n: 16, sections: [{ label: "Week 16 (Dec 14-18)", text: "Unit 15." }, { label: "Monday", text: "Parts 1 & 2 (Unit 15 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 15 (not graded)." }], note: "End of fall semester — grades due; Christmas Break follows." },
    { n: 17, sections: [{ label: "Week 17 (Jan 4-8)", text: "Unit 16." }, { label: "Monday", text: "Parts 1 & 2 (Unit 16 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 16." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 18, sections: [{ label: "Week 18 (Jan 11-15)", text: "Unit 17." }, { label: "Monday", text: "Parts 1 & 2 (Unit 17 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 17." }] },
    { n: 19, sections: [{ label: "Week 19 (Jan 18-22)", text: "Unit 18." }, { label: "Monday", text: "Parts 1 & 2 (Unit 18 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 18." }] },
    { n: 20, sections: [{ label: "Week 20 (Jan 25-29)", text: "Unit 19." }, { label: "Monday", text: "Parts 1 & 2 (Unit 19 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 19." }] },
    { n: 21, sections: [{ label: "Week 21 (Feb 1-5)", text: "Unit 20." }, { label: "Monday", text: "Parts 1 & 2 (Unit 20 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 20." }] },
    { n: 22, sections: [{ label: "Week 22 (Feb 8-12)", text: "Unit 21." }, { label: "Monday", text: "Parts 1 & 2 (Unit 21 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 21." }], note: "Mid-Winter Break follows." },
    { n: 23, sections: [{ label: "Week 23 (Feb 22-26)", text: "Unit 22." }, { label: "Monday", text: "Parts 1 & 2 (Unit 22 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 22." }], note: "Resume after Mid-Winter Break." },
    { n: 24, sections: [{ label: "Week 24 (Mar 1-5)", text: "Unit 23." }, { label: "Monday", text: "Parts 1 & 2 (Unit 23 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 23." }] },
    { n: 25, sections: [{ label: "Week 25 (Mar 8-12)", text: "Unit 24." }, { label: "Monday", text: "Parts 1 & 2 (Unit 24 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 24." }] },
    { n: 26, sections: [{ label: "Week 26 (Mar 15-19)", text: "Unit 25." }, { label: "Monday", text: "Parts 1 & 2 (Unit 25 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 25." }] },
    { n: 27, sections: [{ label: "Week 27 (Mar 22-26)", text: "Unit 26." }, { label: "Monday", text: "Parts 1 & 2 (Unit 26 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 26." }], note: "Easter Break follows (two weeks)." },
    { n: 28, sections: [{ label: "Week 28 (Apr 12-16)", text: "Review week — no new unit." }, { label: "Monday", text: "Targeted review with games if CLT does not interfere with LOE time." }, { label: "Thursday", text: "Targeted review with games if CLT does not interfere with LOE time." }], note: "Resume after Easter Break; CLT testing week." },
    { n: 29, sections: [{ label: "Week 29 (Apr 19-23)", text: "Unit 27." }, { label: "Monday", text: "Parts 1 & 2 (Unit 27 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 27." }] },
    { n: 30, sections: [{ label: "Week 30 (Apr 26-30)", text: "Unit 28." }, { label: "Monday", text: "Parts 1 & 2 (Unit 28 intro)." }, { label: "Thursday", text: "Feast of the Ascension of the Lord: RCA closed, no work." }], note: "Unit 28's dictation shifts to Wednesday (home day) this week and is parent-administered, not collected/graded by Jacob — a one-off schedule shift caused by this closure." },
    { n: 31, sections: [{ label: "Week 31 (May 3-7)", text: "Unit 29." }, { label: "Monday", text: "Parts 1 & 2 (Unit 29 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 29 (do not collect or grade)." }] },
    { n: 32, sections: [{ label: "Week 32 (May 10-14)", text: "Unit 30." }, { label: "Monday", text: "Parts 1 & 2 (Unit 30 intro)." }, { label: "Thursday", text: "Parts 4 & 5; Dictation - Unit 30 (not graded)." }] },
  ],
};
