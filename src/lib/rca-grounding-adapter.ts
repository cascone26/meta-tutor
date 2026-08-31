// Registers RCA's existing grounding function with the Tutor Core registry — wraps,
// does not rewrite, rca-grounding.ts. Importing this file (for its side effect) is what
// makes getContextForSubject("rca", ...) work; see src/app/api/rca-chat/route.ts.
import { buildClassGrounding } from "./rca-grounding";
import { registerGrounding } from "./tutor-core/grounding-registry";

registerGrounding("rca", (params) =>
  buildClassGrounding(params.subjectId as string | undefined, params.lessonNOverride as number | undefined)
);
