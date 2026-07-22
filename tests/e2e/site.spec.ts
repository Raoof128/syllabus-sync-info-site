import { expect, test } from "@playwright/test";

test("homepage exposes the product story and safe links", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Syllabus Sync/);
  await expect(page.getByRole("heading", { level: 1, name: "One connected ecosystem for university life." })).toBeVisible();
  const appLinks = page.getByRole("main").getByRole("link", { name: "Open Syllabus Sync", exact: true });
  await expect(appLinks.first()).toHaveAttribute("href", "https://www.syllabus-sync.app");
  await expect(page.getByRole("link", { name: "Open Sylla", exact: true }).first()).toHaveAttribute("href", "https://sylla.syllabus-sync.app");
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

test("ecosystem section exposes all three products with distinct anchors", async ({ page }) => {
  await page.goto("/#ecosystem");
  await expect(page.locator("#platform")).toContainText("Syllabus Sync Platform");
  await expect(page.locator("#platform")).toContainText("Web platform available in early access");
  await expect(page.locator("#sylla")).toContainText("AI chat available in early access");
  await expect(page.locator("#sylla")).toContainText("Flashcards");
  await expect(page.locator("#mq-navigation")).toContainText("Mobile prototype, not yet published");
  await expect(page.locator("#mq-navigation")).toContainText("Public OS-level linking and the complete production handoff are not yet released");
});

test("connections section explains the ecosystem without exposing backend details", async ({ page }) => {
  await page.goto("/#connections");
  const section = page.locator("#connections");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("connect");
  await expect(section).toContainText("Academic context");
  await expect(section).toContainText("AI-powered study layer");
  await expect(section).toContainText("Campus wayfinding");
  await expect(section).not.toContainText("Supabase");
  await expect(section).not.toContainText("cookie");
});

test("Macquarie and incubator sections use the exact approved wording", async ({ page }) => {
  await page.goto("/#macquarie");
  await expect(page.locator("#macquarie")).toContainText("not an official university service");

  await page.goto("/#incubator");
  const incubator = page.locator("#incubator");
  await expect(incubator).toContainText("Selected for the Macquarie University Incubator in May 2026.");
  await expect(incubator).toContainText("mentoring, customer discovery and founder development");
  await expect(incubator).toContainText("not an official university service");
});

test("roadmap section presents three future-facing phases without naming a Sydney university", async ({ page }) => {
  await page.goto("/#vision");
  const section = page.locator("#vision");
  await expect(section).toContainText("Macquarie University");
  await expect(section).toContainText("Expansion to other Sydney universities");
  await expect(section).toContainText("Australia-wide expansion");
  await expect(section).not.toContainText("UNSW");
  await expect(section).not.toContainText("University of Sydney");
});

test("team section credits both founders with neutral titles", async ({ page }) => {
  await page.goto("/#team");
  const section = page.locator("#team");
  await expect(section).toContainText("Co-founder, Software Engineering & Product");
  await expect(section).toContainText("Co-founder, Backend & Platform Engineering");
  await expect(section.getByRole("link", { name: /LinkedIn/ })).toHaveCount(2);
  await expect(section.getByRole("link", { name: /GitHub/ })).toHaveCount(2);
});
