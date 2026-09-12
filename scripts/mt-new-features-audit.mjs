// Viewer walkthrough of the 3 new surfaces (2026-09-11): teaching-day watch-for
// chips (/rca/week), reverse-homework prep page (/rca/prep), and the learner
// profile's prep-contact line (/learner-profile). Real headless browser, real
// screenshots read with own eyes. Requires `npm run dev` + a real AI token.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log("shot:", name);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    extraHTTPHeaders: { "x-dev-preview": "1" },
  });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE ERROR:", m.text()); });
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));

  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("meta-tutor-onboarding-done", "true"));

  // #4 — watch-for chips on the week view (shows Mon+Thu regardless of today).
  await page.goto(BASE_URL + "/rca/week", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "new-week-watchfor");

  // #7 — reverse-homework prep page. Render, then actually click "Assign me prep".
  await page.goto(BASE_URL + "/rca/prep", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await shot(page, "new-prep-initial");

  // Pick Latin (has real teacher-guide grounding), generate.
  try {
    await page.selectOption("select", "first-form-latin-6");
  } catch (e) { console.log("select failed:", e.message); }
  const btn = page.getByText(/Assign me prep/);
  await btn.click();
  await page.waitForTimeout(12000); // real AI generation + save
  await shot(page, "new-prep-generated");

  // #10 — learner profile (prep-contact line if columns+data exist).
  await page.goto(BASE_URL + "/learner-profile", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "new-learner-profile");

  await browser.close();
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
