import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { "x-dev-preview": "1" } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/rca/religion-6", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.click('[aria-label="Customize this page\'s layout"]', { force: true });
await page.waitForTimeout(300);
const beforeHasPractice = await page.evaluate(() => document.body.textContent.includes("Speed drill"));
const rows = await page.$$('[data-widget-row]');
const rowIds = [];
for (const r of rows) rowIds.push(await r.getAttribute('data-widget-row'));
for (const r of rows) {
  const id = await r.getAttribute('data-widget-row');
  if (id === 'practice') {
    const checkbox = await r.$('input[type=checkbox]');
    await checkbox.click({ force: true });
  }
}
await page.waitForTimeout(300);
const afterHasPractice = await page.evaluate(() => document.body.textContent.includes("Speed drill"));

// Now test reordering: move "teacherGuide" up via its up-arrow button, check order changed in localStorage
const tgRow = await page.$('[data-widget-row="teacherGuide"]');
const upBtn = await tgRow.$('button[aria-label*="Move"][aria-label*="up"]');
await upBtn.click({ force: true });
await page.waitForTimeout(200);
const savedPrefs = await page.evaluate(() => localStorage.getItem('meta-tutor-rca-layout-religion-6'));

await page.screenshot({ path: "./scripts/.shots/drawer-open-toggled.png" });
console.log(JSON.stringify({ rowIds, beforeHasPractice, afterHasPractice, savedPrefs }, null, 2));
await browser.close();
