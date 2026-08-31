// Two-account access control: Jacob (admin, sees everything) and Cristian (scoped to his
// own Metaphysics-suite pages only). Emails are configurable via env so they're not hardcoded
// secrets in source; defaults match the two real accounts as of 2026-08-29.
export type Role = "jacob" | "cristian";

const JACOB_EMAIL = (process.env.JACOB_EMAIL ?? "cobo.cascone@gmail.com").toLowerCase();
const CRISTIAN_EMAIL = (process.env.CRISTIAN_EMAIL ?? "crisvalldeperas@gmail.com").toLowerCase();

export function roleForEmail(email: string | null | undefined): Role | null {
  if (!email) return null;
  const normalized = email.toLowerCase();
  if (normalized === JACOB_EMAIL) return "jacob";
  if (normalized === CRISTIAN_EMAIL) return "cristian";
  return null;
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  return roleForEmail(email) !== null;
}

// Jacob's hub-shell (personal learning: RCA teaching prep, chess, trivia, riemann) plus its
// API routes. Cristian's login is redirected away from all of these; Jacob (role "jacob") is
// never restricted, so he keeps full access to Cristian's Metaphysics-suite pages too.
export const JACOB_ONLY_PREFIXES = [
  "/",
  "/hub",
  "/chess",
  "/latin",
  "/latin-lab",
  "/rca",
  "/riemann",
  "/trivia",
  "/api/rca-chat",
  "/api/rca-grading",
  "/api/rca-pacing",
  "/api/rca-progress",
  "/api/rca-understanding",
  "/api/chess-coach",
  "/api/riemann-chat",
  "/api/riemann-understanding",
  "/api/trivia-generate",
  "/api/trivia-progress",
  "/api/latin-lab",
  "/api/latin-progress",
  // NOTE: /api/subject-progress is deliberately NOT here even though RCA (Jacob-only)
  // uses it — as of 2026-08-30 Cristian's Metaphysics quiz-history/wrong-answers (see
  // src/lib/study-history.ts, src/lib/wrong-answers.ts) were migrated onto this same
  // route too. It's safe to share: every query is scoped server-side by the session's
  // own email (src/app/api/subject-progress/route.ts), never by client input. Blocking
  // it here would silently break Cristian's progress tracking — proxy.ts's matcher
  // covers /api/* (only /api/auth is excluded), so this list gates API routes too, not
  // just pages. Found while wiring up Latin Lab's own new routes, 2026-08-30.
  //
  // NOTE: /api/learner-profile (Tutor Core, 2026-08-30) is deliberately NOT here either,
  // same reasoning — scoped server-side by session email, meant to work for any subject's
  // SubjectProgressAdapter (Cristian's Metaphysics included, once it adopts one).
];

export function isJacobOnlyPath(pathname: string): boolean {
  return JACOB_ONLY_PREFIXES.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")));
}

export const CRISTIAN_HOME = "/metaphysics";
