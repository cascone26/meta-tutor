// Simple single-stroke line-art icons for the RCA nature theme. Deliberately not
// emoji — plain SVG so color/weight stay consistent with the rest of the theme.

type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

// Redesigned as two separate wing strokes around a body point (was one fused
// silhouette path) specifically so each wing can flap independently via
// flapWingY — a static shape sliding around a path reads as "on a string";
// this actually beats its wings while it travels.
export function BirdIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <g style={{ transformOrigin: "12px 12px", animation: "flapWingY 0.5s ease-in-out infinite" }}>
        <path d="M12 12C9.2 10 5.6 9.2 2.3 10.8" />
      </g>
      <g style={{ transformOrigin: "12px 12px", animation: "flapWingY 0.5s ease-in-out infinite" }}>
        <path d="M12 12C14.8 10 18.4 9.2 21.7 10.8" />
      </g>
    </svg>
  );
}

// Wings grouped left/right (upper+lower stroke each) so flapWingX folds them
// toward the body and back out — same original path data, just regrouped.
export function ButterflyIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 6v13" />
      <g style={{ transformOrigin: "12px 9px", animation: "flapWingX 0.7s ease-in-out infinite" }}>
        <path d="M12 8c-1-3-4-4.5-6.5-3.5C3.5 5.3 3 8 4.5 10c1.2 1.6 3.2 2.2 5 1.5" />
        <path d="M12 12c-1.3-1.7-3.7-2.2-5.5-1C4.8 12.2 4.3 14.7 5.8 16.3c1 1.1 2.6 1.4 4 .9" />
      </g>
      <g style={{ transformOrigin: "12px 9px", animation: "flapWingX 0.7s ease-in-out infinite" }}>
        <path d="M12 8c1-3 4-4.5 6.5-3.5C20.5 5.3 21 8 19.5 10c-1.2 1.6-3.2 2.2-5 1.5" />
        <path d="M12 12c1.3-1.7 3.7-2.2 5.5-1 1.7 1.2 2.2 3.7.7 5.3-1 1.1-2.6 1.4-4 .9" />
      </g>
    </svg>
  );
}

export function LeafIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 20c0-8 5-14 16-15-1 11-7 16-15 16-.5 0-1 0-1-1z" />
      <path d="M6 18c3-4 6.5-7 12-11" />
    </svg>
  );
}

export function SkyIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="8" cy="8" r="3.2" />
      <path d="M14 16.5a3.5 3.5 0 0 0 0-7 4.5 4.5 0 0 0-8.7 1.4A3.5 3.5 0 0 0 6 16.5h8z" />
    </svg>
  );
}

// Decorative "doodle" illustrations for the RCA scene backdrop — same single-stroke
// hand-drawn feel as the icons above, just bigger and meant to sit in the page's
// margins as ambient scenery rather than as functional UI icons.

export function CloudDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 40 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M8 18a5.5 5.5 0 0 1 .3-11A7 7 0 0 1 21.5 5.2 6 6 0 0 1 30 10.5 5.5 5.5 0 0 1 29 18H8z" />
    </svg>
  );
}

// Canopy is 4 overlapping circles (the standard "foliage cluster" technique every
// simple tree icon uses), not one smooth outline — a single wobbly path read as an
// abstract blob/balloon, not a tree. Canopy circles are now actually FILLED (was
// pure outline, which at real scale on the live page read as a big pale clover,
// not foliage) and the trunk gets its own brown color so it doesn't just blend
// into the same currentColor as the leaves — a tree needs two materials, not one.
export function TreeDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M30 68V47" stroke="#6b4a2a" strokeWidth="2.4" />
      <path d="M30 58c-4-2-8-1-10 3M30 54c4-1.5 7-.5 9 2.5" stroke="#6b4a2a" strokeWidth="1.6" />
      <circle cx="21" cy="32" r="11" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="39" cy="32" r="11" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="30" cy="21" r="12.5" fill="currentColor" fillOpacity="0.68" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="30" cy="38" r="10.5" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
    </svg>
  );
}

// Three distinct flower silhouettes (round bloom / tulip cup / daisy petals) so a
// five-flower bed doesn't read as one icon copy-pasted and recolored — real flower
// beds have shape variety, not just color variety. All get FILLED petals (was pure
// outline circles, which is what made every flower read as a "lollipop" — a stick
// with a faint ring on top — instead of an actual bloom), and every stem is the
// same muted green regardless of petal color, same as real stems are.
const STEM = "#5a7a4a";

export function FlowerDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" fill="none" strokeLinecap="round" className={className} style={style}>
      <path d="M12 30v-11" stroke={STEM} strokeWidth="1.3" />
      <path d="M12 19c-2-1-4 0-4.5 2" stroke={STEM} strokeWidth="1.3" />
      <circle cx="12" cy="6" r="3" fill="currentColor" fillOpacity="0.85" />
      <circle cx="8" cy="8.5" r="3" fill="currentColor" fillOpacity="0.85" />
      <circle cx="16" cy="8.5" r="3" fill="currentColor" fillOpacity="0.85" />
      <circle cx="9.2" cy="12" r="3" fill="currentColor" fillOpacity="0.85" />
      <circle cx="14.8" cy="12" r="3" fill="currentColor" fillOpacity="0.85" />
      <circle cx="12" cy="9.3" r="1.8" fill="#fbf8f0" />
      <circle cx="12" cy="9.3" r="1.2" fill="#c9843a" />
    </svg>
  );
}

export function TulipDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" fill="none" strokeLinecap="round" className={className} style={style}>
      <path d="M12 30v-13" stroke={STEM} strokeWidth="1.3" />
      <path d="M12 20c-2 0-4-1.5-4.5-4" stroke={STEM} strokeWidth="1.3" />
      <path d="M7 12c0-4 2-7 5-7s5 3 5 7c0 1.6-1.1 2.6-2.4 2.6H9.4C8.1 14.6 7 13.6 7 12z" fill="currentColor" fillOpacity="0.85" />
    </svg>
  );
}

export function DaisyDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" fill="none" strokeLinecap="round" className={className} style={style}>
      <path d="M12 30v-12" stroke={STEM} strokeWidth="1.3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 12 12)`}>
          <ellipse cx="12" cy="6.5" rx="1.9" ry="4.8" fill="currentColor" fillOpacity="0.85" />
        </g>
      ))}
      <circle cx="12" cy="12" r="2.6" fill="#c9843a" />
    </svg>
  );
}

// Legs split into left/right pairs (was one fused 4-stroke path) so they wiggle
// with a slight offset — an alternating scuttle instead of a rigid body gliding.
// Body is now FILLED (was pure outline + 3 tiny dots, which read as a faint ring,
// not a bug) with a dark head/spots for contrast against whatever body color.
// Side-profile now, not top-down. The old top-down version (a centered head
// circle + symmetric legs on both sides) had NO left-right asymmetry, so the
// scaleX(-1) flip in crawlLoop's turn-around was mirroring a shape that looks
// identical either way — the bug never visibly "faced" a direction, which is
// exactly why it read as sliding back and forth instead of walking and
// turning. This shape has a real front (a distinct head+antennae at the
// right) and a real back (the wider dome), so the flip actually reorients it.
export function BugDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * (20 / 28)} viewBox="0 0 28 20" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M3 15c-1-6 4-11 11-11s10 5 9 11c-1 3-6 4-10 4s-9-1-10-4z" fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      <path d="M13 4.5v11" stroke="#2a2420" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="8" cy="8.5" r="1.3" fill="#2a2420" />
      <circle cx="8" cy="13.5" r="1.3" fill="#2a2420" />
      <circle cx="16" cy="9" r="1.3" fill="#2a2420" />
      {/* Head + antennae — the front, at the right by default */}
      <circle cx="22" cy="9" r="3" fill="#2a2420" />
      <path d="M23 6.3c.7-1 1.7-1.3 2.5-1M24.2 7.3c.6-1.1 1.5-1.7 2.3-1.7" stroke="#2a2420" strokeWidth="1" />
      <g style={{ transformOrigin: "10px 16px", animation: "legWiggle 0.35s ease-in-out infinite" }}>
        <path d="M6 16l-2 3M10 17l-1 3" stroke="#2a2420" strokeWidth="1.2" />
      </g>
      <g style={{ transformOrigin: "16px 16px", animation: "legWiggle 0.35s ease-in-out infinite 0.18s" }}>
        <path d="M15 17l0 3M19 16l2 3" stroke="#2a2420" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// The mound is a FILLED shape with texture marks re-colored dark brown (was
// currentColor at low opacity, which nearly vanished once layered on top of the
// mound's own now-much-more-opaque fill — texture needs to contrast against its
// base, not match it) so it reads as a solid mound of dirt with real detail.
export function AntHillDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 28" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 25c8-1 24-1 32 0" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.5" />
      <path d="M8 25c0-8.5 5.2-15.5 12-15.5S32 16.5 32 25z" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.4" />
      <circle cx="20" cy="15.5" r="1.4" fill="#3a2510" />
      <path d="M13 21c1-.4 2-.2 2.4.6M27 20c-1-.4-2-.2-2.4.6M17 11.5c.7-.3 1.4 0 1.7.7" stroke="#3a2510" strokeWidth="1.1" strokeOpacity="0.55" />
    </svg>
  );
}

// A fallen twig with a couple of leaf flecks — small debris scattered near
// the ant hill so the colony reads as living in an actual patch of ground
// with stuff on it, not a bare mound floating on clean gradient.
export function TwigDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 40 16" fill="none" className={className} style={style}>
      {/* Leaf flecks sized up relative to the stem (were 2.6/2.2 radius — too
          small to read as anything but noise on a thin wavy line, which is
          exactly why this read as a stray squiggle/worm instead of debris). */}
      <path d="M2 12c8-2 16 2 24-4 4-3 8-3 12-1" stroke="#6b4a2a" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="13" cy="8" rx="3.8" ry="2" fill="#5a7a4a" fillOpacity="0.85" transform="rotate(-25 13 8)" />
      <ellipse cx="22" cy="4.5" rx="3.2" ry="1.7" fill="#6b8e5a" fillOpacity="0.85" transform="rotate(15 22 4.5)" />
    </svg>
  );
}

// At the tiny size these actually render, fine anatomical detail (legs,
// antennae, 3 separate segments) just disappears into noise — what reads as
// "ant" at that scale is a small dark speck with a slight waist, repeated many
// times in a line. Simplified to two filled blobs instead of a stroked outline
// (filled reads as "solid tiny thing" immediately; outlines read as empty rings
// at small size).
export function AntDoodle({ size = 8, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 20 10" fill="currentColor" stroke="none" className={className} style={style}>
      <ellipse cx="5.5" cy="5" rx="2.3" ry="1.9" />
      <ellipse cx="13" cy="5" rx="3.2" ry="2.4" />
    </svg>
  );
}

// Verified via render loop: ANY two internal marks inside an oval outline read
// as facial features (eyes/nose/mouth) regardless of their exact shape — that's
// too strong a gestalt to design around. Stripped to the minimum that can't
// pattern-match to a face: one irregular water outline, lily pads crossing
// the rim, nothing else inside the body.
//
// Depth is a radial gradient (deep/saturated center fading to a paler shallow
// edge), a defined bank rim, one ripple line, and a highlight for shine. Lily
// pads are now placed at the water shape's actual visual center (was cx=43 —
// right at the shape's ambiguous outer edge, which is why it read as a loop
// floating disconnected next to the pond rather than sitting IN it) — two
// pads, sizes staggered, both clearly inside the body regardless of the exact
// hand-drawn outline bounds.
// Rebuilt 2026-08-13: the previous version's bright off-center white
// specular highlight (a classic "glossy sphere/marble" rendering cue — a
// light-colored ellipse offset from center, mimicking a light source
// hitting a RAISED curved surface) was the actual reason this read as a
// floating bead no matter how the shadow beneath it was tuned. Three
// rounds of shadow-position/gradient fixes never touched this because the
// problem was the object's own rendering, not its shadow. Flat water
// viewed from this angle doesn't have a dramatic specular highlight — it
// has a darker, more uniform surface with a visible bank/rim at the edge
// (the actual cue that grounds something: a boundary where it meets the
// land) and subtle ripple lines, not a bright glossy dome.
export function PondDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {/* A visible darker bank/rim OUTSIDE the water body — the actual
          "this sits in the ground, not on top of it" cue, drawn first so
          the water body paints over its inner edge. */}
      <path
        d="M3 19.5c-1.2-7.5 7.5-13 16-12s13 1.2 20 4.3 11 6.5 9.7 11S37 29 27 29 4.2 25 3 19.5z"
        fill="#5a4a2e"
        fillOpacity="0.35"
        stroke="none"
      />
      {/* FLAT fill, no gradient at all — any brightness variance (even a
          "realistic deeper-water" radial gradient) kept reading as a
          glossy specular highlight to independent review, no matter how
          it was tuned. A single uniform opacity is the only way to fully
          remove that "raised glossy solid" cue. */}
      <path
        d="M5 19c-1-7 7-12 15-11s12 1 19 4 10 6 9 10-11 6-20 6S6 25 5 19z"
        fill="currentColor"
        fillOpacity="0.72"
        stroke="currentColor"
        strokeOpacity="0.65"
      />
      {/* Ripple lines — flat, low-contrast, same hue as the water, no
          light-source implication. */}
      <path d="M10 13c8-3.5 20-3.5 29 2" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" fill="none" />
      <path d="M9 21c7 2.5 17 2.5 25-0.5" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" fill="none" />
      {/* Lily pads — a distinct GREEN, not a lighter tint of the water's
          own blue. The previous version used currentColor at lower
          opacity than the water around it, which made a "lily pad" read
          as a lighter patch — exactly the "hotspot" look this whole
          redesign is trying to kill, just relocated instead of removed. */}
      <ellipse cx="27" cy="17.5" rx="6.5" ry="2.5" fill="#5a7a4a" fillOpacity="0.8" stroke="#3f5a34" strokeOpacity="0.4" strokeWidth="1" />
      <path d="M27 17.5c0-1 .8-1.6 1.8-1.7" stroke="#3f5a34" strokeOpacity="0.4" strokeWidth="1" />
      <ellipse cx="17" cy="20.5" rx="4.2" ry="1.7" fill="#5a7a4a" fillOpacity="0.75" stroke="#3f5a34" strokeOpacity="0.4" strokeWidth="0.8" />
    </svg>
  );
}

// Cattail-style reeds at a pond's edge — the single most recognizable "this is
// a pond, not a puddle" motif in garden illustration. Three stalks, staggered
// heights/rotations so they don't look like one stamp repeated.
export function ReedDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className={className} style={style}>
      <path d="M6 30c0-10 1-16 3-22" />
      <path d="M12 30c0-12-1-18 1-24" />
      <path d="M17 30c0-9 2-14 4-19" />
      <ellipse cx="9.3" cy="7.5" rx="1.6" ry="4" fill="currentColor" fillOpacity="0.75" stroke="none" transform="rotate(-15 9.3 7.5)" />
      <ellipse cx="13.3" cy="5.8" rx="1.6" ry="4.5" fill="currentColor" fillOpacity="0.75" stroke="none" transform="rotate(5 13.3 5.8)" />
      <ellipse cx="20.3" cy="10.5" rx="1.4" ry="3.5" fill="currentColor" fillOpacity="0.75" stroke="none" transform="rotate(-10 20.3 10.5)" />
    </svg>
  );
}

// A winding dirt path — the connective tissue the whole scene was missing.
// Every element used to be an independent sticker positioned by percentage
// math with nothing tying them together; this gives the eye an actual line to
// follow through the garden, and gives the ant trail a reason to exist (ants
// crossing a real path, not floating in isolation). Two overlapping strokes —
// a wide, very faint "worn edge" halo behind a narrower tan "trodden" core —
// reads as a soft-edged dirt path rather than a hard-edged shape.
export function PathDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.12} viewBox="0 0 700 84" fill="none" preserveAspectRatio="none" className={className} style={style}>
      <path
        d="M0 50c70-16 120 8 190 0s130-20 200-8 140 18 210 6 70-10 100-4"
        stroke="#8a6a3a"
        strokeWidth="34"
        strokeLinecap="round"
        strokeOpacity="0.1"
        fill="none"
      />
      <path
        d="M0 50c70-16 120 8 190 0s130-20 200-8 140 18 210 6 70-10 100-4"
        stroke="#c9a86a"
        strokeWidth="26"
        strokeLinecap="round"
        strokeOpacity="0.32"
        fill="none"
      />
    </svg>
  );
}

// Short filled foliage cluster, no trunk — same "overlapping circles" canopy
// technique as TreeDoodle, just lower and denser, for a shrub/hedge instead of
// a tree. Adds plant variety at ground level beyond "one tree, five flowers."
export function BushDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 50 32" fill="none" className={className} style={style}>
      <circle cx="14" cy="19" r="10" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="28" cy="14" r="12" fill="currentColor" fillOpacity="0.66" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="38" cy="20" r="9" fill="currentColor" fillOpacity="0.58" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}

// A small filled pebble cluster — garden-edge detail, distinct material (flat
// grey-brown, no green) so the scene isn't 100% foliage.
export function RockDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 40 22" fill="none" className={className} style={style}>
      <path d="M2 20c-1-5 3-9 8-9s7 3 8 6c3-2 7-1 8 2 1 2-1 4-4 4H6c-2 0-3.5-1-4-3z" fill="#8a8478" fillOpacity="0.75" />
      <path d="M22 20c0-4 3-6 6-6s6 2 6 6" fill="#a29c8e" fillOpacity="0.7" />
    </svg>
  );
}

// A small clump of grass blades — ground texture scattered along the base of
// the scene so it reads as an actual meadow surface, not bare gradient with
// icons dropped on it.
export function GrassTuftDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} style={style}>
      <path d="M6 22c0-6 1-10 2-13" />
      <path d="M12 22c0-7-1-11 0-15" />
      <path d="M18 22c0-6-1-10-2-13" />
      <path d="M9 22c0-5 2-8 4-10" />
      <path d="M15 22c0-5-2-8-4-10" />
    </svg>
  );
}

export function FlameIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 2.5c1 3 .5 4.5-.8 6-1.3 1.5-2.7 2.5-2.7 5a5.5 5.5 0 0 0 11 0c0-2.5-1.2-4-2.5-5.3.3 2-.5 3-1.5 3.3-.3-3-1.5-6-3.5-9z" />
    </svg>
  );
}

// A faint worn-dirt groove under the ant line — connective tissue so the eye
// reads "a line of ants following a path" even when the individual ants
// (necessarily tiny) are hard to resolve on their own.
export function TrailDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.12} viewBox="0 0 200 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" preserveAspectRatio="none" className={className} style={style}>
      <path d="M2 14c20-4 40 3 60-1s40-7 60-2 40 4 76-3" />
    </svg>
  );
}

export function GroundLineDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.05} viewBox="0 0 300 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" preserveAspectRatio="none" className={className} style={style}>
      <path d="M0 7c30-4 60 4 90 0s60-6 90-1 60 5 90 0 30-3 30-3" />
    </svg>
  );
}
