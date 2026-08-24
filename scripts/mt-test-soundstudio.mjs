// Regression check for Sound Studio's "Audio quiz (guess the phonogram)"
// reverse-direction tab (SoundStudio.tsx's ReverseQuizMode) — the audio
// self-test Jacob asked for 2026-08-24: hear the sounds, type the
// phonogram, reveal to check. Requires `npm run dev` already running.
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, extraHTTPHeaders: { "x-dev-preview": "1" } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("401")) errors.push(m.text()); });

await page.goto("http://localhost:3000/rca/loe-essentials-c", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.click('button:has-text("Sound studio")', { force: true });
await page.waitForTimeout(300);
await page.click('button:has-text("Audio quiz (guess the phonogram)")', { force: true });
await page.waitForTimeout(300);

const hasInput = await page.evaluate(() => !!document.querySelector('input[placeholder="Type what you heard"]'));
const item1 = await page.evaluate(() => document.body.textContent.includes("Item 1 of"));
await page.fill('input[placeholder="Type what you heard"]', "ea");
await page.click('button:has-text("Reveal")', { force: true });
await page.waitForTimeout(200);
await page.click('button:has-text("Got it")', { force: true });
await page.waitForTimeout(300);
const item2 = await page.evaluate(() => document.body.textContent.includes("Item 2 of"));

console.log(JSON.stringify({ hasInput, item1, advancedToItem2: item2, errors }, null, 2));
if (!hasInput || !item1 || !item2 || errors.length) process.exit(1);
await browser.close();
