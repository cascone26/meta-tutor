// Grounding builder for the Riemann Hypothesis station's chat + understanding-check.
// Unlike RCA's grounding (schedule-driven, "current lesson" = today's date), this
// station is self-paced — the client tracks which lesson Jacob is on and passes it in.
import { riemannContent } from "@/lib/riemann-content";

export function buildLessonGrounding(lessonN: number | undefined): string {
  const n = lessonN && lessonN >= 1 && lessonN <= riemannContent.lessons.length ? lessonN : 1;
  const lesson = riemannContent.lessons.find((l) => l.n === n);

  let grounding = `CONTEXT: Jacob is working through a self-paced, from-zero course on the Riemann Hypothesis. ${riemannContent.overview}\n\n`;
  grounding += `HE IS CURRENTLY ON LESSON ${n} OF ${riemannContent.lessons.length}:\n`;
  if (lesson) {
    for (const s of lesson.sections) grounding += `${s.label}: ${s.text}\n`;
  }
  return grounding;
}
