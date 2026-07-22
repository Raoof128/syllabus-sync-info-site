import { expect, test } from "@playwright/test";

test("homepage exposes the product story and safe links", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Syllabus Sync/);
  await expect(page.getByRole("heading", { level: 1, name: "Your semester, finally organised." })).toBeVisible();
  const appLinks = page.getByRole("main").getByRole("link", { name: "Open Syllabus Sync", exact: true });
  await expect(appLinks).toHaveCount(2);
  await expect(appLinks.first()).toHaveAttribute("href", "https://www.syllabus-sync.app");
  await expect(page.getByRole("heading", { level: 2, name: "Student technology should earn trust." })).toBeVisible();
});

test("primary navigation reaches a supporting page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Product", exact: true }).click();
  await expect(page).toHaveURL(/\/product$/);
  await expect(page.getByRole("heading", { level: 1, name: "One place for the academic day" })).toBeVisible();
});

test("mobile menu opens and Escape restores the closed state", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const openButton = page.getByRole("button", { name: "Open navigation" });
  await openButton.click();
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();
  await expect(openButton).toBeFocused();
});

test("FAQ opens using the native disclosure control", async ({ page }) => {
  await page.goto("/");
  const summary = page.locator("summary").filter({ hasText: "Does it replace my university portal?" });
  await summary.click();
  await expect(page.getByText("It is designed as an organisational layer", { exact: false })).toBeVisible();
});

test("contact form reports validation and unavailable delivery honestly", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#name-error")).toHaveText("Enter your name.");

  await page.getByLabel("Name").fill("Alex Student");
  await page.getByLabel("Email").fill("alex@example.test");
  await page.getByLabel("Enquiry type").selectOption("General");
  await page.getByLabel("Message").fill("I would like to understand the current product direction.");
  await page.getByLabel(/I have read the privacy notice/).check();
  await page.waitForTimeout(1_600);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Your message is valid, but delivery has not been configured yet. Please try again after launch.", { exact: true })).toBeVisible();
});

test("metadata and machine-readable routes resolve", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/security.txt", "/.well-known/security.txt", "/manifest.webmanifest"]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should resolve`).toBe(true);
  }
});

test("unknown routes show useful navigation", async ({ page }) => {
  await page.goto("/not-a-real-page");
  await expect(page.getByRole("heading", { level: 1, name: "That page is out of the plan." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});
