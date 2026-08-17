// Classical Language Arts 6 — real 2026-2027 pacing from RCA's actual "6th Grade
// lesson plans" doc, re-pulled 2026-08-17 as a PDF download (curl's
// export?format=txt returns a genuine 401 on this multi-tab Google Doc even with
// identical "anyone with the link" sharing to Saxon/LOE — File > Download > PDF from
// Jacob's logged-in browser worked instead). Paraphrased/condensed (explicitly
// copyrighted — "©2025 Regina Caeli, Inc. All rights reserved"), but kept SPECIFIC:
// real poem titles, real stanza/recitation milestones, real Narration numbers — a
// prior pass here repeated the exact same boilerplate ("Personal narration — outline
// and first draft" / "Begin memorizing 'The Charge of the Light Brigade,' stanza 1")
// every single week regardless of what week it actually was.
//
// Folds in Poetry, which the real doc lists as its own strand alongside Classical
// Language Arts but which doesn't have a separate class tile in this app (same
// "fold related content into an existing subject" pattern used for Latin's
// vocab/grammar drills). One entry per real teaching week (33 weeks). Two real
// threads run in parallel: Narration (9 personal-response paragraphs across the
// year, each on an outline → first draft → final-shared 3-week cycle) and Poetry
// (5 real poems memorized stanza-by-stanza and recited from memory: "The Charge of
// the Light Brigade," "The Lake Isle of Innisfree," "Jabberwocky," "The Fool's
// Prayer," "The Destruction of Sennacherib").

import type { SubjectContent } from "./types";

export const classicalLanguageArts6Content: SubjectContent = {
  overview:
    "Classical Language Arts 6, 2026-2027 — 33 real teaching weeks, two parallel threads. Narration: " +
    "9 personal-response paragraphs across the year (outline independently → first draft submitted to " +
    "tutor → final draft shared with the class, each on roughly a 3-4 week cycle; Narration 5/6 is a " +
    "student's-choice pair). Poetry: 5 real poems memorized stanza-by-stanza and recited from memory — " +
    "\"The Charge of the Light Brigade\" (Tennyson), \"The Lake Isle of Innisfree\" (Yeats), " +
    "\"Jabberwocky\" (Carroll), \"The Fool's Prayer\" (Sill), \"The Destruction of Sennacherib\" " +
    "(Byron) — each copied into a Poetry Notebook and ending in an oral recitation graded word-for-word. " +
    "Pacing note: content below is from RCA's real 2026-2027 doc (re-verified 2026-08-17), not a " +
    "placeholder.",
  totalWeeks: 33,
  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Introduce \"The Charge of the Light Brigade\" by Alfred Lord Tennyson. Read the entire poem aloud, begin memorizing the title, author, and first stanza. Discuss Narration 1 — a personal response to a writing prompt, done independently. Write the Narration 1 outline independently." }, { label: "Week 1 (Aug 17-21)", text: "Thursday — Practice the title, author, & stanza 1 together as a class. Submit your Narration 1 First Draft paragraph to your tutor." }] },
    { n: 2, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Read the poem aloud, begin memorizing stanza 2." }, { label: "Week 2 (Aug 24-28)", text: "Thursday — Practice and copy stanza 2 into the Poetry Notebook." }] },
    { n: 3, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Read the poem aloud, begin memorizing stanza 3." }, { label: "Week 3 (Aug 31-4)", text: "Thursday — Practice and copy stanza 3 into the Poetry Notebook. Share your Narration 1 Final paragraph with the class." }] },
    { n: 4, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor Day: RCA closed, no work." }, { label: "Week 4 (Sep 7-11)", text: "Thursday — Practice and copy stanza 4 into the Poetry Notebook." }] },
    { n: 5, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Continue memorizing the poem, stanza 5. Discuss Narration 2. Write the Narration 2 outline independently." }, { label: "Week 5 (Sep 14-18)", text: "Thursday — Practice and copy stanza 5 into the Poetry Notebook. Submit your Narration 2 First Draft paragraph to your tutor." }] },
    { n: 6, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Continue memorizing the poem, stanza 6." }, { label: "Week 6 (Sep 21-25)", text: "Thursday — Practice and copy stanza 6 into the Poetry Notebook." }] },
    { n: 7, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Quiz Thursday — practice the whole poem." }, { label: "Week 7 (Sep 28-2)", text: "Thursday — Poetry Recitation: \"The Charge of the Light Brigade.\" Share your Narration 2 Final paragraph with the class." }] },
    { n: 8, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — HW Check: Poetry Notebook — \"The Charge of the Light Brigade,\" share with the class. Introduce \"The Lake Isle of Innisfree\" by W.B. Yeats. Read the entire poem aloud, begin memorizing the title, author, and stanza 1." }, { label: "Week 8 (Oct 5-9)", text: "Thursday — Practice the title, author, & stanza 1." }] },
    { n: 9, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Continue memorizing, stanza 2. Discuss Narration 3. Write the Narration 3 outline independently." }, { label: "Week 9 (Oct 19-23)", text: "Thursday — Practice and copy stanzas 1-2 into the Poetry Notebook. Submit your Narration 3 First Draft paragraph to your tutor." }] },
    { n: 10, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Continue memorizing, stanza 3." }, { label: "Week 10 (Oct 26-30)", text: "Thursday — Practice and copy stanzas 1-3 into the Poetry Notebook." }] },
    { n: 11, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Quiz Thursday — practice the whole poem." }, { label: "Week 11 (Nov 2-6)", text: "Thursday — Poetry Recitation: \"The Lake Isle of Innisfree.\" Share your Narration 3 Final paragraph with the class." }] },
    { n: 12, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — HW Check: Poetry Notebook — \"The Lake Isle of Innisfree,\" share with the class. Introduce \"Jabberwocky\" by Lewis Carroll. Read the entire poem aloud, begin memorizing the title, author, and stanzas 1-2." }, { label: "Week 12 (Nov 9-13)", text: "Thursday — Practice the title, author, & stanzas 1-2." }] },
    { n: 13, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Continue memorizing, stanzas 3-4. Discuss Narration 4. Write the Narration 4 outline independently." }, { label: "Week 13 (Nov 16-20)", text: "Thursday — Practice and copy stanzas 3-4 into the Poetry Notebook. Submit your Narration 4 First Draft paragraph to your tutor." }] },
    { n: 14, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Continue memorizing, stanzas 5-6." }, { label: "Week 14 (Nov 30-4)", text: "Thursday — Practice and copy stanzas 5-6 into the Poetry Notebook." }] },
    { n: 15, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Continue memorizing, stanza 7." }, { label: "Week 15 (Dec 7-11)", text: "Thursday — Practice and copy stanza 7 into the Poetry Notebook. Share your Narration 4 Final paragraph with the class." }] },
    { n: 16, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Quiz Thursday — practice the whole poem." }, { label: "Week 16 (Dec 14-18)", text: "Thursday — Poetry Recitation: \"Jabberwocky.\" HW Check: Poetry Notebook — \"Jabberwocky,\" share with the class." }], note: "End of fall semester; Christmas Break follows." },
    { n: 17, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Introduce \"The Fool's Prayer\" by Edward Rowland Sill. Read the entire poem aloud, begin memorizing the title, author, and stanzas 1-2. Discuss Narration 5 or 6 (student's choice). Write the outline independently." }, { label: "Week 17 (Jan 4-8)", text: "Thursday — Practice the title, author, & stanzas 1-2. Submit your Narration 5 or 6 First Draft paragraph to your tutor." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 18, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Continue memorizing, stanza 3." }, { label: "Week 18 (Jan 11-15)", text: "Thursday — Practice and copy stanza 3 into the Poetry Notebook." }] },
    { n: 19, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Continue memorizing, stanzas 4-5." }, { label: "Week 19 (Jan 18-22)", text: "Thursday — Practice and copy stanzas 4-5 into the Poetry Notebook. Share your Narration 5 or 6 Final paragraph with the class." }] },
    { n: 20, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — Continue memorizing, stanza 6." }, { label: "Week 20 (Jan 25-29)", text: "Thursday — Practice and copy stanza 6 into the Poetry Notebook." }] },
    { n: 21, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Continue memorizing, stanzas 7-8. Discuss Narration 7. Write the Narration 7 outline independently." }, { label: "Week 21 (Feb 1-5)", text: "Thursday — Practice and copy stanzas 7-8 into the Poetry Notebook. Submit your Narration 7 First Draft paragraph to your tutor." }], note: "Mid-Winter Break follows." },
    { n: 22, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — Continue memorizing, stanzas 9-10." }, { label: "Week 22 (Feb 8-12)", text: "Thursday — Practice and copy stanzas 9-10 into the Poetry Notebook." }], note: "Resume after Mid-Winter Break." },
    { n: 23, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — Quiz Thursday — practice the whole poem." }, { label: "Week 23 (Feb 22-26)", text: "Thursday — Poetry Recitation: \"The Fool's Prayer.\" Share your Narration 7 Final paragraph with the class." }] },
    { n: 24, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — HW Check: Poetry Notebook — \"The Fool's Prayer,\" share with the class. Introduce \"The Destruction of Sennacherib\" by George Gordon Byron. Read the entire poem aloud, begin memorizing the title, author, and stanza 1." }, { label: "Week 24 (Mar 1-5)", text: "Thursday — Practice the title, author, & stanza 1." }] },
    { n: 25, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Continue memorizing, stanza 2. Discuss Narration 8. Write the Narration 8 outline independently." }, { label: "Week 25 (Mar 8-12)", text: "Thursday — Practice and copy stanza 2 into the Poetry Notebook. Submit your Narration 8 First Draft paragraph to your tutor." }], note: "Easter Break follows (two weeks)." },
    { n: 26, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Continue memorizing, stanza 3." }, { label: "Week 26 (Mar 15-19)", text: "Thursday — Practice and copy stanza 3 into the Poetry Notebook." }], note: "Resume after Easter Break." },
    { n: 27, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — Continue memorizing, stanza 4." }, { label: "Week 27 (Mar 22-26)", text: "Thursday — Practice and copy stanza 4 into the Poetry Notebook. Share your Narration 8 Final paragraph with the class." }] },
    { n: 28, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — Continue memorizing, stanza 5." }, { label: "Week 28 (Apr 12-16)", text: "Thursday — Practice and copy stanza 5 into the Poetry Notebook. Discuss Narration 9. Write the Narration 9 outline independently." }] },
    { n: 29, sections: [{ label: "Week 29 (Apr 19-23)", text: "Thursday — Practice the whole poem for Thursday's quiz. Submit your Narration 9 First Draft paragraph to your tutor." }] },
    { n: 30, sections: [{ label: "Week 30 (Apr 26-30)", text: "No CLA or Poetry work this week." }] },
    { n: 31, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — Quiz Thursday — practice the whole poem." }, { label: "Week 31 (May 3-7)", text: "Thursday — Poetry Recitation: \"The Destruction of Sennacherib.\" Share your Narration 9 Final paragraph with the class." }] },
    { n: 32, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — HW Check: Poetry Notebook — \"The Destruction of Sennacherib,\" share with the class. Recite the poems learned this semester — which was your favorite?" }, { label: "Week 32 (May 10-14)", text: "Thursday — Present your own poem & illustration to the class." }] },
    { n: 33, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — Field Day, no new content." }] },
  ],
};
