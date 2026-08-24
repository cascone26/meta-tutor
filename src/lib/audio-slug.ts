// Shared filename convention for pre-generated sound files — used by both
// scripts/gen-sound-audio.mjs (writing the files) and SoundStudio.tsx
// (pointing <audio> tags at them), so the two can never drift out of sync.
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip macrons/diacritics (ā -> a, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
