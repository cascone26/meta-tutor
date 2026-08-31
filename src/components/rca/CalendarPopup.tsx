"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCalendarEvents, type CalendarEvent } from "@/lib/rca-calendar";
import { rcaSchedule } from "@/lib/rca";
import { blockStartMinutes } from "@/lib/rca-upcoming";

type ViewMode = "day" | "week" | "month";

function CalendarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(d.getDate() + n);
  return next;
}
function startOfWeek(d: Date): Date {
  // Weeks anchored to Monday, since that's the only day that matters here.
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(d, diff);
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function fmtDay(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// Always-available RCA calendar — same floating-panel pattern as
// RcaAssistant/RcaNotes, but top-right (those two live bottom-right) since
// this is a distinct surface Jacob asked to be able to check independently
// of the class pages, not another chat/notes-style tool.
export default function CalendarPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState(() => new Date());

  const rangeStart = useMemo(() => {
    if (view === "day") return anchor;
    if (view === "week") return startOfWeek(anchor);
    return startOfMonth(startOfWeek(startOfMonth(anchor))); // pad to full weeks
  }, [view, anchor]);

  const rangeEnd = useMemo(() => {
    if (view === "day") return anchor;
    if (view === "week") return addDays(startOfWeek(anchor), 6);
    const monthEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
    return addDays(startOfWeek(monthEnd), 6 - monthEnd.getDay());
  }, [view, anchor]);

  const events = useMemo(
    () => getCalendarEvents(dateKey(rangeStart), dateKey(rangeEnd)),
    [rangeStart, rangeEnd]
  );

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return map;
  }, [events]);

  function step(dir: 1 | -1) {
    if (view === "day") setAnchor((a) => addDays(a, dir));
    else if (view === "week") setAnchor((a) => addDays(a, dir * 7));
    else setAnchor((a) => new Date(a.getFullYear(), a.getMonth() + dir, 1));
  }

  const days = useMemo(() => {
    const list: Date[] = [];
    for (let d = new Date(rangeStart); d <= rangeEnd; d = addDays(d, 1)) list.push(new Date(d));
    return list;
  }, [rangeStart, rangeEnd]);

  // /rca/today is a deliberately distraction-free work-day reference page —
  // same reasoning/pattern as RcaAssistant/RcaNotes's guard.
  if (pathname === "/rca/today") return null;

  return (
    <>
      {/* Fixed + a SIBLING of <header>, not a DOM descendant of it — the
          header has backdrop-blur (backdrop-filter), which per the CSS spec
          establishes a new containing block for position:fixed descendants.
          Nesting this inside the header meant the expanded panel's
          inset-4/inset-10 was computed against the header's own ~57px box
          instead of the viewport, collapsing it to ~2px tall (found via
          real getComputedStyle() measurement, not a hunch). z-20 sits above
          the header's z-10 so it visually reads as part of the header band
          without any actual layout coupling to it. */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close calendar" : "Open calendar"}
        className="fixed top-3 right-4 z-20 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
        style={{ width: 32, height: 32, background: "#3f7ea6", color: "#fff" }}
      >
        <CalendarIcon size={16} />
      </button>

      {open && (
        <div
          className={expanded
            ? "fixed inset-4 md:inset-10 z-40 flex flex-col rounded-2xl shadow-xl overflow-hidden"
            : "fixed top-[60px] right-4 z-30 flex flex-col rounded-2xl shadow-xl overflow-hidden"}
          style={{ background: "#fbf8f0", border: "1px solid #d9e4d3", ...(expanded ? {} : { width: "min(420px, calc(100vw - 2rem))", maxHeight: "75vh" }) }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#eef2e2", borderBottom: "1px solid #d9e4d3" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#2f5e7a" }}>RCA calendar</p>
              <p className="text-xs" style={{ color: "#6b8e9a" }}>{rcaSchedule.center}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1 rounded-lg hover:opacity-60"
                style={{ color: "#3f7ea6" }}
                aria-label={expanded ? "Shrink calendar" : "Expand calendar"}
                title={expanded ? "Shrink" : "Expand — see the whole calendar"}
              >
                {expanded ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                )}
              </button>
              <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "#3f7ea6" }} aria-label="Close">✕</button>
            </div>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: "1px solid #d9e4d3" }}>
            <div className="flex items-center gap-1">
              <button onClick={() => step(-1)} className="px-2 py-1 rounded text-sm" style={{ color: "#3f7ea6" }}>←</button>
              <button onClick={() => setAnchor(new Date())} className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "#eef2e2", color: "#3f7ea6" }}>Today</button>
              <button onClick={() => step(1)} className="px-2 py-1 rounded text-sm" style={{ color: "#3f7ea6" }}>→</button>
            </div>
            <div className="flex gap-1">
              {(["day", "week", "month"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                  style={{ background: view === v ? "#3f7ea6" : "#eef2e2", color: view === v ? "#fff" : "#3f7ea6" }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {view === "month" ? (
              <MonthGrid anchor={anchor} days={days} byDate={byDate} />
            ) : (
              <AgendaList days={days} byDate={byDate} />
            )}
          </div>

          <div className="px-4 py-2 text-[10px]" style={{ borderTop: "1px solid #d9e4d3", color: "#a8b39c" }}>
            Class blocks/rooms are real (KSC staff schedule). Break dates marked <span style={{ color: "#c9843a" }}>estimated</span> are reasoned placement, not yet confirmed against RCA&apos;s official calendar.
          </div>
        </div>
      )}
    </>
  );
}

function MonthGrid({ anchor, days, byDate }: { anchor: Date; days: Date[]; byDate: Map<string, CalendarEvent[]> }) {
  const todayKey = dateKey(new Date());
  return (
    <div>
      <p className="text-xs font-semibold mb-2 text-center" style={{ color: "#2f5e7a" }}>
        {anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-[10px] text-center font-medium" style={{ color: "#8a9a7c" }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const key = dateKey(d);
          const dayEvents = byDate.get(key) ?? [];
          const closure = dayEvents.find((e) => e.kind === "closure");
          const classCount = dayEvents.filter((e) => e.kind === "class").length;
          const inMonth = d.getMonth() === anchor.getMonth();
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className="rounded-lg p-1 text-center"
              style={{
                minHeight: 40,
                background: closure ? "rgba(160,74,74,0.08)" : isToday ? "rgba(63,126,166,0.12)" : "transparent",
                border: isToday ? "1px solid rgba(63,126,166,0.4)" : "1px solid transparent",
                opacity: inMonth ? 1 : 0.35,
              }}
              title={closure ? `${closure.title}${closure.estimated ? " (estimated)" : ""}` : undefined}
            >
              <p className="text-[10px]" style={{ color: isToday ? "#2f5e7a" : "#5c6b52" }}>{d.getDate()}</p>
              {closure ? (
                <div className="mx-auto mt-0.5 rounded-full" style={{ width: 5, height: 5, background: "#a04a4a" }} />
              ) : classCount > 0 ? (
                <p className="text-[9px] font-semibold" style={{ color: "#3f7ea6" }}>{classCount}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaList({ days, byDate }: { days: Date[]; byDate: Map<string, CalendarEvent[]> }) {
  const todayKey = dateKey(new Date());
  return (
    <div className="space-y-3">
      {days.map((d) => {
        const key = dateKey(d);
        const hasBlock = (e: CalendarEvent) => e.kind === "class" || e.kind === "planning";
        const dayEvents = (byDate.get(key) ?? []).slice().sort((a, b) => (hasBlock(a) && hasBlock(b) ? blockStartMinutes(a.block) - blockStartMinutes(b.block) : 0));
        const isToday = key === todayKey;
        return (
          <div key={key}>
            <p className="text-xs font-semibold mb-1" style={{ color: isToday ? "#2f5e7a" : "#8a9a7c" }}>
              {fmtDay(d)}{isToday && <span className="ml-1.5 text-[10px] font-normal" style={{ color: "#3f7ea6" }}>today</span>}
            </p>
            {dayEvents.length === 0 ? (
              <p className="text-xs pl-2" style={{ color: "#c4cbb8" }}>No class</p>
            ) : (
              <div className="space-y-1">
                {dayEvents.map((e, i) => {
                  if (e.kind === "closure") {
                    return (
                      <div key={i} className="rounded-lg px-2.5 py-1.5 text-xs" style={{ background: "rgba(160,74,74,0.08)", color: "#a04a4a" }}>
                        {e.title} — no class{e.estimated && <span className="text-[10px] ml-1" style={{ color: "#c9843a" }}>(estimated)</span>}
                      </div>
                    );
                  }
                  if (e.kind === "rca-event") {
                    return (
                      <div key={i} className="rounded-lg px-2.5 py-1.5 text-xs" style={{ background: "rgba(201,132,58,0.1)", color: "#8a6a2e" }}>
                        <span className="font-medium">{e.title}</span> — {e.time}
                      </div>
                    );
                  }
                  if (e.kind === "planning") {
                    return (
                      <div key={i} className="rounded-lg px-2.5 py-1.5 text-xs" style={{ background: "#f0efe8", border: "1px dashed #c4cbb8", color: "#6b7260" }}>
                        <span className="font-medium">{e.title}</span>
                        <span style={{ color: "#8a9a7c" }}> · {e.block}</span>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={i}
                      href={`/rca/${e.classId}`}
                      className="block rounded-lg px-2.5 py-1.5 text-xs hover:opacity-80"
                      style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
                    >
                      <span className="font-medium">{e.title}</span>
                      {e.block && <span style={{ color: "#8a9a7c" }}> · {e.block}</span>}
                      {e.room && <span style={{ color: "#8a9a7c" }}> · {e.room}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
