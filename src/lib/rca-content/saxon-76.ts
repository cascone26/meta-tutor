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
//
// 2026-09-09: Added the REAL topic of every lesson/investigation number in parentheses at its
// first mention, sourced directly off Jacob's physical copy of the Saxon Math 7/6 — Homeschool
// (4th edition) student text table of contents (photographed page-by-page,
// ~/Desktop/MT;RCAmaterial) — every number below is a direct read of the book's own contents
// pages, not an inference.

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
    "placeholder. Lesson/Investigation topics (in parentheses) are confirmed directly off Jacob's " +
    "physical Saxon 7/6 textbook table of contents (re-verified 2026-09-09).",

  lessons: [
    { n: 1, sections: [{ label: "Week 1 (Aug 17-21)", text: "Monday — Teach Lessons 1 (Adding/Subtracting Whole Numbers & Money; Fact Families, Part 1), 2 (Multiplying/Dividing Whole Numbers & Money; Fact Families, Part 2), 3 (Missing Numbers in Addition/Subtraction). Today's practice: Lesson 1. Introduce the textbook." }] },
    { n: 2, sections: [{ label: "Week 1 (Aug 17-21)", text: "Thursday — Teach Lessons 4 (Missing Numbers in Multiplication/Division), 5 (Order of Operations, Part 1). Today's practice: Lesson 4." }] },
    { n: 3, sections: [{ label: "Week 2 (Aug 24-28)", text: "Monday — Teach Lessons 6 (Fractional Parts), 7 (Lines, Segments, and Rays; Linear Measure), 8 (Perimeter). Today's practice: Lesson 6." }] },
    { n: 4, sections: [{ label: "Week 2 (Aug 24-28)", text: "Thursday — Teach Lessons 9 (The Number Line: Ordering and Comparing), 10 (Sequences; Scales), 11 (Problems About Combining; Problems About Separating), 12 (Place Value Through Trillions; Multistep Problems). Today's practice: Lesson 9. Homework Check 1: Lessons 2, 3, 5, 7, 8." }] },
    { n: 5, sections: [{ label: "Week 3 (Aug 31-4)", text: "Monday — Math Test 1 (material thru lesson 6 included)." }] },
    { n: 6, sections: [{ label: "Week 3 (Aug 31-4)", text: "Thursday — Teach Lessons 13 (Problems About Comparing; Elapsed-Time Problems), 14 (The Number Line: Negative Numbers), 15 (Problems About Equal Groups). Investigation 1 (Frequency Tables, Histograms, Surveys)." }] },
    { n: 7, sections: [{ label: "Week 4 (Sep 7-11)", text: "Monday — Labor day: RCA closed- No work." }] },
    { n: 8, sections: [{ label: "Week 4 (Sep 7-11)", text: "Thursday — Teach Lessons 16 (Rounding Whole Numbers; Estimating), 17 (The Number Line: Fractions and Mixed Numbers). Today's practice: Lesson 16. Homework Check 2: Lessons 10, 11, 12, 13, 14, 15." }] },
    { n: 9, sections: [{ label: "Week 5 (Sep 14-18)", text: "Monday — Teach Lessons 18 (Average; Line Graphs), 19 (Factors; Prime Numbers), 20 (Greatest Common Factor, GCF). Today's practice: Lesson 18." }] },
    { n: 10, sections: [{ label: "Week 5 (Sep 14-18)", text: "Thursday — Teach Lesson 21 (Divisibility) if time. Investigation 2 (Investigating Fractions with Manipulatives)." }] },
    { n: 11, sections: [{ label: "Week 6 (Sep 21-25)", text: "Monday — Teach Lessons 22 (\"Equal Groups\" Stories with Fractions), 23 (Ratio), 24 (Adding/Subtracting Fractions That Have Common Denominators). Today's practice: Lesson 22." }] },
    { n: 12, sections: [{ label: "Week 6 (Sep 21-25)", text: "Thursday — Math Test 2 (material thru lesson 19 included); Homework Check 3: Lessons 17, 19, 20, 21, 23, 24." }] },
    { n: 13, sections: [{ label: "Week 7 (Sep 28-2)", text: "Monday — Teach Lessons 25 (Writing Division Answers as Mixed Numbers; Multiples), 26 (Using Manipulatives to Reduce Fractions; Adding/Subtracting Mixed Numbers), 27 (Measures of a Circle). Today's practice: Lesson 25." }] },
    { n: 14, sections: [{ label: "Week 7 (Sep 28-2)", text: "Thursday — Teach Lessons 28 (Angles), 29 (Multiplying Fractions; Reducing Fractions by Dividing by Common Factors). Today's practice: Lesson 28." }] },
    { n: 15, sections: [{ label: "Week 8 (Oct 5-9)", text: "Monday — Teach Lessons 30 (Least Common Multiple, LCM; Reciprocals), 31 (Areas of Rectangles), 32 (Expanded Notation; More on Elapsed Time). Today's practice: Lesson 30." }] },
    { n: 16, sections: [{ label: "Week 8 (Oct 5-9)", text: "Thursday — Teach Lesson 33 (Writing Percents as Fractions, Part 1) if time. Investigation 3 (Measuring and Drawing Angles with a Protractor); Homework Check 4: Lessons 26, 27, 29, 31, 32." }], note: "Fall Break follows." },
    { n: 17, sections: [{ label: "Week 9 (Oct 19-23)", text: "Monday — Teach Lessons 34 (Decimal Place Value), 35 (Writing Decimal Numbers as Fractions, Part 1; Reading/Writing Decimal Numbers). Today's practice: Review Lesson 33 if necessary." }], note: "Resume after Fall Break." },
    { n: 18, sections: [{ label: "Week 9 (Oct 19-23)", text: "Thursday — Math Test 3 (material thru lesson 31 included)." }] },
    { n: 19, sections: [{ label: "Week 10 (Oct 26-30)", text: "Monday — Teach Lessons 37 (Adding and Subtracting Decimal Numbers), 38 (Adding/Subtracting Decimal Numbers and Whole Numbers; Squares and Square Roots), 39 (Multiplying Decimal Numbers). Today's practice: Lesson 37." }] },
    { n: 20, sections: [{ label: "Week 10 (Oct 26-30)", text: "Thursday — Teach Lesson 40 (Using Zero as a Placeholder; Circle Graphs) if time allows. Investigation 4 (Data Collection and Surveys); Homework Check 5: Lessons 33, 34, 35, 36, 38, 39." }] },
    { n: 21, sections: [{ label: "Week 11 (Nov 2-6)", text: "Monday — Teach Lessons 41 (Finding a Percent of a Number), 42 (Renaming Fractions by Multiplying by 1), 43 (Equivalent Division Problems; Missing-Number Problems with Fractions and Decimals). Today's practice: Lesson 41." }] },
    { n: 22, sections: [{ label: "Week 11 (Nov 2-6)", text: "Thursday — Teach Lessons 44 (Simplifying Decimal Numbers; Comparing Decimal Numbers), 45 (Dividing a Decimal Number by a Whole Number). Today's practice: Lesson 44." }] },
    { n: 23, sections: [{ label: "Week 12 (Nov 9-13)", text: "Monday — Teach Lessons 46 (Writing Decimal Numbers in Expanded Notation; Mentally Multiplying Decimal Numbers by 10 and 100), 47 (Circumference; Pi), 48 (Subtracting Mixed Numbers with Regrouping, Part 1), 49 (Dividing by a Decimal Number). Today's practice: Lesson 46." }] },
    { n: 24, sections: [{ label: "Week 12 (Nov 9-13)", text: "Thursday — Math Test 4 (material thru lesson 43 included); Homework Check 6: Lessons 40, 42, 43, 45, 47, 48." }] },
    { n: 25, sections: [{ label: "Week 13 (Nov 16-20)", text: "Monday — Teach Lessons 50 (Decimal Number Line — Tenths; Dividing by a Fraction), 51 (Rounding Decimal Numbers), 52 (Mentally Dividing Decimal Numbers by 10 and 100). Today's practice: Lesson 50." }] },
    { n: 26, sections: [{ label: "Week 13 (Nov 16-20)", text: "Thursday — Investigation 5 (Displaying Data)." }], note: "Thanksgiving Break follows." },
    { n: 27, sections: [{ label: "Week 14 (Nov 30-4)", text: "Monday — Teach Lessons 53 (Decimals Chart; Simplifying Fractions), 54 (Reducing by Grouping Factors Equal to 1; Dividing Fractions), 55 (Common Denominators, Part 1). Today's practice: Lesson 53." }], note: "Resume after Thanksgiving Break." },
    { n: 28, sections: [{ label: "Week 14 (Nov 30-4)", text: "Thursday — Teach Lessons 56 (Common Denominators, Part 2), 57 (Adding and Subtracting Fractions: Three Steps). Today's practice: Lesson 56. Homework Check 7: Lessons 49, 51, 52, 54, 55." }] },
    { n: 29, sections: [{ label: "Week 15 (Dec 7-11)", text: "Monday — Teach Lessons 58 (Probability and Chance), 59 (Adding Mixed Numbers), 60 (Polygons). Today's practice: Lesson 58." }] },
    { n: 30, sections: [{ label: "Week 15 (Dec 7-11)", text: "Thursday — Math Test 5 (material thru lesson 52 included)." }] },
    { n: 31, sections: [{ label: "Week 16 (Dec 14-18)", text: "Monday — Teach Lesson 61 (Adding Three or More Fractions), 62 (Writing Mixed Numbers as Improper Fractions) if time allows. Investigation 6 (Attributes of Geometric Solids)." }] },
    { n: 32, sections: [{ label: "Week 16 (Dec 14-18)", text: "Thursday — Teach Lesson 63 (Subtracting Mixed Numbers with Regrouping, Part 2). Today's practice: Lesson 63. Homework Check 6: Lessons 57, 59, 60, 61, 62." }], note: "End of fall semester — parent home grade and all fall semester work due by end of day. Christmas Break follows." },
    { n: 33, sections: [{ label: "Week 17 (Jan 4-8)", text: "Monday — Teach Lessons 64 (Classifying Quadrilaterals), 65 (Prime Factorization; Division by Primes; Factor Trees), 66 (Multiplying Mixed Numbers). Today's practice: Lesson 64." }], note: "Resume after Christmas Break; spring semester begins." },
    { n: 34, sections: [{ label: "Week 17 (Jan 4-8)", text: "Thursday — Teach Lesson 67 (Using Prime Factorization to Reduce Fractions), 68 (Dividing Mixed Numbers). Today's practice: Lesson 67." }] },
    { n: 35, sections: [{ label: "Week 18 (Jan 11-15)", text: "Monday — Teach Lessons 69 (Lengths of Segments; Complementary and Supplementary Angles), 70 (Reducing Fractions Before Multiplying), 71 (Parallelograms). Today's practice: Lesson 69." }] },
    { n: 36, sections: [{ label: "Week 18 (Jan 11-15)", text: "Thursday — Investigation 7 (The Coordinate Plane); Homework Check 9: Lessons 65, 66, 68, 70, 71." }] },
    { n: 37, sections: [{ label: "Week 19 (Jan 18-22)", text: "Monday — Teach Lessons 72 (Fractions Chart; Multiplying Three Fractions), 73 (Exponents; Writing Decimal Numbers as Fractions, Part 2), 74 (Writing Fractions as Decimal Numbers), 75 (Writing Fractions and Decimals as Percents, Part 1). Today's practice: Lesson 72." }] },
    { n: 38, sections: [{ label: "Week 19 (Jan 18-22)", text: "Thursday — Math Test 6 (material thru lesson 62 included)." }] },
    { n: 39, sections: [{ label: "Week 20 (Jan 25-29)", text: "Monday — Teach Lessons 76 (Comparing Fractions by Converting to Decimal Form), 77 (Finding Unstated Information in Fraction Problems), 78 (Capacity). Today's practice: Lesson 76." }] },
    { n: 40, sections: [{ label: "Week 20 (Jan 25-29)", text: "Thursday — Teach Lessons 79 (Area of a Triangle), 80 (Using Scale Factor to Solve Ratio Problems). Today's practice: Lesson 79. Homework Check 10: Lessons 73, 74, 75, 77, 78." }] },
    { n: 41, sections: [{ label: "Week 21 (Feb 1-5)", text: "Monday — Teach Lessons 81 (Arithmetic with Units of Measure), 82 (Volume of a Rectangular Prism). Investigation 8 (Geometric Construction of Bisectors)." }] },
    { n: 42, sections: [{ label: "Week 21 (Feb 1-5)", text: "Thursday — Teach Lessons 83 (Proportions), 84 (Order of Operations, Part 2). Today's practice: Lesson 83." }] },
    { n: 43, sections: [{ label: "Week 22 (Feb 8-12)", text: "Monday — Teach Lessons 85 (Using Cross Products to Solve Proportions), 86 (Area of a Circle), 87 (Finding Missing Factors), 88 (Using Proportions to Solve Ratio Problems). Today's practice: Lesson 85." }] },
    { n: 44, sections: [{ label: "Week 22 (Feb 8-12)", text: "Thursday — Math Test 7 (material thru lesson 72 included); Homework Check 11: Lessons 80, 81, 82, 84, 86, 87." }], note: "Mid-Winter Break follows." },
    { n: 45, sections: [{ label: "Week 23 (Feb 22-26)", text: "Monday — Teach Lessons 89 (Estimating Square Roots), 90 (Measuring Turns), 91 (Geometric Formulas). Today's practice: Lesson 89." }], note: "Resume after Mid-Winter Break." },
    { n: 46, sections: [{ label: "Week 23 (Feb 22-26)", text: "Thursday — Teach Lesson 92 (Expanded Notation with Exponents; Order of Operations with Exponents; Powers of Fractions, if time permits). Investigation 9 (Experimental Probability)." }] },
    { n: 47, sections: [{ label: "Week 24 (Mar 1-5)", text: "Monday — Teach Lessons 93 (Classifying Triangles), 94 (Writing Fractions and Decimals as Percents, Part 2). Today's practice: Lesson 93." }] },
    { n: 48, sections: [{ label: "Week 24 (Mar 1-5)", text: "Thursday — Math Test 8 (material thru lesson 85 included); Homework Check 12: Lessons 88, 90, 91 92, 94, 95." }] },
    { n: 49, sections: [{ label: "Week 25 (Mar 8-12)", text: "Monday — Teach Lessons 96 (Functions; Graphing Functions), 97 (Transversals), 98 (Sum of the Angle Measures of Triangles and Quadrilaterals). Today's practice: Lesson 96." }] },
    { n: 50, sections: [{ label: "Week 25 (Mar 8-12)", text: "Thursday — Teach Lessons 99 (Fraction-Decimal-Percent Equivalents), 100 (Algebraic Addition of Integers). Today's practice: Lesson 99." }] },
    { n: 51, sections: [{ label: "Week 26 (Mar 15-19)", text: "Monday — Teach Lesson 101 (Ratio Problems Involving Totals, if time permits). Investigation 10 (Compound Experiments)." }] },
    { n: 52, sections: [{ label: "Week 26 (Mar 15-19)", text: "Thursday — Teach Lesson 102 (Mass and Weight). Today's practice: Lesson 102. Homework Check 13: Lessons 97, 98, 100, 101." }] },
    { n: 53, sections: [{ label: "Week 27 (Mar 22-26)", text: "Monday — Teach Lessons 103 (Perimeter of Complex Shapes), 104 (Algebraic Addition Activity), 105 (Using Proportions to Solve Percent Problems), 106 (Two-Step Equations), 107 (Area of Complex Shapes). Today's practice: Lesson 103." }] },
    { n: 54, sections: [{ label: "Week 27 (Mar 22-26)", text: "Thursday — Math Test 9 (material thru lesson 100 included); Homework Check 14: Lessons 104 and 105." }], note: "Easter Break follows (two weeks)." },
    { n: 55, sections: [{ label: "Week 28 (Apr 12-16)", text: "Monday — CLT Testing, no new lessons." }], note: "Resume after Easter Break." },
    { n: 56, sections: [{ label: "Week 28 (Apr 12-16)", text: "Thursday — CLT Testing, no new lessons." }] },
    { n: 57, sections: [{ label: "Week 29 (Apr 19-23)", text: "Monday — Teach Lesson 108 (Transformations), 109 (Corresponding Parts; Similar Triangles). Today's practice: Lesson 108." }] },
    { n: 58, sections: [{ label: "Week 29 (Apr 19-23)", text: "Thursday — Teach Lesson 111 (Applications Using Division). Today's practice: Lesson 111." }] },
    { n: 59, sections: [{ label: "Week 30 (Apr 26-30)", text: "Monday — Teach Lesson 112 (Multiplying and Dividing Integers), 113 (Adding and Subtracting Mixed Measures; Multiplying by Powers of Ten) if time permits. Investigation 11 (Scale Drawings and Models); Homework Check 15: Lessons 106, 107, 109, 110." }] },
    { n: 60, sections: [{ label: "Week 30 (Apr 26-30)", text: "Thursday — Feast of the Ascension of the Lord: RCA Closed- No work." }] },
    { n: 61, sections: [{ label: "Week 31 (May 3-7)", text: "Monday — Teach Lesson 114 (Unit Multipliers), 115 (Writing Percents as Fractions, Part 2) and 116 (Compound Interest). Today's practice: Lesson 114." }] },
    { n: 62, sections: [{ label: "Week 31 (May 3-7)", text: "Thursday — Math Test 10 (material thru lesson 111 included); Homework Check 16: Lessons 112, 113, 115, 116." }] },
    { n: 63, sections: [{ label: "Week 32 (May 10-14)", text: "Monday — Teach Lesson 117 (Finding a Whole When a Fraction is Known), 118 (Estimating Area), 119 (Finding a Whole When a Percent is Known), 120 (Volume of a Cylinder)." }], note: "Parent home grade and all late work is due." },
    { n: 64, sections: [{ label: "Week 32 (May 10-14)", text: "Thursday — Investigation 12 (Platonic Solids)." }] },
    { n: 65, sections: [{ label: "Week 33 (May 17-21)", text: "Monday — No work - Field Day!" }] },
  ],
};
