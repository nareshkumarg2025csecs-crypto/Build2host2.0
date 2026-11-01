import { chromium } from "playwright";

const routes = [
  "/",
  "/websites",
  "/automation",
  "/catalog",
  "/about",
  "/websites/enquiry",
  "/automation/enquiry",
  "/privacy",
  "/terms",
];

const mobileWidths = [320, 360, 390, 430, 767];
const baseUrl = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];

  for (const width of mobileWidths) {
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${baseUrl}${route}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);

      const overflowData = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasOverflow = docWidth > winWidth;
        let overflowingElements = [];

        if (hasOverflow) {
          const allEls = document.querySelectorAll("*");
          allEls.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1) {
              overflowingElements.push({
                tag: el.tagName,
                id: el.id,
                className: typeof el.className === "string" ? el.className.slice(0, 80) : "",
                right: Math.round(rect.right),
              });
            }
          });
        }

        return {
          docWidth,
          winWidth,
          hasOverflow,
          overflowingCount: overflowingElements.length,
          topCulprits: overflowingElements.slice(0, 3),
        };
      });

      let existing = results.find((r) => r.Route === route);
      if (!existing) {
        existing = { Route: route };
        results.push(existing);
      }

      existing[`${width}px`] = overflowData.hasOverflow
        ? `FAIL (${overflowData.docWidth}px, +${overflowData.docWidth - overflowData.winWidth})`
        : "OK";
    }

    await context.close();
  }

  await browser.close();
  console.log("\n================ OVERFLOW AUDIT (320px - 767px) ================");
  console.table(results);
}

main().catch(console.error);
