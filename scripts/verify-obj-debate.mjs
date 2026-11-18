import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ extraHTTPHeaders: { "x-dev-preview": "1" } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://localhost:3000/veritas/objection", { waitUntil: "networkidle" });
  await page.fill("textarea", "The Bible never mentions purgatory");
  await page.click("text=Handle This Objection");
  await page.waitForTimeout(8000);
  await page.screenshot({ path: "scripts/.shots/objection-test.png", fullPage: true });

  await page.goto("http://localhost:3000/veritas/debate", { waitUntil: "networkidle" });
  await page.fill("input[placeholder='What topic are you debating?']", "The Trinity");
  await page.click("text=Atheist / Agnostic");
  await page.click("text=Generate Debate Prep");
  await page.waitForTimeout(8000);
  await page.screenshot({ path: "scripts/.shots/debate-test.png", fullPage: true });

  console.log("ERRORS:", JSON.stringify(errors));
  await browser.close();
}
main();
