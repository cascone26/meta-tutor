export type Subject = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  accent: string;
  accentDark: string;
  bg: string;
  status: "live" | "building";
};

// An "umbrella" owns multiple stations under one roof (e.g. RCA owns 10 classes) and
// has its own sub-landing page, distinct from a standalone single-station subject above.
export type Umbrella = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  accent: string;
  accentDark: string;
  status: "live" | "building";
};

export const umbrellas: Umbrella[] = [
  {
    id: "rca",
    name: "Regina Caeli (KSC)",
    tagline: "Teaching hub — schedule, lesson plans, prep for all 10 classes (incl. Latin)",
    href: "/rca",
    accent: "#3f7ea6",
    accentDark: "#7ec8e3",
    status: "building",
  },
];

export const subjects: Subject[] = [
  {
    id: "metaphysics",
    name: "Thomistic Metaphysics",
    tagline: "Active-recall study assistant for Cris's course",
    href: "/",
    accent: "#7c6b9a",
    accentDark: "#a594c0",
    bg: "#f8f7f4",
    status: "live",
  },
  {
    id: "chess",
    name: "Chess",
    tagline: "Play, get engine-analyzed, drill your actual weaknesses",
    href: "/chess",
    accent: "#3f6b4f",
    accentDark: "#6fae82",
    bg: "#0f1a14",
    status: "building",
  },
];

// Latin lives inside the RCA umbrella now (it's his actual RCA class, First Form
// Latin 6) — /latin permanently redirects there via next.config.ts, kept in the
// hub-shell prefix list so the redirect still gets the chrome-free treatment mid-flight.
const HUB_SHELL_PREFIXES = ["/hub", "/chess", "/latin", "/rca"];

export function isHubShellRoute(pathname: string): boolean {
  return HUB_SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
