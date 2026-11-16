// Viewer walkthrough of the Veritas additions (2026-11-16): Catholic vs. Lutheran
// deep-dive + Church Teaching: Homosexuality catalog + updated hub station list.
// Real headless browser, real screenshots read with own eyes.
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
    viewport: { width: 1280, height: 1400 },
    extraHTTPHeaders: { "x-dev-preview": "1" },
  });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE ERROR:", m.text()); });
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));

  await page.goto(BASE_URL + "/veritas", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "hub");

  await page.goto(BASE_URL + "/veritas/catholic-vs-lutheran", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "cvl-initial");
  await page.click("text=Show the historical timeline");
  await page.waitForTimeout(400);
  await shot(page, "cvl-timeline-open");
  // Expand the Eucharist topic too, to check a second accordion item renders cleanly
  await page.click("text=Transubstantiation, or Sacramental/Real Union");
  await page.waitForTimeout(400);
  await shot(page, "cvl-eucharist-open");

  await page.goto(BASE_URL + "/veritas/church-teaching/homosexuality", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "homo-ccc-tab");
  await page.click("button:has-text('Aquinas & Natural Law')");
  await page.waitForTimeout(400);
  await shot(page, "homo-aquinas-tab");
  await page.click("button:has-text('Magisterial Documents')");
  await page.waitForTimeout(400);
  await shot(page, "homo-documents-tab");
  await page.click("button:has-text('Terminology')");
  await page.waitForTimeout(400);
  await shot(page, "homo-terminology-tab");
  await page.click("button:has-text('Pastoral Care')");
  await page.waitForTimeout(400);
  await shot(page, "homo-pastoral-tab");
  await page.click("button:has-text('Objections & Responses')");
  await page.waitForTimeout(400);
  await shot(page, "homo-objections-tab");

  await browser.close();
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
