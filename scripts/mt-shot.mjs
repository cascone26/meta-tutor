// Adapted from meta-tutor/scripts/verify-scene.mjs for Windows (HP) using
// full `playwright` (chromium auto-managed, `npx playwright install
// chromium` once) instead of puppeteer-core + a hardcoded macOS Chrome path.
// Uses the same dev-only x-dev-preview auth bypass (src/proxy.ts) -- no real
// Google login or cookies needed. Requires `npm run dev` already running.
//
// Usage: node scripts/mt-shot.mjs [path] [outName] [localStorageSeedJson]
//   node scripts/mt-shot.mjs /rca/religion-6 religion
//   node scripts/mt-shot.mjs /study study '{"meta-tutor-onboarding-done":"true"}'
// On Windows/Git Bash, prefix with MSYS2_ARG_CONV_EXCL="*" so the leading
// "/path" argument isn't mangled into a Windows filesystem path.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const path = process.argv[2] || "/rca";
const outName = process.argv[3] || "shot";
const localStorageSeed = process.argv[4]; // optional JSON string: {key: value, ...}
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots"); // gitignored scratch dir, not the repo root

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      extraHTTPHeaders: { "x-dev-preview": "1" },
    });
    const page = await ctx.newPage();

    if (localStorageSeed) {
      // Navigate once to establish origin, then seed localStorage, then reload.
      await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
      const seed = JSON.parse(localStorageSeed);
      await page.evaluate((seed) => {
        for (const [k, v] of Object.entries(seed)) {
          localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
        }
      }, seed);
    }

    await page.goto(BASE_URL + path, { waitUntil: "networkidle", timeout: 30000 });
    const url = page.url();
    if (url.includes("/login")) {
      console.error("FAIL: redirected to /login -- dev auth bypass did not work.");
      process.exit(1);
    }
    await page.waitForTimeout(400);

    mkdirSync(outDir, { recursive: true });
    await page.screenshot({ path: `${outDir}/${outName}.png`, fullPage: true });
    console.log(`Saved ${outDir}/${outName}.png (final URL: ${url})`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
