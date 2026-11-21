// Minimal line-icon set, one consistent stroke style, shared across the Guitar module's nav
// and hub tiles — keeps every page feeling like one system instead of ad hoc per-page SVGs.
type IconProps = { size?: number; className?: string };
const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export const BackIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M15 18l-6-6 6-6" /></svg>
);
export const HomeIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></svg>
);
export const TunerIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 12 12 6.5" /><path d="M8.5 12h7" /></svg>
);
export const LessonsIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M4 5.5c2-1 5-1 8 0v13c-3-1-6-1-8 0z" /><path d="M20 5.5c-2-1-5-1-8 0v13c3-1 6-1 8 0z" /></svg>
);
export const ChordsIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><rect x="5" y="4" width="14" height="16" rx="1.5" /><path d="M9 4v16M15 4v16M5 9h14M5 14h14" /><circle cx="9" cy="11.5" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="16.5" r="1" fill="currentColor" stroke="none" /></svg>
);
export const PlayAlongIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M9 6v12l9-6z" /></svg>
);
export const ProgressIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M4 20V11M12 20V4M20 20v-7" /></svg>
);
export const MetronomeIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M8.5 20h7l-2-15h-3z" /><path d="M12 8l3 9" /><circle cx="12" cy="4.2" r="1" fill="currentColor" stroke="none" /></svg>
);
export const FretboardIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /><path d="M7 4v16M12 4v16M17 4v16" /></svg>
);
export const NoteTrainerIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" /></svg>
);
export const DailyIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M5.6 18.4l2.1-2.1M12 18v3M16.3 16.3l2.1 2.1M18 12h3M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="3.3" /></svg>
);
export const MenuIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const SunIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="4.2" /><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
);
export const MoonIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5z" /></svg>
);
export const TrophyIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" /><path d="M12 13v4M9 20h6M10 17h4v3h-4z" /></svg>
);
export const FlameIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M12 3c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-1-2-1-2 2 1 3 3 3 5a5 5 0 0 1-10 0c0-4 3-6 5-11z" /></svg>
);
export const ShuffleIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M4 7h3.5l9 10H20M4 17h3.5l2-2.2M14 7h6M17.5 4.5 20 7l-2.5 2.5M17.5 19.5 20 17l-2.5-2.5" /></svg>
);
export const CheckIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
);
export const LockIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const HelpIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M9.3 9.3a2.7 2.7 0 1 1 3.6 2.5c-.7.3-1 .8-1 1.6v.4" /><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" /></svg>
);
