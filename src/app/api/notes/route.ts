import { NextResponse } from "next/server";
import { courseNotes } from "@/lib/course-notes";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  return NextResponse.json({ notes: courseNotes });
}
