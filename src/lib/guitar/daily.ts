import { CHORDS, ChordShape } from "./chords-data";

/** Deterministic "today's chord" — same chord all day for everyone, cycles through the
 *  whole library over ~18 days. No backend needed: pure date math, same pattern Trivia's
 *  own daily-challenge feature uses. */
export function dailyChallenge(date: Date = new Date()): { chord: ChordShape; dateKey: string } {
  const dateKey = date.toISOString().split("T")[0];
  const startOfYear = new Date(date.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
  const chord = CHORDS[dayOfYear % CHORDS.length];
  return { chord, dateKey };
}
