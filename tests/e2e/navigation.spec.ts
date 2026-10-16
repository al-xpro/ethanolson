import { expect, test } from "@playwright/test";

test("the menu opens and closes with the keyboard", async ({ page }) => {
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

// Known bug: https://github.com/al-xpro/portfolio-project/issues/17
test.fixme("opening the menu moves focus to the first link", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).focus();
  await page.keyboard.press("Enter");

  const menu = page.getByRole("navigation", { name: "Main" });
  await expect(menu.getByRole("link", { name: "Home" })).toBeFocused();
});
