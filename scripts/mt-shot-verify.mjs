import { chromium } from 'playwright';
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
const ctx = await browser.newContext({ extraHTTPHeaders: { 'x-dev-preview': '1' }, viewport: { width: 1400, height: 1200 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3099/rca/first-form-latin-6', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(1000);
for (let i = 0; i < 8; i++) {
  const text = await page.locator('text=/Lesson \\d+ of 33/').first().textContent().catch(() => null);
  if (text && text.includes('Lesson 1 of')) break;
  const prev = page.locator('button:has-text("Prev")').first();
  if (await prev.count() === 0) break;
  await prev.click();
  await page.waitForTimeout(400);
}
// Find the MTSS heading and scroll it into view
const mtssHeading = page.locator('text=/MTSS|Tier 1/').first();
const found = await mtssHeading.count();
console.log('MTSS element count:', found);
if (found > 0) {
  await mtssHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: '/Users/scones/estate/data/renders/mt-mtss-check-4.png' });
await browser.close();
console.log('done');
