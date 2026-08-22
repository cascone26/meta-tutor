import BackLink from "@/components/rca/BackLink";
import PrintButton from "@/components/rca/PrintButton";
import ReadAloudButton from "@/components/rca/ReadAloudButton";
import CopyTextButton from "@/components/rca/CopyTextButton";
import RcaClassBlock from "@/components/rca/RcaClassBlock";
import { rcaClasses, rcaSchedule, getClosure, rcaEvents } from "@/lib/rca";
import { getUpcomingHighlights, getCltHeadsUp, blockStartMinutes } from "@/lib/rca-upcoming";

// Sunday-night (or whenever) planning view — Jacob cram-preps ahead of the
// week, not just the morning of. /rca/today only shows the ONE day that's
// happening right now; this shows both real teaching days (Monday + Thursday)
// together, plus anything worth knowing more than a day out (upcoming tests/
// investigations/homework checks, coordination notes like May Crowning, CLT
// testing week) — none of which had any lead-time surfacing anywhere before.
export const dynamic = "force-dynamic";

// Walk forward up to 2 weeks collecting the next real (non-closed, in-term)
// Monday and Thursday — same closure/event-skipping logic as
// getNextScheduleItem() in rca.ts, just collecting both weekdays instead of
// stopping at the first hit.
function getUpcomingTeachingDays(today: Date): { date: Date; weekday: "Monday" | "Thursday" }[] {
  const termStart = new Date(rcaSchedule.termStart + "T00:00:00");
  const termEnd = new Date(rcaSchedule.termEnd + "T00:00:00");
  const found: { date: Date; weekday: "Monday" | "Thursday" }[] = [];
  const have = new Set<string>();

  for (let i = 0; i <= 13 && found.length < 2; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d < termStart || d > termEnd) continue;
    const day = d.getDay();
    if (day !== 1 && day !== 4) continue;
    const weekday = day === 1 ? "Monday" : "Thursday";
    if (have.has(weekday)) continue;
    const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (getClosure(d)) continue;
    if (rcaEvents.some((e) => e.date === todayKey)) continue;
    found.push({ date: d, weekday });
    have.add(weekday);
  }
  return found;
}

export default function WeekPage() {
  const today = new Date();
  const teachingDays = getUpcomingTeachingDays(today);
  const highlights = getUpcomingHighlights(today);
  const clt = getCltHeadsUp(today);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-16 print:px-0 print:py-4">
      <div className="flex items-start justify-between gap-2 print:hidden">
        <BackLink href="/rca" size="xs">Back to RCA</BackLink>
        <div className="flex gap-2">
          <ReadAloudButton targetId="rca-week-content" />
          <CopyTextButton targetId="rca-week-content" label="Copy for FACTS" />
          <PrintButton />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mt-2 mb-0.5">Week ahead</h1>
      <p className="text-xs mb-6" style={{ color: "#8a9a7c" }}>{rcaSchedule.center} · {rcaSchedule.address}</p>

      <div id="rca-week-content">
      {clt && (
        <div className="rounded-xl px-4 py-3 mb-6" style={{ background: "rgba(201,132,58,0.1)", border: "1px solid rgba(201,132,58,0.25)" }}>
          <p className="text-sm font-semibold" style={{ color: "#8a6a2e" }}>
            CLT testing week in {clt.daysAway} day{clt.daysAway === 1 ? "" : "s"} ({clt.start} – {clt.end})
          </p>
          <p className="text-xs mt-1" style={{ color: "#8a6a2e" }}>No new lessons that week — informational, not a closure.</p>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b8e5a" }}>
            Coming up
          </h2>
          <ul className="text-sm space-y-1.5">
            {highlights.slice(0, 8).map((h, i) => (
              <li key={i} style={{ color: "#3a4a34" }}>
                <span className="font-semibold" style={{ color: "#33402c" }}>{h.className}</span>
                {" — "}
                {h.lessonsAway === 0 ? "today" : `in ~${h.lessonsAway} lesson${h.lessonsAway === 1 ? "" : "s"}`}
                {": "}
                {h.snippet}
              </li>
            ))}
          </ul>
        </div>
      )}

      {teachingDays.length === 0 ? (
        <p className="text-sm" style={{ color: "#8a9a7c" }}>No more scheduled teaching days on the calendar right now.</p>
      ) : (
        teachingDays.map(({ date, weekday }) => {
          const dateLabel = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
          const classes = rcaClasses
            .filter((c) => (c.days ?? rcaSchedule.days).includes(weekday))
            .slice()
            .sort((a, b) => blockStartMinutes(a.block) - blockStartMinutes(b.block));

          return (
            <div key={weekday} className="mb-8">
              <h2 className="text-base font-bold mb-3" style={{ color: "#2f5e7a" }}>{dateLabel}</h2>
              <div className="space-y-4">
                {classes.map((c) => (
                  <RcaClassBlock key={c.id} classId={c.id} name={c.name} block={c.block} room={c.room} weekday={weekday} />
                ))}
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
}
