// Real liturgical-season computation, not a lookup table someone has to keep
// updating by hand. Easter is computed via the standard Anonymous Gregorian
// algorithm (Meeus/Jones/Butcher) — the same method every Western liturgical
// calendar is built from — everything else (Advent, Lent, Easter season) is
// derived from it with well-established offsets. This exists because the
// content already implicitly depends on season (Regina Caeli only sung
// Easter–Pentecost, Advent/Christmas hymns, etc.) but nothing ever named
// "what season are we actually in" anywhere in the app.

export function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

// Sunday on/around a fixed date, per the "nearest Sunday" rule Advent's start
// actually uses (0 = Sunday).
function nearestSunday(d: Date): Date {
  const dow = d.getDay();
  const back = dow; // days back to the most recent Sunday
  const forward = (7 - dow) % 7; // days forward to the next Sunday
  return back <= forward ? addDays(d, -back) : addDays(d, forward);
}

export type LiturgicalSeason = "Advent" | "Christmas" | "Ordinary Time" | "Lent" | "Easter";

export function getLiturgicalSeason(date: Date): { season: LiturgicalSeason; label: string } {
  const year = date.getFullYear();
  const easterThisYear = computeEaster(year);
  const easterNextYear = computeEaster(year + 1);
  // Determine which "liturgical year" (roughly Advent-to-Advent) `date` falls
  // in by checking against THIS calendar year's Advent start.
  const adventStartThisYear = nearestSunday(new Date(year, 10, 30)); // Nov 30
  const easterForLent = date < adventStartThisYear ? easterThisYear : easterNextYear;

  const ashWednesday = addDays(easterForLent, -46);
  const holySaturday = addDays(easterForLent, -1);
  const pentecost = addDays(easterForLent, 49);
  // easterForLent's year is always the January-side year of this Christmas
  // season (e.g. Christmas 2026 pairs with Easter 2027, and Epiphany falls in
  // January 2027 too) — no offset needed.
  const epiphany = new Date(easterForLent.getFullYear(), 0, 6);
  const baptismOfLord = nearestSunday(addDays(epiphany, 1));
  const christmasThisSeason = date >= adventStartThisYear ? new Date(year, 11, 25) : new Date(year - 1, 11, 25);

  if (date >= adventStartThisYear && date < christmasThisSeason) {
    return { season: "Advent", label: "Advent" };
  }
  if (date >= christmasThisSeason && date < baptismOfLord) {
    return { season: "Christmas", label: "Christmas season" };
  }
  if (date >= ashWednesday && date < easterForLent) {
    return { season: "Lent", label: date >= holySaturday ? "Holy Saturday" : "Lent" };
  }
  if (date >= easterForLent && date <= pentecost) {
    return { season: "Easter", label: date.getTime() === easterForLent.getTime() ? "Easter Sunday" : "Easter season" };
  }
  return { season: "Ordinary Time", label: "Ordinary Time" };
}
