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
// abstract blob/balloon, not a tree. This reads as foliage at a glance instead.
export function TreeDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M30 68V47" />
      <path d="M30 58c-4-2-8-1-10 3M30 54c4-1.5 7-.5 9 2.5" />
      <circle cx="21" cy="32" r="11" />
      <circle cx="39" cy="32" r="11" />
      <circle cx="30" cy="21" r="12.5" />
      <circle cx="30" cy="38" r="10.5" />
      <path d="M20 14c.7-.6 1.6-.6 2.2.1M24 12c.7-.6 1.6-.6 2.2.1" />
    </svg>
  );
}

export function FlowerDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 30v-11" />
      <path d="M12 19c-2-1-4 0-4.5 2" />
      <circle cx="12" cy="8.5" r="8" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="8.5" cy="8.2" r="2" />
      <circle cx="15.5" cy="8.2" r="2" />
      <circle cx="9.6" cy="11.5" r="2" />
      <circle cx="14.4" cy="11.5" r="2" />
      <circle cx="12" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Legs split into left/right pairs (was one fused 4-stroke path) so they wiggle
// with a slight offset — an alternating scuttle instead of a rigid body gliding.
export function BugDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="14" r="7" />
      <circle cx="12" cy="5.5" r="2.8" />
      <path d="M12 7.5v13.5" />
      <g style={{ transformOrigin: "12px 13px", animation: "legWiggle 0.35s ease-in-out infinite" }}>
        <path d="M7 10l-3-2M6 16l-3 1" />
      </g>
      <g style={{ transformOrigin: "12px 13px", animation: "legWiggle 0.35s ease-in-out infinite 0.18s" }}>
        <path d="M17 10l3-2M18 16l3 1" />
      </g>
      <circle cx="8.7" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// The mound is now an actually FILLED shape (was pure stroke outline, which at a
// distance just reads as a thin arc/rainbow, not a solid mound of dirt) plus a
// couple of texture marks so it reads as ground, not a line.
export function AntHillDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 25c8-1 24-1 32 0" />
      <path d="M8 25c0-8.5 5.2-15.5 12-15.5S32 16.5 32 25z" fill="currentColor" fillOpacity="0.28" />
      <circle cx="20" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M13 21c1-.4 2-.2 2.4.6M27 20c-1-.4-2-.2-2.4.6M17 11.5c.7-.3 1.4 0 1.7.7" />
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
// pattern-match to a face: one irregular water outline, one lily pad crossing
// the rim, nothing else inside the body.
export function PondDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M5 19c-1-7 7-12 15-11s12 1 19 4 10 6 9 10-11 6-20 6S6 25 5 19z" fill="currentColor" fillOpacity="0.14" />
      <ellipse cx="43" cy="9" rx="5.5" ry="2.1" />
      <path d="M43 9c0-1 .7-1.5 1.6-1.6" />
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

export function GroundLineDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.05} viewBox="0 0 300 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" preserveAspectRatio="none" className={className} style={style}>
      <path d="M0 7c30-4 60 4 90 0s60-6 90-1 60 5 90 0 30-3 30-3" />
    </svg>
  );
}
