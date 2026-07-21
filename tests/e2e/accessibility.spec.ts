import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.skip(({ browserName }) => browserName !== "chromium", "Run automated axe evaluation once in Chromium.");

for (const path of ["/", "/product", "/security", "/universities", "/contact"]) {
  test(`has no serious automated accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
  });
}
