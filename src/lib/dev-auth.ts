import { NextRequest } from "next/server";
import { auth } from "@/auth";

const DEV_PREVIEW_EMAIL = process.env.JACOB_EMAIL ?? "cobo.cascone@gmail.com";

// Dev-only API-route auth bypass, sibling to proxy.ts's page-level isDevPreview() — lets
// the local headless verification harness (scripts/mt-*.mjs) exercise real AI-backed
// routes (Latin Lab comprehension/evaluate, etc.) without a real Google login. Gated on
// NODE_ENV !== "production" so it can never activate on a Vercel build, even if someone
// sent the header there.
export async function sessionEmail(req: NextRequest): Promise<string | null> {
  const session = await auth();
  if (session?.user?.email) return session.user.email;
  if (process.env.NODE_ENV !== "production" && req.headers.get("x-dev-preview") === "1") {
    return DEV_PREVIEW_EMAIL;
  }
  return null;
}
