// Derived calendar events for the RCA calendar view — built entirely from
// rca.ts's data (rcaClasses, rcaSchedule, rcaEvents, RCA_CLOSURES), not a
// separate copy of the schedule. One source of truth: rca.ts owns what's
// true, this file just projects it onto a date range.

import { rcaClasses, rcaSchedule, rcaEvents, RCA_CLOSURES, getClosure } from "./rca";

export type CalendarEvent =
  | { kind: "class"; date: string; classId: string; title: string; block?: string; room?: string }
  | { kind: "closure"; date: string; title: string; estimated: boolean }
  | { kind: "rca-event"; date: string; title: string; detail: string; time: string };

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Every calendar-worthy thing happening in [startKey, endKey] (inclusive,
 * both "YYYY-MM-DD"). Class sessions are generated fresh from rcaClasses on
 * every call (day-of-week × block time × room), not stored, so there's
 * exactly one source of truth for the schedule instead of a duplicate copy
 * living in calendar-specific data. */
export function getCalendarEvents(startKey: string, endKey: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const start = new Date(startKey + "T00:00:00");
  const end = new Date(endKey + "T00:00:00");
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
  const termEnd = new Date(rcaSchedule.termEnd + "T00:00:00");

  for (const ev of rcaEvents) {
    if (ev.date >= startKey && ev.date <= endKey) {
      events.push({ kind: "rca-event", date: ev.date, title: ev.label, detail: ev.detail, time: ev.time });
    }
  }

  for (const c of RCA_CLOSURES) {
    if (c.end < startKey || c.start > endKey) continue;
    // Emit one event per DAY the closure overlaps the requested range, so a
    // month grid can shade every closed cell, not just the closure's start.
    const rangeStart = c.start > startKey ? c.start : startKey;
    const rangeEnd = c.end < endKey ? c.end : endKey;
    for (let d = new Date(rangeStart + "T00:00:00"); d <= new Date(rangeEnd + "T00:00:00"); d = new Date(d.getTime() + 86400000)) {
      events.push({ kind: "closure", date: dateKey(d), title: c.label, estimated: c.estimated });
    }
  }

  for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86400000)) {
    if (d < termStart || d > termEnd) continue; // no phantom classes past the real school year
    if (getClosure(d)) continue; // closure days never also show class blocks
    const weekday = d.getDay(); // 1=Mon, 4=Thu
    const dayName = weekday === 1 ? "Monday" : weekday === 4 ? "Thursday" : null;
    if (!dayName) continue;
    const key = dateKey(d);
    for (const c of rcaClasses) {
      const classDays = c.days ?? rcaSchedule.days;
      if (!classDays.includes(dayName)) continue;
      events.push({ kind: "class", date: key, classId: c.id, title: c.name, block: c.block, room: c.room });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}
