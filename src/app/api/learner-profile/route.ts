import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getLearnerProfile, upsertSubjectSnapshot } from "@/lib/tutor-core/profile-aggregator";
import type { SubjectSnapshot } from "@/lib/tutor-core/types";

// Scoped entirely by the caller's own session email — same reasoning as
// /api/subject-progress (see the comment on JACOB_ONLY_PREFIXES in access.ts). Must work
// for Cristian too, since his subjects will eventually adopt SubjectProgressAdapter same
// as Jacob's — never add this route to JACOB_ONLY_PREFIXES.

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const profile = await getLearnerProfile(session.user.email);
  return Response.json(profile);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const snapshot = (await req.json()) as SubjectSnapshot;
  if (!snapshot.subjectId) return new Response("Missing subjectId", { status: 400 });

  await upsertSubjectSnapshot(session.user.email, snapshot);
  return Response.json({ ok: true });
}
