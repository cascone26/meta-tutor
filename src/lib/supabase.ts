import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { notifyOps } from "./alert";

// Server-side only — service role key must never reach the browser.
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    try {
      _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
    } catch (e) {
      // 2026-08-19: this exact throw (malformed env var value) silently broke every
      // Supabase-backed feature app-wide for ~10 days because every call site catches
      // and degrades gracefully instead of surfacing it. Loud is the point here.
      notifyOps(`Supabase client failed to construct — env var likely malformed: ${e instanceof Error ? e.message : e}`);
      throw e;
    }
  }
  return _supabase;
}
