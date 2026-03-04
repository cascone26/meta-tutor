export type Unit = {
  id: number;
  name: string;
  description: string;
  categories: string[]; // glossary categories that belong to this unit
  questionIds: number[]; // exam question IDs that belong to this unit
};

export const units: Unit[] = [
  {
    id: 1,
    name: "Importance of Metaphysics",
    description: "Why metaphysics matters, responses to objections",
    categories: [],
    questionIds: [3],
  },
  {
    id: 2,
    name: "Plato",
    description: "Divided Line, Cave, Forms, Participation",
    categories: ["Plato"],
    questionIds: [1, 2],
  },
  {
    id: 3,
    name: "Aristotle",
    description: "Methodology, Syllogisms, Being as Being, Categories",
    categories: ["Aristotle"],
    questionIds: [4, 5, 6, 7, 8],
  },
  {
    id: 4,
    name: "First Principles & Being",
    description: "Non-contradiction, Intelligibility, Real vs Mental Being, Concepts, Analogy",
    categories: ["First Principles", "Concepts"],
    questionIds: [9, 10, 11, 12, 13, 14, 29, 30],
  },
  {
    id: 5,
    name: "Unity & Composition",
    description: "Transcendentals, Hylomorphism, Form/Matter, Individuation",
    categories: ["Positions"],
    questionIds: [15, 16, 17, 18, 19, 20, 21, 22],
  },
  {
    id: 6,
    name: "Act, Potency & Existence",
    description: "Act/Potency, Substance/Accident, Essence/Existence, Action",
    categories: ["Thomism"],
    questionIds: [23, 24, 25, 26, 27, 28, 31],
  },
];

// Map glossary categories to unit IDs
export function getUnitForCategory(category: string): number | null {
  for (const unit of units) {
    if (unit.categories.includes(category)) return unit.id;
  }
  return null;
}

// Map question IDs to unit IDs
export function getUnitForQuestion(questionId: number): number | null {
  for (const unit of units) {
    if (unit.questionIds.includes(questionId)) return unit.id;
  }
  return null;
}

// Get/set selected units from localStorage
const UNIT_KEY = "meta-tutor-selected-units";

export function getSelectedUnits(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(UNIT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Filter glossary terms by selected units (empty = all)
export function filterByUnits<T extends { category: string }>(items: T[], unitIds: number[]): T[] {
  if (unitIds.length === 0) return items;
  const allowedCategories = new Set<string>();
  for (const id of unitIds) {
    const unit = units.find((u) => u.id === id);
    if (unit) unit.categories.forEach((c) => allowedCategories.add(c));
  }
  return items.filter((item) => allowedCategories.has(item.category));
}

// Filter questions by selected units (empty = all)
export function filterQuestionsByUnits<T extends { id: number }>(questions: T[], unitIds: number[]): T[] {
  if (unitIds.length === 0) return questions;
  const allowedIds = new Set<number>();
  for (const id of unitIds) {
    const unit = units.find((u) => u.id === id);
    if (unit) unit.questionIds.forEach((qid) => allowedIds.add(qid));
  }
  return questions.filter((q) => allowedIds.has(q.id));
}

export function setSelectedUnits(unitIds: number[]) {
  try {
    localStorage.setItem(UNIT_KEY, JSON.stringify(unitIds));
  } catch (e) {
    console.error("Failed to save unit selection:", e);
  }
}
