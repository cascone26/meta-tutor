import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const page = await browser.newPage();
await page.setExtraHTTPHeaders({ "x-dev-preview": "1" });
await page.setViewport({ width: 1400, height: 1000 });
await page.goto("http://localhost:3000/rca", { waitUntil: "networkidle0" });

// Open notes panel, start a new note
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label")?.includes("notes"));
  btn?.click();
});
await new Promise((r) => setTimeout(r, 300));
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "+ New");
  btn?.click();
});
await new Promise((r) => setTimeout(r, 300));

// Type into the contentEditable editor
const editor = await page.$('[contenteditable="true"]');
if (!editor) throw new Error("contentEditable editor not found");
await editor.click();
await page.keyboard.type("hello world");

// Select "hello" (first 5 chars) and bold it via the toolbar button
await page.evaluate(() => {
  const el = document.querySelector('[contenteditable="true"]');
  const range = document.createRange();
  const textNode = el.firstChild.nodeType === 3 ? el.firstChild : el.firstChild.firstChild;
  range.setStart(textNode, 0);
  range.setEnd(textNode, 5);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
});
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.title?.includes("Bold"));
  btn?.click();
});
await new Promise((r) => setTimeout(r, 200));

const htmlAfterBold = await page.evaluate(() => document.querySelector('[contenteditable="true"]').innerHTML);
console.log("HTML after bold toolbar click:", htmlAfterBold);

// Now test the keyboard shortcut for underline on a fresh selection
await page.evaluate(() => {
  const el = document.querySelector('[contenteditable="true"]');
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
});
await page.keyboard.down("Meta");
await page.keyboard.press("u");
await page.keyboard.up("Meta");
await new Promise((r) => setTimeout(r, 200));
const htmlAfterUnderline = await page.evaluate(() => document.querySelector('[contenteditable="true"]').innerHTML);
console.log("HTML after Cmd+U:", htmlAfterUnderline);

// Save it and confirm it lands in the list without raw tags leaking
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Add note");
  btn?.click();
});
await new Promise((r) => setTimeout(r, 400));
const listPreview = await page.evaluate(() => {
  const els = [...document.querySelectorAll("p")].filter((p) => p.textContent?.includes("hello") || p.textContent?.includes("world"));
  return els.map((e) => e.textContent);
});
console.log("List preview text (should be plain, no tags):", listPreview);

await browser.close();
