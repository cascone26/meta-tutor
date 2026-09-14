// Build every First Form Latin drill ITEM for Jacob from two VERIFIED sources:
//   1. FF_QUIZ_VOCAB (vocab-data.ts) — vocab + sayings parsed & checked from his real quizzes.
//   2. latin-grammar-charts.ts — the full, already-verified paradigms (every conjugation +
//      declension form, lesson-keyed via chartsForLesson). Paradigm answers come from here,
//      NOT from the messy quiz tables, so the forms he's drilled on are guaranteed correct.
import type { DrillItem } from "./items";
import { FF_QUIZ_VOCAB } from "./vocab-data";
import { chartsForLesson } from "@/lib/rca-content/latin-grammar-charts";

const PERSON_NUMBER: [string, string][] = [
  ["1st", "singular"], ["2nd", "singular"], ["3rd", "singular"],
  ["1st", "plural"], ["2nd", "plural"], ["3rd", "plural"],
];

function tenseFromId(id: string): string {
  const t = id.split("-").slice(1).join(" ");
  return t.replace("futureperfect", "future perfect").replace("pluperfect", "pluperfect");
}

// First Form covers ~34 lessons; chartsForLesson is cumulative, so dedupe by item key and
// keep the earliest lesson an item appears in (that's when it's first taught / testable).
const MAX_LESSON = 34;

export function buildAllItems(): DrillItem[] {
  const byKey = new Map<string, DrillItem>();
  const add = (item: DrillItem) => {
    const existing = byKey.get(item.key);
    if (!existing || item.lesson < existing.lesson) byKey.set(item.key, item);
  };

  // ── Vocab + sayings ──
  for (const q of FF_QUIZ_VOCAB) {
    const L = Math.max(...q.lessons);
    const tag = q.lessons.join("-");
    for (const v of q.vocab) {
      add({ key: `L${tag}:vocab:${v.latin}`, lesson: L, itemType: "vocab",
            prompt: v.english, direction: "English → Latin", answer: v.latin });
    }
    if (q.sayingLatin) {
      add({ key: `L${tag}:saying`, lesson: L, itemType: "saying",
            prompt: "Give the Latin saying for this lesson", direction: `Lesson ${tag}`, answer: q.sayingLatin });
    }
  }

  // ── Paradigms from the verified grammar charts ──
  for (let n = 1; n <= MAX_LESSON; n++) {
    for (const chart of chartsForLesson(n)) {
      if (chart.kind === "verb") {
        const tense = tenseFromId(chart.id);
        chart.rows.forEach((cell, i) => {
          const [person, number] = PERSON_NUMBER[i];
          add({ key: `conj:${chart.id}:${i}`, lesson: n, itemType: "conjugate",
                prompt: `${chart.modelWord.split("—")[0].trim()} — ${tense}: ${person} person ${number}`,
                direction: "Give the Latin form", answer: cell.latin });
        });
      } else if (chart.kind === "noun") {
        chart.cases.forEach((cse, i) => {
          for (const [num, forms] of [["singular", chart.singular], ["plural", chart.plural]] as const) {
            add({ key: `decl:${chart.id}:${cse}:${num}`, lesson: n, itemType: "decline",
                  prompt: `${chart.modelWord.split("—")[0].trim()} — ${cse} ${num}`,
                  direction: "Give the Latin form", answer: forms[i] });
          }
        });
      } else if (chart.kind === "numbers") {
        for (const num of chart.numbers) {
          add({ key: `num:${num.value}`, lesson: n, itemType: "vocab",
                prompt: `${num.english} (${num.value})`, direction: "English → Latin", answer: num.latin });
        }
      }
      // adjective / principal-parts charts: reference-heavy; deferred from drilling for now.
    }
  }

  return [...byKey.values()];
}
