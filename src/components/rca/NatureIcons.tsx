// Simple single-stroke line-art icons for the RCA nature theme. Deliberately not
// emoji — plain SVG so color/weight stay consistent with the rest of the theme.

type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

export function BirdIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M3 12c2-2.5 4.5-3 6-1.5.7-2 2.7-3 5-2.5C17 6 19.5 6.3 21 8.5c-1.3-.3-2.3 0-3 1 1.7.3 2.6 1.2 3 2.5-1.3-.6-2.4-.6-3.3 0-.6 2.5-2.7 4.3-5.7 4.3-3.4 0-6-2-9-4.3z" />
      <circle cx="17" cy="9" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ButterflyIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 6v13" />
      <path d="M12 8c-1-3-4-4.5-6.5-3.5C3.5 5.3 3 8 4.5 10c1.2 1.6 3.2 2.2 5 1.5" />
      <path d="M12 8c1-3 4-4.5 6.5-3.5C20.5 5.3 21 8 19.5 10c-1.2 1.6-3.2 2.2-5 1.5" />
      <path d="M12 12c-1.3-1.7-3.7-2.2-5.5-1C4.8 12.2 4.3 14.7 5.8 16.3c1 1.1 2.6 1.4 4 .9" />
      <path d="M12 12c1.3-1.7 3.7-2.2 5.5-1 1.7 1.2 2.2 3.7.7 5.3-1 1.1-2.6 1.4-4 .9" />
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

export function TreeDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M30 68V44" />
      <path d="M30 55c-4-2-9-1-11 3M30 50c4-1.5 8-.5 10 2.5" />
      <path
        d="M30 44c-10 0-18-7-18-16 0-7 4.5-12.5 11-14C24 8 27.5 5 32 5.5c5 .5 8 4.5 7.5 9 5 .5 8.5 5 8.5 10 0 4-2 7.5-5.5 9.5C43 39.5 37 44 30 44z"
      />
      <path d="M20.5 15c.6-.7 1.6-.7 2.2 0M23.5 15c.6-.7 1.6-.7 2.2 0" />
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

export function BugDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="14" r="7" />
      <circle cx="12" cy="5.5" r="2.8" />
      <path d="M12 7.5v13.5" />
      <path d="M7 10l-3-2M17 10l3-2M6 16l-3 1M18 16l3 1" />
      <circle cx="8.7" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AntHillDoodle({ size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 24c8-1 24-1 32 0" />
      <path d="M9 24c.5-9 6-16 11-16s10.5 7 11 16" />
      <circle cx="20" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <path d="M2 24l2.5-2M4.5 24l-1.5-3" />
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
