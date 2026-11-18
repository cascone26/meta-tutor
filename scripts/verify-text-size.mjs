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
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

  await page.goto("http://localhost:3000/veritas/catholic-vs-lutheran", { waitUntil: "networkidle" });
  await page.click("text=Authority: Scripture Alone");
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "size-cvl-expanded.png"), fullPage: true });

  await page.goto("http://localhost:3000/veritas/heresies", { waitUntil: "networkidle" });
  await page.click("text=Adoptionism");
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "size-heresies-expanded.png"), fullPage: true });

  await page.goto("http://localhost:3000/veritas/saved", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "size-saved.png"), fullPage: true });

  console.log("ERRORS:", JSON.stringify(errors));
  await browser.close();
}
main();
