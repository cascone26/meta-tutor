// Verify the RCA-material content updates (2026-09-09: real lesson/experiment topics
// folded into first-form-latin-6.ts, saxon-76.ts, science-6-experiments.ts) actually
// render correctly in the live app. Ad hoc, not wired into CI.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`shot: ${name}`);
}

async function checkPage(page, slug, expectedSnippets, steps = 8) {
  await page.goto(`${BASE_URL}/rca/${slug}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  // Walk back to Lesson 1 first — the page defaults to TODAY's real lesson
  // (whatever week it currently is), not the start of the year, so testing
  // forward-only from there misses all the earlier annotated weeks.
  for (let guard = 0; guard < 40; guard++) {
    const prevBtn = page.getByRole("button", { name: "Prev", exact: true });
    if (await prevBtn.isDisabled().catch(() => true)) break;
    await prevBtn.click();
    await page.waitForTimeout(120);
  }

  let allText = "";
  for (let i = 0; i < steps; i++) {
    const bodyText = await page.textContent("body");
    allText += bodyText + "\n---\n";
    await shot(page, `rca-${slug}-lesson${i + 1}`);
    const nextBtn = page.getByRole("button", { name: "Next", exact: true });
    if (await nextBtn.isDisabled().catch(() => true)) break;
    await nextBtn.click();
    await page.waitForTimeout(250);
  }
  const missing = expectedSnippets.filter((s) => !allText.includes(s));
  return { allText, missing };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1400 },
    extraHTTPHeaders: { "x-dev-preview": "1" },
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`CONSOLE: ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`PAGE ERROR: ${err.message}`));

  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("meta-tutor-onboarding-done", "true"));

  const results = {};

  results["first-form-latin-6"] = await checkPage(page, "first-form-latin-6", [
    "First Conjugation Present Tense",
    "First Conjugation Imperfect Tense",
    "First Conjugation Future Tense",
  ], 5);

  results["saxon-76"] = await checkPage(page, "saxon-76", [
    "Adding/Subtracting Whole Numbers & Money",
    "Missing Numbers in Addition/Subtraction",
    "Missing Numbers in Multiplication/Division",
  ], 5);

  results["science-6"] = await checkPage(page, "science-6", [
    "Mass and Density",
  ], 5);

  await browser.close();

  console.log("\n=== RESULTS ===");
  for (const [slug, r] of Object.entries(results)) {
    console.log(`${slug}: ${r.missing.length === 0 ? "OK — all expected snippets found" : `MISSING: ${r.missing.join(", ")}`}`);
  }
  console.log(`Console/page errors: ${errors.length}`);
  errors.forEach((e) => console.log(" - " + e));
}

main().catch((e) => { console.error(e); process.exit(1); });
