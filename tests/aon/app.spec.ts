import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the canonical policy is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8788/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy Policy");
  // Generated in the app repository from its own ARB strings, so these assert
  // the disclosures survive generation and hosting.
  for (const text of ["applies specifically to the Astronomy Open Night 2026 mobile applications", "ML Kit", "leo@leoalavi.dev", "astronomyopennight@mq.edu.au"]) {
    await expect(page.locator("body")).toContainText(text);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://aon.syllabus-sync.app/privacy");
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

test("every public app route is refresh-safe and panoramas stay lazy", async ({ page, request }) => {
  for (const route of ["/", "/program", "/my-night", "/night", "/map", "/info", "/settings"]) {
    const response = await request.get(route);
    expect(response.status(), `${route} should serve the SPA shell`).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/html");
  }

  const panoramaRequests: string[] = [];
  page.on("request", req => {
    const url = req.url();
    if (url.includes("/assets/assets/indoor/") || url.includes("/assets/web/pannellum/")) {
      panoramaRequests.push(url);
    }
  });
  await page.goto("/");
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 60_000 });
  await page.waitForLoadState("networkidle");
  expect(panoramaRequests).toEqual([]);
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

test("the Directions screen can load the Maps JS API under the deployed CSP", async ({ browser, request }) => {
  // The app injects the Maps JavaScript API at runtime rather than hard-coding a
  // script tag with a key into web/index.html. That means the policy itself has
  // to allow the Google origin: when it does not, the browser blocks the script
  // and the map never appears *even though the key is present and correct*,
  // which sends you hunting for a credentials bug that does not exist. This is
  // exactly what shipped on 11 September 2026.
  const csp = (await request.get("/")).headers()["content-security-policy"] ?? "";
  expect(csp).toContain("https://maps.googleapis.com");

  const context = await browser.newContext({
    permissions: ["geolocation"],
    geolocation: { latitude: -33.7738, longitude: 151.1126 },
  });
  const page = await context.newPage();
  const cspBlocked: string[] = [];
  const mapsRequests: string[] = [];
  page.on("requestfailed", request => {
    if (request.failure()?.errorText === "csp") cspBlocked.push(request.url());
  });
  page.on("request", request => {
    if (request.url().startsWith("https://maps.googleapis.com")) mapsRequests.push(request.url());
  });

  await page.goto("/google-nav/venue%3Acentral-courtyard");
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 60_000 });
  await page.waitForTimeout(6000);

  // The flow must actually reach Google, and nothing may be refused by the CSP.
  // The key is referrer-restricted to the production host, so on localhost the
  // script loads and *then* Google rejects the referer — that is expected and is
  // not what this test is about.
  expect(mapsRequests.length, "the Maps JS API was never requested").toBeGreaterThan(0);
  expect(cspBlocked, "the CSP blocked a request the app needs").toEqual([]);
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
