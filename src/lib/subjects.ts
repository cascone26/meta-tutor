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
    tagline: "Teaching hub — schedule, lesson plans, prep for all 10 classes",
    href: "/rca",
    accent: "#8a6d1f",
    accentDark: "#c9a227",
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
  {
    id: "latin",
    name: "Latin",
    tagline: "Vocab, grammar drills, and personalized quizzing",
    href: "/latin",
    accent: "#b8763a",
    accentDark: "#d99a5c",
    bg: "#1c1712",
    status: "building",
  },
];

const HUB_SHELL_PREFIXES = ["/hub", "/chess", "/latin", "/rca"];

export function isHubShellRoute(pathname: string): boolean {
  return HUB_SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
