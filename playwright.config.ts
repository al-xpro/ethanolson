import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // CI runners are small: one browser at a time keeps timings stable
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    // CI runners have no GPU: without WebGL the hero skips its 3D scene, which would
    // otherwise render in software and starve the page of CPU
    launchOptions: process.env.CI
      ? { args: ["--disable-gpu", "--disable-software-rasterizer"] }
      : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against a production build, like the real site
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // Test runs never reach real services: empty values win over .env.local, so no
    // analytics, no e-mails and no database (the features step aside without them)
    env: {
      NEXT_PUBLIC_UMAMI_WEBSITE_ID: "",
      NEXT_PUBLIC_UMAMI_SCRIPT_URL: "",
      RESEND_API_KEY: "",
      DATABASE_URL: "",
      RATE_LIMIT_SALT: "",
    },
  },
});
