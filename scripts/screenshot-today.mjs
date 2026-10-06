import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = "http://localhost:3098";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--force-device-scale-factor=1"],
  });

  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ "x-dev-preview": "1" });
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });

    const url = page.url();
    if (url.includes("/login")) {
      console.error("FAIL: redirected to /login — dev auth bypass did not work.");
      process.exit(1);
    }

    await new Promise((r) => setTimeout(r, 500));
    const path = "/tmp/mt-today-hub.png";
    await page.screenshot({ path, fullPage: false });
    console.log(`Screenshot saved to ${path}`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
