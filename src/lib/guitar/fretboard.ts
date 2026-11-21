import { STANDARD_TUNING, NOTE_NAMES, pitchClassOf } from "./notes";

export type FretboardCell = { fret: number; name: string; pc: number; isNatural: boolean };

export const FRET_COUNT = 12;
export const FRET_MARKERS = [3, 5, 7, 9, 12];

/** Rows ordered high e (string 1) at top down to low E (string 6) at bottom — the
 *  conventional top-to-bottom orientation for a fretboard reference chart. */
export function fretboardGrid(): { stringLabel: string; cells: FretboardCell[] }[] {
  const ordered = [...STANDARD_TUNING].sort((a, b) => a.string - b.string);
  return ordered.map((s) => {
    const cells: FretboardCell[] = [];
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const pc = pitchClassOf(s.midi + fret);
      const name = NOTE_NAMES[pc];
      cells.push({ fret, name, pc, isNatural: !name.includes("#") });
    }
    return { stringLabel: s.string === 1 ? "e" : s.name[0], cells };
  });
}
