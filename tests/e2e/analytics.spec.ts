import { expect, test } from "@playwright/test";

// The test build runs without the Umami variables (playwright.config.ts)
test("Umami doesn't load without its variables", async ({ page }) => {
  const umamiRequests: string[] = [];
  page.on("request", (request) => {
    if (/umami/.test(request.url())) umamiRequests.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("script[data-website-id]")).toHaveCount(0);
  expect(umamiRequests).toEqual([]);
});

test("llms.txt says the analytics are cookieless", async ({ request }) => {
  const text = await (await request.get("/llms.txt")).text();
  expect(text).toContain("Analytics are cookieless");
});
