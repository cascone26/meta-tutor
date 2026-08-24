import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1400 }, extraHTTPHeaders: { "x-dev-preview": "1" } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto("http://localhost:3000/rca/religion-6", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
async function readGuideText() {
  return page.evaluate(() => {
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes("Teacher"));
    return h2 ? h2.closest('div').parentElement.textContent.slice(0, 200) : "NOT FOUND";
  });
}
console.log("WEEK 2 GUIDE:", await readGuideText());
const nextLessonBtn = page.locator('button:has-text("Next")').first();
for (let i = 0; i < 20; i++) {
  await nextLessonBtn.click({ force: true });
  await page.waitForTimeout(20);
}
await page.waitForTimeout(300);
console.log("WEEK 22 GUIDE:", await readGuideText());
console.log("CONSOLE ERRORS:", JSON.stringify(errors));
await browser.close();
