"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCalendarEvents, type CalendarEvent } from "@/lib/rca-calendar";
import { rcaClasses, rcaSchedule, getRcaClass, getClosure } from "@/lib/rca";
import { blockStartMinutes } from "@/lib/rca-upcoming";
import { ChevronIcon } from "@/components/rca/NatureIcons";

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
function fmtDayLong(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
function fmtShort(key: string): string {
  return new Date(key + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Always-available RCA calendar — same floating-panel pattern as
// RcaAssistant/RcaNotes, but top-right (those two live bottom-right) since
// this is a distinct surface Jacob asked to be able to check independently
// of the class pages, not another chat/notes-style tool.
//
// 2026-10-12 redesign: month cells are now real click targets (jump straight
// into that day's full agenda instead of just showing a count), every class
// row carries its own accent color so a week/month reads at a glance instead
// of requiring you to read every label, and closures/events — which
// previously only showed a title, with real detail text sitting unused in
// the data — expand in place so there's actually something to review.
export default function CalendarPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState(() => new Date());
  const [cameFromMonth, setCameFromMonth] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rangeStart = useMemo(() => {
    if (view === "day") return anchor;
    if (view === "week") return startOfWeek(anchor);
    return startOfWeek(startOfMonth(anchor)); // pad to full weeks
  }, [view, anchor]);

  const rangeEnd = useMemo(() => {
    if (view === "day") return anchor;
    if (view === "week") return addDays(startOfWeek(anchor), 6);
    const monthEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
    return addDays(startOfWeek(monthEnd), 6); // Monday-anchored week always ends 6 days later
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

  function openDay(d: Date) {
    setCameFromMonth(view === "month");
    setAnchor(d);
    setView("day");
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
        className="fixed top-3 right-4 z-20 flex items-center justify-center rounded-full shadow-md transition-all duration-150 hover:scale-105"
        style={{ width: 32, height: 32, background: "#3f7ea6", color: "#fff", boxShadow: open ? "0 0 0 3px rgba(63,126,166,0.25)" : "0 1px 4px rgba(0,0,0,0.15)" }}
      >
        <CalendarIcon size={16} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30"
          style={{ background: "rgba(40,50,35,0.18)", backdropFilter: "blur(1.5px)", animation: "fadeUpIn 0.18s ease both" }}
        />
      )}

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={expanded
            ? "fixed inset-4 md:inset-10 z-40 flex flex-col rounded-[22px] overflow-hidden"
            : "fixed top-[60px] right-4 z-40 flex flex-col rounded-[22px] overflow-hidden"}
          style={{
            background: "#fbf8f0",
            border: "1px solid #d9e4d3",
            boxShadow: "0 24px 60px -12px rgba(47,94,122,0.35), 0 4px 16px rgba(47,94,122,0.12)",
            animation: "fadeUpIn 0.22s cubic-bezier(0.16,1,0.3,1) both",
            ...(expanded ? {} : { width: "min(440px, calc(100vw - 2rem))", maxHeight: "78vh" }),
          }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #eef2e2, #e4edf0)", borderBottom: "1px solid #d9e4d3" }}>
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "#2f5e7a" }}>
                <CalendarIcon size={14} /> RCA calendar
              </p>
              <p className="text-xs" style={{ color: "#6b8e9a" }}>{rcaSchedule.center}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 rounded-lg transition-colors duration-150"
                style={{ color: "#3f7ea6" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(63,126,166,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label={expanded ? "Shrink calendar" : "Expand calendar"}
                title={expanded ? "Shrink" : "Expand — see the whole calendar"}
              >
                {expanded ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-sm transition-colors duration-150"
                style={{ color: "#3f7ea6" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(63,126,166,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: "1px solid #d9e4d3" }}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150"
                style={{ color: "#3f7ea6" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2e2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <ChevronIcon size={13} />
              </button>
              <button
                onClick={() => { setAnchor(new Date()); setCameFromMonth(false); }}
                className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors duration-150"
                style={{ background: "#eef2e2", color: "#3f7ea6" }}
              >
                Today
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150"
                style={{ color: "#3f7ea6" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2e2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <ChevronIcon size={13} flip />
              </button>
              {view === "day" && (
                <span className="text-xs font-semibold ml-1" style={{ color: "#2f5e7a" }}>{fmtDayLong(anchor)}</span>
              )}
            </div>
            <div className="flex gap-1 p-0.5 rounded-full" style={{ background: "#eef2e2" }}>
              {(["day", "week", "month"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setView(v); setCameFromMonth(false); }}
                  className="text-xs px-2.5 py-1 rounded-full font-medium capitalize transition-all duration-150"
                  style={{ background: view === v ? "#3f7ea6" : "transparent", color: view === v ? "#fff" : "#3f7ea6", boxShadow: view === v ? "0 1px 3px rgba(63,126,166,0.4)" : "none" }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {view === "day" && cameFromMonth && (
            <button
              onClick={() => { setView("month"); setCameFromMonth(false); }}
              className="mx-4 mt-2.5 self-start flex items-center gap-1 text-[11px] font-medium"
              style={{ color: "#8a9a7c" }}
            >
              <ChevronIcon size={10} /> Back to month
            </button>
          )}

          {view === "month" && <ClassLegend />}

          <div className="flex-1 overflow-y-auto p-3">
            {view === "month" ? (
              <MonthGrid anchor={anchor} days={days} byDate={byDate} onPickDay={openDay} />
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

function ClassLegend() {
  return (
    <div className="px-4 pt-2.5 flex flex-wrap gap-x-3 gap-y-1">
      {rcaClasses.map((c) => (
        <span key={c.id} className="flex items-center gap-1 text-[10px]" style={{ color: "#5c6b52" }}>
          <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: c.color }} />
          {c.name}
        </span>
      ))}
    </div>
  );
}

function MonthGrid({ anchor, days, byDate, onPickDay }: { anchor: Date; days: Date[]; byDate: Map<string, CalendarEvent[]>; onPickDay: (d: Date) => void }) {
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
          const hasEvent = dayEvents.some((e) => e.kind === "rca-event");
          const classColors: string[] = [];
          for (const e of dayEvents) {
            if (e.kind !== "class") continue;
            const c = getRcaClass(e.classId)?.color;
            if (c && !classColors.includes(c)) classColors.push(c);
          }
          const inMonth = d.getMonth() === anchor.getMonth();
          const isToday = key === todayKey;
          const clickable = inMonth && dayEvents.length > 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPickDay(d)}
              disabled={!inMonth}
              title={closure ? `${closure.title}${closure.estimated ? " (estimated)" : ""}` : clickable ? "View this day" : undefined}
              className="rounded-xl p-1 text-center transition-all duration-150"
              style={{
                minHeight: 44,
                background: closure ? "rgba(160,74,74,0.1)" : isToday ? "rgba(63,126,166,0.14)" : "transparent",
                border: isToday ? "1.5px solid #3f7ea6" : "1px solid transparent",
                opacity: inMonth ? 1 : 0.3,
                cursor: inMonth ? "pointer" : "default",
              }}
              onMouseEnter={(e) => { if (inMonth) { e.currentTarget.style.background = closure ? "rgba(160,74,74,0.16)" : "rgba(63,126,166,0.1)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(47,94,122,0.18)"; } }}
              onMouseLeave={(e) => { if (inMonth) { e.currentTarget.style.background = closure ? "rgba(160,74,74,0.1)" : isToday ? "rgba(63,126,166,0.14)" : "transparent"; e.currentTarget.style.boxShadow = "none"; } }}
            >
              <p className="text-[10px] font-medium" style={{ color: isToday ? "#2f5e7a" : "#5c6b52" }}>{d.getDate()}</p>
              <div className="flex items-center justify-center gap-0.5 mt-0.5" style={{ minHeight: 6 }}>
                {closure ? (
                  <span className="rounded-full" style={{ width: 5, height: 5, background: "#a04a4a" }} />
                ) : (
                  <>
                    {classColors.slice(0, 4).map((c) => (
                      <span key={c} className="rounded-full" style={{ width: 4.5, height: 4.5, background: c }} />
                    ))}
                    {hasEvent && <span className="rounded-full" style={{ width: 4.5, height: 4.5, background: "#c9843a" }} />}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgendaList({ days, byDate }: { days: Date[]; byDate: Map<string, CalendarEvent[]> }) {
  const todayKey = dateKey(new Date());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  function toggle(k: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

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
              <div className="space-y-1.5">
                {dayEvents.map((e, i) => {
                  const itemKey = `${key}-${i}`;
                  const isExpanded = expandedKeys.has(itemKey);

                  if (e.kind === "closure") {
                    const closure = getClosure(d);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggle(itemKey)}
                        className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-150"
                        style={{ background: "rgba(160,74,74,0.08)", color: "#a04a4a" }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{e.title} — no class{e.estimated && <span className="text-[10px] ml-1" style={{ color: "#c9843a" }}>(estimated)</span>}</span>
                          <ChevronIcon size={9} flip style={{ transform: isExpanded ? "rotate(90deg)" : undefined, transition: "transform 150ms" }} />
                        </div>
                        {isExpanded && closure && (
                          <p className="text-[10px] mt-1" style={{ color: "#b56a6a" }}>
                            {closure.start === closure.end ? fmtShort(closure.start) : `${fmtShort(closure.start)} – ${fmtShort(closure.end)}`}
                            {closure.estimated && " · reasoned placement, not yet confirmed against RCA's official calendar"}
                          </p>
                        )}
                      </button>
                    );
                  }
                  if (e.kind === "rca-event") {
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggle(itemKey)}
                        className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-150"
                        style={{ background: "rgba(201,132,58,0.1)", color: "#8a6a2e" }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span><span className="font-medium">{e.title}</span> — {e.time}</span>
                          <ChevronIcon size={9} flip style={{ transform: isExpanded ? "rotate(90deg)" : undefined, transition: "transform 150ms" }} />
                        </div>
                        {isExpanded && (
                          <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: "#9a7a3e" }}>{e.detail}</p>
                        )}
                      </button>
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
                  const color = getRcaClass(e.classId)?.color ?? "#3f7ea6";
                  return (
                    <Link
                      key={i}
                      href={`/rca/${e.classId}`}
                      className="group flex items-center justify-between gap-2 rounded-lg pl-2.5 pr-2 py-1.5 text-xs transition-all duration-150"
                      style={{ background: "#fff", border: "1px solid #d9e4d3", borderLeftWidth: 3, borderLeftColor: color, color: "#2f3a2a" }}
                      onMouseEnter={(ev) => { ev.currentTarget.style.boxShadow = "0 2px 8px rgba(47,94,122,0.16)"; ev.currentTarget.style.transform = "translateX(1px)"; }}
                      onMouseLeave={(ev) => { ev.currentTarget.style.boxShadow = "none"; ev.currentTarget.style.transform = "none"; }}
                    >
                      <span>
                        <span className="font-medium">{e.title}</span>
                        {e.block && <span style={{ color: "#8a9a7c" }}> · {e.block}</span>}
                        {e.room && <span style={{ color: "#8a9a7c" }}> · {e.room}</span>}
                      </span>
                      <ChevronIcon size={11} flip className="shrink-0 opacity-40 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5" style={{ color }} />
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
