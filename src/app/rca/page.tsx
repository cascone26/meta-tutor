import Link from "next/link";
import { rcaClasses, rcaSchedule, gradingGuidelinesUrl, getNextScheduleItem } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import {
  SkyIcon, LeafIcon, ButterflyIcon, BirdIcon,
  CloudDoodle, TreeDoodle, FlowerDoodle, BugDoodle, AntHillDoodle, AntDoodle, PondDoodle, GroundLineDoodle,
} from "@/components/rca/NatureIcons";
import Reveal from "@/components/Reveal";
import RcaDashboard from "@/components/rca/RcaDashboard";
import RcaReviewPicker from "@/components/rca/RcaReviewPicker";

// Next-teaching-day needs a fresh Date() per request, not baked in at build time.
export const dynamic = "force-dynamic";

export default function RcaPage() {
  const academic = rcaClasses.filter((c) => c.area === "Academic");
  const specials = rcaClasses.filter((c) => c.area === "Specials");
  const next = getNextScheduleItem();
  const nextLabel = next.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="relative">
      {/* Doodle scene — sits in the page's own flow so each critter is where it'd actually
          be: sky things up top, flying things through the middle, ground things at the
          bottom in the earthy zone (a ground line to root them, tree/flowers/ant hill on it). */}

      {/* Sky zone — clouds drift, birds actually fly wandering loops */}
      <CloudDoodle size={90} className="hidden md:block absolute pointer-events-none" style={{ top: "1%", left: "3%", color: "#ffffff", opacity: 0.85, animation: "drift 32s linear infinite alternate" }} />
      <CloudDoodle size={64} className="hidden md:block absolute pointer-events-none" style={{ top: "3.5%", right: "5%", color: "#ffffff", opacity: 0.75, animation: "drift 40s linear infinite alternate-reverse" }} />
      <CloudDoodle size={48} className="hidden md:block absolute pointer-events-none" style={{ top: "7%", left: "14%", color: "#ffffff", opacity: 0.6, animation: "drift 36s linear infinite alternate" }} />
      <BirdIcon size={18} className="hidden md:block absolute pointer-events-none" style={{ top: "2.5%", left: "20%", color: "#2f5e7a", opacity: 0.6, animation: "wander1 9s ease-in-out infinite" }} />
      <BirdIcon size={14} className="hidden md:block absolute pointer-events-none" style={{ top: "5%", left: "24%", color: "#2f5e7a", opacity: 0.5, animation: "wander2 11s ease-in-out infinite 0.8s" }} />
      <BirdIcon size={16} className="hidden md:block absolute pointer-events-none" style={{ top: "3%", right: "16%", color: "#4a7a8a", opacity: 0.55, animation: "wander3 10s ease-in-out infinite 0.3s", transform: "scaleX(-1)" }} />
      <BirdIcon size={12} className="hidden md:block absolute pointer-events-none" style={{ top: "10%", right: "28%", color: "#5a7a8a", opacity: 0.45, animation: "wander1 13s ease-in-out infinite 1.5s" }} />

      {/* Middle zone — only flying things (butterflies). Bugs/ants live on the
          ground below, not up here — a ladybug tumbling through the air on a
          rotating wander path just looked wrong. */}
      <ButterflyIcon size={26} className="hidden md:block absolute pointer-events-none" style={{ top: "26%", right: "3%", color: "#7a5a8a", opacity: 0.55, animation: "wander1 8s ease-in-out infinite" }} />
      <ButterflyIcon size={20} className="hidden md:block absolute pointer-events-none" style={{ top: "38%", left: "2%", color: "#c9843a", opacity: 0.5, animation: "wander2 10s ease-in-out infinite 0.6s" }} />
      <ButterflyIcon size={18} className="hidden md:block absolute pointer-events-none" style={{ top: "60%", left: "5%", color: "#3f7ea6", opacity: 0.5, animation: "wander2 9s ease-in-out infinite 1.1s" }} />
      <ButterflyIcon size={16} className="hidden md:block absolute pointer-events-none" style={{ top: "18%", left: "40%", color: "#c9843a", opacity: 0.4, animation: "wander3 11s ease-in-out infinite 0.4s" }} />

      {/* Ground zone — tree, pond further back, a real flower bed, and an ant hill
          with an actual marching line instead of just a mound sitting there. */}
      <GroundLineDoodle size={340} className="hidden md:block absolute pointer-events-none" style={{ top: "92%", left: "0%", color: "#6b8e5a", opacity: 0.4 }} />

      {/* Pond — smaller + more muted + higher up in the ground zone to read as further back */}
      <PondDoodle size={150} className="hidden md:block absolute pointer-events-none" style={{ top: "74%", left: "8%", color: "#3f7ea6", opacity: 0.35 }} />

      <TreeDoodle size={130} className="hidden md:block absolute pointer-events-none" style={{ top: "76%", right: "2%", color: "#4f6a41", opacity: 0.55, animation: "sway 7s ease-in-out infinite", transformOrigin: "bottom center" }} />

      {/* Ladybugs — crawling on the ground near the flowers, not flying */}
      <BugDoodle size={20} className="hidden md:block absolute pointer-events-none" style={{ top: "89%", left: "30%", color: "#a04a4a", opacity: 0.55, animation: "crawl 6s ease-in-out infinite" }} />
      <BugDoodle size={15} className="hidden md:block absolute pointer-events-none" style={{ top: "95%", left: "44%", color: "#5a7a4a", opacity: 0.5, animation: "crawl 7.5s ease-in-out infinite 1s" }} />

      {/* Flower bed */}
      <FlowerDoodle size={46} className="hidden md:block absolute pointer-events-none" style={{ top: "88%", left: "4%", color: "#7a5a8a", opacity: 0.65, animation: "sway 5s ease-in-out infinite", transformOrigin: "bottom center" }} />
      <FlowerDoodle size={34} className="hidden md:block absolute pointer-events-none" style={{ top: "91%", left: "9%", color: "#c9843a", opacity: 0.6, animation: "sway 4.5s ease-in-out infinite 0.3s", transformOrigin: "bottom center" }} />
      <FlowerDoodle size={40} className="hidden md:block absolute pointer-events-none" style={{ top: "89%", right: "16%", color: "#5a7a4a", opacity: 0.6, animation: "sway 5.5s ease-in-out infinite 0.6s", transformOrigin: "bottom center" }} />
      <FlowerDoodle size={30} className="hidden md:block absolute pointer-events-none" style={{ top: "94%", left: "34%", color: "#3f7ea6", opacity: 0.55, animation: "sway 5s ease-in-out infinite 0.5s", transformOrigin: "bottom center" }} />
      <FlowerDoodle size={38} className="hidden md:block absolute pointer-events-none" style={{ top: "90%", right: "34%", color: "#c9843a", opacity: 0.6, animation: "sway 4.8s ease-in-out infinite 0.7s", transformOrigin: "bottom center" }} />
      <FlowerDoodle size={26} className="hidden md:block absolute pointer-events-none" style={{ top: "96%", right: "6%", color: "#7a5a8a", opacity: 0.55, animation: "sway 5.3s ease-in-out infinite 0.2s", transformOrigin: "bottom center" }} />
      <FlowerDoodle size={32} className="hidden md:block absolute pointer-events-none" style={{ top: "93%", left: "22%", color: "#5a7a4a", opacity: 0.55, animation: "sway 4.6s ease-in-out infinite 0.9s", transformOrigin: "bottom center" }} />

      {/* Ant hill — bigger, more opaque, with an actual marching line of ants
          trailing away from it instead of just sitting there empty */}
      <AntHillDoodle size={92} className="hidden md:block absolute pointer-events-none" style={{ top: "90%", left: "18%", color: "#8a6a3a", opacity: 0.7 }} />
      <AntDoodle size={14} className="hidden md:block absolute pointer-events-none" style={{ top: "96%", left: "24%", color: "#5a3a1a", opacity: 0.65, animation: "antMarch 0.5s ease-in-out infinite" }} />
      <AntDoodle size={14} className="hidden md:block absolute pointer-events-none" style={{ top: "97%", left: "27%", color: "#5a3a1a", opacity: 0.65, animation: "antMarch 0.5s ease-in-out infinite 0.1s" }} />
      <AntDoodle size={14} className="hidden md:block absolute pointer-events-none" style={{ top: "97.5%", left: "30.5%", color: "#5a3a1a", opacity: 0.6, animation: "antMarch 0.5s ease-in-out infinite 0.2s" }} />
      <AntDoodle size={14} className="hidden md:block absolute pointer-events-none" style={{ top: "98%", left: "34%", color: "#5a3a1a", opacity: 0.6, animation: "antMarch 0.5s ease-in-out infinite 0.3s" }} />
      <AntDoodle size={13} className="hidden md:block absolute pointer-events-none" style={{ top: "97.2%", left: "21%", color: "#5a3a1a", opacity: 0.6, animation: "antMarch 0.5s ease-in-out infinite 0.4s", transform: "scaleX(-1)" }} />
      <AntDoodle size={13} className="hidden md:block absolute pointer-events-none" style={{ top: "98.3%", left: "17%", color: "#5a3a1a", opacity: 0.55, animation: "antMarch 0.5s ease-in-out infinite 0.5s", transform: "scaleX(-1)" }} />

    <div className="max-w-2xl mx-auto px-5 py-8 pb-24 relative z-[1]">
      <div className="flex items-center gap-2 mb-1" style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
        <ButterflyIcon size={24} style={{ color: "#3f7ea6", animation: "floatSlow 6s ease-in-out infinite" }} />
        <h1 className="text-2xl font-bold tracking-tight">Regina Caeli Academy</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#5c6b52", animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 80ms both" }}>
        6th Grade Lead + Music 3-4 — {rcaSchedule.center}
      </p>

      <Reveal><RcaDashboard /></Reveal>

      <div
        className="rounded-2xl p-5 mb-8"
        style={{
          background: "rgba(251,248,240,0.75)",
          border: "1px solid #d9e4d3",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px -12px rgba(63,126,166,0.25)",
          animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 140ms both",
        }}
      >
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
          <SkyIcon size={16} />
          Weekly schedule
        </h2>
        {next.kind === "event" ? (
          <>
            <div
              className="rounded-xl px-3 py-2 mb-2"
              style={{ background: next.isToday ? "rgba(201,132,58,0.15)" : "rgba(63,126,166,0.1)", border: `1px solid ${next.isToday ? "rgba(201,132,58,0.35)" : "rgba(63,126,166,0.25)"}` }}
            >
              <p className="text-sm font-semibold" style={{ color: next.isToday ? "#8a6a2e" : "#2f5e7a" }}>
                {next.isToday ? "Today" : nextLabel}: {next.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#5c6b52" }}>{next.time}</p>
              <p className="text-xs mt-1" style={{ color: "#5c6b52" }}>{next.detail}</p>
            </div>
            <p className="text-xs" style={{ color: "#8a9a7c" }}>
              Not a normal teaching day — this is training/setup week. Real classes start {new Date(rcaSchedule.termStart + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}, the regular <strong>Monday &amp; Thursday</strong> pattern kicks in from there.
            </p>
          </>
        ) : (
          <p className="text-sm" style={{ color: "#3a4a34" }}>
            <strong>Monday &amp; Thursday</strong> are the deadlines — the only two days actually on campus.
            {" "}{rcaSchedule.startTime} – {rcaSchedule.endTime}.
          </p>
        )}
        {next.kind === "teaching" && (
          <p className="text-sm mt-1.5 font-semibold" style={{ color: "#2f5e7a" }}>
            {next.isToday ? "Today's the day" : "Next teaching day"}: {nextLabel}
          </p>
        )}
        <p className="text-xs mt-1" style={{ color: "#8a9a7c" }}>{rcaSchedule.address}</p>
        <p className="text-xs mt-2" style={{ color: "#8a9a7c" }}>
          Term: {rcaSchedule.termStart} – {rcaSchedule.termEnd}. Per-class block times aren&apos;t set yet.
        </p>
      </div>

      <SectionHeader icon={<LeafIcon size={15} />} label="Academic" sublabel="6th grade" />
      <div className="grid gap-2.5 mb-8">
        {academic.map((c, i) => (
          <Reveal key={c.id} delay={i * 60}>
            <ClassCard id={c.id} name={c.name} summary={c.summary} hasContent={c.id in rcaContent} />
          </Reveal>
        ))}
      </div>

      <SectionHeader icon={<LeafIcon size={15} />} label="Specials" sublabel="beyond the core" />
      <div className="grid gap-2.5 mb-8">
        {specials.map((c, i) => (
          <Reveal key={c.id} delay={i * 60}>
            <ClassCard id={c.id} name={c.name} summary={c.summary} hasContent={c.id in rcaContent} />
          </Reveal>
        ))}
      </div>

      <Reveal><RcaReviewPicker /></Reveal>

      <Reveal>
        <a
          href={gradingGuidelinesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline"
          style={{ color: "#3f7ea6" }}
        >
          RCA Lower School Tutor Guidelines (grading, all subjects) →
        </a>
      </Reveal>
    </div>
    </div>
  );
}

function SectionHeader({ icon, label, sublabel }: { icon: React.ReactNode; label: string; sublabel: string }) {
  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-3 mt-2">
        <span
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 30, height: 30, background: "rgba(107,142,90,0.18)", color: "#4f6a41", border: "1px solid rgba(107,142,90,0.3)" }}
        >
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-bold tracking-tight" style={{ color: "#33402c" }}>{label}</h2>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: "#8a9a7c" }}>{sublabel}</p>
        </div>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(107,142,90,0.35), transparent)" }} />
      </div>
    </Reveal>
  );
}

function ClassCard({ id, name, summary, hasContent }: { id: string; name: string; summary: string; hasContent: boolean }) {
  return (
    <Link
      href={`/rca/${id}`}
      className="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(251,248,240,0.7)",
        border: "1px solid #d9e4d3",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 16px -8px rgba(63,126,166,0.15)",
      }}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: "#33402c" }}>{name}</span>
          {hasContent && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide" style={{ background: "#e6f0dd", color: "#5a7a4a" }}>
              Lesson viewer
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#8a9a7c" }}>{summary}</p>
      </div>
      <span className="text-base opacity-40 group-hover:opacity-90 group-hover:translate-x-1 transition-all duration-300" style={{ color: "#3f7ea6" }}>→</span>
    </Link>
  );
}
