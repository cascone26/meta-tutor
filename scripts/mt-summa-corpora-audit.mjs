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

  await page.goto(BASE_URL + "/veritas/summa", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await shot(page, "summa-hub");

  await page.goto(BASE_URL + "/veritas/summa/prima-pars", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await shot(page, "summa-part-list");

  await page.goto(BASE_URL + "/veritas/summa/prima-pars/2", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "summa-q2-collapsed-art1");
  await page.click("text=Article 2: Whether it can be demonstrated that God exists?");
  await page.waitForTimeout(400);
  await shot(page, "summa-q2-art2-open");

  await page.goto(BASE_URL + "/veritas/library", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.click("button:has-text('Sacred Scripture')");
  await page.waitForTimeout(300);
  await shot(page, "library-scripture-filter");

  await page.goto(BASE_URL + "/veritas/library/bible-genesis", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "library-genesis-reader");

  await page.goto(BASE_URL + "/veritas/library/ccc-part3", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "library-ccc-part3-reader");

  await browser.close();
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
