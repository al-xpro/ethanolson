import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("with reduced motion, the services stack vertically", async ({ page }) => {
  await page.goto("/");

  const titles = page.locator("#services h3");
  await expect(titles).toHaveCount(4);

  const first = await titles.nth(0).boundingBox();
  const second = await titles.nth(1).boundingBox();
  expect(first && second).toBeTruthy();

  // Stacked: the second service is below the first, not beside it
  expect(second!.y).toBeGreaterThan(first!.y + first!.height);
  expect(Math.abs(second!.x - first!.x)).toBeLessThan(5);
});
