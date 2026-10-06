# K-12 Research Index — Tony's Estate Integration

**Source:** Rick's RIB research pass (8/11–8/12), Doc (`100.91.75.29`), pulled to Meta Tutor 2026-10-02.

**Total pulled:** 6 research files, ~305 KB, covering all six intended topics.

---

## What's here (six topics × three dimensions each)

| Topic | File | Size | RCA Relevance | Meta Tutor Application |
|---|---|---|---|---|
| **Early Literacy** | R1_early-literacy.md | 49 KB | Low (RCA is K-6, not a reading program) | **Future opportunity:** K-3 parent/tutor tool for Science of Reading; LD free-gen could use structured-literacy principles for early-grades features |
| **K-12 Math** | R2_k12-mathematics.md | 63 KB | **High** (Saxon 7/6 is one of RCA's 6 core subjects) | **Immediate:** deepen Saxon 7/6 teacher-guide "common mistakes" sections (number sense, fluency, procedural-vs-conceptual, the algebra gate). Add MTSS-aligned intervention strategies for low-Saxon weeks. |
| **Curriculum & Assessment** | R3_curriculum-standards-and-assessment.md | 44 KB | **Medium** (RCA uses Memoria Press, not Common Core; standards alignment is external) | **Informational:** refine RCA standards-alignment claims in teacher guides; design classroom-assessment items using EdReports rubrics |
| **Classroom Management & MTSS** | R4_classroom-management-and-academic-mtss.md | 45 KB | **Medium** (RCA subject-specific, not classroom mgmt) | **High-leverage:** inform a new RCA **accommodation/differentiation feature** (Tier 1–3 RTI math/reading/writing strategies, teacher scaffolding options per lesson); feed into the `prep-contact` prep-assignment system with MTSS-aligned tasks |
| **Teacher Supervision & Coaching** | R5_teacher-supervision-and-coaching.md | 55 KB | **Low-Medium** (Jacob teaches RCA, not manages other teachers) | **Coaching self-check:** Danielson/Marzano frameworks could shape RCA grading rubrics and feedback wording; instructional-coaching principles inform the AI chat's "teaching hints" in `/api/rca-understanding` |
| **School Emergency Operations** | R6_school-emergency-operations.md | 54 KB | **Very low** (RCA does not teach school administration) | **Deferred:** no direct Meta Tutor application unless Jacob adds school-leadership curriculum; could serve a future K-12-admin tool |

---

## Immediate & medium-term integration plan

**IMMEDIATE (week 1):**
1. Read **R2_k12-mathematics** (Saxon math application) and **R4_classroom-management-and-academic-mtss** (Tier 1–3 strategies).
2. Extend Saxon 7/6 teacher guides with the math-wars context and specific common-mistakes patterns from R2 (number sense, proportions, exponents, similar triangles, compound interest — all already mentioned in the Saxon TOC, now add pedagogy).
3. Prototype an **RCA accommodation/differentiation micro-feature:** per-lesson toggle for "Tier 2 strategies" (small-group reteach, concrete manipulatives, explicit fluency) keyed to Saxon + reading + writing.

**MEDIUM-TERM (2–4 weeks):**
1. Review **R3_curriculum-standards-and-assessment** (EdReports + standards). Update RCA's own "what standards does this lesson hit" alignment docs to match EdReports granularity.
2. Review **R5_teacher-supervision-and-coaching** (Danielson/Marzano + feedback). Reword RCA grading checklist and AI-chat "watch-for" notes to align with observable, specific feedback language (vs. generic praise).
3. Wire the Tier 2 strategies into the new `/rca/prep` **prep-assignment generation** — when Jacob preps a lesson, offer MTSS scaffolds matched to that week's content + last week's quiz results.

**DEFER:**
- R1_early-literacy → future younger-sibling K-3 app
- R6_emergency-operations → no RCA application

---

## File manifest

```
~/projects/meta-tutor/research/tony-k12/
├── INDEX.md (this file)
├── R1_early-literacy.md (49 KB)
├── R2_k12-mathematics.md (63 KB)
├── R3_curriculum-standards-and-assessment.md (44 KB)
├── R4_classroom-management-and-academic-mtss.md (45 KB)
├── R5_teacher-supervision-and-coaching.md (55 KB)
└── R6_school-emergency-operations.md (54 KB)
```

**Total:** 310 KB (6 files + index).

All files carry provenance header: `Source: Tony's estate (Rick RIB research pass, Doc, 2026-08-11)`.
