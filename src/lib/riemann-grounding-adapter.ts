// Registers Riemann's existing grounding function with the Tutor Core registry — wraps,
// does not rewrite, riemann-grounding.ts. See src/lib/rca-grounding-adapter.ts for the
// pattern this follows.
import { buildLessonGrounding } from "./riemann-grounding";
import { registerGrounding } from "./tutor-core/grounding-registry";

registerGrounding("riemann", (params) => buildLessonGrounding(params.lessonN as number | undefined));
