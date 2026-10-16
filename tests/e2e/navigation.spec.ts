import { expect, test } from "@playwright/test";

test("the menu closes even right after opening", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );

  await page.keyboard.press("Escape");
  const burger = page.getByRole("button", { name: "Open menu" });
  await expect(burger).toHaveAttribute("aria-expanded", "false");
  await expect(burger).toBeFocused();
});

test("opening the menu moves focus to the first link", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).focus();
  await page.keyboard.press("Enter");

  const menu = page.getByRole("navigation", { name: "Main" });
  await expect(menu.getByRole("link", { name: "Home" })).toBeFocused();

  // Closing after the opening animation has run reverses it
  await page.keyboard.press("Escape");
  const burger = page.getByRole("button", { name: "Open menu" });
  await expect(burger).toHaveAttribute("aria-expanded", "false");
  await expect(burger).toBeFocused();
});
