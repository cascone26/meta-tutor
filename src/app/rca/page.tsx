import Link from "next/link";
import { rcaClasses, rcaSchedule, gradingGuidelinesUrl, getNextScheduleItem } from "@/lib/rca";
import { rcaContent } from "@/lib/rca-content";
import {
  SkyIcon, LeafIcon, ButterflyIcon, BirdIcon,
  CloudDoodle, TreeDoodle, TreeDoodleB, FlowerDoodle, TulipDoodle, DaisyDoodle, BugDoodle, AntHillDoodle, AntDoodle, PondDoodle,
  BushDoodle, RockDoodle, GrassTuftDoodle, ReedDoodle, PathDoodle, TwigDoodle,
} from "@/components/rca/NatureIcons";
import Reveal from "@/components/Reveal";
import RcaDashboard from "@/components/rca/RcaDashboard";
import RcaReviewPicker from "@/components/rca/RcaReviewPicker";
import DailyVerse from "@/components/rca/DailyVerse";

// Next-teaching-day needs a fresh Date() per request, not baked in at build time.
export const dynamic = "force-dynamic";

// ONE light source for the whole ground scene: the sun sits in the top-right,
// so every cast shadow falls down-and-LEFT at the same angle (Jacob,
// 2026-08-16: "imagine this is a full world. the sun is somewhere in the top
// right, the shadows should be based off of that"). Every drop-shadow in the
// scene used to be hand-typed as `0 Ypx Bpx color` — a straight-down offset,
// which is what you'd get from a sun directly overhead, not top-right. This
// is the one place that encodes where the sun is; every shadow derives from
// it instead of being independently tuned, so the whole scene stays
// physically consistent by construction rather than by coincidence.
const SUN_SHADOW_RATIO = 0.7; // horizontal:vertical — the sun's apparent angle off vertical
function castShadow(dropY: number, blur: number, color: string): string {
  const dropX = -(dropY * SUN_SHADOW_RATIO);
  return `drop-shadow(${dropX}px ${dropY}px ${blur}px ${color})`;
}

// The ground texture used to be a small SVG tile (42px/67px) repeated via CSS
// background-repeat — technically visible now, but Jacob (2026-08-16, after
// directly reviewing a real screenshot) correctly called it out as reading
// like a printed/wallpaper pattern, not grass: every blade in a repeating
// tile has identical length/angle/spacing, and the human eye picks up that
// period instantly no matter how organic each individual blade looks.
// Replaced with a genuinely large field of individually-varied blades (each
// with its own random-ish length/angle/curve/color/opacity), rendered as one
// non-repeating SVG. Needs to be DETERMINISTIC (same value on server render
// and client hydration, or Next.js throws a hydration mismatch) — Math.random()
// can't be used directly, so this is a small seeded PRNG (mulberry32) instead.
function mulberry32(seed: number) {
  let s = seed;
  return function rand() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRASS_FIELD_VB = { w: 1400, h: 380 }; // matches GROUND_HEIGHT below
const GRASS_COLORS = ["#4f6a41", "#5a7a4a", "#6b8e5a", "#456339", "#3f5a34"];

type GrassBlade = { x: number; y: number; angle: number; curve: number; len: number; width: number; color: string; opacity: number };

// Density and richness both bias toward the BOTTOM of the field (y near h =
// "close to the viewer"), sparser/paler toward the top ("further away") —
// this single generator does double duty for texture (fix #1) AND
// atmospheric depth-via-density (part of fix #3), rather than being two
// separate, disconnected systems.
// Depth gradient made deliberately more dramatic (Jacob, 2026-08-16: "try
// more depth and maybe busier at the foreground/bottom and a tab more
// sparse/smaller near the higher side to rly show the depth and perception
// of being close"). A power curve (exponent > 1) instead of the old linear
// depthT scaling — that keeps the TOP genuinely sparse/tiny/faint for longer
// (most of the upper half stays thin) while the BOTTOM ramps up fast, which
// reads as real perspective; a straight linear ramp looks more like a slow,
// even fade than a "close vs. far" contrast.
function generateGrassField(count: number, seed: number): GrassBlade[] {
  const rand = mulberry32(seed);
  const blades: GrassBlade[] = [];
  for (let i = 0; i < count; i++) {
    const y = rand() * GRASS_FIELD_VB.h;
    const depthT = y / GRASS_FIELD_VB.h; // 0 = far/top, 1 = near/bottom
    const depthP = Math.pow(depthT, 1.7); // steeper falloff toward the top
    // Survival probability itself now follows the curve — top ~8% density,
    // bottom effectively always survives, instead of only thinning the top
    // third at a flat rate.
    if (rand() > 0.08 + depthP * 0.92) continue;
    const x = rand() * GRASS_FIELD_VB.w;
    // The pond (top:32%, left:6%, ~150px wide) sits within this field's
    // area, and its water fill is deliberately translucent (0.72 opacity —
    // kept flat/non-glossy on purpose, see PondDoodle). A blade rendering
    // behind that translucent fill still shows through faintly as an odd
    // line cutting across the water (caught in the 2026-08-16 picky review
    // — confirmed via DOM query that real GrassField blades' bounding boxes
    // genuinely overlap the pond's, not a rendering illusion). Simplest
    // correct fix: don't generate blades under the pond at all, with a
    // generous margin, rather than patching it with more pond opacity
    // (which would undo the deliberate flat/non-glossy water look).
    if (x > 40 && x < 290 && y > 100 && y < 215) continue;
    const angle = (rand() - 0.5) * 34; // degrees off vertical
    const curve = (rand() - 0.5) * 9;
    const len = 2 + Math.pow(depthT, 1.4) * 21 + rand() * 4; // tiny far, big near
    const width = 0.5 + Math.pow(depthT, 1.3) * 1.7 + rand() * 0.3;
    const color = GRASS_COLORS[Math.floor(rand() * GRASS_COLORS.length)];
    const opacity = 0.08 + depthP * 0.55 + rand() * 0.15; // faint far, strong near
    blades.push({ x, y, angle, curve, len, width, color, opacity });
  }
  return blades;
}

function GrassField({ count, seed }: { count: number; seed: number }) {
  const blades = generateGrassField(count, seed);
  return (
    <svg
      aria-hidden
      className="absolute inset-0"
      width="100%"
      height="100%"
      viewBox={`0 0 ${GRASS_FIELD_VB.w} ${GRASS_FIELD_VB.h}`}
      preserveAspectRatio="none"
      style={{ pointerEvents: "none", zIndex: 1 }}
    >
      {blades.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const endX = b.x + b.len * Math.sin(rad);
        const endY = b.y - b.len * Math.cos(rad);
        const ctrlX = b.x + (b.len * 0.5) * Math.sin(rad) + b.curve;
        const ctrlY = b.y - (b.len * 0.5) * Math.cos(rad);
        return (
          <path
            key={i}
            d={`M${b.x.toFixed(1)},${b.y.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`}
            stroke={b.color}
            strokeWidth={b.width}
            strokeOpacity={b.opacity}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

// Real foraging routes for the ant trail (Jacob, 2026-08-16: "a more complex
// system or loop of movement like walking off screen" — replacing the old
// small translateX-oscillation, then again after "like being upsidedown
// when walking back" — see the travelLoop/faceFlip comment in globals.css
// for the full fix). Each is an OPEN curve relative to the ant's own anchor
// (top/left): the travelLoop keyframe walks offset-distance out to 100%
// then back to 0% along the SAME curve (real ants forage out and return by
// roughly the same route), so these don't need to close back to their own
// start the way a true closed loop would. Sizes vary from a tight local
// wander to genuinely long routes that exit the visible ground zone before
// the return leg.
const ANT_PATHS = [
  "path('M0,0 C10,-8 18,2 12,10 C6,16 -4,14 -6,6')",
  "path('M0,0 C25,-10 45,5 60,-5 C78,-16 85,10 95,2')",
  "path('M0,0 C-15,10 -30,22 -22,36 C-14,48 5,42 10,28')",
  "path('M0,0 C-50,-15 -110,-5 -160,-18 C-210,-30 -240,-10 -280,-15')",
  "path('M0,0 C35,-18 70,-8 95,-25 C115,-38 130,-15 150,-5')",
];

// Real depth layering (Jacob, 2026-08-16: "REALLY work on making a depth
// filled scene... the x and y are obv the easy part but the z really needs
// work") — every doodle used to be a plain absolutely-positioned sibling,
// so paint order was pure DOM order, not actual scene depth: an element
// higher up (further away) could render IN FRONT of one lower down (closer)
// just because it happened to come later in the JSX. This is the classic
// 2D "fake depth" fix (Y-sorting / painter's algorithm, same technique
// top-down/isometric games use): z-index derived directly from an element's
// own vertical position, so anything further DOWN the ground zone (closer
// to the viewer) always paints over anything further UP (further away),
// regardless of source order. Applied to every object below via zFor(topPct)
// — the ground texture/wash layers stay fixed at the bottom (z:1) since
// they're the surface everything else sits on, not objects in the scene.
function zFor(topPercent: number): number {
  return Math.max(2, Math.round(topPercent * 10));
}

export default function RcaPage() {
  const academic = rcaClasses.filter((c) => c.area === "Academic");
  const specials = rcaClasses.filter((c) => c.area === "Specials");
  const next = getNextScheduleItem();
  const nextLabel = next.kind === "term-ended" ? "" : next.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

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
      <p className="text-sm mb-4" style={{ color: "#5c6b52", animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) 80ms both" }}>
        6th Grade Lead Tutor
      </p>

      {/* The fast path — a distraction-free, cram-before-work / quick-glance-
          during-work page (Jacob, 2026-08-17). Placed first, above even the
          verse/dashboard, since the whole point is needing almost no time to
          find it. */}
      <Reveal>
        <Link
          href="/rca/today"
          className="flex items-center justify-between rounded-2xl px-4 py-3 mb-3 transition-transform hover:scale-[1.01]"
          style={{ background: "#3f7ea6", color: "#fff", boxShadow: "0 8px 24px -10px rgba(63,126,166,0.5)" }}
        >
          <span className="text-sm font-semibold">Today — quick reference for work</span>
          <span aria-hidden>→</span>
        </Link>
      </Reveal>

      <Reveal>
        <Link
          href="/rca/week"
          className="flex items-center justify-between rounded-2xl px-4 py-3 mb-6 transition-transform hover:scale-[1.01]"
          style={{ background: "rgba(63,126,166,0.1)", color: "#2f5e7a", border: "1px solid rgba(63,126,166,0.25)" }}
        >
          <span className="text-sm font-semibold">Week ahead — plan Sunday night, coming tests/events</span>
          <span aria-hidden>→</span>
        </Link>
      </Reveal>

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
        ) : next.kind === "closure" ? (
          <div
            className="rounded-xl px-3 py-2 mb-2"
            style={{ background: "rgba(63,126,166,0.1)", border: "1px solid rgba(63,126,166,0.25)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "#2f5e7a" }}>
              Today: {next.label} — no class
              {next.estimated && <span className="text-[10px] font-normal ml-1.5" style={{ color: "#c9843a" }}>(estimated, not confirmed)</span>}
            </p>
          </div>
        ) : next.kind === "term-ended" ? (
          <p className="text-sm" style={{ color: "#3a4a34" }}>
            The 2026-2027 term ended {rcaSchedule.termEnd} — no more scheduled class days.
          </p>
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
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={gradingGuidelinesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
            style={{ color: "#3f7ea6" }}
          >
            RCA Lower School Tutor Guidelines (grading, all subjects) →
          </a>
          <Link href="/rca/progress" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            Prep progress →
          </Link>
          <Link href="/rca/changelog" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            What's changed →
          </Link>
          <Link href="/rca/substitute" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            If I'm out →
          </Link>
          <Link href="/rca/pacing-explainer" className="text-xs underline" style={{ color: "#3f7ea6" }}>
            Explain pacing to a parent →
          </Link>
        </div>
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
        {/* Real ground TEXTURE, not just individually-shadowed objects on a
            smooth gradient. Two prior attempts here both failed real direct
            review (2026-08-16, "use viewer and freaking look at everything"
            — Read a real screenshot straight into context via the
            hook-exempted ~/estate/data/renders/ path, not a third-party
            vision model): first an abstract fractal-noise filter (invisible
            at render scale), then a small repeating SVG tile (visible but
            reads as a printed/wallpaper pattern — identical blade length/
            angle/spacing repeating on a grid, which the eye picks up
            instantly). Replaced with GrassField: a genuinely large,
            individually-randomized field of ~350 blades (see the generator
            above castShadow), each with its own length/angle/curve/color,
            non-repeating. Density and richness both bias toward the bottom
            of the field (near/close) vs. the top (far/distant) — the same
            generator does the texture AND a real atmospheric-depth cue at
            once, not two disconnected systems. */}
        {/* Count raised from 340 — the steeper top-thinning curve above
            means far fewer candidates survive near the top now, so a higher
            total attempt count is needed to keep the BOTTOM genuinely dense
            rather than just thinning everything uniformly. */}
        <GrassField count={480} seed={1337} />

        {/* Color-variation patches — real grass isn't one flat tone. Now
            biased by actual position instead of scattered arbitrarily: the
            warm, more saturated patches sit toward the BOTTOM (near/lit),
            the paler cooler patch sits toward the TOP (far/hazy) — this is
            atmospheric perspective, a real depth cue, not just texture
            breakup. First pass (opacity 0.08-0.28, no positional logic) was
            confirmed too weak / not directionally meaningful by direct
            review. */}
        {/* Reinforcing the same near/far gradient as GrassField: the two
            bottom-biased warm patches got richer/more saturated, the two
            top-biased pale patches got fainter — color depth should agree
            with texture/size depth, not fight it. */}
        <div className="absolute rounded-full" style={{ top: "45%", left: "0%", width: "94%", height: "75%", background: "radial-gradient(ellipse, rgba(140,120,60,0.3) 0%, transparent 70%)", zIndex: 1 }} />
        <div className="absolute rounded-full" style={{ top: "-8%", left: "15%", width: "46%", height: "45%", background: "radial-gradient(ellipse, rgba(190,210,170,0.16) 0%, transparent 70%)", zIndex: 1 }} />
        <div className="absolute rounded-full" style={{ top: "50%", right: "2%", width: "50%", height: "65%", background: "radial-gradient(ellipse, rgba(170,195,110,0.36) 0%, transparent 70%)", zIndex: 1 }} />
        <div className="absolute rounded-full" style={{ top: "55%", left: "35%", width: "34%", height: "55%", background: "radial-gradient(ellipse, rgba(70,110,60,0.28) 0%, transparent 70%)", zIndex: 1 }} />
        <div className="absolute rounded-full" style={{ top: "-5%", right: "18%", width: "30%", height: "40%", background: "radial-gradient(ellipse, rgba(200,215,180,0.14) 0%, transparent 70%)", zIndex: 1 }} />

        {/* The old horizon hairline was flagged as an artifact back in the
            2026-08-13 audit ("a thin horizon rule that clashes with the
            soft, lineless illustration style; reads as an artifact") and
            never actually removed — it's the exact kind of mechanical,
            ruler-straight mark that reinforces "flat card with a fold line"
            instead of an organic scene. Removed rather than faded further. */}

        {/* A winding dirt path — the connective tissue the whole scene was
            missing. Every element used to be independently positioned by
            percentage math with nothing actually tying them together; this
            gives the eye one line to follow through the garden, and gives the
            ant trail (below) a real reason to exist instead of being its own
            disconnected smear mark. Full-width now via CSS width:100% instead
            of a fixed px size, so it actually spans edge to edge regardless
            of monitor width. The path's own rounded stroke caps land exactly
            AT the SVG canvas edge (x=0/x=700), so the round cap's own curve
            gets sliced flat by the viewport boundary — a real hard-cut
            artifact, not the soft fade-into-grass a dirt path should have
            (flagged in the original sick-him audit, 2026-08-13). A
            mask-image gradient fades both ends to transparent instead of
            reshaping the SVG geometry — same fix category as everything
            else today: the path is flush WITH the ground, so it should
            blend into it at the edges, not look cut out and dropped on. */}
        <PathDoodle
          className="absolute"
          style={{
            top: "66%", left: 0, width: "100%", height: 90, zIndex: zFor(66),
            maskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          }}
        />

        {/* Back row — bushes are placed TOUCHING the pond and tree behind them
            (not floating alone in empty space, the earlier attempt), smaller
            and more muted, a real near/far depth cue instead of everything on
            one baseline. */}
        {/* A genuine atmospheric-perspective cue, not just smaller/higher: a
            slight blur + lower opacity so these actually read as further
            away, the way real distance haze desaturates and softens things. */}
        {/* Switched every shadow in this scene from a hand-positioned
            sibling div to CSS drop-shadow directly on the object — it
            renders an offset+blurred copy of the element's own actual
            alpha silhouette, so it's physically impossible for it to miss
            or gap; there's no position math left to get wrong. Four rounds
            of increasingly precise sibling-div position math (bounding-box
            centering, getBBox fill-ratio, contact-line centering) all
            checked out in pixel sampling and Jacob still saw a gap in the
            real deployed screenshot every time — this replaces that whole
            approach instead of tuning it a fifth time. */}
        {/* Each back-row position now gets a SECOND, smaller, offset bush
            clustered right against the first — flagged three separate
            reviews running as "still just vague blurry circles, no coherent
            structure." A single blurred BushDoodle is one clean circular
            silhouette; two overlapping at different sizes/offsets breaks
            that into an irregular clump, which is what actually reads as
            "a bit of distant shrubbery" instead of "an abstract blur dot." */}
        {/* Wrapper opacity across every bush here was 0.35-0.5 — used as the
            "distance" cue, but a low element-opacity means the GrassField
            behind it visibly shows through the whole bush, not just a haze
            effect (same root bug as the ant hill, caught in the same
            2026-08-16 review: "make sure stuff isnt like showing through
            the other opaque stuff"). Real distant objects are still 100%
            solid — what changes with distance is blur/color, not literal
            transparency. Raised opacity to near-solid across the board and
            shifted more of the "distance" weight onto blur (bumped) instead. */}
        {/* Shrunk further (was 58/34/54/30/46/26) to sell distance through
            SCALE too, not just blur/color — "a tab more sparse/smaller near
            the higher side" (Jacob, 2026-08-16). */}
        <BushDoodle size={48} className="absolute" style={{ top: "20%", left: "0%", color: "#4f6a41", opacity: 0.88, zIndex: zFor(20), filter: `blur(0.9px) ${castShadow(3, 1.5, "rgba(20,30,10,0.5)")}` }} />
        <BushDoodle size={26} className="absolute" style={{ top: "26%", left: "3.5%", color: "#5a7a4a", opacity: 0.82, zIndex: zFor(26), filter: `blur(1px) ${castShadow(2, 1, "rgba(20,30,10,0.45)")}` }} />
        <BushDoodle size={44} className="absolute" style={{ top: "16%", right: "23%", color: "#5a7a4a", opacity: 0.88, zIndex: zFor(16), filter: `blur(0.9px) ${castShadow(3, 1.5, "rgba(20,30,10,0.5)")}` }} />
        <BushDoodle size={22} className="absolute" style={{ top: "21%", right: "20.5%", color: "#4f6a41", opacity: 0.8, zIndex: zFor(21), filter: `blur(1px) ${castShadow(2, 1, "rgba(20,30,10,0.42)")}` }} />
        {/* A third distant bush, further right — the old back row only had
            two anchors near the pond/tree; with the scene now full-width
            there's real space past the tree that needs its own depth layer,
            not just empty gradient. */}
        <BushDoodle size={38} className="absolute" style={{ top: "22%", right: "2%", color: "#4f6a41", opacity: 0.85, zIndex: zFor(22), filter: `blur(1.1px) ${castShadow(2, 1, "rgba(20,30,10,0.45)")}` }} />
        <BushDoodle size={20} className="absolute" style={{ top: "27%", right: "0%", color: "#5a7a4a", opacity: 0.78, zIndex: zFor(27), filter: `blur(1.2px) ${castShadow(2, 1, "rgba(20,30,10,0.4)")}` }} />
        {/* Two more, tinier still, right at the very top edge — extends the
            sense of the scene actually receding into the distance instead
            of the background bushes being the smallest thing up there. */}
        <BushDoodle size={16} className="absolute" style={{ top: "4%", left: "13%", color: "#7a9070", opacity: 0.6, zIndex: zFor(4), filter: `blur(1.3px) ${castShadow(1.5, 1, "rgba(20,30,10,0.3)")}` }} />
        <BushDoodle size={14} className="absolute" style={{ top: "6%", right: "35%", color: "#7a9070", opacity: 0.55, zIndex: zFor(6), filter: `blur(1.4px) ${castShadow(1.5, 1, "rgba(20,30,10,0.28)")}` }} />
        {/* A fourth, mid-scene — direct review (2026-08-16) found the whole
            middle stretch between the pond/mound cluster and the tree was
            visually dead: the three back-row bushes only sat at the far
            edges (0%, ~77%, ~98%), leaving the entire back/middle band bare
            except for thin flower stems in the front row. This breaks up
            that gap with actual foliage bulk, not just more small stems. */}
        <BushDoodle size={50} className="absolute" style={{ top: "18%", left: "46%", color: "#5a7a4a", opacity: 0.88, zIndex: zFor(18), filter: `blur(0.9px) ${castShadow(3, 1.5, "rgba(20,30,10,0.48)")}` }} />

        {/* Pond — went through several rounds of hand-positioned shadows and
            then a drop-shadow, and EVERY one of them was wrong for a
            different reason than "gap/position": a pond is a depression IN
            the ground, not an object standing ON it. Every other doodle
            here (rock, tree, bushes, reeds, ant hill, bugs) genuinely sits
            above the ground plane and casts a real shadow — a pond doesn't,
            because it IS the ground, just lower and wet (Jacob, 2026-08-16,
            after the drop-shadow version still read as "floating": "ponds
            dont pertrude, theyre in the ground, NOT above"). Any offset
            shadow under it — however well-positioned — reads as a raised
            blob because that's literally what a cast shadow means visually.
            No shadow at all is the correct fix. Depth now comes ENTIRELY
            from the SVG's own darker bank/rim path (drawn behind the water
            fill, in NatureIcons.tsx) — the only honest way to say "recessed"
            instead of "raised." */}
        {/* "the little area around it" (Jacob, 2026-08-16) — a soft, wider,
            mossy-damp wash centered on the pond, so the ground immediately
            surrounding the water reads as a real damp margin instead of dry
            grass butting straight up against a rim line. Same z:1 as the
            other background color washes — sits under everything, purely
            ambient coloring. */}
        <div className="absolute rounded-full" style={{ top: "24%", left: "-3%", width: "34%", height: "56%", background: "radial-gradient(ellipse, rgba(90,110,60,0.16) 0%, transparent 72%)", zIndex: 1 }} />
        <PondDoodle
          size={150}
          className="absolute"
          style={{ top: "32%", left: "6%", color: "#3f7ea6", opacity: 0.85, zIndex: zFor(32) }}
        />
        {/* Reeds/rock were positioned above and to the right of the pond's
            actual bounding box (pond spans top~32-52%, left~6-16%) — nowhere
            close enough to visually belong to it, which is exactly why "the
            area around it" read as generic grass rather than a pond's edge
            (Jacob, 2026-08-16: "make the pond more pond like and the little
            area around it"). Moved to genuinely hug the water: two reeds at
            the back-right rim, a third added on the front-left for balance
            (the old two both sat on the same side), rock nudged right up
            against the front-left edge instead of just "somewhere nearby." */}
        <ReedDoodle size={34} className="absolute" style={{ top: "28%", left: "14%", color: "#5a7a4a", opacity: 0.8, zIndex: zFor(28), filter: castShadow(2, 1, "rgba(20,30,10,0.4)") }} />
        <ReedDoodle size={26} className="absolute" style={{ top: "32%", left: "16.5%", color: "#4f6a41", opacity: 0.75, zIndex: zFor(32), filter: castShadow(2, 1, "rgba(20,30,10,0.4)") }} />
        <ReedDoodle size={22} className="absolute" style={{ top: "38%", left: "2%", color: "#5a7a4a", opacity: 0.7, zIndex: zFor(38), filter: castShadow(1.5, 1, "rgba(20,30,10,0.38)") }} />

        {/* Pebbles right at the pond's edge now (was floating a bit south
            of it in open grass) — a material change (flat grey-brown, no
            green) so the scene isn't 100% foliage. */}
        <RockDoodle size={34} className="absolute" style={{ top: "48%", left: "8%", opacity: 0.96, zIndex: zFor(48), filter: castShadow(1.5, 1, "rgba(20,20,15,0.45)") }} />

        {/* A soft, blurred ambient-occlusion-style blob UNDER the tree, in
            addition to its own drop-shadow — a thin offset silhouette copy
            alone (what castShadow gives every object) reads as correct but
            visually thin for something this large; real illustrations
            usually pair a sharp contact shadow with a soft broad one for
            actual "weight." Positioned at the trunk's real base, biased left
            per the same sun-from-top-right direction as every other shadow. */}
        <div className="absolute rounded-full" style={{ top: "39%", right: "9%", width: 100, height: 28, background: "radial-gradient(ellipse, rgba(20,30,10,0.45) 0%, transparent 75%)", filter: "blur(3px)", zIndex: zFor(39) }} />
        <TreeDoodle
          size={130}
          className="absolute"
          style={{ top: "10%", right: "6%", color: "#4f6a41", opacity: 0.98, zIndex: zFor(10), animation: "sway 7s ease-in-out infinite", transformOrigin: "bottom center", filter: castShadow(5, 2, "rgba(20,30,10,0.55)") }}
        />

        {/* A few more trees, similar-ish but genuinely different (Jacob,
            2026-08-16) — not copies of the same tree at different scales.
            TreeDoodleB is a distinct silhouette (leaning, 5-lobe canopy vs.
            4). Sized/placed to read as real depth, not just "more trees":
            the mid-scene one is smaller + slightly blurred + more muted
            (further back than the hero tree), the small one past it is
            smaller still and paler (furthest), and this also directly
            answers the earlier "dead zone between the flowers and the
            tree" critique — real foliage mass there now, not just grass
            texture filling a gap. */}
        <div className="absolute rounded-full" style={{ top: "34%", left: "58%", width: 46, height: 14, background: "radial-gradient(ellipse, rgba(20,30,10,0.3) 0%, transparent 75%)", filter: "blur(2px)", zIndex: zFor(34) }} />
        {/* Both trees' opacity was carrying their "distance" almost
            entirely (0.68 and 0.45) — enough that grass visibly showed
            through the canopy mass, the same bug as everywhere else in this
            pass. Raised opacity substantially; the "further back" read now
            leans on blur (bumped) and the far tree's already-paler color
            (#8aa085) instead of literal see-through. */}
        <TreeDoodleB
          size={78}
          className="absolute"
          style={{ top: "16%", left: "58%", color: "#5a7a4a", opacity: 0.9, zIndex: zFor(16), animation: "sway 8.5s ease-in-out infinite 0.4s", transformOrigin: "bottom center", filter: `blur(0.7px) ${castShadow(3, 1.5, "rgba(20,30,10,0.4)")}` }}
        />
        <TreeDoodle
          size={42}
          className="absolute"
          style={{ top: "8%", left: "38%", color: "#8aa085", opacity: 0.8, zIndex: zFor(8), animation: "sway 9.5s ease-in-out infinite 1.1s", transformOrigin: "bottom center", filter: `blur(1.2px) ${castShadow(2, 1, "rgba(20,30,10,0.3)")}` }}
        />

        {/* Front-row grass texture along the very base of the scene, below
            the path — the actual ground SURFACE, not icons on a bare
            gradient. Each gets a very subtle sway so the whole base feels
            alive without any single blade reading as "waving." Every blade
            here genuinely stands up off the ground, same as the reeds/
            flowers/bushes elsewhere in the scene — but unlike those, these
            17 instances had NO drop-shadow at all (found 2026-08-16, after
            Jacob: "if its standing, obv there should be a shadow" — this
            was the literal gap that made the whole base read as flat
            cutouts pasted on the gradient instead of a real meadow
            surface). Kept deliberately light (a thin stroke silhouette at
            this size doesn't need a heavy shadow) so it grounds without
            competing with the actual focal objects. */}
        {/* Sizes bumped ~35-45% and opacity raised (was 0.6) — the closest
            row in the scene should read as genuinely close/prominent, not
            the same visual weight as everything else. Also added extra
            in-between instances so the very front edge is the densest band
            in the whole scene, reinforcing "busier at the foreground." */}
        {[
          { left: "1%", size: 28, color: "#5a7a4a", d: "3.2s" },
          { left: "5%", size: 22, color: "#4f6a41", d: "3.4s" },
          { left: "9%", size: 25, color: "#6b8e5a", d: "3.5s" },
          { left: "13%", size: 20, color: "#5a7a4a", d: "3.1s" },
          { left: "17%", size: 32, color: "#6b8e5a", d: "3.6s" },
          { left: "21%", size: 22, color: "#4f6a41", d: "3.8s" },
          { left: "24%", size: 25, color: "#5a7a4a", d: "3.3s" },
          { left: "29%", size: 20, color: "#6b8e5a", d: "3.5s" },
          { left: "34%", size: 25, color: "#5a7a4a", d: "3s" },
          { left: "38%", size: 20, color: "#4f6a41", d: "3.2s" },
          { left: "40%", size: 30, color: "#6b8e5a", d: "3.7s" },
          { left: "44%", size: 22, color: "#5a7a4a", d: "3.9s" },
          { left: "48%", size: 30, color: "#6b8e5a", d: "3.4s" },
          { left: "53%", size: 25, color: "#5a7a4a", d: "3.9s" },
          { left: "58%", size: 24, color: "#5a7a4a", d: "3.8s" },
          { left: "63%", size: 27, color: "#6b8e5a", d: "3.2s" },
          { left: "67%", size: 32, color: "#6b8e5a", d: "3.1s" },
          { left: "71%", size: 20, color: "#4f6a41", d: "3.6s" },
          { left: "74%", size: 25, color: "#5a7a4a", d: "3.6s" },
          { left: "80%", size: 27, color: "#5a7a4a", d: "3.5s" },
          { left: "86%", size: 30, color: "#6b8e5a", d: "3.9s" },
          { left: "90%", size: 30, color: "#6b8e5a", d: "3.3s" },
          { left: "94%", size: 24, color: "#5a7a4a", d: "3.4s" },
          { left: "98%", size: 25, color: "#5a7a4a", d: "3.7s" },
        ].map((g, i) => (
          <GrassTuftDoodle
            key={i}
            size={g.size}
            className="absolute"
            style={{ top: "90%", left: g.left, color: g.color, opacity: 0.78, zIndex: zFor(90), animation: `sway ${g.d} ease-in-out infinite`, transformOrigin: "bottom center", filter: castShadow(1.5, 1, "rgba(20,30,10,0.4)") }}
          />
        ))}

        {/* Flower CLUSTERS, not single evenly-spaced stems — real flower beds
            clump. Three clusters of 2 (near the ant hill / mid-path / by the
            tree) instead of five isolated singles spread across the width. */}
        {([
          // Cluster A — by the ant hill. Daisy was #5a7a4a — the SAME green
          // as the surrounding grass, so it camouflaged into the background
          // instead of reading as a flower (caught in the 2026-08-16 picky
          // review). Real daisies are white/cream petals, not foliage-green.
          { Shape: DaisyDoodle, size: 36, top: "50%", left: "44%", color: "#f0ebd8", d: "5.5s", delay: "0.6s" },
          { Shape: TulipDoodle, size: 26, top: "58%", left: "48%", color: "#c9843a", d: "4.6s", delay: "0.2s" },
          // Cluster B — mid-path
          { Shape: FlowerDoodle, size: 32, top: "44%", left: "56%", color: "#3f7ea6", d: "5s", delay: "0.5s" },
          { Shape: TulipDoodle, size: 24, top: "52%", left: "59%", color: "#c9843a", d: "4.3s", delay: "0.4s" },
          // Cluster C — approaching the tree
          { Shape: FlowerDoodle, size: 34, top: "42%", left: "70%", color: "#7a5a8a", d: "4.8s", delay: "0.7s" },
          // Same camouflage-green issue as Cluster A's daisy — a soft yellow
          // here instead, so the two daisies aren't identical twins either.
          { Shape: DaisyDoodle, size: 24, top: "50%", left: "73%", color: "#e0c968", d: "5.2s", delay: "0.1s" },
          // Cluster D — past the tree, filling the width that opened up once
          // the scene went full-width instead of a centered 760px column.
          { Shape: TulipDoodle, size: 28, top: "48%", left: "84%", color: "#7a5a8a", d: "5.1s", delay: "0.3s" },
          { Shape: DaisyDoodle, size: 22, top: "56%", left: "87%", color: "#c9843a", d: "4.4s", delay: "0.5s" },
        ] as { Shape: typeof FlowerDoodle; size: number; top: string; left: string; color: string; d: string; delay: string }[]).map((f, i) => (
          <f.Shape
            key={i}
            size={f.size}
            className="absolute"
            style={{
              // Wrapper opacity was ALSO 0.85, compounding with the SVG's
              // own internal fillOpacity 0.85 for a real ~0.72 effective
              // opacity — same class of grass-showing-through bug as the
              // ant hill/trees/bushes, just less visually obvious at flower
              // size. Raised so it isn't stacking two layers of translucency.
              top: f.top, left: f.left, color: f.color, opacity: 0.97, zIndex: zFor(parseFloat(f.top)),
              animation: `sway ${f.d} ease-in-out infinite ${f.delay}`, transformOrigin: "bottom center",
              filter: castShadow(2, 1, "rgba(20,30,10,0.5)"),
            }}
          />
        ))}

        {/* Ladybugs — real wandering routes (Jacob, 2026-08-16: "still not
            loving the just tiny back and forth motions"), not a translateX
            oscillation. Round 1 used offset-rotate:auto to face the bug
            along its path, which Jacob then caught rendering upside-down on
            the return leg — see the travelLoop/faceFlip comment in
            globals.css for the full root-cause writeup. Fix: position and
            orientation are now two SEPARATE nested elements. Outer:
            offset-path drives real position via travelLoop (walks the route
            out and back, dart-pause rhythm), offset-rotate is FIXED at 0deg
            so this element itself never rotates — always upright. Inner:
            faceFlip, a plain scaleX mirror synced to the same pause points,
            so "facing the other way" is a mirror (legs still point down),
            never a rotation. filter (the cast shadow) lives on the outer —
            shadows point per the fixed global sun direction regardless of
            which way the bug is currently facing, so it must NOT be on the
            part that flips. zIndex from the anchor's own top% so the bug
            correctly layers against nearby objects instead of always
            painting on top via DOM order. */}
        <div
          className="absolute"
          style={{
            top: "62%", left: "42%", zIndex: zFor(62),
            offsetPath: "path('M0,0 C25,-16 55,-6 68,-24 C82,-42 70,10 38,20 C14,28 -10,18 0,0')",
            offsetRotate: "0deg",
            animation: "travelLoop 16s ease-in-out infinite",
            filter: castShadow(2, 1, "rgba(20,30,10,0.6)"),
          }}
        >
          <div style={{ animation: "faceFlip 16s steps(1) infinite" }}>
            <BugDoodle size={18} style={{ color: "#a04a4a", opacity: 0.97, display: "block" }} />
          </div>
        </div>
        <div
          className="absolute"
          style={{
            top: "56%", left: "57%", zIndex: zFor(56),
            offsetPath: "path('M0,0 C-20,14 -42,32 -28,44 C-12,58 20,42 16,18 C13,4 8,-6 0,0')",
            offsetRotate: "0deg",
            animation: "travelLoop 12.5s ease-in-out infinite 2.3s",
            filter: castShadow(1.5, 1, "rgba(20,30,10,0.55)"),
          }}
        >
          {/* Was the same #5a7a4a grass-green as the daisies above — a
              "ladybug" that camouflages into the lawn instead of standing
              out defeats the point of putting a bug there at all. */}
          <div style={{ animation: "faceFlip 12.5s steps(1) infinite 2.3s" }}>
            <BugDoodle size={14} style={{ color: "#d4823a", opacity: 0.95, display: "block" }} />
          </div>
        </div>

        {/* Ant hill — real foraging routes now, see ANT_PATHS/travelLoop/
            faceFlip comments above and in globals.css for the full
            movement-system writeup (two rounds: first replaced the old
            translateX oscillation with Motion Path, then fixed the
            upside-down-on-return bug that introduced). */}
        {/* Same soft ambient-shadow pairing as the tree — the mound is the
            second-largest object in the scene and deserves the same real
            "weight" treatment, not just a thin offset silhouette. */}
        <div className="absolute rounded-full" style={{ top: "56%", left: "21%", width: 54, height: 15, background: "radial-gradient(ellipse, rgba(20,30,10,0.3) 0%, transparent 75%)", filter: "blur(2.5px)", zIndex: zFor(56) }} />
        <AntHillDoodle size={88} className="absolute" style={{ top: "42%", left: "23%", color: "#8a6a3a", opacity: 0.97, zIndex: zFor(42), filter: castShadow(4, 1.5, "rgba(20,30,10,0.5)") }} />
        {/* Debris scattered near the hill so it reads as an actual patch of
            ground the colony lives on, not a bare mound on clean gradient.
            Real twigs sit slightly proud of the grass (they have actual
            thickness), so a very light contact shadow belongs here too —
            lighter than anything else in the scene since they're nearly
            flush, not genuinely raised like the flowers/bushes. */}
        <TwigDoodle size={30} className="absolute" style={{ top: "68%", left: "34%", opacity: 0.9, zIndex: zFor(68), transform: "rotate(-8deg)", filter: castShadow(1, 0.5, "rgba(20,30,10,0.35)") }} />
        <TwigDoodle size={22} className="absolute" style={{ top: "58%", left: "18%", opacity: 0.85, zIndex: zFor(58), transform: "rotate(20deg) scaleX(-1)", filter: castShadow(1, 0.5, "rgba(20,30,10,0.35)") }} />
        {/* Duration/delay hand-varied and deliberately NOT tied to one shared
            linear parameter — driving every ant off the same 0.05-step value
            makes each one exactly 0.05s slower AND more delayed than its
            neighbor, a textbook traveling-wave pattern that's the single
            biggest reason this read as a synchronized conveyor belt instead
            of a real colony. Path index cycles through ANT_PATHS so
            neighboring ants get genuinely different route shapes/lengths,
            not just different timing on the same shape. Same outer/inner
            split as the ladybugs above: outer carries offset-path + fixed
            offset-rotate:0deg + zIndex (from the anchor's own top%, so ants
            correctly layer against twigs/flowers/the mound instead of
            always painting on top); inner carries only the faceFlip mirror. */}
        {[
          { left: "25%", top: "60%", dur: 13, delay: 0, path: 0 },
          { left: "27%", top: "62%", dur: 19, delay: 2.1, path: 1 },
          { left: "29%", top: "63.5%", dur: 11, delay: 0.8, path: 2 },
          { left: "31%", top: "64.5%", dur: 24, delay: 4.6, path: 3 },
          { left: "33%", top: "65%", dur: 14.5, delay: 1.3, path: 4 },
          { left: "35%", top: "64.5%", dur: 17, delay: 3.2, path: 0 },
          { left: "37%", top: "63.5%", dur: 12, delay: 0.4, path: 1 },
          { left: "39%", top: "62%", dur: 21, delay: 5.5, path: 2 },
          { left: "41%", top: "60.5%", dur: 15.5, delay: 2.7, path: 3 },
          { left: "43%", top: "59%", dur: 10.5, delay: 1.9, path: 4 },
          { left: "45%", top: "58%", dur: 18, delay: 0.6, path: 0 },
        ].map((a) => (
          <div
            key={a.left}
            className="absolute"
            style={{
              top: a.top, left: a.left, zIndex: zFor(parseFloat(a.top)),
              offsetPath: ANT_PATHS[a.path],
              offsetRotate: "0deg",
              animation: `travelLoop ${a.dur}s ease-in-out infinite ${a.delay}s`,
              filter: castShadow(1, 0.5, "rgba(20,30,10,0.6)"),
            }}
          >
            <div style={{ animation: `faceFlip ${a.dur}s steps(1) infinite ${a.delay}s` }}>
              <AntDoodle size={10} style={{ color: "#4a2f14", opacity: 0.75, display: "block" }} />
            </div>
          </div>
        ))}
        {[
          { left: "24%", top: "67%", dur: 16, delay: 3.4, path: 2 },
          { left: "28%", top: "68.5%", dur: 22, delay: 0.9, path: 3 },
          { left: "32.5%", top: "69%", dur: 12.5, delay: 5.1, path: 1 },
        ].map((a) => (
          <div
            key={a.left}
            className="absolute"
            style={{
              top: a.top, left: a.left, zIndex: zFor(parseFloat(a.top)),
              offsetPath: ANT_PATHS[a.path],
              offsetRotate: "0deg",
              animation: `travelLoop ${a.dur}s ease-in-out infinite ${a.delay}s`,
              filter: castShadow(1, 0.5, "rgba(20,30,10,0.55)"),
            }}
          >
            <div style={{ animation: `faceFlip ${a.dur}s steps(1) infinite ${a.delay}s` }}>
              <AntDoodle size={9} style={{ color: "#4a2f14", opacity: 0.65, display: "block" }} />
            </div>
          </div>
        ))}

        {/* Foreground blur — two oversized, soft-focus, edge-cropped foliage
            shapes at the very front of the scene. This is the actual biggest
            lever for "real depth" in a flat illustration: something close and
            slightly out of focus in the extreme foreground is what a camera
            with shallow depth of field does, and it's the strongest possible
            cue that everything else is further back — much stronger than
            spacing/shadows/scale alone, which is all the previous rounds
            tried. zIndex explicitly set above every zFor() value in the
            scene (nothing else legitimately sits this close to the camera)
            rather than relying on DOM order/paint-last the way this used to
            — consistent with every other object now being Y-sorted. */}
        <BushDoodle
          size={220}
          className="absolute pointer-events-none"
          style={{ top: "82%", left: "-6%", color: "#3f5a34", opacity: 0.55, zIndex: 999, filter: "blur(5px)" }}
        />
        <BushDoodle
          size={190}
          className="absolute pointer-events-none"
          style={{ top: "85%", right: "-5%", color: "#3f5a34", opacity: 0.5, zIndex: 999, filter: "blur(5px)" }}
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
