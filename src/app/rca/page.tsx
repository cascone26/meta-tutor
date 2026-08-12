import Link from "next/link";
import { rcaClasses, rcaSchedule, gradingGuidelinesUrl, getNextScheduleItem } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import {
  SkyIcon, LeafIcon, ButterflyIcon, BirdIcon,
  CloudDoodle, TreeDoodle, FlowerDoodle, TulipDoodle, DaisyDoodle, BugDoodle, AntHillDoodle, AntDoodle, PondDoodle, GroundLineDoodle, TrailDoodle,
  BushDoodle, RockDoodle, GrassTuftDoodle,
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

  // Ground-scene layout constants — used by both the JSX below and by the
  // verification harness (scripts/verify-scene.mjs) reasoning about expected
  // geometry, so keep numbers here rather than scattered magic strings.
  const GROUND_HEIGHT = 380;
  const SKY_HEIGHT = 1100;

  return (
    <div className="relative">
      {/* Sky + middle band — a FIXED-HEIGHT container (not 100%/full-page), so
          the top:% positions of everything inside it are always measured
          against this one constant regardless of how many class cards render
          below. This is the fix for the old bug: clouds/birds/butterflies used
          to be absolute against the page's OWN total height (which grows with
          every card), which is exactly why ground-zone doodles were landing in
          the middle of the card list on a real content-length page instead of
          the isolated short mockups they were tuned against. This band sits
          behind the content (z-index below the z-[1] content column) so cards
          always paint on top and nothing can visually intrude on card text. */}
      <div aria-hidden data-scene-zone="sky" className="hidden md:block absolute inset-x-0 top-0 pointer-events-none overflow-hidden" style={{ height: SKY_HEIGHT, zIndex: 0 }}>
        <CloudDoodle size={90} className="absolute" style={{ top: "1%", left: "3%", color: "#ffffff", opacity: 0.85, animation: "drift 34s linear infinite" }} />
        <CloudDoodle size={64} className="absolute" style={{ top: "3.5%", right: "5%", color: "#ffffff", opacity: 0.75, animation: "drift 42s linear infinite reverse" }} />
        <CloudDoodle size={48} className="absolute" style={{ top: "7%", left: "14%", color: "#ffffff", opacity: 0.6, animation: "drift 38s linear infinite" }} />
        <BirdIcon size={18} className="absolute" style={{ top: "2.5%", left: "20%", color: "#2f5e7a", opacity: 0.6, animation: "wander1 9s ease-in-out infinite" }} />
        <BirdIcon size={14} className="absolute" style={{ top: "5%", left: "24%", color: "#2f5e7a", opacity: 0.5, animation: "wander2 11s ease-in-out infinite 0.8s" }} />
        <BirdIcon size={16} className="absolute" style={{ top: "3%", right: "16%", color: "#4a7a8a", opacity: 0.55, animation: "wander3 10s ease-in-out infinite 0.3s", transform: "scaleX(-1)" }} />
        <BirdIcon size={12} className="absolute" style={{ top: "10%", right: "28%", color: "#5a7a8a", opacity: 0.45, animation: "wander1 13s ease-in-out infinite 1.5s" }} />

        {/* Butterflies — spread through the rest of this same fixed band, so
            "the middle zone" is a real, bounded stretch of the page instead
            of a percentage of unknown total length. */}
        <ButterflyIcon size={26} className="absolute" style={{ top: "26%", right: "3%", color: "#7a5a8a", opacity: 0.55, animation: "wander1 8s ease-in-out infinite" }} />
        <ButterflyIcon size={20} className="absolute" style={{ top: "38%", left: "2%", color: "#c9843a", opacity: 0.5, animation: "wander2 10s ease-in-out infinite 0.6s" }} />
        <ButterflyIcon size={18} className="absolute" style={{ top: "60%", left: "5%", color: "#3f7ea6", opacity: 0.5, animation: "wander2 9s ease-in-out infinite 1.1s" }} />
        <ButterflyIcon size={16} className="absolute" style={{ top: "18%", left: "40%", color: "#c9843a", opacity: 0.4, animation: "wander3 11s ease-in-out infinite 0.4s" }} />
      </div>

    <div className="max-w-2xl mx-auto px-5 py-8 pb-0 relative z-[1]">
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

      {/* Ground scene — a real block placed AFTER all real content, in normal
          document flow, with its OWN fixed height. This is the other half of
          the positioning fix above: since this sits after the last card
          instead of floating at top:X% of the whole page, it always renders
          at the true bottom, and can never land in the middle of the card
          list no matter how many classes/dashboard widgets are above it. */}
      <div data-scene-zone="ground" className="hidden md:block relative pointer-events-none" style={{ height: GROUND_HEIGHT }}>
      {/* Everything below lives inside a width-CAPPED inner wrapper, not the
          full browser width. Left/right percentages are relative to this
          wrapper, so on a wide monitor the same numbers that read as a tight,
          composed little garden on a laptop don't get stretched into a thin
          strip of icons scattered across huge dead gaps — the actual bug
          behind "looks sparse/disconnected" once the positioning-vs-page-
          height bug was fixed and this rendered at real desktop width for
          the first time. Capped to roughly the content column's width. */}
      <div className="relative mx-auto" style={{ maxWidth: 760, height: "100%" }}>
        {/* A soft, wide, low-contrast patch of warmer ground tying the whole
            cluster together as "one patch of garden" instead of a scatter of
            individually-shadowed objects on a flat color field. */}
        <div className="absolute rounded-full" style={{ top: "20%", left: "0%", width: "88%", height: "85%", background: "radial-gradient(ellipse, rgba(140,120,60,0.1) 0%, transparent 70%)" }} />

        <GroundLineDoodle size={340} className="absolute" style={{ top: "18%", left: "0%", color: "#6b8e5a", opacity: 0.4 }} />

        {/* Contact shadows — a soft blurred dark ellipse under each grounded
            element's actual base, sized to its footprint. This is what makes
            something read as "sitting on the ground" instead of "floating in
            front of the ground" — drop-shadow alone (the previous attempt)
            casts a shadow from the shape's silhouette, which doesn't work for
            an already-flat/thin doodle like the pond outline. A separate
            blurred ellipse at the base does. */}
        <div className="absolute rounded-full" style={{ top: "58%", left: "5%", width: 132, height: 22, background: "radial-gradient(ellipse, rgba(20,40,50,0.22) 0%, transparent 75%)", filter: "blur(3px)" }} />
        <div className="absolute rounded-full" style={{ top: "70%", right: "7%", width: 110, height: 20, background: "radial-gradient(ellipse, rgba(20,30,10,0.28) 0%, transparent 75%)", filter: "blur(3px)" }} />
        <div className="absolute rounded-full" style={{ top: "76%", left: "15%", width: 84, height: 16, background: "radial-gradient(ellipse, rgba(20,30,10,0.26) 0%, transparent 75%)", filter: "blur(2.5px)" }} />

        {/* Back row — bushes sit higher/smaller than the pond/tree/flowers in
            front of them, a cheap but real depth cue (further-back things are
            higher in frame and slightly smaller/more muted), not just more
            stuff crammed onto one baseline. */}
        <div className="absolute rounded-full" style={{ top: "44%", left: "0%", width: 78, height: 14, background: "radial-gradient(ellipse, rgba(20,30,10,0.2) 0%, transparent 75%)", filter: "blur(2.5px)" }} />
        <BushDoodle size={72} className="absolute" style={{ top: "24%", left: "0%", color: "#4f6a41", opacity: 0.65 }} />
        <div className="absolute rounded-full" style={{ top: "48%", right: "31%", width: 68, height: 13, background: "radial-gradient(ellipse, rgba(20,30,10,0.2) 0%, transparent 75%)", filter: "blur(2.5px)" }} />
        <BushDoodle size={64} className="absolute" style={{ top: "28%", right: "30%", color: "#5a7a4a", opacity: 0.6 }} />

        <PondDoodle
          size={150}
          className="absolute"
          style={{ top: "36%", left: "6%", color: "#3f7ea6", opacity: 0.85 }}
        />

        {/* Pebbles at the pond's edge — a small material change (flat grey-
            brown, no green) so the scene isn't 100% foliage, and it visually
            anchors the pond's near edge to solid ground. */}
        <RockDoodle size={34} className="absolute" style={{ top: "58%", left: "13%", opacity: 0.75 }} />

        <TreeDoodle
          size={130}
          className="absolute"
          style={{ top: "16%", right: "6%", color: "#4f6a41", opacity: 0.9, animation: "sway 7s ease-in-out infinite", transformOrigin: "bottom center" }}
        />

        {/* Front-row grass texture along the very base of the scene — the
            actual ground SURFACE, not just icons dropped on a flat gradient. */}
        {[
          { left: "6%", size: 20, color: "#5a7a4a" },
          { left: "16%", size: 24, color: "#6b8e5a" },
          { left: "42%", size: 22, color: "#5a7a4a" },
          { left: "54%", size: 18, color: "#6b8e5a" },
          { left: "64%", size: 24, color: "#5a7a4a" },
          { left: "88%", size: 22, color: "#6b8e5a" },
          { left: "96%", size: 20, color: "#5a7a4a" },
        ].map((g, i) => (
          <GrassTuftDoodle key={i} size={g.size} className="absolute" style={{ top: "93%", left: g.left, color: g.color, opacity: 0.6 }} />
        ))}

        {/* Ladybugs — settled near the flowers: a leg-wiggle (built into
            BugDoodle) plus a faint bob reads as "alive and pottering around,"
            not sliding back and forth in place. Each gets the same blurred
            contact-shadow ellipse as the pond/tree/hill — a CSS drop-shadow
            on a thin-stroke outline doesn't read as ground contact, verified
            by an actual render check (the pond looked "floating" with only
            drop-shadow; the ellipse trick is what fixed it). */}
        <BugDoodle size={20} className="absolute" style={{ top: "58%", left: "30%", color: "#a04a4a", opacity: 0.85, animation: "bob 3.4s ease-in-out infinite" }} />
        <div className="absolute rounded-full" style={{ top: "68%", left: "31%", width: 22, height: 6, background: "radial-gradient(ellipse, rgba(20,30,10,0.32) 0%, transparent 75%)", filter: "blur(1.2px)" }} />
        <BugDoodle size={15} className="absolute" style={{ top: "72%", left: "44%", color: "#5a7a4a", opacity: 0.8, animation: "bob 4s ease-in-out infinite 0.6s" }} />
        <div className="absolute rounded-full" style={{ top: "80%", left: "44.5%", width: 16, height: 5, background: "radial-gradient(ellipse, rgba(20,30,10,0.2) 0%, transparent 75%)", filter: "blur(1.5px)" }} />

        {/* Flower bed — each gets a real blurred contact-shadow ellipse at its
            base (not just a CSS drop-shadow, which is too weak on a thin-stroke
            bloom to read as ground contact) so it sits IN the scene, not on
            top of it. */}
        {/* Positions computed against the 760px-max-width container so the
            spacing math is checkable, not eyeballed: pond+ant-hill cluster
            occupies roughly 0-40%, tree occupies roughly 77-94% — these five
            fill the gap between them (38-83%) with clear, calculated gaps
            around the tree's canopy instead of crowding it. Three distinct
            shapes (round bloom / tulip / daisy) instead of one icon repeated
            five times recolored — a real flower bed has shape variety. */}
        {([
          { Shape: DaisyDoodle, size: 40, top: "64%", left: "38%", right: undefined, color: "#5a7a4a", d: "5.5s", delay: "0.6s" },
          { Shape: FlowerDoodle, size: 30, top: "44%", left: "48%", right: undefined, color: "#3f7ea6", d: "5s", delay: "0.5s" },
          { Shape: TulipDoodle, size: 34, top: "58%", left: "60%", right: undefined, color: "#c9843a", d: "4.5s", delay: "0.3s" },
          { Shape: FlowerDoodle, size: 38, top: "46%", left: "70%", right: undefined, color: "#7a5a8a", d: "4.8s", delay: "0.7s" },
          { Shape: TulipDoodle, size: 26, top: "78%", left: "73%", right: undefined, color: "#c9843a", d: "5.3s", delay: "0.2s" },
        ] as { Shape: typeof FlowerDoodle; size: number; top: string; left?: string; right?: string; color: string; d: string; delay: string }[]).map((f, i) => (
          <div key={i}>
            <div
              className="absolute rounded-full"
              style={{
                top: `calc(${f.top} + ${f.size * 0.95}px)`,
                left: f.left ? `calc(${f.left} + ${f.size * 0.22}px)` : undefined,
                right: f.right ? `calc(${f.right} + ${f.size * 0.22}px)` : undefined,
                width: f.size * 0.55, height: f.size * 0.16,
                background: "radial-gradient(ellipse, rgba(20,30,10,0.22) 0%, transparent 75%)",
                filter: "blur(2px)",
              }}
            />
            <f.Shape
              size={f.size}
              className="absolute"
              style={{
                top: f.top, left: f.left, right: f.right, color: f.color, opacity: 0.85,
                animation: `sway ${f.d} ease-in-out infinite ${f.delay}`, transformOrigin: "bottom center",
              }}
            />
          </div>
        ))}

        {/* Ant hill — a double-file marching trail of 12 tiny ants, most heading
            out, a few heading back in. Motion is a staggered scale-twitch
            (antScurry) — a vertical bob read as "waving up and down" once
            actually seen live (the previous fix over-corrected: killing the
            back-and-forth slide by leaving ONLY a single vertical axis of
            motion made that one axis read as flapping, since nothing else
            was happening to contextualize it as a step). A scale pulse has
            no directional read, so it just looks like tiny activity. */}
        <AntHillDoodle size={92} className="absolute" style={{ top: "50%", left: "18%", color: "#8a6a3a", opacity: 0.85 }} />
        <TrailDoodle size={230} className="absolute" style={{ top: "89%", left: "18%", color: "#6b4a2a", opacity: 0.3 }} />
        {[
          { left: "20%", top: "84%", d: 0 },
          { left: "22.2%", top: "86%", d: 0.05 },
          { left: "24.3%", top: "87%", d: 0.1 },
          { left: "26.6%", top: "88%", d: 0.15 },
          { left: "29%", top: "88.5%", d: 0.2 },
          { left: "31.4%", top: "88%", d: 0.25 },
          { left: "33.8%", top: "87%", d: 0.3 },
          { left: "36.2%", top: "86%", d: 0.35 },
          { left: "38.6%", top: "84%", d: 0.4 },
        ].map((a) => (
          <AntDoodle
            key={a.left}
            size={10}
            className="absolute"
            style={{ top: a.top, left: a.left, color: "#4a2f14", opacity: 0.75, animation: `antScurry 1.6s ease-in-out infinite ${a.d * 3}s` }}
          />
        ))}
        {[
          { left: "19%", top: "90%", d: 0.1 },
          { left: "23%", top: "91%", d: 0.25 },
          { left: "27.5%", top: "91.5%", d: 0.4 },
        ].map((a) => (
          <AntDoodle
            key={a.left}
            size={9}
            className="absolute"
            style={{ top: a.top, left: a.left, color: "#4a2f14", opacity: 0.65, transform: "scaleX(-1)", animation: `antScurry 1.6s ease-in-out infinite ${a.d * 3}s` }}
          />
        ))}
      </div>
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
      data-card="true"
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
