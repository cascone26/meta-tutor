export type Subject = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  accent: string;
  accentDark: string;
  bg: string;
  status: "live" | "building";
  /** Route stays live (Cris can still use /metaphysics directly) — just not listed on Jacob's hub. */
  hiddenFromHub?: boolean;
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
    href: "/metaphysics",
    accent: "#7c6b9a",
    accentDark: "#a594c0",
    bg: "#f8f7f4",
    status: "live",
    hiddenFromHub: true,
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
  {
    id: "trivia",
    name: "Trivia",
    tagline: "12 categories, spaced-repetition learning, daily challenges",
    href: "/trivia",
    accent: "#ec4899",
    accentDark: "#f472b6",
    bg: "#1a0f1f",
    status: "building",
  },
  {
    id: "riemann",
    name: "Riemann Hypothesis",
    tagline: "Zero to real understanding — 12 lessons, self-paced",
    href: "/riemann",
    accent: "#c9a24d",
    accentDark: "#e0c07a",
    bg: "#141a2e",
    status: "live",
  },
  {
    id: "latin-lab",
    name: "Latin Lab",
    tagline: "Research-based, comprehensible-input Latin — separate from RCA's Latin, adaptive by design",
    href: "/latin-lab",
    accent: "#c17a3a",
    accentDark: "#c17a3a",
    bg: "#1a1410",
    status: "live",
  },
];

// Root "/" is the hub landing page now (moved from /hub, which permanently redirects
// there). Cris's Metaphysics chat moved to /metaphysics so it keeps its own Nav/Prayer/
// Onboarding chrome — everything under here is the chrome-free hub-shell instead.
// Latin lives inside the RCA umbrella now (it's his actual RCA class, First Form
// Latin 6) — /latin permanently redirects there via next.config.ts, kept in the
// hub-shell prefix list so the redirect still gets the chrome-free treatment mid-flight.
const HUB_SHELL_PREFIXES = ["/", "/hub", "/chess", "/latin", "/latin-lab", "/rca", "/riemann", "/trivia"];

export function isHubShellRoute(pathname: string): boolean {
  return HUB_SHELL_PREFIXES.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")));
}
