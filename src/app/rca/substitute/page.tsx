import BackLink from "@/components/rca/BackLink";
import PrintButton from "@/components/rca/PrintButton";
import RcaClassBlock from "@/components/rca/RcaClassBlock";
import { rcaClasses, rcaSchedule, getClosure, rcaEvents } from "@/lib/rca";
import { blockStartMinutes } from "@/lib/rca-upcoming";

// If Jacob's ever out, whoever covers needs enough context to actually run
// the day without him — same class cards as /rca/today (which already show
// full lesson detail, not just a summary), but with the classroom-logistics
// framing a regular tutor doesn't need spelled out. Print-friendly by design.
export const dynamic = "force-dynamic";

export default function SubstitutePage() {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const closure = getClosure(today);
  const event = rcaEvents.find((e) => e.date === todayKey);
  const isTeachingWeekday = weekday === "Monday" || weekday === "Thursday";
  const isRealTeachingDay = isTeachingWeekday && !closure && !event;

  const classes = isRealTeachingDay
    ? rcaClasses
        .filter((c) => (c.days ?? rcaSchedule.days).includes(weekday as "Monday" | "Thursday"))
        .slice()
        .sort((a, b) => blockStartMinutes(a.block) - blockStartMinutes(b.block))
    : [];

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-16 print:px-0 print:py-4">
      <div className="flex items-start justify-between gap-2 print:hidden">
        <BackLink href="/rca" size="xs">Back to RCA</BackLink>
        <PrintButton />
      </div>

      <h1 className="text-2xl font-bold tracking-tight mt-2 mb-0.5">Covering for Mr. Cascone — {dateLabel}</h1>
      <p className="text-sm mb-1" style={{ color: "#3a4a34" }}>
        6th Grade, {rcaSchedule.center} · {rcaSchedule.address}
      </p>
      <p className="text-xs mb-6" style={{ color: "#8a9a7c" }}>
        Thank you for covering! Each block below has the full plan — what's already been taught, what
        today's is, and the actual teaching content. If anything's unclear, check with the Center
        Coordinator of Education.
      </p>

      {!isRealTeachingDay ? (
        <p className="text-sm rounded-xl p-4" style={{ background: "rgba(140,140,120,0.08)", border: "1px solid rgba(140,140,120,0.2)" }}>
          {closure ? `${closure.label} — no class today.` : event ? `${event.label} — no regular classes today.` : "Not a scheduled teaching day (Monday & Thursday only)."}
        </p>
      ) : (
        <div className="space-y-4">
          {classes.map((c) => (
            <RcaClassBlock key={c.id} classId={c.id} name={c.name} block={c.block} room={c.room} weekday={weekday} />
          ))}
        </div>
      )}
    </div>
  );
}
