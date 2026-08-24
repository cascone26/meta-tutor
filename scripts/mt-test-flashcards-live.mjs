import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { "x-dev-preview": "1" } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.evaluate(() => {
  sessionStorage.setItem("meta-tutor-prayer-shown", "true");
  localStorage.setItem("meta-tutor-onboarding-done", "true");
  localStorage.removeItem("meta-tutor-fc-progress"); // clean slate, no restore
  const added = Array.from({ length: 10 }, (_, i) => ({ term: "n" + i, definition: "def" + i, category: "Numbers" }));
  localStorage.setItem("meta-tutor-custom-glossary", JSON.stringify({ added, edited: {}, deleted: [] }));
});

await page.goto("http://localhost:3000/study", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.click('button:has-text("Flashcards")', { force: true });
await page.waitForTimeout(400);

function readCount() {
  return page.evaluate(() => {
    const spans = [...document.querySelectorAll("span")];
    const s = spans.find((s) => /\d+ \/ \d+/.test(s.textContent));
    return s ? s.textContent.trim() : "NOT FOUND";
  });
}

console.log("start:", await readCount());
// Click "Next" (the right arrow icon button, second-to-last button on the card controls row) 14 times, LIVE within the session
const nextBtn = page.locator('button:has(svg path[d="M5 12h14M12 5l7 7-7 7"])');
for (let i = 0; i < 14; i++) {
  await nextBtn.click({ force: true }).catch(() => {});
  await page.waitForTimeout(30);
}
console.log("after 14 nexts:", await readCount());

await page.click('button:has-text("Numbers")', { force: true });
await page.waitForTimeout(400);
console.log("after switching to Numbers:", await readCount());
await page.screenshot({ path: "./scripts/.shots/flashcards-live-switch.png" });
await browser.close();
