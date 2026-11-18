import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

const PAGES = [
  "catholic-vs-lutheran",
  "denominations",
  "heresies",
  "sacraments",
  "virtues",
  "natural-law",
  "myths",
  "councils",
  "saints",
  "typology",
  "critics",
  "grounding-arguments",
  "church-teaching/homosexuality",
  "prophecy",
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ extraHTTPHeaders: { "x-dev-preview": "1" } });
  const page = await context.newPage();
  const allErrors = {};

  for (const slug of PAGES) {
    const errors = [];
    const onErr = (err) => errors.push(String(err));
    const onConsole = (msg) => { if (msg.type() === "error") errors.push("CONSOLE: " + msg.text()); };
    page.on("pageerror", onErr);
    page.on("console", onConsole);

    await page.goto(`http://localhost:3000/veritas/${slug}`, { waitUntil: "networkidle" });
    // expand the first item
    const firstItem = page.locator('[role="button"]').first();
    if (await firstItem.count()) {
      await firstItem.click();
      await page.waitForTimeout(300);
    }
    // star the first visible star
    const star = page.locator("text=☆").first();
    if (await star.count()) {
      await star.click();
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: join(outDir, `sweep-${slug.replace("/", "-")}.png`), fullPage: false });

    page.off("pageerror", onErr);
    page.off("console", onConsole);
    if (errors.length) allErrors[slug] = errors;
  }

  await browser.close();
  console.log(JSON.stringify(allErrors, null, 2));
}
main();
