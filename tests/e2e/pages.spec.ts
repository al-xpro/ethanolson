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

test("the home works gallery links to the projects", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^Fieldbook, Editorial platform/ }).first().click();
  await expect(page).toHaveURL(/\/works\/fieldbook$/);
});

test("the about page is in the menu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 2, name: "Experience" })).toBeVisible();
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

test("focusing a testimonial link brings its card to the front", async ({ page }) => {
  await page.goto("/");
  const link = page.locator(".testimonial-card").nth(2).getByRole("link");
  await link.focus();
  await expect(async () => {
    const onTop = await link.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return element === hit || element.contains(hit);
    });
    expect(onTop).toBe(true);
  }).toPass();
});

test("the footer shows the page as an agent reads it", async ({ page }) => {
  await page.goto("/works/quarrow");
  const button = page.getByRole("button", { name: "View as an agent" });
  await button.focus();
  await button.click();
  const dialog = page.getByRole("dialog", { name: "This page, as agents read it" });
  await expect(dialog.locator("pre")).toContainText("# Quarrow");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});

test.describe("on phones", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the minimap opens the headings and jumps to one", async ({ page }) => {
    await page.goto("/privacy");
    await page.locator("#who-processes-the-data-for-me").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "On this page" }).click();

    const panel = page.getByRole("navigation", { name: "On this page" });
    await panel.getByRole("link", { name: "Cookies" }).click();
    await expect(page).toHaveURL(/#cookies$/);
    await expect(page.locator("#cookies")).toBeInViewport();
    await expect(panel).toBeHidden();
  });
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
