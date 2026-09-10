import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/aon",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:8788", screenshot: "only-on-failure", trace: "retain-on-failure" },
  webServer: { command: "npm run aon:preview", url: "http://127.0.0.1:8788/privacy", timeout: 120_000, reuseExistingServer: !process.env.CI },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
