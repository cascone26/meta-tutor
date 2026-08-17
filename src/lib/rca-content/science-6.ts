// Science 6 — real 2026-2027 pacing from RCA's actual "6th Grade lesson plans" doc,
// re-pulled 2026-08-17 as a PDF download (curl's export?format=txt returns a genuine
// 401 on this multi-tab Google Doc even with identical "anyone with the link"
// sharing to Saxon/LOE — File > Download > PDF from Jacob's logged-in browser
// worked instead). Paraphrased/condensed (explicitly copyrighted — "©2025 Regina
// Caeli, Inc. All rights reserved"), but kept SPECIFIC: real experiment numbers,
// real chapter/page references — a prior pass here fabricated a "Matter: mass/density
// experiment" topic and page numbers that don't match the real doc's actual weekly
// assignments (the real Experiment #1 IS mass/density, but on the real Thursday of
// week 1, not woven the way the earlier version described it).
//
// One entry per real teaching week (33 weeks) using Behold and See 6 (BAS textbook,
// BASWB workbook). No tests/quizzes in this class — chapter tests in the workbook
// are used for review only. Fall: matter/states/simple machines through frequent
// numbered hands-on experiments (26 across the year). Spring: cells, biome profiles,
// astronomy, and a running RCA Science Fair project (joint with 7th/8th grade)
// spanning planning → in-class experiment groups → write-up → display board →
// presentation.

import type { SubjectContent } from "./types";

export const science6Content: SubjectContent = {
  overview:
    "Science 6, 2026-2027 — 33 real teaching weeks with Behold and See 6. No tests or quizzes — " +
    "workbook chapter tests are used for review only. Fall: matter, states of matter, and simple " +
    "machines, taught through 26 numbered hands-on experiments across the year (mass/density, " +
    "physical/chemical separation, freezing points, conductors/insulators, static electricity, " +
    "levers, pulleys, and more). Spring: cell structures, a running set of biome profile write-ups, " +
    "then astronomy (moon phases, eclipses, solar system scale model) alongside a full RCA Science " +
    "Fair track (joint with 7th/8th grade) — planning, an in-class experiment students can base their " +
    "project on, write-up, display board, and presentation. Pacing note: content below is from RCA's " +
    "real 2026-2027 doc (re-verified 2026-08-17), not a placeholder.",
  totalWeeks: 33,
  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Read and discuss the poem by St. Augustine on the back cover of the Behold and See Workbook (BASWB). Chapter 1: read and discuss BAS 1.1-1.2 pp. 1-4." }, { label: "Week 1 (Aug 17-21)", text: "Thursday — Briefly discuss BAS 2.1-2.2. Do Experiment #1: Mass and Density (BASWB p. 119) — use the center's mass scale, not a kitchen scale." }] },
    { n: 2, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Briefly discuss BAS 2.3." }, { label: "Week 2 (Aug 24-28)", text: "Thursday — HW Check: BASWB pp. 1-4. Discuss BAS 2.4. Do Experiment #4: Physical Separation (BASWB p. 121)." }] },
    { n: 3, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Briefly discuss BAS 2.5. Do Experiment #5: Chemical Separation (BASWB p. 122)." }, { label: "Week 3 (Aug 31-4)", text: "Thursday — HW Check: BASWB pp. 5-8. Briefly discuss BAS 3.1. Do Experiments #6 Shrinking Bottle & #7 Jumping Quarter (BASWB p. 123)." }] },
    { n: 4, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor Day — RCA closed, no work." }, { label: "Week 4 (Sep 7-11)", text: "Thursday — HW Check: BASWB pp. 9-10. Briefly discuss BAS 3.2-3.4. Do Experiment #8 Can Crunch, start Experiment #9 Freezing Points (BASWB pp. 124-125)." }] },
    { n: 5, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Briefly discuss BAS 3.5-3.6. Do part 4 of Experiment #9 Freezing Points; start Experiment #10 Expanding Ice (BASWB p. 125) — put a cup of water in the freezer." }, { label: "Week 5 (Sep 14-18)", text: "Thursday — HW Check: BASWB pp. 11-13. Briefly discuss BAS 3.7-3.9. Finish Experiment #10 Expanding Ice." }] },
    { n: 6, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Read BAS 4.2-4.4 pp. 46-48. Do BASWB p. 15." }, { label: "Week 6 (Sep 21-25)", text: "Thursday — HW Check: BASWB pp. 14, 16-17. Briefly discuss BAS 4.5-4.7. Do Experiment #12 Baking Soda-Vinegar Rocket (BASWB p. 127) if there's a safe outdoor space." }] },
    { n: 7, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Briefly discuss BAS 4.8-4.10. Begin Experiment #13 Conductors and Insulators (BASWB p. 128), step 1." }, { label: "Week 7 (Sep 28-2)", text: "Thursday — HW Check: BASWB pp. 18-19, 20 #1-5. Briefly discuss BAS 4.11-4.12. Finish Experiment #13 Conductors and Insulators." }] },
    { n: 8, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — Do Experiment #14 Convection Current (BASWB p. 129)." }, { label: "Week 8 (Oct 5-9)", text: "Thursday — HW Check: BASWB pp. 20-21 #6-13, 22. Briefly discuss BAS 5.1-5.3. Do Experiments #15 & #16 Fun (and More Fun) with Static Electricity (BASWB p. 130)." }] },
    { n: 9, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Briefly discuss BAS 5.4-5.5. Do Experiment #17 Fun with Magnets (BASWB p. 131)." }, { label: "Week 9 (Oct 19-23)", text: "Thursday — HW Check: BASWB pp. 23-24, 26 #1-4. Discuss BAS 5.6-5.7." }] },
    { n: 10, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Review BAS Chapter 5. Finish BASWB pp. 26-28. Optional: Experiment #18 Electrical Potential Difference (BASWB p. 132)." }, { label: "Week 10 (Oct 26-30)", text: "Thursday — HW Check: BASWB pp. 25, 29-30. Briefly discuss BAS 6.1-6.5. Demonstrate 1st, 2nd, and 3rd class levers using a ruler and erasers or clay." }] },
    { n: 11, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Briefly discuss BAS 6.7-6.8. Do Experiment #19 Wheel and Axle (BASWB pp. 133-134)." }, { label: "Week 11 (Nov 2-6)", text: "Thursday — HW Check: BASWB pp. 33-37. Briefly discuss BAS 6.9. Do Experiment #20 Simple and Fixed Pulleys (BASWB pp. 135-136)." }] },
    { n: 12, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — Chapter 7: read BAS 7.1 pp. 107-111. Do BASWB p. 41." }, { label: "Week 12 (Nov 9-13)", text: "Thursday — HW Check: BASWB pp. 38-39, 42-43. Discuss BAS 7.2-7.3." }] },
    { n: 13, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Briefly discuss BAS 8.3. Read BAS 8.4-8.5 pp. 126-130." }, { label: "Week 13 (Nov 16-20)", text: "Thursday — Briefly discuss BAS 8.6-8.8. Do Experiment #21 Frozen Celery Cells (BASWB p. 137)." }] },
    { n: 14, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Do Experiment #22 Parabolic Solar Heater (BASWB p. 137)." }, { label: "Week 14 (Nov 30-4)", text: "Thursday — HW Check: BASWB pp. 46-49. Work together to do the Tundra Profile (BASWB p. 45)." }] },
    { n: 15, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Discuss BAS 9.3-9.4. Read BAS 9.5-9.6 pp. 156-161." }, { label: "Week 15 (Dec 7-11)", text: "Thursday — HW Check: BASWB pp. 51-54. Briefly discuss BAS 9.5-9.8. Do Experiment #24 Needles and Broad Leaves (BASWB p. 140) — Experiment #23 is done after the Christmas break." }] },
    { n: 16, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Work together to do the Boreal Forest Profile (BASWB p. 50). Chapter 10: read BAS 10.1-10.2 pp. 169-175." }, { label: "Week 16 (Dec 14-18)", text: "Thursday — Discuss BAS 10.3-10.5. Work together to do the Temperate Forest Profile (BASWB p. 55)." }], note: "End of fall semester. Christmas Break follows." },
    { n: 17, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Read BAS 10.6-10.8 pp. 184-189." }, { label: "Week 17 (Jan 4-8)", text: "Thursday — HW Check: BASWB pp. 57-60. Work together to write a Tropical Rainforest Biome profile in the Writing Notebook (BASWB p. 56 framework)." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 18, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Review the steps of the Scientific Method (BAS pp. 10-11, BASWB p. 119). Review the Science Fair Supplement — decide this week whether the science-fair project happens at the center or at home (class joins the RCA Science Fair with 7th/8th grade this spring)." }, { label: "Week 18 (Jan 11-15)", text: "Thursday — Work together to write a Temperate and Tropical Grassland Biome profile in the Writing Notebook (BASWB p. 61 framework)." }] },
    { n: 19, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Briefly review BAS 11.1-11.5. Read BAS 11.6 pp. 205-208. Collect the Science Fair Planning Form from students." }, { label: "Week 19 (Jan 18-22)", text: "Thursday — HW Check: BASWB pp. 62, 64-65. Work together to write a Desert Biome profile (BASWB p. 63 framework)." }] },
    { n: 20, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — Chapter 12: read BAS 12.1-12.2 pp. 216-222." }, { label: "Week 20 (Jan 25-29)", text: "Thursday — HW Check: BASWB pp. 67-68. Discuss Chapter 12, do BASWB p. 69." }] },
    { n: 21, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Chapter 13: read BAS 13.1-13.2 pp. 233-237." }, { label: "Week 21 (Feb 1-5)", text: "Thursday — HW Check: BASWB pp. 70-71, 74. Discuss BAS 13.3-13.5." }], note: "Mid-Winter Break follows." },
    { n: 22, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — In-Class Science Fair Experiment 1 — students basing their project on this experiment take excellent notes, illustrations, data, and adjust variables; those students lead presenting it to the class." }, { label: "Week 22 (Feb 8-12)", text: "Thursday — HW Check: BASWB pp. 75-76. Discuss BAS 13.8-13.11. Do Activity #3 (WB p. 73)." }], note: "Resume after Mid-Winter Break." },
    { n: 23, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — In-Class Science Fair Experiment 2." }, { label: "Week 23 (Feb 22-26)", text: "Thursday — HW Check: BASWB pp. 77-81. Discuss BAS 14.1-14.5. Activity: demonstrate moon phases with a ball and flashlight (or go outside in the sun); demonstrate eclipses." }] },
    { n: 24, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — In-Class Science Fair Experiment 3." }, { label: "Week 24 (Mar 1-5)", text: "Thursday — HW Check: BASWB pp. 82-83. Start Chapter 14 Review (BASWB pp. 84-85)." }] },
    { n: 25, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Chapter 15: read BAS 15.1-15.2 pp. 285-291. Do BASWB p. 86, check together as a class." }, { label: "Week 25 (Mar 8-12)", text: "Thursday — HW Check: BASWB pp. 84-88. Science Fair: work alone or with a partner to analyze data/results, draft the Data/Results and Conclusion sections (G6SW p. 103)." }], note: "Easter Break follows (two weeks)." },
    { n: 26, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Discuss in-class activities #1-4 (BASWB p. 73), share the experience with the class." }, { label: "Week 26 (Mar 15-19)", text: "Thursday — HW Check: BASWB pp. 89-93." }], note: "Resume after Easter Break." },
    { n: 27, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — HW Check: BASWB pp. 94-95. Science Fair: write the bibliography (G6SW p. 103)." }, { label: "Week 27 (Mar 22-26)", text: "Thursday — HW Check: BASWB pp. 94-98. Science Fair: write out display info — Question, Hypothesis, and Variables (G6SW pp. 100-101)." }] },
    { n: 28, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — Science Fair: write the Abstract (G6SW p. 104)." }, { label: "Week 28 (Apr 12-16)", text: "Thursday — HW Check: BASWB pp. 99-102. Science Fair: finish any sections that need attention." }] },
    { n: 29, sections: [{ label: "Week 29 (Apr 19-23)", text: "Monday — No work — CLT Testing. Science Fair: work in class to build the display board (G6SW p. 105 guidance)." }, { label: "Week 29 (Apr 19-23)", text: "Thursday — Science Fair: continue building the display board." }] },
    { n: 30, sections: [{ label: "Week 30 (Apr 26-30)", text: "Monday — Briefly discuss BAS 16.1-16.5. Do Experiment #26 Greenhouse Effect (BASWB p. 142)." }], note: "Feast of the Ascension Thursday: RCA closed, no work." },
    { n: 31, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — HW Check: BASWB pp. 103-106. Briefly discuss BAS 16.6-16.10. Activity: Scale Model of the Solar System." }, { label: "Week 31 (May 3-7)", text: "Thursday — HW Check: BASWB pp. 107-108. Read and discuss BAS 17.7-17.8. Do BASWB pp. 109-111." }] },
    { n: 32, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — Science Fair: finalize the board, begin working on the presentation." }, { label: "Week 32 (May 10-14)", text: "Thursday — Science Fair: set up projects and present!" }] },
    { n: 33, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — Field Day, no new content." }] },
  ],
};
