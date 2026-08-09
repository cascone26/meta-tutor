import Link from "next/link";
import { rcaClasses, rcaSchedule, gradingGuidelinesUrl } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import { SkyIcon, LeafIcon, ButterflyIcon } from "@/components/rca/NatureIcons";

export default function RcaPage() {
  const academic = rcaClasses.filter((c) => c.area === "Academic");
  const specials = rcaClasses.filter((c) => c.area === "Specials");

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 pb-24">
      <div className="flex items-center gap-2 mb-1">
        <ButterflyIcon size={22} style={{ color: "#3f7ea6" }} />
        <h1 className="text-xl font-semibold">Regina Caeli Academy</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#5c6b52" }}>
        6th Grade Lead + Music 3-4 — {rcaSchedule.center}
      </p>

      <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
          <SkyIcon size={16} />
          Weekly schedule
        </h2>
        <p className="text-sm" style={{ color: "#3a4a34" }}>
          {rcaSchedule.days.join(" & ")} · {rcaSchedule.startTime} – {rcaSchedule.endTime}
        </p>
        <p className="text-xs mt-1" style={{ color: "#8a9a7c" }}>{rcaSchedule.address}</p>
        <p className="text-xs mt-2" style={{ color: "#8a9a7c" }}>
          Term: {rcaSchedule.termStart} – {rcaSchedule.termEnd}. Per-class block times aren&apos;t set yet — this is the full on-campus window.
        </p>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: "#6b8e5a" }}>
        <LeafIcon size={13} />
        Academic (6th grade)
      </h2>
      <div className="grid gap-2 mb-6">
        {academic.map((c) => (
          <ClassCard key={c.id} id={c.id} name={c.name} summary={c.summary} hasContent={c.id in rcaContent} />
        ))}
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: "#6b8e5a" }}>
        <LeafIcon size={13} />
        Specials
      </h2>
      <div className="grid gap-2 mb-6">
        {specials.map((c) => (
          <ClassCard key={c.id} id={c.id} name={c.name} summary={c.summary} hasContent={c.id in rcaContent} />
        ))}
      </div>

      <a
        href={gradingGuidelinesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline"
        style={{ color: "#3f7ea6" }}
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
      style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: "#33402c" }}>{name}</span>
          {hasContent && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide" style={{ background: "#e6f0dd", color: "#5a7a4a" }}>
              Lesson viewer
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#8a9a7c" }}>{summary}</p>
      </div>
      <span className="text-sm opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: "#3f7ea6" }}>→</span>
    </Link>
  );
}
