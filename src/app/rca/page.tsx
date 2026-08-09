import Link from "next/link";
import { rcaClasses, rcaSchedule, gradingGuidelinesUrl } from "@/lib/rca";

export default function RcaPage() {
  const academic = rcaClasses.filter((c) => c.area === "Academic");
  const specials = rcaClasses.filter((c) => c.area === "Specials");

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="text-xl font-semibold mb-1">Regina Caeli Academy</h1>
      <p className="text-sm mb-6" style={{ color: "#a89968" }}>
        6th Grade Lead + 3-4 Music, 3-4 PE, 5-6 PE — {rcaSchedule.center}
      </p>

      <div className="rounded-xl p-4 mb-6" style={{ background: "#1a2138", border: "1px solid #2a3350" }}>
        <h2 className="text-sm font-semibold mb-2">Weekly schedule</h2>
        <p className="text-sm" style={{ color: "#c7bd97" }}>
          {rcaSchedule.days.join(" & ")} · {rcaSchedule.startTime} – {rcaSchedule.endTime}
        </p>
        <p className="text-xs mt-1" style={{ color: "#7d7455" }}>
          {rcaSchedule.address}
        </p>
        <p className="text-xs mt-2" style={{ color: "#7d7455" }}>
          Term: {rcaSchedule.termStart} – {rcaSchedule.termEnd}. Per-class block times aren&apos;t set yet — this is the full on-campus window.
        </p>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7d7455" }}>
        Academic (6th grade)
      </h2>
      <div className="grid gap-2 mb-6">
        {academic.map((c) => (
          <ClassCard key={c.id} id={c.id} name={c.name} summary={c.summary} hasContent={c.hasStructuredContent} />
        ))}
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7d7455" }}>
        Specials
      </h2>
      <div className="grid gap-2 mb-6">
        {specials.map((c) => (
          <ClassCard key={c.id} id={c.id} name={c.name} summary={c.summary} hasContent={c.hasStructuredContent} />
        ))}
      </div>

      <a
        href={gradingGuidelinesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline"
        style={{ color: "#c9a227" }}
      >
        RCA Lower School Tutor Guidelines (grading, all subjects) →
      </a>
    </div>
  );
}

function ClassCard({ id, name, summary, hasContent }: { id: string; name: string; summary: string; hasContent: boolean }) {
  return (
    <Link
      href={`/rca/${id}`}
      className="group flex items-center justify-between rounded-xl px-4 py-3 transition-transform hover:scale-[1.005]"
      style={{ background: "#1a2138", border: "1px solid #2a3350" }}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
          {hasContent && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide" style={{ background: "#243318", color: "#8fc25c" }}>
              Lesson viewer
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#8a8060" }}>{summary}</p>
      </div>
      <span className="text-sm opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: "#c9a227" }}>→</span>
    </Link>
  );
}
