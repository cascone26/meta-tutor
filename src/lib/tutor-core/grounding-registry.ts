// A subject registers how to build its AI-chat grounding text once; chat-router.ts (or
// anything else) looks it up by subjectId instead of importing each subject's grounding
// function directly. Registration happens as a side effect of importing a subject's
// *-grounding-adapter.ts file — see src/lib/rca-grounding-adapter.ts for the pattern.
export type GroundingBuilder = (params: Record<string, unknown>) => string;

const registry = new Map<string, GroundingBuilder>();

export function registerGrounding(subjectId: string, builder: GroundingBuilder): void {
  registry.set(subjectId, builder);
}

export function getGroundingBuilder(subjectId: string): GroundingBuilder | undefined {
  return registry.get(subjectId);
}
