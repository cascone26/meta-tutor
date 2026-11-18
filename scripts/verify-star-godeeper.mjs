import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ extraHTTPHeaders: { "x-dev-preview": "1" } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push("CONSOLE: " + msg.text()); });

  await page.goto("http://localhost:3000/veritas/catholic-vs-lutheran", { waitUntil: "networkidle" });
  await page.screenshot({ path: join(outDir, "cvl-collapsed.png") });

  // Click the first topic to expand
  await page.locator("button:has-text('▸')").first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "cvl-expanded.png"), fullPage: true });

  // Star the first topic
  await page.locator("text=☆").first().click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(outDir, "cvl-starred.png") });

  // Click Go deeper
  await page.locator("text=Go deeper in Ask Aquinas").first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(outDir, "cvl-go-deeper-landed.png") });

  // Check Saved -> Starred tab
  await page.goto("http://localhost:3000/veritas/saved", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "saved-starred-tab.png"), fullPage: true });

  console.log("ERRORS:", JSON.stringify(errors));
  await browser.close();
}
main();
