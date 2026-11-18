/**
 * Hands a question off to Ask Aquinas from any content page's "Go deeper" button.
 * Pre-fills the chat textarea (doesn't auto-send) so the question can still be
 * edited before it burns a real AI call.
 */

const KEY = "veritas-pending-question";

export function setPendingQuestion(text: string): void {
  sessionStorage.setItem(KEY, text);
}

export function takePendingQuestion(): string | null {
  if (typeof window === "undefined") return null;
  const text = sessionStorage.getItem(KEY);
  if (text) sessionStorage.removeItem(KEY);
  return text;
}
