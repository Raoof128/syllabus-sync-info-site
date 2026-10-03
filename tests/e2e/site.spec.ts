import { expect, test } from "@playwright/test";

test("homepage exposes the product story and safe links", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Syllabus Sync/);
  await expect(page.getByRole("heading", { level: 1, name: "A clearer workspace for university life." })).toBeVisible();
  const appLinks = page.getByRole("main").getByRole("link", { name: "Open Syllabus Sync", exact: true });
  await expect(appLinks.first()).toHaveAttribute("href", "https://www.syllabus-sync.app");
  await expect(page.getByRole("link", { name: "Open Sylla", exact: true }).first()).toHaveAttribute("href", "https://sylla.syllabus-sync.app");
  await expect(page.getByRole("heading", { level: 2, name: "Student technology should earn trust." })).toBeVisible();
});

test("primary navigation reaches a supporting page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1, name: "Contact Syllabus Sync" })).toBeVisible();
});

test("header keeps one app action and makes Campus Navigation discoverable", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header.getByRole("link", { name: "Sign in", exact: true })).toHaveCount(0);
  await expect(header.getByRole("link", { name: "Open Syllabus Sync" })).toHaveCount(1);
  await header.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Campus Navigation" }).click();
  await expect(page).toHaveURL(/#campus-navigation$/);
  await expect(page.locator("#campus-navigation")).toBeVisible();
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

test("FAQ distinguishes the platform, mobile companion and separate event project", async ({ page }) => {
  await page.goto("/#faq");
  for (const question of ["What is Sylla?", "What is Campus Navigation?", "What is Astronomy Open Night?"]) {
    await page.locator("summary").filter({ hasText: question }).click();
  }
  await expect(page.locator(".faq details").filter({ hasText: "What is Sylla?" }).locator("p")).toContainText("AI-assisted study layer");
  await expect(page.locator(".faq details").filter({ hasText: "What is Campus Navigation?" }).locator("p")).toContainText("destination deep links");
  await expect(page.locator(".faq details").filter({ hasText: "What is Astronomy Open Night?" }).locator("p")).toContainText("not a Syllabus Sync product");
});

test("small-screen product cards and menu do not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(menu.getByRole("link", { name: "Campus Navigation" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Open Syllabus Sync" })).toBeVisible();
  await expect(menu.getByRole("link", { name: /Sign in/ })).toHaveCount(0);
});

test("product layout fits phone, tablet and desktop widths", async ({ page }) => {
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#ecosystem");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator("#campus-navigation")).toBeVisible();
  }
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

test("Astronomy Open Night support & terms are live and in the sitemap", async ({ page, request }) => {
  for (const path of ["/astronomy-open-night", "/astronomy-open-night/support", "/astronomy-open-night/terms"]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should resolve`).toBe(true);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/astronomy-open-night/support");
  expect(sitemap).toContain("/astronomy-open-night/terms");
  // The privacy policy has ONE canonical home (the AON app); the info site does
  // not host a copy and must not list one in its sitemap.
  expect(sitemap).not.toContain("/astronomy-open-night/privacy");

  // The old privacy path redirects to the canonical AON policy URL.
  const privacy = await request.get("/astronomy-open-night/privacy", { maxRedirects: 0 });
  expect([301, 308]).toContain(privacy.status());
  expect(privacy.headers()["location"]).toBe("https://aon.syllabus-sync.app/privacy");

  // The first published names for these pages were publicly reachable before the
  // rename, so they redirect instead of 404ing.
  const legacy: Record<string, string> = {
    "/astronomy-open-night/app-privacy": "https://aon.syllabus-sync.app/privacy",
    "/astronomy-open-night/app-support": "/astronomy-open-night/support",
    "/astronomy-open-night/app-terms": "/astronomy-open-night/terms",
  };
  for (const [from, to] of Object.entries(legacy)) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect([301, 308], `${from} should redirect`).toContain(response.status());
    expect(response.headers()["location"]).toBe(to);
  }

  await page.goto("/astronomy-open-night/terms");
  const main = page.getByRole("main");
  await expect(main).toContainText("Google Maps");
  // Google's terms must be a real, clickable link for reviewers.
  await expect(main.getByRole("link", { name: "Google Maps/Google Earth Additional Terms of Service" }))
    .toHaveAttribute("href", "https://maps.google.com/help/terms_maps/");

  await page.goto("/astronomy-open-night/nope");
  await expect(page.getByRole("heading", { level: 1, name: "That page is out of the plan." })).toBeVisible();
});

test("unknown routes show useful navigation", async ({ page }) => {
  await page.goto("/not-a-real-page");
  await expect(page.getByRole("heading", { level: 1, name: "That page is out of the plan." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});

test("product showcase exposes four entries with accurate relationships and screenshots", async ({ page }) => {
  await page.goto("/#ecosystem");
  await expect(page.locator("#platform")).toContainText("Syllabus Sync Platform");
  await expect(page.locator("#platform")).toContainText("Web platform available in early access");
  await expect(page.locator("#sylla")).toContainText("AI chat available in early access");
  await expect(page.locator("#sylla")).toContainText("Flashcards");
  await expect(page.locator("#campus-navigation")).toContainText("Mobile release links coming soon");
  await expect(page.locator("#campus-navigation")).not.toContainText("Open web app");
  await expect(page.locator("#astronomy-open-night")).toContainText("Separate team project");
  await expect(page.locator("#astronomy-open-night")).toContainText("QR passport rally");
  await expect(page.locator("#astronomy-open-night .status-pill").first()).toHaveClass(/status-pill-available/);
  for (const id of ["platform", "sylla", "campus-navigation", "astronomy-open-night"]) {
    const image = page.locator(`#${id} img`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test("Astronomy Open Night is presented as a separate event project", async ({ page }) => {
  await page.goto("/#astronomy-open-night");
  const card = page.locator("#astronomy-open-night");
  await expect(card).toContainText("separate event");
  await expect(card).not.toContainText("Syllabus Sync");
  await expect(card.getByRole("link", { name: /Download on the App Store/ })).toHaveAttribute("href", "https://apps.apple.com/au/app/astronomy-open-night-2026/id6808865067");
  await expect(card.getByRole("link", { name: /Get for Android/ })).toHaveAttribute("href", "https://info.syllabus-sync.app/astronomy-open-night/android");
  // The repository is private, so the card must not offer a link the public cannot open.
  await expect(card.getByRole("link", { name: /GitHub/i })).toHaveCount(0);
});

test("connections section explains the ecosystem without exposing backend details", async ({ page }) => {
  await page.goto("/#connections");
  const section = page.locator("#connections");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("connect");
  await expect(section.getByRole("article")).toHaveCount(2);
  await expect(section).toContainText("Syllabus Sync Platform");
  await expect(section).toContainText("Campus Navigation");
  await expect(section).toContainText("not part of the Syllabus Sync platform");
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
  await expect(section).toContainText("Co-founder, Software Engineering & Product Development");
  await expect(section).toContainText("Co-founder, Backend & Platform Engineering");
  await expect(section.getByRole("link", { name: /LinkedIn/ })).toHaveCount(2);
  await expect(section.getByRole("link", { name: /GitHub/ })).toHaveCount(2);
});
