import { chromium } from "playwright";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ extraHTTPHeaders: { "x-dev-preview": "1" } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

  await page.goto("http://localhost:3000/veritas", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "size-hub.png"), fullPage: true });

  await page.goto("http://localhost:3000/veritas/ask", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "size-ask.png") });

  await page.goto("http://localhost:3000/veritas/denominations", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "size-denominations.png"), fullPage: true });

  console.log("ERRORS:", JSON.stringify(errors));
  await browser.close();
}
main();
