// Drives the real audio pipeline (mic permission + Chromium's fake synthetic audio device)
// to confirm getUserMedia -> AudioContext -> AnalyserNode -> YIN/chroma actually runs without
// throwing and updates the UI — not just that the page renders.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE_URL = "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), ".shots");
mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
  });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    extraHTTPHeaders: { "x-dev-preview": "1" },
    permissions: ["microphone"],
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

  await page.goto(BASE_URL + "/guitar/tuner", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Start Tuner/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(outDir, "guitar_audio_tuner_live.png") });
  const tunerText = await page.textContent("body");

  await page.goto(BASE_URL + "/guitar/chords", { waitUntil: "networkidle" });
  await page.getByText("E minor").first().click();
  await page.getByRole("button", { name: /Start Practicing/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(outDir, "guitar_audio_chordtrainer_live.png") });
  const chordText = await page.textContent("body");

  await browser.close();

  console.log("=== Tuner page text after 2s listening ===");
  console.log(tunerText.replace(/\s+/g, " ").trim());
  console.log("\n=== ChordTrainer page text after 2s listening ===");
  console.log(chordText.replace(/\s+/g, " ").trim());
  console.log("\n=== Console/page errors ===");
  console.log(errors.length ? errors.join("\n") : "none");
}

main();
