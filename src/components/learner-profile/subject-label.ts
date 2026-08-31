import { subjects, umbrellas } from "@/lib/subjects";

// Resolves a SubjectSnapshot's subjectId ("latin-lab", "rca", …) to the same display
// name used on the hub tile grid, falling back to the raw id for subjects that haven't
// registered a display name yet (e.g. future adapters added before their hub entry).
export function subjectLabel(subjectId: string): string {
  const subject = subjects.find((s) => s.id === subjectId);
  if (subject) return subject.name;
  const umbrella = umbrellas.find((u) => u.id === subjectId);
  if (umbrella) return umbrella.name;
  return subjectId;
}
