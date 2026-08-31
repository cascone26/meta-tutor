import { getGroundingBuilder } from "./grounding-registry";

export function getContextForSubject(subjectId: string, params: Record<string, unknown>): string {
  const builder = getGroundingBuilder(subjectId);
  if (!builder) throw new Error(`No grounding registered for subject "${subjectId}" — import its *-grounding-adapter.ts first.`);
  return builder(params);
}
