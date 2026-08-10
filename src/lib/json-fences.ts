// Models sometimes wrap "JSON only, no fences" responses in ```json fences anyway.
// Shared by every route that asks Claude for raw JSON.
export function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : trimmed;
}
