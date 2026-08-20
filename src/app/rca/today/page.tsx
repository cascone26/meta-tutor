import Link from "next/link";
import BackLink from "@/components/rca/BackLink";
import { rcaClasses, rcaSchedule, getClosure, rcaEvents } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { currentLessonNumber, isPacingCurrent } from "@/lib/rca";
import { todaysLessonNumber } from "@/lib/rca-content/types";

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

// Block strings are "H:MM – H:MM AM/PM" with ONE trailing period marker that
// applies to the whole span (none of RCA's real blocks cross the noon
// boundary) — parsed just to sort classes chronologically, since the array
// order in rca.ts isn't guaranteed to match real time order (Latin/Religion
// tie at 10:10 but sit after Science/History at 1:55 in the source array).
function blockStartMinutes(block?: string): number {
  if (!block) return 9999;
  const time = block.match(/^(\d{1,2}):(\d{2})/);
  const period = block.match(/\b(AM|PM)\b/);
  if (!time) return 9999;
  let h = parseInt(time[1], 10);
  const min = parseInt(time[2], 10);
  if (period?.[1] === "PM" && h !== 12) h += 12;
  if (period?.[1] === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

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

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-16">
      <BackLink href="/rca" size="xs">Back to RCA</BackLink>
      <h1 className="text-2xl font-bold tracking-tight mt-2 mb-0.5">{dateLabel}</h1>
      <p className="text-xs mb-6" style={{ color: "#8a9a7c" }}>{rcaSchedule.center} · {rcaSchedule.address}</p>

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
              <ClassBlock key={c.id} classId={c.id} name={c.name} block={c.block} room={c.room} weekday={weekday} />
            ))}
          </div>
        </>
      )}
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

// The "key points" block is the whole point of this page — deliberately the
// most visually distinct section on each card, since it's what Jacob said
// he'd copy straight onto a physical whiteboard before students arrive.
function ClassBlock({ classId, name, block, room, weekday }: { classId: string; name: string; block?: string; room?: string; weekday: string }) {
  const content = rcaContent[classId];
  // For weekday-tagged subjects (Saxon-style, one lesson per calendar day),
  // currentLessonNumber()'s raw proportional estimate can land on the right
  // WEEK but the wrong DAY within it — found live on day 1 of term, where
  // Saxon's estimate came back as the Thursday entry while today was Monday.
  // todaysLessonNumber corrects for that; it's a no-op for bundled-week
  // subjects (LOE, Religion, etc.) where there's no day to correct.
  const rawEstimate = content ? currentLessonNumber(content.lessons.length, content.totalWeeks) : 0;
  const n = content ? todaysLessonNumber(content, rawEstimate, weekday) : 0;
  const lesson = content?.lessons.find((l) => l.n === n);
  const stale = content ? !isPacingCurrent(content.totalWeeks ?? content.lessons.length) : false;

  return (
    <div className="rounded-2xl p-4" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold" style={{ color: "#33402c" }}>{name}</h3>
        <Link href={`/rca/${classId}`} className="text-xs shrink-0" style={{ color: "#3f7ea6" }}>Full page →</Link>
      </div>
      <p className="text-sm mb-3" style={{ color: "#3f7ea6" }}>
        {block}{room && <span style={{ color: "#8a9a7c" }}> · {room}</span>}
      </p>

      {!content ? (
        <p className="text-sm" style={{ color: "#8a9a7c" }}>No lesson content on file for this class yet.</p>
      ) : (
        <>
          {stale && (
            <p className="text-xs rounded-lg px-2.5 py-1.5 mb-3" style={{ background: "#fbeee0", color: "#8a5a2a" }}>
              Documented pacing has run out — showing the last lesson on file, not necessarily today&apos;s real plan.
            </p>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b8e5a" }}>
            Lesson {n} of {content.lessons.length} — key points
          </p>
          {lesson ? (
            <div className="rounded-xl p-3 space-y-2" style={{ background: "#fff", border: "1px solid #e8e4d5" }}>
              {lesson.note && (
                <p className="text-xs font-semibold" style={{ color: "#8a6a45" }}>{lesson.note}</p>
              )}
              {lesson.sections.map((s) => (
                <p key={s.label} className="text-sm" style={{ color: "#3a4a34" }}>
                  <span className="font-semibold" style={{ color: "#33402c" }}>{s.label}: </span>
                  {s.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "#8a9a7c" }}>No lesson content for lesson {n}.</p>
          )}
        </>
      )}
    </div>
  );
}
