#!/usr/bin/env node
// Teaching-morning brief — on a real RCA teaching day, pulls the server-computed
// brief from /api/preclass-brief (today's classes in order, current lesson per
// class, and the Teacher's-Guide "watch for" note Jacob most needs to remember)
// and fires ONE local Mac notification so it's waiting when he opens the laptop
// to cram before class. Full brief also printed to stdout (captured in the log)
// and written to a plain-text file he can open/print. No phone push — local only,
// same policy as scripts/daily-nudge.mjs.
//
// Defaults to the deployed app so it works even when no local dev server is up;
// override with BRIEF_URL for local testing.

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NOTIFY = path.join(process.env.HOME, "tools", "notify", "notify.js");
const BRIEF_URL = process.env.BRIEF_URL || "https://meta-tutor.vercel.app/api/preclass-brief";
const OUT_FILE = path.join(process.env.HOME, "logs", "preclass-brief-latest.txt");

async function main() {
  const res = await fetch(BRIEF_URL);
  if (!res.ok) throw new Error(`brief fetch failed: ${res.status}`);
  const brief = await res.json();

  if (!brief.isTeachingDay) {
    console.log(`Not a teaching day (${brief.date}): ${brief.reason} — no brief sent.`);
    return;
  }

  // Notification headline: tight and glanceable. Lead with class count + hours,
  // then the single most important watch-for of the day if there is one.
  const firstWatch = brief.classes.find((c) => c.watchFor);
  const headParts = [`${brief.classCount} classes, ${brief.hours}.`];
  if (firstWatch) {
    headParts.push(`${firstWatch.name} L${firstWatch.lessonN}: ${firstWatch.watchFor.watchFor}`);
  }
  const headline = headParts.join(" ");

  // Full brief → text file + stdout.
  const lines = [`RCA teaching day — ${brief.date}`, `${brief.classCount} classes · ${brief.hours}`, ""];
  if (brief.materials?.length) {
    lines.push(`Bring: ${brief.materials.join(", ")}`, "");
  }
  for (const c of brief.classes) {
    const lesson = c.lessonN ? `Lesson ${c.lessonN}${c.total ? ` of ${c.total}` : ""}` : "no lesson content on file";
    lines.push(`• ${c.name}${c.block ? ` (${c.block}${c.room ? `, ${c.room}` : ""})` : ""} — ${lesson}${c.pacingStale ? " [pacing ran out — verify]" : ""}`);
    if (c.watchFor) lines.push(`    Watch for (${c.watchFor.title}): ${c.watchFor.watchFor}`);
  }
  const full = lines.join("\n");
  console.log(full);
  try {
    fs.writeFileSync(OUT_FILE, full + "\n");
  } catch {}

  execFileSync(
    "node",
    [
      NOTIFY,
      headline,
      "--title",
      `RCA ${brief.weekday} — cram before class`,
      "--click",
      "https://meta-tutor.vercel.app/rca/today",
    ],
    { stdio: "inherit" }
  );
}

main().catch((e) => {
  console.error("preclass-brief failed:", e);
  process.exit(1);
});
