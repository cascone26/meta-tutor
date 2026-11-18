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
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://localhost:3000/veritas/ask", { waitUntil: "networkidle" });
  await page.fill("textarea", "Give me a short answer with a markdown list and a header, like:\n# Heading\n- point one\n- point two\n**bold** and *italic* and a --- rule");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(8000);
  await page.screenshot({ path: join(outDir, "ask-markdown.png"), fullPage: true });

  // Test the per-message save button
  const saveBtn = page.locator("text=✎ Save").first();
  if (await saveBtn.count()) {
    await saveBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(outDir, "ask-saved-confirm.png") });
  }

  // Test highlight-to-save: select some text in the assistant bubble, then fire a
  // real mouseup ON the scroll container (programmatic selection doesn't trigger
  // the browser's native mouseup, which is what the component listens for).
  const container = page.locator("div.relative.flex-1.overflow-y-auto");
  await container.evaluate((el) => {
    const range = document.createRange();
    const textNode = el.querySelector(".mr-8 p, .mr-8 li");
    range.selectNodeContents(textNode);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "ask-highlight-btn.png") });

  // Visit Saved page, Chat Notes tab
  await page.goto("http://localhost:3000/veritas/saved", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Chat Notes/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, "saved-notes-tab.png"), fullPage: true });

  console.log("ERRORS:", JSON.stringify(errors));
  await browser.close();
}

main();
