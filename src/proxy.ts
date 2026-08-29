import { auth } from "@/auth";
import { isJacobOnlyPath, roleForEmail, CRISTIAN_HOME } from "@/lib/access";

// Dev-only preview bypass for the local verification harness (scripts/verify-scene.mjs) —
// lets a headless browser render real gated pages without doing real Google OAuth. Gated on
// NODE_ENV !== "production" so it can never activate on a Vercel build, even if someone sent
// the header there.
function isDevPreview(req: { headers: Headers }) {
  return process.env.NODE_ENV !== "production" && req.headers.get("x-dev-preview") === "1";
}

export default auth((req) => {
  if (!req.auth && !isDevPreview(req) && req.nextUrl.pathname !== "/login") {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  // Cristian's account is scoped to the Metaphysics-suite pages only — bounced back home if
  // he hits any of Jacob's hub-shell routes (RCA/chess/trivia/riemann) directly by URL. Jacob's
  // account is never restricted, so he keeps full visibility into Cristian's area too.
  const role = isDevPreview(req) ? "jacob" : roleForEmail(req.auth?.user?.email);
  if (role === "cristian" && isJacobOnlyPath(req.nextUrl.pathname)) {
    return Response.redirect(new URL(CRISTIAN_HOME, req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|chi-rho.png|rca-logo.png|login).*)"],
};
