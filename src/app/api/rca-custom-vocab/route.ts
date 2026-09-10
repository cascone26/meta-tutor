import { NextRequest, NextResponse } from "next/server";
import { sessionEmail } from "@/lib/dev-auth";
import { getSupabase } from "@/lib/supabase";

// Server-side mirror of useCustomVocab()'s localStorage — see the comment on
// mt_custom_vocab in supabase-schema-hub.sql for why this exists (only a local
// script can generate real verified audio for these words, and it can't read
// the browser's localStorage). This route just keeps that table in sync;
// SoundStudio still renders instantly from localStorage either way.

type VocabRow = {
  id: string;
  latin: string;
  english: string;
  category: string;
  note: string | null;
  audio_ready: boolean;
  created_at: string;
};

export async function GET(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mt_custom_vocab")
    .select("id, latin, english, category, note, audio_ready, created_at")
    .eq("user_email", userEmail);

  if (error) return new Response("Failed to load custom vocab", { status: 500 });

  const items = ((data as VocabRow[]) || []).map((r) => ({
    id: r.id,
    latin: r.latin,
    english: r.english,
    category: r.category,
    note: r.note ?? undefined,
    audioReady: r.audio_ready,
    createdAt: new Date(r.created_at).getTime(),
  }));
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, latin, english, category, note } = body;
  if (!id || !latin || !english || !category) return new Response("Missing fields", { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase.from("mt_custom_vocab").upsert({
    user_email: userEmail,
    id,
    latin,
    english,
    category,
    note: note ?? null,
  });
  if (error) return new Response("Failed to save", { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const userEmail = await sessionEmail(req);
  if (!userEmail) return new Response("Unauthorized", { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase.from("mt_custom_vocab").delete().eq("user_email", userEmail).eq("id", id);
  if (error) return new Response("Failed to delete", { status: 500 });
  return NextResponse.json({ ok: true });
}
