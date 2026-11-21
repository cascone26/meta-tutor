import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

const ROUTES = [
  "/guitar",
  "/guitar/tuner",
  "/guitar/chords",
  "/guitar/lessons",
  "/guitar/lessons/meet-your-guitar",
  "/guitar/lessons/your-first-chord-e-minor",
  "/guitar/play-along",
  "/guitar/progress",
  "/guitar/metronome",
  "/guitar/fretboard",
  "/guitar/note-trainer",
];

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const THEMES = ["light", "dark"];

async function sweep(browser, viewport, theme) {
  const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, extraHTTPHeaders: { "x-dev-preview": "1" } });
  const page = await ctx.newPage();
  if (theme === "dark") {
    await ctx.addInitScript(() => {
      localStorage.setItem("meta-tutor-theme", "dark");
    });
  }
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${page.url()}: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${page.url()}: ${e.message}`));

  for (const route of ROUTES) {
    try {
      const res = await page.goto(BASE_URL + route, { waitUntil: "networkidle", timeout: 15000 });
      const status = res ? res.status() : "no-response";
      const shotName = `guitar_${theme}_${viewport.name}_${route.replace(/\//g, "_") || "root"}.png`;
      await page.screenshot({ path: join(outDir, shotName) });
      console.log(`${viewport.name} ${route} -> ${status} -> ${shotName}`);
    } catch (e) {
      console.log(`${viewport.name} ${route} -> ERROR: ${e.message}`);
    }
  }

  await ctx.close();
  return errors;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let allErrors = [];
  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const errs = await sweep(browser, vp, theme);
      allErrors = allErrors.concat(errs);
    }
  }
  await browser.close();

  console.log("\n=== Console/page errors ===");
  if (allErrors.length === 0) {
    console.log("none");
  } else {
    allErrors.forEach((e) => console.log(e));
  }
}

main();
