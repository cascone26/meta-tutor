import { NextResponse } from "next/server";
import { courseNotes } from "@/lib/course-notes";

export async function GET() {
  return NextResponse.json({ notes: courseNotes });
}
