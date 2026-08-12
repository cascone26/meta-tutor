// Classical Language Arts 6 — digest notes from RCA's 2026-2027 6th Grade master
// lesson plan doc, paraphrased (see religion-6.ts for the copyright note — same
// applies here). 25 weeks. Folds in Poetry memorization/recitation, which the new
// doc lists as its own strand alongside CLA but which doesn't have a separate
// class tile in this app — same "fold related content into an existing subject"
// pattern already used for Latin's vocab/grammar drills.

import type { SubjectContent } from "./types";

export const classicalLanguageArts6Content: SubjectContent = {
  overview:
    "Classical Language Arts 6, 2026-2027 — 25 weeks. Two strands: (1) Narration — eight narration-essay cycles across the year (outline → draft → self-edit → revise → submit for feedback), roughly one every 2-3 weeks, not every week. (2) Poetry — four poems memorized across the year (The Charge of the Light Brigade, The Lake Isle of Innisfree, Jabberwocky, The Fool's Prayer, The Destruction of Sennacherib), built up stanza-by-stanza week to week with a recitation quiz on completion.",
  totalWeeks: 25,
  lessons: [
    { n: 1, sections: [{ label: "Narration", text: "Personal narration — outline and first draft." }, { label: "Poetry", text: "Begin memorizing \"The Charge of the Light Brigade,\" stanza 1." }] },
    { n: 2, sections: [{ label: "Poetry", text: "\"Charge of the Light Brigade,\" stanza 2." }] },
    { n: 3, sections: [{ label: "Narration", text: "Revise narration 1 based on feedback." }, { label: "Poetry", text: "Stanza 3." }] },
    { n: 4, sections: [{ label: "Poetry", text: "Stanza 4." }], note: "Monday is Labor Day — no class." },
    { n: 5, sections: [{ label: "Narration", text: "Second narration — outline and draft." }, { label: "Poetry", text: "Stanza 5." }] },
    { n: 6, sections: [{ label: "Poetry", text: "Stanza 6." }] },
    { n: 7, sections: [{ label: "Narration", text: "Revise second narration." }, { label: "Poetry", text: "Full \"Charge of the Light Brigade\" recitation quiz Thursday." }] },
    { n: 8, sections: [{ label: "Poetry", text: "Introduce \"The Lake Isle of Innisfree,\" stanza 1." }] },
    { n: 9, sections: [{ label: "Narration", text: "Third narration — outline and draft." }, { label: "Poetry", text: "Stanzas 1-2 of \"Lake Isle of Innisfree.\"" }] },
    { n: 10, sections: [{ label: "Poetry", text: "Begin memorizing \"Lake Isle of Innisfree\" stanzas 1-3." }] },
    { n: 11, sections: [{ label: "Poetry", text: "Recite \"Lake Isle of Innisfree\"; copy stanzas into notebook." }] },
    { n: 12, sections: [{ label: "Poetry", text: "Begin memorizing \"Jabberwocky,\" stanzas 1-2." }] },
    { n: 13, sections: [{ label: "Narration", text: "Narration 4 — full writing/editing process." }, { label: "Poetry", text: "\"Jabberwocky\" stanzas 1-4; copy stanzas 3-4." }] },
    { n: 14, sections: [{ label: "Poetry", text: "\"Jabberwocky\" stanzas 1-6; copy stanzas 5-6." }] },
    { n: 15, sections: [{ label: "Narration", text: "Edit and finalize Narration 4." }, { label: "Poetry", text: "\"Jabberwocky\" stanza 7." }] },
    { n: 16, sections: [{ label: "Poetry", text: "Quiz on full \"Jabberwocky\"; finish copying/illustrating." }], note: "End of fall semester; fall break follows." },
    { n: 17, sections: [{ label: "Narration", text: "Narration 5 or 6 — full writing/editing process." }, { label: "Poetry", text: "Begin \"The Fool's Prayer,\" stanzas 1-2." }] },
    { n: 18, sections: [{ label: "Poetry", text: "\"The Fool's Prayer\" stanza 3." }] },
    { n: 19, sections: [{ label: "Narration", text: "Revise and finalize Narration 5/6." }, { label: "Poetry", text: "\"The Fool's Prayer\" stanzas 4-5." }] },
    { n: 20, sections: [{ label: "Poetry", text: "\"The Fool's Prayer\" stanza 6." }] },
    { n: 21, sections: [{ label: "Narration", text: "Narration 7 — full writing process." }, { label: "Poetry", text: "\"The Fool's Prayer\" stanzas 7-8." }] },
    { n: 22, sections: [{ label: "Poetry", text: "\"The Fool's Prayer\" stanzas 9-10." }], note: "Mid-Winter Break follows." },
    { n: 23, sections: [{ label: "Narration", text: "Revise and submit Narration 7." }, { label: "Poetry", text: "Full \"The Fool's Prayer\" recitation quiz." }] },
    { n: 24, sections: [{ label: "Poetry", text: "Begin \"The Destruction of Sennacherib,\" stanza 1." }] },
    { n: 25, sections: [{ label: "Narration", text: "Narration 8 — full writing process." }, { label: "Poetry", text: "\"Destruction of Sennacherib\" stanza 2." }], note: "Easter Break follows; end of documented pacing." },
  ],
};
