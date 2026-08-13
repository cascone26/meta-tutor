import Link from "next/link";
import { rcaClasses, rcaSchedule, gradingGuidelinesUrl, getNextScheduleItem } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import {
  SkyIcon, LeafIcon, ButterflyIcon, BirdIcon,
  CloudDoodle, TreeDoodle, FlowerDoodle, TulipDoodle, DaisyDoodle, BugDoodle, AntHillDoodle, AntDoodle, PondDoodle, GroundLineDoodle,
  BushDoodle, RockDoodle, GrassTuftDoodle, ReedDoodle, PathDoodle, TwigDoodle,
} from "@/components/rca/NatureIcons";
import Reveal from "@/components/Reveal";
import RcaDashboard from "@/components/rca/RcaDashboard";
import RcaReviewPicker from "@/components/rca/RcaReviewPicker";
import DailyVerse from "@/components/rca/DailyVerse";

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
        6th Grade Lead Tutor
      </p>

      <Reveal><DailyVerse /></Reveal>
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
            {next.isToday ? "Today's the day" : "Next work day"}: {nextLabel}
          </p>
        )}
        <p className="text-xs mt-1" style={{ color: "#8a9a7c" }}>{rcaSchedule.address}</p>
        <p className="text-xs mt-2" style={{ color: "#8a9a7c" }}>
          Term: {rcaSchedule.termStart} – {rcaSchedule.termEnd}. Block times below are real (KSC staff schedule, printed 2026-08-13).
        </p>
      </div>

      <SectionHeader icon={<LeafIcon size={15} />} label="Academic" sublabel="6th grade" />
      <div className="grid gap-2.5 mb-8">
        {academic.map((c, i) => (
          <Reveal key={c.id} delay={i * 60}>
            <ClassCard id={c.id} name={c.name} summary={c.summary} hasContent={c.id in rcaContent} block={c.block} room={c.room} days={c.days} />
          </Reveal>
        ))}
      </div>

      <SectionHeader icon={<LeafIcon size={15} />} label="Specials" sublabel="beyond the core" />
      <div className="grid gap-2.5 mb-8">
        {specials.map((c, i) => (
          <Reveal key={c.id} delay={i * 60}>
            <ClassCard id={c.id} name={c.name} summary={c.summary} hasContent={c.id in rcaContent} block={c.block} room={c.room} days={c.days} />
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
      {/* Spans the FULL width now, not a centered content-width column — capping
          it earlier was meant to fix "sparse/scattered on a wide monitor," but
          it just relocated the problem into two large dead margins on either
          side of an island. The real fix for sparseness is density (the path,
          clusters, and repeated grass below all now scale with the actual
          container width), not artificially narrowing the canvas. */}
      <div className="relative" style={{ width: "100%", height: "100%" }}>
        {/* A soft, wide, low-contrast patch of warmer ground tying the whole
            cluster together as "one patch of garden" instead of a scatter of
            individually-shadowed objects on a flat color field. */}
        <div className="absolute rounded-full" style={{ top: "20%", left: "0%", width: "94%", height: "85%", background: "radial-gradient(ellipse, rgba(140,120,60,0.1) 0%, transparent 70%)" }} />

        <GroundLineDoodle className="absolute" style={{ top: "12%", left: 0, width: "100%", height: 18, color: "#6b8e5a", opacity: 0.4 }} />

        {/* A winding dirt path — the connective tissue the whole scene was
            missing. Every element used to be independently positioned by
            percentage math with nothing actually tying them together; this
            gives the eye one line to follow through the garden, and gives the
            ant trail (below) a real reason to exist instead of being its own
            disconnected smear mark. Full-width now via CSS width:100% instead
            of a fixed px size, so it actually spans edge to edge regardless
            of monitor width. */}
        <PathDoodle className="absolute" style={{ top: "66%", left: 0, width: "100%", height: 90 }} />

        {/* Back row — bushes are placed TOUCHING the pond and tree behind them
            (not floating alone in empty space, the earlier attempt), smaller
            and more muted, a real near/far depth cue instead of everything on
            one baseline. */}
        {/* A genuine atmospheric-perspective cue, not just smaller/higher: a
            slight blur + lower opacity so these actually read as further
            away, the way real distance haze desaturates and softens things. */}
        <div className="absolute rounded-full" style={{ top: "28%", left: "0%", width: 56, height: 11, background: "radial-gradient(ellipse, rgba(20,30,10,0.32) 0%, transparent 72%)", filter: "blur(1.2px)" }} />
        <BushDoodle size={58} className="absolute" style={{ top: "20%", left: "0%", color: "#4f6a41", opacity: 0.5, filter: "blur(0.5px)" }} />
        <div className="absolute rounded-full" style={{ top: "24%", right: "22%", width: 50, height: 10, background: "radial-gradient(ellipse, rgba(20,30,10,0.32) 0%, transparent 72%)", filter: "blur(1.2px)" }} />
        <BushDoodle size={54} className="absolute" style={{ top: "16%", right: "23%", color: "#5a7a4a", opacity: 0.48, filter: "blur(0.5px)" }} />
        {/* A third distant bush, further right — the old back row only had
            two anchors near the pond/tree; with the scene now full-width
            there's real space past the tree that needs its own depth layer,
            not just empty gradient. */}
        <div className="absolute rounded-full" style={{ top: "30%", right: "2%", width: 42, height: 9, background: "radial-gradient(ellipse, rgba(20,30,10,0.28) 0%, transparent 72%)", filter: "blur(1.2px)" }} />
        <BushDoodle size={46} className="absolute" style={{ top: "22%", right: "2%", color: "#4f6a41", opacity: 0.4, filter: "blur(0.7px)" }} />

        {/* Pond — tight, precisely-fitted shadow (not a wide blurry bar) plus
            reeds clustered at its back-right edge, the single most
            recognizable "this is a pond" cue in garden illustration. Shadow
            opacity/blur were correctly POSITIONED (verified flush to the
            pond's actual bottom edge) but too faint to actually read as a
            shadow at real viewing scale — measured only ~21pt RGB contrast
            against nearby background, well under the ~60-90pt that reads
            clearly. Roughly doubled the opacity and cut blur across every
            shadow in this scene to fix that. */}
        <div className="absolute rounded-full" style={{ top: "52%", left: "8%", width: 118, height: 16, background: "radial-gradient(ellipse, rgba(15,30,38,0.38) 0%, transparent 72%)", filter: "blur(1.5px)" }} />
        <PondDoodle
          size={150}
          className="absolute"
          style={{ top: "32%", left: "6%", color: "#3f7ea6", opacity: 0.85 }}
        />
        <ReedDoodle size={34} className="absolute" style={{ top: "24%", left: "23%", color: "#5a7a4a", opacity: 0.8 }} />
        <ReedDoodle size={28} className="absolute" style={{ top: "27%", left: "27%", color: "#4f6a41", opacity: 0.75 }} />

        {/* Pebbles at the pond's front edge — a material change (flat grey-
            brown, no green) so the scene isn't 100% foliage. */}
        <RockDoodle size={32} className="absolute" style={{ top: "52%", left: "11%", opacity: 0.75 }} />

        <div className="absolute rounded-full" style={{ top: "43%", right: "9%", width: 96, height: 15, background: "radial-gradient(ellipse, rgba(20,30,10,0.38) 0%, transparent 72%)", filter: "blur(1.5px)" }} />
        <TreeDoodle
          size={130}
          className="absolute"
          style={{ top: "10%", right: "6%", color: "#4f6a41", opacity: 0.9, animation: "sway 7s ease-in-out infinite", transformOrigin: "bottom center" }}
        />

        {/* Front-row grass texture along the very base of the scene, below
            the path — the actual ground SURFACE, not icons on a bare
            gradient. Each gets a very subtle sway so the whole base feels
            alive without any single blade reading as "waving." */}
        {[
          { left: "1%", size: 20, color: "#5a7a4a", d: "3.2s" },
          { left: "9%", size: 18, color: "#6b8e5a", d: "3.5s" },
          { left: "17%", size: 24, color: "#6b8e5a", d: "3.6s" },
          { left: "24%", size: 18, color: "#5a7a4a", d: "3.3s" },
          { left: "34%", size: 18, color: "#5a7a4a", d: "3s" },
          { left: "40%", size: 22, color: "#6b8e5a", d: "3.7s" },
          { left: "48%", size: 22, color: "#6b8e5a", d: "3.4s" },
          { left: "53%", size: 18, color: "#5a7a4a", d: "3.9s" },
          { left: "58%", size: 18, color: "#5a7a4a", d: "3.8s" },
          { left: "63%", size: 20, color: "#6b8e5a", d: "3.2s" },
          { left: "67%", size: 24, color: "#6b8e5a", d: "3.1s" },
          { left: "74%", size: 18, color: "#5a7a4a", d: "3.6s" },
          { left: "80%", size: 20, color: "#5a7a4a", d: "3.5s" },
          { left: "86%", size: 22, color: "#6b8e5a", d: "3.9s" },
          { left: "90%", size: 22, color: "#6b8e5a", d: "3.3s" },
          { left: "94%", size: 18, color: "#5a7a4a", d: "3.4s" },
          { left: "98%", size: 18, color: "#5a7a4a", d: "3.7s" },
        ].map((g, i) => (
          <GrassTuftDoodle
            key={i}
            size={g.size}
            className="absolute"
            style={{ top: "90%", left: g.left, color: g.color, opacity: 0.6, animation: `sway ${g.d} ease-in-out infinite`, transformOrigin: "bottom center" }}
          />
        ))}

        {/* Flower CLUSTERS, not single evenly-spaced stems — real flower beds
            clump. Three clusters of 2 (near the ant hill / mid-path / by the
            tree) instead of five isolated singles spread across the width. */}
        {([
          // Cluster A — by the ant hill
          { Shape: DaisyDoodle, size: 36, top: "50%", left: "44%", color: "#5a7a4a", d: "5.5s", delay: "0.6s" },
          { Shape: TulipDoodle, size: 26, top: "58%", left: "48%", color: "#c9843a", d: "4.6s", delay: "0.2s" },
          // Cluster B — mid-path
          { Shape: FlowerDoodle, size: 32, top: "44%", left: "56%", color: "#3f7ea6", d: "5s", delay: "0.5s" },
          { Shape: TulipDoodle, size: 24, top: "52%", left: "59%", color: "#c9843a", d: "4.3s", delay: "0.4s" },
          // Cluster C — approaching the tree
          { Shape: FlowerDoodle, size: 34, top: "42%", left: "70%", color: "#7a5a8a", d: "4.8s", delay: "0.7s" },
          { Shape: DaisyDoodle, size: 24, top: "50%", left: "73%", color: "#5a7a4a", d: "5.2s", delay: "0.1s" },
          // Cluster D — past the tree, filling the width that opened up once
          // the scene went full-width instead of a centered 760px column.
          { Shape: TulipDoodle, size: 28, top: "48%", left: "84%", color: "#7a5a8a", d: "5.1s", delay: "0.3s" },
          { Shape: DaisyDoodle, size: 22, top: "56%", left: "87%", color: "#c9843a", d: "4.4s", delay: "0.5s" },
        ] as { Shape: typeof FlowerDoodle; size: number; top: string; left: string; color: string; d: string; delay: string }[]).map((f, i) => (
          <div key={i}>
            <div
              className="absolute rounded-full"
              style={{
                // All flower shapes share a 24x32 viewBox (height =
                // size*1.333) — the old *0.95 multiplier undershot the
                // actual bottom edge by ~29% of size, so these shadows sat
                // visibly above the bloom instead of under it.
                top: `calc(${f.top} + ${f.size * 1.2}px)`,
                left: `calc(${f.left} + ${f.size * 0.22}px)`,
                width: f.size * 0.55, height: f.size * 0.16,
                background: "radial-gradient(ellipse, rgba(20,30,10,0.4) 0%, transparent 72%)",
                filter: "blur(1.2px)",
              }}
            />
            <f.Shape
              size={f.size}
              className="absolute"
              style={{
                top: f.top, left: f.left, color: f.color, opacity: 0.85,
                animation: `sway ${f.d} ease-in-out infinite ${f.delay}`, transformOrigin: "bottom center",
              }}
            />
          </div>
        ))}

        {/* Ladybugs — GENUINE crawling now (crawlLoop: real translateX travel
            with a turn-around flip at each end), not a vertical bob. Shadows
            recomputed to sit flush with each bug's actual bottom edge (size,
            not an eyeballed offset) — they were sitting 4-5% below where the
            bug actually is, reading as a disconnected smudge. */}
        <BugDoodle size={18} className="absolute" style={{ top: "62%", left: "42%", color: "#a04a4a", opacity: 0.85, animation: "crawlLoop 6s ease-in-out infinite", ["--crawl-dist" as string]: "46px" }} />
        <div className="absolute rounded-full" style={{ top: "66%", left: "43%", width: 20, height: 5, background: "radial-gradient(ellipse, rgba(20,30,10,0.48) 0%, transparent 72%)", filter: "blur(0.8px)", animation: "crawlLoop 6s ease-in-out infinite", ["--crawl-dist" as string]: "46px" }} />
        <BugDoodle size={14} className="absolute" style={{ top: "56%", left: "57%", color: "#5a7a4a", opacity: 0.8, animation: "crawlLoop 7s ease-in-out infinite 0.6s", ["--crawl-dist" as string]: "36px" }} />
        <div className="absolute rounded-full" style={{ top: "59.5%", left: "57.5%", width: 15, height: 4, background: "radial-gradient(ellipse, rgba(20,30,10,0.44) 0%, transparent 72%)", filter: "blur(0.8px)", animation: "crawlLoop 7s ease-in-out infinite 0.6s", ["--crawl-dist" as string]: "36px" }} />

        {/* Ant hill — a double-file marching trail. Motion is now GENUINE
            small-scale crawling (antCrawl: real translateX + turn-flip) in
            place of the old antScurry (a scale pulse that never actually
            moved — which is exactly why it read as "in place," not marching).
            Shadow moved up to the mound's actual bottom edge (was 6% below
            it, floating free). */}
        <div className="absolute rounded-full" style={{ top: "57%", left: "22%", width: 90, height: 14, background: "radial-gradient(ellipse, rgba(20,30,10,0.4) 0%, transparent 72%)", filter: "blur(1.2px)" }} />
        <AntHillDoodle size={88} className="absolute" style={{ top: "42%", left: "23%", color: "#8a6a3a", opacity: 0.85 }} />
        {/* Debris scattered near the hill so it reads as an actual patch of
            ground the colony lives on, not a bare mound on clean gradient. */}
        <TwigDoodle size={30} className="absolute" style={{ top: "68%", left: "34%", opacity: 0.7, transform: "rotate(-8deg)" }} />
        <TwigDoodle size={22} className="absolute" style={{ top: "58%", left: "18%", opacity: 0.6, transform: "rotate(20deg) scaleX(-1)" }} />
        {[
          { left: "25%", top: "60%", d: 0 },
          { left: "27%", top: "62%", d: 0.05 },
          { left: "29%", top: "63.5%", d: 0.1 },
          { left: "31%", top: "64.5%", d: 0.15 },
          { left: "33%", top: "65%", d: 0.2 },
          { left: "35%", top: "64.5%", d: 0.25 },
          { left: "37%", top: "63.5%", d: 0.3 },
          { left: "39%", top: "62%", d: 0.35 },
          { left: "41%", top: "60.5%", d: 0.4 },
          { left: "43%", top: "59%", d: 0.45 },
          { left: "45%", top: "58%", d: 0.5 },
        ].map((a) => (
          <AntDoodle
            key={a.left}
            size={10}
            className="absolute"
            style={{ top: a.top, left: a.left, color: "#4a2f14", opacity: 0.75, animation: `antCrawl ${1.4 + a.d}s ease-in-out infinite ${a.d}s`, ["--crawl-dist" as string]: "8px" }}
          />
        ))}
        {[
          { left: "24%", top: "67%", d: 0.1 },
          { left: "28%", top: "68.5%", d: 0.25 },
          { left: "32.5%", top: "69%", d: 0.4 },
        ].map((a) => (
          <AntDoodle
            key={a.left}
            size={9}
            className="absolute"
            style={{ top: a.top, left: a.left, color: "#4a2f14", opacity: 0.65, animation: `antCrawl ${1.6 + a.d}s ease-in-out infinite ${a.d}s`, ["--crawl-dist" as string]: "-7px" }}
          />
        ))}

        {/* Foreground blur — two oversized, soft-focus, edge-cropped foliage
            shapes at the very front of the scene. This is the actual biggest
            lever for "real depth" in a flat illustration: something close and
            slightly out of focus in the extreme foreground is what a camera
            with shallow depth of field does, and it's the strongest possible
            cue that everything else is further back — much stronger than
            spacing/shadows/scale alone, which is all the previous rounds
            tried. Painted last so it renders on top of everything. */}
        <BushDoodle
          size={220}
          className="absolute pointer-events-none"
          style={{ top: "82%", left: "-6%", color: "#3f5a34", opacity: 0.55, filter: "blur(5px)" }}
        />
        <BushDoodle
          size={190}
          className="absolute pointer-events-none"
          style={{ top: "85%", right: "-5%", color: "#3f5a34", opacity: 0.5, filter: "blur(5px)" }}
        />
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

function ClassCard({
  id, name, summary, hasContent, block, room, days,
}: {
  id: string; name: string; summary: string; hasContent: boolean;
  block?: string; room?: string; days?: readonly string[];
}) {
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: "#33402c" }}>{name}</span>
          {hasContent && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide" style={{ background: "#e6f0dd", color: "#5a7a4a" }}>
              Lesson viewer
            </span>
          )}
          {(block || room) && (
            <span className="text-[10px]" style={{ color: "#3f7ea6" }}>
              {(days ?? ["Monday", "Thursday"]).map((d) => d.slice(0, 3)).join("/")}{block ? ` ${block}` : ""}{room ? ` · ${room}` : ""}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#8a9a7c" }}>{summary}</p>
      </div>
      <span className="text-base opacity-40 group-hover:opacity-90 group-hover:translate-x-1 transition-all duration-300" style={{ color: "#3f7ea6" }}>→</span>
    </Link>
  );
}
