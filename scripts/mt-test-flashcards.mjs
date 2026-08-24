import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { "x-dev-preview": "1" } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.evaluate(() => {
  sessionStorage.setItem("meta-tutor-prayer-shown", "true");
  localStorage.setItem("meta-tutor-onboarding-done", "true");
  const added = [
    { term: "unus", definition: "one", category: "Numbers" },
    { term: "duo", definition: "two", category: "Numbers" },
    { term: "tres", definition: "three", category: "Numbers" },
    { term: "quattuor", definition: "four", category: "Numbers" },
    { term: "quinque", definition: "five", category: "Numbers" },
    { term: "sex", definition: "six", category: "Numbers" },
    { term: "septem", definition: "seven", category: "Numbers" },
    { term: "octo", definition: "eight", category: "Numbers" },
    { term: "novem", definition: "nine", category: "Numbers" },
    { term: "decem", definition: "ten", category: "Numbers" },
  ];
  localStorage.setItem("meta-tutor-custom-glossary", JSON.stringify({ added, edited: {}, deleted: [] }));
  // Mimics Jacob's exact reported scenario: sitting at index 14 (displays
  // "15/N") on the unfiltered "All" deck, cardTerms empty so it restores via
  // the full-list fallback path.
  localStorage.setItem("meta-tutor-fc-progress", JSON.stringify({
    category: null, shuffled: false, index: 14, knownTerms: [], cardTerms: [],
  }));
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

const beforeCount = await readCount();
const buttons = await page.$$eval("button", (els) => els.map((e) => e.textContent.trim()));
console.log("BUTTONS ON SCREEN:", JSON.stringify(buttons.filter((t) => t.length < 20)));

await page.click('button:has-text("Numbers")', { force: true });
await page.waitForTimeout(400);
const afterCount = await readCount();
const hasDecem = await page.evaluate(() => document.body.textContent.includes("decem"));

console.log(JSON.stringify({ beforeCount, afterCount, hasDecem }, null, 2));
await page.screenshot({ path: "./scripts/.shots/flashcards-numbers-after.png" });
await browser.close();
