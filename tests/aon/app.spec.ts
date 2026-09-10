import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("store policy is readable without JavaScript and covers all three platforms", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8788/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy Policy");
  for (const text of ["iOS, Android and web", "ML Kit", "iCloud", "motion sensor", "Cloudflare", "leo@leoalavi.dev", "manual code entry"]) {
    await expect(page.locator("main")).toContainText(text);
  }
  // The scope statement and attribution block the event team asked for.
  await expect(page.locator("main")).toContainText("This Privacy Policy applies specifically to the Astronomy Open Night 2026 app");
  await expect(page.locator("main")).toContainText("does not apply to other Syllabus Sync products or to the Macquarie University website");
  await expect(page.locator("main")).toContainText("Developed by the Syllabus Sync team (Leo Alavi and Mohammad Raouf Abedini) for the Astronomy Night – FSE Outreach Team.");
  await expect(page.locator("main")).toContainText("Contact: astronomyopennight@mq.edu.au");
  // The credit under the policy must not drift from the credit inside it.
  await expect(page.locator("footer")).toContainText("Developed by the Syllabus Sync team (Leo Alavi and Mohammad Raouf Abedini)");
  await expect(page.locator("footer")).toContainText("© 2026 Astronomy Night – FSE Outreach Team");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://aon.syllabus-sync.app/privacy");
  await expect(page.locator('[lang="fa"][dir="rtl"]')).toContainText("سیاست حریم خصوصی");
  await page.screenshot({ path: testInfo.outputPath("policy-mobile.png") });
  await context.close();
});

test("legal routes have real HTML and safe links", async ({ page, request }) => {
  for (const slug of ["privacy", "support", "terms"]) {
    const response = await request.get(`/${slug}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/html");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    await page.goto(`/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open app", exact: true })).toHaveAttribute("href", "/");
  }
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
