import { expect, test } from "@playwright/test";

test("the menu links to every page, and marks the current one", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Main" });
  await expect(menu.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");

  await menu.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Services");
});

test("a project opens from the works list, and links back", async ({ page }) => {
  await page.goto("/works");
  await page.getByRole("link", { name: /Mirelle Health/ }).click();
  await expect(page).toHaveURL(/\/works\/mirelle-health$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mirelle Health");

  await page.getByRole("link", { name: /All works/ }).click();
  await expect(page).toHaveURL(/\/works$/);
});

test("unknown pages show the 404 page", async ({ page }) => {
  const response = await page.goto("/works/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lost in the grid");
});

test("the footer links to the legal pages", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const privacy = footer.getByRole("link", { name: "Privacy Policy" });

  // Keyboard users reach the footer: focusing a link scrolls it into view
  await privacy.focus();
  await expect(privacy).toBeInViewport();

  await privacy.click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy");

  const terms = page.getByRole("contentinfo").getByRole("link", { name: "Terms & Conditions" });
  await terms.focus();
  await terms.click();
  await expect(page).toHaveURL(/\/terms$/);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("testimonials are listed one after the other", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".testimonial-card");
    await expect(cards).toHaveCount(4);
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height);
  });
});
