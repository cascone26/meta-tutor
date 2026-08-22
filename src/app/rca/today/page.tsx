import BackLink from "@/components/rca/BackLink";
import { rcaClasses, rcaSchedule, getClosure, rcaEvents } from "@/lib/rca";
import RcaClassBlock from "@/components/rca/RcaClassBlock";
import PrintButton from "@/components/rca/PrintButton";
import ReadAloudButton from "@/components/rca/ReadAloudButton";
import { blockStartMinutes } from "@/lib/rca-upcoming";
import { getLiturgicalSeason } from "@/lib/liturgical-calendar";

// A dedicated, deliberately distraction-free work-day page (Jacob, 2026-08-17,
// his first real teaching day: "the center is really a no tech place... laptops
// can only really be used or looked at when the kids are not in class or quick
// glances/reminders... a kinda of like full view and page... class/at work
// oriented, no distractions, anything i could need if i need quick peeks or
// reminders or even like its ready to go and look at before the work day so i
// can quickly cram... even if im in my classroom early i can also just use the
// whiteboard to copy down the most important things"). This is NOT the
// dashboard — no AI assistant, no notes popup, no calendar popup (all three
// guarded off this route in their own components), no practice quizzes, no
// garden. Pure reference: what's today, in what order, what to bring, what to
// teach — read-only, nothing to type or edit, since laptops in-class are
// glance-only and phones can't comfortably do data entry either.
export const dynamic = "force-dynamic";

export default function TodayPage() {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const closure = getClosure(today);
  const event = rcaEvents.find((e) => e.date === todayKey);
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
  const termEnd = new Date(rcaSchedule.termEnd + "T00:00:00");
  const inTerm = today >= termStart && today <= termEnd;
  const isTeachingWeekday = weekday === "Monday" || weekday === "Thursday";
  const isRealTeachingDay = inTerm && isTeachingWeekday && !closure && !event;

  const todaysClasses = isRealTeachingDay
    ? rcaClasses
        .filter((c) => (c.days ?? rcaSchedule.days).includes(weekday as "Monday" | "Thursday"))
        .slice()
        .sort((a, b) => blockStartMinutes(a.block) - blockStartMinutes(b.block))
    : [];

  const materials = Array.from(new Set(todaysClasses.flatMap((c) => c.books))).sort();

  // "Up next" — which of today's blocks hasn't started yet, by wall-clock time.
  // Only meaningful mid-day; before the first block or after the last one it's
  // just noise, so it only renders inside that window.
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const upNext = todaysClasses.find((c) => blockStartMinutes(c.block) > nowMinutes);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-16 print:px-0 print:py-4">
      <div className="flex items-start justify-between gap-2 print:hidden">
        <BackLink href="/rca" size="xs">Back to RCA</BackLink>
        <div className="flex gap-2">
          <ReadAloudButton targetId="rca-today-content" />
          <PrintButton />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mt-2 mb-0.5">{dateLabel}</h1>
      <p className="text-xs mb-6" style={{ color: "#8a9a7c" }}>
        {rcaSchedule.center} · {rcaSchedule.address} · {getLiturgicalSeason(today).label}
      </p>

      <div id="rca-today-content">
      {!inTerm ? (
        <StatusBanner tone="neutral">
          {today < termStart
            ? `Term hasn't started yet — first day is ${rcaSchedule.termStart}.`
            : `The 2026-2027 term ended ${rcaSchedule.termEnd} — no more scheduled class days.`}
        </StatusBanner>
      ) : event ? (
        <StatusBanner tone="event">
          <p className="text-base font-semibold" style={{ color: "#8a6a2e" }}>{event.label}</p>
          <p className="text-sm mt-1">{event.time}</p>
          <p className="text-sm mt-1">{event.detail}</p>
        </StatusBanner>
      ) : closure ? (
        <StatusBanner tone="closure">
          <p className="text-base font-semibold" style={{ color: "#a04a4a" }}>
            {closure.label} — no class{closure.estimated ? " (estimated, not confirmed)" : ""}
          </p>
        </StatusBanner>
      ) : !isTeachingWeekday ? (
        <StatusBanner tone="neutral">Not a scheduled teaching day — Monday &amp; Thursday only.</StatusBanner>
      ) : (
        <>
          <StatusBanner tone="teaching">
            <p className="text-base font-semibold" style={{ color: "#2f5e7a" }}>
              Teaching day — {todaysClasses.length} class{todaysClasses.length === 1 ? "" : "es"}, {rcaSchedule.startTime}–{rcaSchedule.endTime}
            </p>
            {upNext && (
              <p className="text-sm mt-1" style={{ color: "#2f5e7a" }}>
                Up next: <span className="font-semibold">{upNext.name}</span>{upNext.block ? ` — ${upNext.block}` : ""}{upNext.room ? ` · ${upNext.room}` : ""}
              </p>
            )}
          </StatusBanner>

          {materials.length > 0 && (
            <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b8e5a" }}>
                Bring today
              </h2>
              <ul className="text-sm space-y-1">
                {materials.map((m) => (
                  <li key={m} style={{ color: "#3a4a34" }}>— {m}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            {todaysClasses.map((c) => (
              <RcaClassBlock key={c.id} classId={c.id} name={c.name} block={c.block} room={c.room} weekday={weekday} />
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}

function StatusBanner({ tone, children }: { tone: "teaching" | "closure" | "event" | "neutral"; children: React.ReactNode }) {
  const styles: Record<string, { background: string; border: string }> = {
    teaching: { background: "rgba(63,126,166,0.1)", border: "1px solid rgba(63,126,166,0.25)" },
    closure: { background: "rgba(160,74,74,0.08)", border: "1px solid rgba(160,74,74,0.2)" },
    event: { background: "rgba(201,132,58,0.1)", border: "1px solid rgba(201,132,58,0.25)" },
    neutral: { background: "rgba(140,140,120,0.08)", border: "1px solid rgba(140,140,120,0.2)" },
  };
  return (
    <div className="rounded-xl px-4 py-3 mb-6" style={styles[tone]}>
      {children}
    </div>
  );
}
