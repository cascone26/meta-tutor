#!/usr/bin/env node
// Daily push nudge for Meta Tutor — pulls real cross-subject state from Supabase
// (mt_learner_profile, written by every subject's progress route — see
// src/lib/tutor-core/profile-aggregator.ts) and the static Praxis deadline, then
// pushes ONE real "here's what's actually due" notification via ~/tools/notify/notify.js.
// Never invents urgency — if nothing is due and Praxis is far off, it says so plainly.

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const NOTIFY = path.join(process.env.HOME, "tools", "notify", "notify.js");

// Kept in sync with src/lib/praxis/types.ts PRAXIS_DEADLINE — Praxis has no
// server-side sync yet (localStorage only), so this is the one hardcoded fact.
const PRAXIS_DEADLINE = "2027-02-01";

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync(path.join(REPO_ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return env;
}

function daysUntil(dateStr) {
  const ms = new Date(dateStr + "T00:00:00").getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

async function fetchLearnerProfile(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const userEmail = env.JACOB_EMAIL || "cobo.cascone@gmail.com";
  // Retry transient failures (Supabase occasionally 504s) so one blip doesn't skip the nudge.
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(
        `${url}/rest/v1/mt_learner_profile?user_email=eq.${encodeURIComponent(userEmail)}&select=subject_id,due_count,last_activity_at`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
      const rows = await res.json();
      // Drop the synthetic prep-store rows (subject_id starts with "__") — they carry
      // non-subject data (e.g. __prep_contact__ due_count = minutes) that must never be
      // counted as "items due". Same filter as getLearnerProfile in the app.
      return rows.filter((r) => !String(r.subject_id).startsWith("__"));
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function buildMessage(rows) {
  const lines = [];

  const totalDue = rows.reduce((s, r) => s + (r.due_count || 0), 0);
  if (totalDue > 0) {
    const bySubject = rows
      .filter((r) => r.due_count > 0)
      .map((r) => `${r.subject_id} (${r.due_count})`)
      .join(", ");
    lines.push(`${totalDue} items due: ${bySubject}.`);
  }

  const staleSubjects = rows
    .map((r) => ({ id: r.subject_id, days: daysSince(r.last_activity_at) }))
    .filter((s) => s.days === null || s.days >= 3);
  if (staleSubjects.length > 0) {
    const desc = staleSubjects
      .map((s) => (s.days === null ? `${s.id} (never opened)` : `${s.id} (${s.days}d ago)`))
      .join(", ");
    lines.push(`Not touched recently: ${desc}.`);
  }

  const praxisDays = daysUntil(PRAXIS_DEADLINE);
  lines.push(`Praxis 7001 deadline: ${praxisDays} days (${PRAXIS_DEADLINE}). Not yet tracked in the shared due-count above — check /praxis directly.`);

  if (totalDue === 0 && staleSubjects.length === 0) {
    lines.unshift("Nothing overdue — you're current on every tracked subject.");
  }

  return lines.join(" ");
}

async function main() {
  const env = loadEnv();
  const rows = await fetchLearnerProfile(env);
  const message = buildMessage(rows);

  execFileSync(
    "node",
    [
      NOTIFY,
      message,
      "--title",
      "Meta Tutor — daily check-in",
      "--click",
      "https://meta-tutor.vercel.app",
    ],
    { stdio: "inherit" }
  );
}

main().catch((e) => {
  console.error("daily-nudge failed:", e);
  process.exit(1);
});
