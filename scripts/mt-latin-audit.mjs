// Viewer-style walkthrough of the whole Latin learning surface — Latin Lab (the
// from-zero self-contained course) and the RCA First Form Latin 6 companion (the
// homework/practice tool for the live class) — as a real learner would use them:
// open every tab, actually START each drill/check, and screenshot the real
// generated content so it can be read with real eyes, not just checked for
// console errors. Requires `npm run dev` already running AND a non-empty
// ANTHROPIC_AUTH_TOKEN or ANTHROPIC_API_KEY in .env.local (the AI-backed routes
// 401/500 without real credentials even with the dev-preview bypass headers).
//
// Usage: node scripts/mt-latin-audit.mjs
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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    extraHTTPHeaders: { "x-dev-preview": "1" },
  });
  const page = await ctx.newPage();
  page.on("console", (msg) => { if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text()); });
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("meta-tutor-onboarding-done", "true"));

  // --- Latin Lab: read / comprehension / vocab review / progress ---
  await page.goto(BASE_URL + "/latin-lab", { waitUntil: "networkidle" });
  await shot(page, "latinlab-read");

  await page.getByText("Comprehension", { exact: true }).click();
  await page.waitForTimeout(6000); // real AI generation
  await shot(page, "latinlab-comprehension");

  await page.goto(BASE_URL + "/latin-lab", { waitUntil: "networkidle" });
  await page.getByText("Vocab review", { exact: true }).click();
  await page.waitForTimeout(2000);
  await shot(page, "latinlab-vocabreview");

  await page.goto(BASE_URL + "/latin-lab", { waitUntil: "networkidle" });
  await page.getByText("progress", { exact: true }).click();
  await page.waitForTimeout(1500);
  await shot(page, "latinlab-progress");

  // --- RCA companion: actually start each drill, not just open the tab ---
  const rcaDrills = [
    { tab: /Speed drill/, start: /Start drill/, shot: "rca-speeddrill" },
    { tab: /Understanding check/, start: /Start check/, shot: "rca-understandingcheck" },
    { tab: /Multiple choice/, start: /Start quiz/, shot: "rca-multiplechoice" },
  ];
  for (const drill of rcaDrills) {
    await page.goto(BASE_URL + "/rca/first-form-latin-6", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: drill.tab }).click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: drill.start }).click();
    await page.waitForTimeout(9000); // real AI generation
    await shot(page, drill.shot);
  }

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
