// History 6 — real 2026-2027 pacing from RCA's actual "6th Grade lesson plans" doc,
// re-pulled 2026-08-17 as a PDF download (curl's export?format=txt returns a genuine
// 401 on this multi-tab Google Doc even with identical "anyone with the link"
// sharing to Saxon/LOE — File > Download > PDF from Jacob's logged-in browser
// worked instead). Paraphrased/condensed (explicitly copyrighted — "©2025 Regina
// Caeli, Inc. All rights reserved"), but kept SPECIFIC: real book titles, real
// chapter numbers, real map/paragraph assignments — a prior pass here fabricated an
// "Egypt: mass/density experiment" week-1 topic that isn't in the real doc at all.
//
// One entry per real teaching week (33 weeks). Fall semester: Ancient Egypt — Book of
// the Ancient World readings, a running Ancient Egypt map, a paragraph-writing cycle
// (Temples/Tombs/Pyramids/Egyptian Dress/Egyptian House/Pharaoh/Egyptian
// Religion/Osiris) alongside the novels Pyramid and Pharaohs, culminating in an Egypt
// research paper. Spring semester: Ancient Near East / Israel — a new map, the novel
// Tirzah then God King, a Patriarchs/Saul/David/Solomon paragraph sequence
// culminating in a Kings of Israel research paper, then Victory on the Walls and
// Greek Myths to close the year.

import type { SubjectContent } from "./types";

export const history6Content: SubjectContent = {
  overview:
    "History 6, 2026-2027 — 33 real teaching weeks. Fall: Ancient Egypt — Book of the Ancient World " +
    "(BAW) readings, a running Ancient Egypt map (10 installments, labeled from memory then keyed), " +
    "and a paragraph-writing cycle (Temples, Tombs, Pyramids, Egyptian Dress, Egyptian House, Pharaoh, " +
    "Egyptian Religion, Osiris) alongside the novels Pyramid and Pharaohs, culminating in an Egypt " +
    "research paper due end of fall semester. Spring: Ancient Near East / Israel — a new 10-part map, " +
    "the novels Tirzah then God King, a Patriarchs/Saul/David/Solomon paragraph sequence culminating " +
    "in a Kings of Israel research paper, then Victory on the Walls and Greek Myths to close the year. " +
    "Pacing note: content below is from RCA's real 2026-2027 doc (re-verified 2026-08-17), not a " +
    "placeholder.",
  totalWeeks: 33,
  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Discuss the course & student expectations. Use the \"How to Read a Book\" guide (G6SW pp. 85-86) to explore The Book of the Ancient World (BAW) for the first time. Look at the Ancient History timeline (G6SW pp. 76-80)." }, { label: "Week 1 (Aug 17-21)", text: "Thursday — Discuss BAW Ch. 1-3. Discuss the paragraph-writing process for the year — over the next couple months, write paragraphs about Egyptian culture leading to a full research paper. Do \"The Temples\" outline in the Writing Notebook as a class." }] },
    { n: 2, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Discuss BAW Ch. 3; discuss \"The Temples\" paragraph — what went well, where to improve. Work on Ancient Egypt Map 1 (G6SW p. 33) — bodies of water and the Nile." }, { label: "Week 2 (Aug 24-28)", text: "Thursday — Discuss this week's reading of Pyramid. Do \"The Tombs\" outline in the Writing Notebook as a class." }] },
    { n: 3, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Continue Ancient Egypt Map 1 — label deserts and Sinai Peninsula. Do \"The Pyramids\" outline in the Writing Notebook as a class." }, { label: "Week 3 (Aug 31-4)", text: "Thursday — Continue Ancient Egypt Map 1 — label Upper and Lower Egypt & the Cataracts. Discuss BAW Ch. 4." }] },
    { n: 4, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor Day — RCA closed, no work." }, { label: "Week 4 (Sep 7-11)", text: "Thursday — HW Check: submit \"The Temples,\" \"The Tombs,\" and \"The Pyramids\" paragraphs. Discuss BAW Ch. 5, Section I. Do \"Egyptian Dress\" outline in the Writing Notebook as a class." }] },
    { n: 5, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Continue Ancient Egypt Map 1 — add remaining labels; this is the key map." }, { label: "Week 5 (Sep 14-18)", text: "Thursday — Discuss Pharaohs Ch. 1-2." }] },
    { n: 6, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Discuss Pharaohs Ch. 3. Do Ancient Egypt Map 3 (G6SW p. 35) as much as possible from memory, then use the key." }, { label: "Week 6 (Sep 21-25)", text: "Thursday — Discuss Pharaohs Ch. 4-5." }] },
    { n: 7, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Discuss Pharaohs Ch. 6. Do Ancient Egypt Map 4 (G6SW p. 36) as much as possible from memory, then use the key." }, { label: "Week 7 (Sep 28-2)", text: "Thursday — Discuss Pharaohs Ch. 7-8." }] },
    { n: 8, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — Read and discuss the poem \"Ozymandias\" by Percy Shelley (G6SW p. 55). Do Ancient Egypt Map 5 (G6SW p. 38) as much as possible from memory, then use the key." }, { label: "Week 8 (Oct 5-9)", text: "Thursday — HW Check: submit Egyptian Dress & \"The Egyptian House\" paragraphs. Discuss BAW Ch. 6 & 7. Do \"The Pharaoh\" outline in the Writing Notebook as a class." }], note: "Fall Break follows." },
    { n: 9, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Discuss BAW Ch. 8, Section 1. Do Ancient Egypt Map 6 (G6SW p. 40) as much as possible from memory, then use the key." }, { label: "Week 9 (Oct 19-23)", text: "Thursday — Discuss BAW Ch. 8, Sections 2 & 3. Do \"Egyptian Religion\" outline in the Writing Notebook as a class." }], note: "Resume after Fall Break." },
    { n: 10, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Discuss BAW Ch. 8, Section 4. Do Ancient Egypt Map 7 (G6SW p. 42) as much as possible from memory, then use the key. Study for the map quiz next Monday." }, { label: "Week 10 (Oct 26-30)", text: "Thursday — Do \"Osiris\" outline in the Writing Notebook as a class." }] },
    { n: 11, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Do Ancient Egypt Map 8 (G6SW p. 42) as much as possible from memory, then use the key. Start reading The Golden Goblet Ch. 1." }, { label: "Week 11 (Nov 2-6)", text: "Thursday — HW Check: submit The Pharaoh, Egyptian Religion, and Osiris paragraphs. Discuss The Golden Goblet Ch. 1-4." }] },
    { n: 12, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — Discuss The Golden Goblet Ch. 5-6. Do Ancient Egypt Map 9 (G6SW p. 42) as much as possible from memory, then use the key." }, { label: "Week 12 (Nov 9-13)", text: "Thursday — Discuss The Golden Goblet Ch. 7-10. Discuss Egypt Paper instructions (G6SW pp. 58-59) — after discussing the paper/process, do Step 1 independently, then begin the outline in the Writing Notebook." }] },
    { n: 13, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Discuss The Golden Goblet Ch. 11-12. Do Ancient Egypt Map 10 (G6SW p. 42) as much as possible from memory, then use the key." }, { label: "Week 13 (Nov 16-20)", text: "Thursday — Discuss The Golden Goblet Ch. 13-16." }] },
    { n: 14, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Discuss Egypt Papers in class — what went well, what was challenging, what changed from the original paragraphs. HW Check: submit the Egypt Paper first draft." }, { label: "Week 14 (Nov 30-4)", text: "Thursday — Map Quiz: Ancient Egypt. Discuss BAW Ch. 9-12." }] },
    { n: 15, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Discuss Tirzah Ch. 1-2; discuss BAW Ch. 13." }, { label: "Week 15 (Dec 7-11)", text: "Thursday — Read BAW Ch. 14-16." }] },
    { n: 16, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Discuss Tirzah Ch. 1-4. Submit the Egypt Paper final draft this week (fall-semester grade)." }, { label: "Week 16 (Dec 14-18)", text: "Thursday — HW Check: submit the Egypt Paper final draft. Discuss Tirzah Ch. 5-8." }], note: "End of fall semester. Christmas Break follows." },
    { n: 17, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Discuss Tirzah — read through Ch. 10 before break; discuss characters, plot, what's coming. Work on Ancient Near East Map 1 (G6SW p. 44) — bodies of water and rivers." }, { label: "Week 17 (Jan 4-8)", text: "Thursday — Discuss Tirzah Ch. 11-14." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 18, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Discuss Tirzah Ch. 15-16. Work on Ancient Near East Map 1 — Egypt/Hittite Empire section." }, { label: "Week 18 (Jan 11-15)", text: "Thursday — Discuss Tirzah Ch. 17-20." }] },
    { n: 19, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Discuss BAW Ch. 17. Do \"The Patriarchs\" outline in the Writing Notebook as a class." }, { label: "Week 19 (Jan 18-22)", text: "Thursday — Discuss BAW Ch. 18-19." }] },
    { n: 20, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — HW Check: submit \"The Patriarchs\" paragraph. Work on Ancient Near East Map 1 — Babylon/Arabian Desert section (key map)." }, { label: "Week 20 (Jan 25-29)", text: "Thursday — Read BAW Ch. 20-21." }] },
    { n: 21, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Do \"Saul\" outline in the Writing Notebook as a class. Work on Ancient Near East Map 3 (G6SW p. 46) as much as possible from memory, then use the key." }, { label: "Week 21 (Feb 1-5)", text: "Thursday — Discuss BAW Ch. 22." }], note: "Mid-Winter Break follows." },
    { n: 22, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — Do \"David\" outline in the Writing Notebook as a class. Work on Ancient Near East Map 4 (G6SW p. 47) as much as possible from memory, then use the key." }, { label: "Week 22 (Feb 8-12)", text: "Thursday — Discuss BAW Ch. 23." }], note: "Resume after Mid-Winter Break." },
    { n: 23, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — Do \"Solomon\" outline in the Writing Notebook as a class. Work on Ancient Near East Map 5 (G6SW p. 48) as much as possible from memory, then use the key." }, { label: "Week 23 (Feb 22-26)", text: "Thursday — Discuss God King — Introduction, 701 B.C., and the Prologue, Ch. 1-2." }] },
    { n: 24, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — HW Check: submit Saul, David, & Solomon paragraphs (the \"Kings of Israel\" paper set). Discuss God King Ch. 3-4. Work on Ancient Near East Map 6 (G6SW p. 49) as much as possible from memory, then use the key." }, { label: "Week 24 (Mar 1-5)", text: "Thursday — Discuss God King Ch. 5-8." }] },
    { n: 25, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Discuss the Kings of Israel paper instructions (G6SW pp. 62-63) — after discussing, do Step 1 independently, then begin the outline in the Writing Notebook." }, { label: "Week 25 (Mar 8-12)", text: "Thursday — Discuss God King Ch. 9-10." }], note: "Easter Break follows (two weeks)." },
    { n: 26, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Discuss Kings of Israel papers in class — what went well, what was challenging. HW Check: submit the Kings of Israel Paper first draft." }, { label: "Week 26 (Mar 15-19)", text: "Thursday — Discuss God King Ch. 15-18. Work on Ancient Near East Map 7 (G6SW p. 50) as much as possible from memory, then use the key." }], note: "Resume after Easter Break." },
    { n: 27, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — Work on Ancient Near East Map 8 (G6SW p. 51) as much as possible from memory, then use the key." }, { label: "Week 27 (Mar 22-26)", text: "Thursday — HW Check (test grade): submit the Kings of Israel Paper final draft. Discuss God King Ch. 21-24." }] },
    { n: 28, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — Discuss God King Ch. 25-26 & Author's Note. Do Ancient Near East Map 9 (G6SW p. 52)." }, { label: "Week 28 (Apr 12-16)", text: "Thursday — Read Victory on the Walls Author's Note & Ch. 1-2." }] },
    { n: 29, sections: [{ label: "Week 29 (Apr 19-23)", text: "Monday — Discuss Victory on the Walls Author's Note & Ch. 1-6." }, { label: "Week 29 (Apr 19-23)", text: "Thursday — Discuss Victory on the Walls Ch. 7-12." }] },
    { n: 30, sections: [{ label: "Week 30 (Apr 26-30)", text: "Monday — Discuss BAW Ch. 27-28. Do \"Behistun Rock\" outline in the Writing Notebook as a class." }], note: "Feast of the Ascension Thursday: RCA closed, no work." },
    { n: 31, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — HW Check: submit \"Behistun Rock\" paragraph. Discuss BAW Ch. 29-31. Do Ancient Near East Map 10 (G6SW p. 53) as much as possible from memory, then use the key." }, { label: "Week 31 (May 3-7)", text: "Thursday — Discuss BAW Ch. 32-34 and Conclusion." }] },
    { n: 32, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — Map Quiz: Ancient Near East. Choose a few stories from Greek Myths and discuss as a class." }, { label: "Week 32 (May 10-14)", text: "Thursday — Read Greek Myths." }] },
    { n: 33, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — Field Day, no new content." }] },
  ],
};
