import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

const ROUTES = [
  "/veritas",
  "/veritas/natural-law",
  "/veritas/virtues",
  "/veritas/sacraments",
  "/veritas/saints",
  "/veritas/heresies",
  "/veritas/councils",
  "/veritas/timeline",
  "/veritas/typology",
  "/veritas/prophecy",
  "/veritas/scripture-index",
  "/veritas/denominations",
  "/veritas/critics",
  "/veritas/debate-playbook",
  "/veritas/oneliners",
  "/veritas/grounding-arguments",
  "/veritas/myths",
  "/veritas/analogies",
  "/veritas/doubt",
  "/veritas/courses",
  "/veritas/aquinas-life",
  "/veritas/reading-guide",
  "/veritas/quickdraw",
  "/veritas/saved",
  "/veritas/plans",
  "/veritas/simulator",
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, extraHTTPHeaders: { "x-dev-preview": "1" } });
  const page = await ctx.newPage();

  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${page.url()}: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${page.url()}: ${e.message}`));

  for (const route of ROUTES) {
    try {
      const res = await page.goto(BASE_URL + route, { waitUntil: "networkidle", timeout: 15000 });
      const status = res ? res.status() : "no-response";
      console.log(`${status === 200 ? "OK " : "FAIL"} ${status}  ${route}`);
      await page.waitForTimeout(300);
      const name = route.replace(/\//g, "_").replace(/^_/, "") || "root";
      await page.screenshot({ path: `${outDir}/sweep_${name}.png` });
    } catch (e) {
      console.log(`ERROR ${route}: ${e.message}`);
    }
  }

  await browser.close();

  if (errors.length) {
    console.log("\n=== CONSOLE/PAGE ERRORS ===");
    for (const e of errors) console.log(e);
  } else {
    console.log("\nNo console or page errors across the sweep.");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
