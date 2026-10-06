import { chromium } from "playwright-core";
import path from "node:path";
import os from "node:os";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const routes = [
  "dashboard",
  "expenses",
  "expenses/new",
  "expenses/EXP-1048",
  "reimbursements",
  "reports",
  "settings",
];
const sizes = [
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 1280, height: 800 },
];
let failures = 0;
for (const size of sizes) {
  const page = await browser.newPage({ viewport: size });
  for (const route of routes) {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:5173/employee/${route}`);
    await page.locator("h1").waitFor({ state: "visible" });
    const result = await page.evaluate(() => ({
      title: document.querySelector("h1")?.textContent,
      bodyWidth: document.body.scrollWidth,
      viewport: window.innerWidth,
      sidebar: Math.round(
        document.querySelector('[data-slot="sidebar"]')?.getBoundingClientRect()
          .width ?? 0,
      ),
      header: Math.round(
        document.querySelector("header")?.getBoundingClientRect().height ?? 0,
      ),
    }));
    const okay =
      Boolean(result.title) &&
      result.bodyWidth <= result.viewport &&
      result.sidebar === 240 &&
      result.header === 64 &&
      !errors.length;
    if (!okay) failures++;
    console.log(
      `${okay ? "PASS" : "FAIL"} ${size.width}x${size.height} ${route} ${JSON.stringify(result)} ${errors.join("; ")}`,
    );
    if (size.width === 1440)
      await page.screenshot({
        path: path.join(
          os.tmpdir(),
          `expense-${route.replaceAll("/", "-")}.png`,
        ),
        fullPage: true,
      });
  }
  await page.close();
}
await browser.close();
if (failures) process.exitCode = 1;
