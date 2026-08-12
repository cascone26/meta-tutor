import { auth } from "@/auth";

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
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|chi-rho.png|login).*)"],
};
