import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the canonical policy is readable without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8788/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy Policy");
  // Generated in the app repository from its own ARB strings, so these assert
  // the disclosures survive generation and hosting.
  for (const text of ["applies specifically to the Astronomy Open Night 2026 app", "ML Kit", "leo@leoalavi.dev", "astronomyopennight@mq.edu.au"]) {
    await expect(page.locator("body")).toContainText(text);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://aon.syllabus-sync.app/privacy");
  await page.screenshot({ path: testInfo.outputPath("policy-mobile.png") });
  await context.close();
});

test("the policy is served as real HTML with the security headers", async ({ page, request }) => {
  // Support and terms stay on the information site; this host serves the app
  // and the one canonical policy.
  const response = await request.get("/privacy");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["content-security-policy"]).toContain("default-src 'self'");
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("Flutter app boots at root and on direct navigation to Settings", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of ["/", "/settings"]) {
    await page.goto(route);
    await expect(page.locator("flutter-view")).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("flt-glass-pane")).toBeAttached();
    await expect(page.locator("canvas").first()).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(route === "/" ? "app-home.png" : "app-settings.png") });
  }
  expect(errors).toEqual([]);
});

test("privacy has no serious accessibility violations", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "axe runs in Chromium");
  await page.goto("/privacy");
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("Persian app renders without loading third-party resources", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ locale: "fa-IR" });
  const page = await context.newPage();
  const thirdParty: string[] = [];
  const errors: string[] = [];
  page.on("request", request => {
    if (new URL(request.url()).hostname !== "127.0.0.1") thirdParty.push(new URL(request.url()).hostname);
  });
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:8788/settings");
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 60_000 });
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: testInfo.outputPath("persian-settings.png") });
  expect(thirdParty).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});

test("the bundled panorama script and image load under the deployed CSP", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/panorama/astronomical-observatory");
  const viewer = page.frameLocator('iframe[title="360° venue tour"]');
  await expect(viewer.locator('#panorama canvas').first()).toBeVisible({ timeout: 60_000 });
  // One load box means one viewer. The host and the iframe both trigger the tour,
  // so a second viewer stacked on the first is the failure this guards.
  await expect(viewer.locator(".pnlm-load-box")).toHaveCount(1);
  await expect(viewer.locator(".pnlm-load-box")).toBeHidden();
  expect(errors).toEqual([]);
});
