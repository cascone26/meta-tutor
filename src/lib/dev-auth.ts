import { NextRequest } from "next/server";
import { auth } from "@/auth";

// No hardcoded fallback — this repo is public, see src/lib/access.ts for why. Only
// reached in non-production (NODE_ENV check below), so this still requires .env.local
// to have JACOB_EMAIL set, same as everywhere else that needs it.
const DEV_PREVIEW_EMAIL = process.env.JACOB_EMAIL;

// Dev-only API-route auth bypass, sibling to proxy.ts's page-level isDevPreview() — lets
// the local headless verification harness (scripts/mt-*.mjs) exercise real AI-backed
// routes (Latin Lab comprehension/evaluate, etc.) without a real Google login. Gated on
// NODE_ENV !== "production" so it can never activate on a Vercel build, even if someone
// sent the header there.
export async function sessionEmail(req: NextRequest): Promise<string | null> {
  const session = await auth();
  if (session?.user?.email) return session.user.email;
  if (process.env.NODE_ENV !== "production" && req.headers.get("x-dev-preview") === "1") {
    return DEV_PREVIEW_EMAIL ?? null;
  }
  return null;
}
