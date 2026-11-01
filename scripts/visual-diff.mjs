import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const routes = [
  { path: "/", name: "home" },
  { path: "/websites", name: "websites" },
  { path: "/automation", name: "automation" },
  { path: "/catalog", name: "catalog" },
  { path: "/about", name: "about" },
  { path: "/websites/enquiry", name: "websites-enquiry" },
  { path: "/automation/enquiry", name: "automation-enquiry" },
  { path: "/privacy", name: "privacy" },
  { path: "/terms", name: "terms" },
];

const widths = [768, 1024, 1280, 1440, 1920];
const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const mode = process.argv[2] || "baseline"; // 'baseline' | 'after' | 'compare'

async function capture(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge", headless: true });

  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });

    const page = await context.newPage();

    for (const route of routes) {
      const url = `${baseUrl}${route.path}`;
      const filename = `${route.name}_${width}.png`;
      const filePath = path.join(targetDir, filename);

      console.log(`[${mode}] Capturing ${route.path} @ ${width}px -> ${filename}`);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.evaluate(() => document.fonts.ready);

        // Disable animations and hide cursor on current page
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
              caret-color: transparent !important;
            }
            [data-cursor], .custom-cursor {
              display: none !important;
            }
          `,
        });

        // Small settle delay
        await page.waitForTimeout(300);

        // Hide preloader or overlays if present
        await page.evaluate(() => {
          const preloader = document.querySelector('[aria-label="preloader"]');
          if (preloader) preloader.remove();
        });

        await page.screenshot({ path: filePath, fullPage: true });
      } catch (err) {
        console.error(`Failed ${route.path} @ ${width}:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log(`Completed capture for ${targetDir}`);
}

function compare() {
  const baselineDir = path.resolve(".visual/baseline");
  const afterDir = path.resolve(".visual/after");
  const diffDir = path.resolve(".visual/diff");

  if (!fs.existsSync(diffDir)) {
    fs.mkdirSync(diffDir, { recursive: true });
  }

  console.log("\n================ VISUAL DIFF REPORT ================");
  const results = [];

  for (const route of routes) {
    const row = { Route: route.path };
    for (const width of widths) {
      const filename = `${route.name}_${width}.png`;
      const bPath = path.join(baselineDir, filename);
      const aPath = path.join(afterDir, filename);

      if (!fs.existsSync(bPath) || !fs.existsSync(aPath)) {
        row[`${width}px`] = "MISSING";
        continue;
      }

      const img1 = PNG.sync.read(fs.readFileSync(bPath));
      const img2 = PNG.sync.read(fs.readFileSync(aPath));

      if (img1.width !== img2.width || img1.height !== img2.height) {
        row[`${width}px`] = `SIZE DIFF (${img1.height} vs ${img2.height})`;
        continue;
      }

      const diff = new PNG({ width: img1.width, height: img1.height });
      const diffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        { threshold: 0.1 }
      );

      row[`${width}px`] = diffPixels;
      if (diffPixels > 0) {
        fs.writeFileSync(path.join(diffDir, filename), PNG.sync.write(diff));
      }
    }
    results.push(row);
  }

  console.table(results);
  return results;
}

async function main() {
  if (mode === "baseline") {
    await capture(path.resolve(".visual/baseline"));
  } else if (mode === "after") {
    await capture(path.resolve(".visual/after"));
    compare();
  } else if (mode === "compare") {
    compare();
  } else {
    console.error("Unknown mode:", mode);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
