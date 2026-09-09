// Verify the 7 newly-authored Latin Lab units (4-10) actually render and that the AI
// comprehension generator handles the trickier formats (Unit 8's dialogue, Unit 10's
// Q&A checkpoint) without choking. Ad hoc, not wired into CI.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`shot: ${name}`);
}

const UNIT_ORDER = [
  "4. The Family's Dinner",
  "5. A Big Family",
  "6. The Boy and the Teacher",
  "7. The Good Boy, the Small Servant",
  "8. A Conversation at the Farmhouse",
  "9. The Farmhouse, Long Ago",
  "10. Reading Checkpoint: Who, What, Where",
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1400 },
    extraHTTPHeaders: { "x-dev-preview": "1" },
  });
  const page = await ctx.newPage();
  page.on("console", (msg) => { if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text()); });
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("meta-tutor-onboarding-done", "true"));

  for (const label of UNIT_ORDER) {
    await page.goto(BASE_URL + "/latin-lab", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: label }).click();
    await page.waitForTimeout(300);
    // Reveal vocab so it's visible in the screenshot
    await page.getByText(/Show new vocabulary/).click();
    await page.waitForTimeout(200);
    const n = label.split(".")[0];
    await shot(page, `latinlab-unit${n}-read`);
  }

  // Comprehension check on the two riskiest formats
  for (const [label, tag] of [["8. A Conversation at the Farmhouse", "unit8"], ["10. Reading Checkpoint: Who, What, Where", "unit10"]]) {
    await page.goto(BASE_URL + "/latin-lab", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: label }).click();
    await page.waitForTimeout(300);
    await page.getByText("Comprehension", { exact: true }).click();
    await page.waitForTimeout(7000);
    await shot(page, `latinlab-${tag}-comprehension`);
  }

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
