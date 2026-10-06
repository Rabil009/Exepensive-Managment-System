import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:5173/employee/expenses/new");
await page.getByRole("combobox", { name: "Category" }).click();
await page.getByRole("option", { name: "Travel" }).click();
await page.getByLabel("Merchant").fill("Metro Rail");
await page.getByLabel("Amount (₹)").fill("975");
await page.getByLabel("Expense Date").fill("2026-10-06");
await page.getByLabel("Description").fill("Client visit commute");
await page.getByLabel("Receipt").setInputFiles({
  name: "metro.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4 test"),
});
await page.getByRole("button", { name: "Submit Expense" }).click();
await page.waitForURL("**/employee/expenses");
await page
  .locator('main input[aria-label="Search expenses"]')
  .fill("Metro Rail");
const rows = page.locator("tbody tr");
if (
  (await rows.count()) !== 1 ||
  !(await rows
    .first()
    .innerText()
    .then((text) => text.includes("Pending")))
)
  throw Error("Submitted expense not visible in filtered list");
await rows.first().getByRole("link", { name: "Metro Rail" }).click();
await page.waitForURL("**/employee/expenses/EXP-*");
await page.getByText("Client visit commute").waitFor({ state: "visible" });
await page.reload();
await page.getByText("Client visit commute").waitFor({ state: "visible" });
await page.goto("http://127.0.0.1:5173/employee/settings");
await page.getByLabel("Full name").fill("Aarav K.");
await page.getByRole("button", { name: "Save Changes" }).click();
await page.getByRole("switch", { name: "Monthly summary" }).click();
await page.reload();
if ((await page.getByLabel("Full name").inputValue()) !== "Aarav K.")
  throw Error("Profile was not persisted");
if (
  (await page
    .getByRole("switch", { name: "Monthly summary" })
    .getAttribute("data-state")) !== "checked"
)
  throw Error("Notification preference was not persisted");
console.log("PASS submit, filter, details, settings, and local persistence");
await browser.close();
