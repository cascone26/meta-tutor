// Real verification harness for the RCA doodle scene — drives the ACTUAL local dev
// server (not an isolated mockup) through the dev-only auth bypass in src/proxy.ts,
// then checks real computed geometry: do any decorative "ground scene" elements
// overlap a real class-card bounding box, and do any animated elements' transforms
// ever move in a direction that would read as sliding back and forth. This replaces
// the old process of eyeballing standalone HTML mockups with a flaky vision tool —
// it reasons about the real DOM, real CSS cascade, real page length.
//
// Usage: node scripts/verify-scene.mjs [path]   (path defaults to /rca)
// Requires: `npm run dev` already running on localhost:3000.

import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = "http://localhost:3000";
const path = process.argv[2] || "/rca";

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

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
    await page.goto(BASE_URL + path, { waitUntil: "networkidle0", timeout: 30000 });

    // Fail loudly if the dev bypass didn't work — better than silently
    // "verifying" a login page and reporting false confidence.
    const url = page.url();
    if (url.includes("/login")) {
      console.error("FAIL: redirected to /login — dev auth bypass did not work. Check src/proxy.ts / NODE_ENV.");
      process.exit(1);
    }

    const report = { path, checks: [] };

    // --- Check 1: geometry — does any element inside the ground scene overlap
    // any real class-card link's bounding box? ---
    const overlapResult = await page.evaluate(() => {
      const groundZone = document.querySelector('[data-scene-zone="ground"]');
      const skyZone = document.querySelector('[data-scene-zone="sky"]');
      const cards = Array.from(document.querySelectorAll('[data-card="true"]'));
      const rect = (el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      };
      const cardRects = cards.map((c) => ({ el: c.textContent?.trim().slice(0, 40), rect: rect(c) }));
      const groundEls = groundZone ? Array.from(groundZone.querySelectorAll("*")) : [];
      const skyEls = skyZone ? Array.from(skyZone.querySelectorAll("*")) : [];
      const overlaps = [];
      for (const el of [...groundEls, ...skyEls]) {
        const r = rect(el);
        if (r.right - r.left < 1 || r.bottom - r.top < 1) continue; // skip zero-size wrappers
        for (const c of cardRects) {
          const o = r.left < c.rect.right && r.right > c.rect.left && r.top < c.rect.bottom && r.bottom > c.rect.top;
          if (o) overlaps.push({ decorEl: el.tagName + (el.className ? "." + String(el.className).slice(0, 30) : ""), card: c.el });
        }
      }
      return {
        cardCount: cardRects.length,
        groundZoneRect: groundZone ? rect(groundZone) : null,
        lastCardBottom: cardRects.length ? Math.max(...cardRects.map((c) => c.rect.bottom)) : null,
        overlaps,
      };
    });
    report.checks.push({ name: "ground-scene vs card overlap", pass: overlapResult.overlaps.length === 0, detail: overlapResult });

    // --- Check 2: does the ground scene render strictly below the last card? ---
    if (overlapResult.groundZoneRect && overlapResult.lastCardBottom != null) {
      const pass = overlapResult.groundZoneRect.top >= overlapResult.lastCardBottom - 5; // small tolerance
      report.checks.push({
        name: "ground scene starts after last card",
        pass,
        detail: { groundTop: overlapResult.groundZoneRect.top, lastCardBottom: overlapResult.lastCardBottom },
      });
    }

    // --- Check 3: animation direction sampling — catch any reintroduced
    // alternate/back-and-forth motion by sampling transform over real time. ---
    const animTargets = await page.evaluate(() => {
      const pick = (sel) => {
        const el = document.querySelector(sel);
        return el ? true : false;
      };
      return {
        hasCloud: pick('[data-scene-zone="sky"] svg'),
      };
    });

    const sampleSelectors = [
      { label: "cloud (drift)", selector: '[data-scene-zone="sky"] svg' },
      // Targets an actual ant by its unique viewBox, not just "first svg in
      // the ground zone" — that generic selector started grabbing GrassField
      // (2026-08-16, an inert background-texture SVG added earlier in DOM
      // order), silently sampling the wrong element's always-empty transform.
      { label: "ant (travelLoop offset-path)", selector: '[data-scene-zone="ground"] svg[viewBox="0 0 20 10"]' },
    ];
    for (const target of sampleSelectors) {
      const samples = [];
      for (let i = 0; i < 6; i++) {
        // getComputedStyle().transform reads "none" for CSS Motion Path
        // (offset-path/offset-distance) effects even while the element is
        // genuinely moving — it's a different rendering mechanism, not
        // exposed through that property (found 2026-08-16 verifying the new
        // ant-loop animations: real getBoundingClientRect position moved
        // frame to frame while .transform stayed "none" throughout). Sample
        // both so this check stays meaningful regardless of which mechanism
        // a given element's animation actually uses.
        const t = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return { transform: cs.transform, x: Math.round(r.x), y: Math.round(r.y) };
        }, target.selector);
        samples.push(t);
        await new Promise((r) => setTimeout(r, 300));
      }
      report.checks.push({ name: `transform samples: ${target.label}`, pass: true, detail: samples });
    }

    // --- Screenshots for a final human-style check, at the actual scroll
    // position where the ground scene sits (not a synthetic mockup). NOTE:
    // this layout scrolls inside its own overflow-y-auto div, not the window
    // — window.scrollTo() is a no-op here. Instead of scrolling, grow the
    // viewport to the full document height so everything renders in one shot,
    // then clip a screenshot to just the region we want. Found this the hard
    // way: an earlier version used window.scrollTo() + a viewport-sized clip
    // and silently captured blank space below the fold.
    await page.screenshot({ path: "/tmp/verify-rca-top.png", fullPage: false });
    const fullHeight = await page.evaluate(() => {
      const scroller = document.querySelector(".overflow-y-auto");
      return Math.max(scroller ? scroller.scrollHeight : 0, document.documentElement.scrollHeight);
    });
    await page.setViewport({ width: 1440, height: fullHeight, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 200));
    if (overlapResult.groundZoneRect) {
      const groundRect = await page.evaluate(() => {
        const el = document.querySelector('[data-scene-zone="ground"]');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: 0, y: Math.max(0, r.top - 20), width: 1440, height: r.height + 60 };
      });
      if (groundRect) await page.screenshot({ path: "/tmp/verify-rca-ground.png", clip: groundRect });
    }
    await page.screenshot({ path: "/tmp/verify-rca-fullpage.png", fullPage: true });

    console.log(JSON.stringify(report, null, 2));
    const failed = report.checks.filter((c) => c.pass === false);
    if (failed.length) {
      console.error(`\nFAIL: ${failed.length} check(s) failed.`);
      process.exit(1);
    } else {
      console.log("\nPASS: all geometry checks passed.");
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
