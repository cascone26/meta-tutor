import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabase } from "@/lib/supabase";

// Per-student roster + attendance for a subject (see mt_rca_roster/mt_rca_attendance
// in supabase-schema-hub.sql). First increment — roster + attendance only, no grades
// yet (a real separate feature).

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const subjectId = url.searchParams.get("subjectId");
  const date = url.searchParams.get("date"); // YYYY-MM-DD, optional
  if (!subjectId) return new Response("Missing subjectId", { status: 400 });

  const supabase = getSupabase();
  const { data: students, error } = await supabase
    .from("mt_rca_roster")
    .select("id, name, notes")
    .eq("user_email", session.user.email)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[rca-roster GET students]", error);
    return new Response("Failed to load roster", { status: 500 });
  }

  let attendance: Record<string, boolean> = {};
  if (date && students && students.length > 0) {
    const { data: rows, error: attError } = await supabase
      .from("mt_rca_attendance")
      .select("student_id, present")
      .eq("user_email", session.user.email)
      .eq("date", date)
      .in("student_id", students.map((s) => s.id));
    if (attError) {
      console.error("[rca-roster GET attendance]", attError);
    } else {
      attendance = Object.fromEntries((rows || []).map((r) => [r.student_id, r.present]));
    }
  }

  return NextResponse.json({
    students: (students || []).map((s) => ({ ...s, present: date ? attendance[s.id] ?? null : null })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const supabase = getSupabase();

  if (body.action === "addStudent") {
    const { subjectId, name } = body;
    if (!subjectId || !name?.trim()) return new Response("Missing subjectId or name", { status: 400 });
    const { data, error } = await supabase
      .from("mt_rca_roster")
      .insert({ user_email: session.user.email, subject_id: subjectId, name: name.trim() })
      .select("id, name, notes")
      .single();
    if (error) {
      console.error("[rca-roster POST addStudent]", error);
      return new Response("Failed to add student", { status: 500 });
    }
    return NextResponse.json({ student: { ...data, present: null } });
  }

  if (body.action === "removeStudent") {
    const { studentId } = body;
    if (!studentId) return new Response("Missing studentId", { status: 400 });
    const { error } = await supabase
      .from("mt_rca_roster")
      .delete()
      .eq("user_email", session.user.email)
      .eq("id", studentId);
    if (error) {
      console.error("[rca-roster POST removeStudent]", error);
      return new Response("Failed to remove student", { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "markAttendance") {
    const { studentId, date, present } = body;
    if (!studentId || !date || typeof present !== "boolean") {
      return new Response("Missing/invalid studentId, date, or present", { status: 400 });
    }
    const { error } = await supabase.from("mt_rca_attendance").upsert(
      { user_email: session.user.email, student_id: studentId, date, present, updated_at: new Date().toISOString() },
      { onConflict: "user_email,student_id,date" }
    );
    if (error) {
      console.error("[rca-roster POST markAttendance]", error);
      return new Response("Failed to save attendance", { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return new Response("Unknown action", { status: 400 });
}
