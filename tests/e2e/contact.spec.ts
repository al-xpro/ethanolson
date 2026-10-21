import { expect, test, type Page } from "@playwright/test";

const message = "I'd like a portfolio with a CMS and a contact form.";

async function openContact(page: Page) {
  await page.goto("/contact");
  await page.locator("form").scrollIntoViewIfNeeded();
}

test("the form links to the privacy policy", async ({ page }) => {
  await openContact(page);
  await page.locator("form").getByRole("link", { name: "privacy policy" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
});

test("pressing Enter in a field doesn't send the form", async ({ page }) => {
  await openContact(page);
  const name = page.getByLabel("Name", { exact: true });
  await name.fill("Ada");
  await name.press("Enter");
  await expect(name).toBeFocused();
  await expect(page.getByText("Please enter a valid e-mail address.")).toBeHidden();
});

test("errors show after leaving a field, and clear while typing", async ({ page }) => {
  await openContact(page);
  const name = page.getByLabel("Name", { exact: true });

  await name.fill("A");
  await name.blur();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Please enter your name.")).toBeVisible();

  await name.focus();
  await page.keyboard.type("da");
  await expect(page.getByText("Please enter your name.")).toBeHidden();
  await expect(name).toHaveAttribute("aria-invalid", "false");
});

test("leaving an empty field shows no error; Send shows them all", async ({ page }) => {
  await openContact(page);
  const name = page.getByLabel("Name", { exact: true });
  await name.focus();
  await name.blur();
  await expect(page.getByText("Please enter your name.")).toBeHidden();

  // aria-disabled: looks disabled, but people can still press it to see what's missing.
  // Playwright treats it as disabled, so the click is forced.
  await page.getByRole("button", { name: "Send message" }).click({ force: true });
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please choose a budget.")).toBeVisible();
  await expect(name).toBeFocused();
});

test("the button unlocks once the form is valid, then sends", async ({ page }) => {
  await openContact(page);
  const send = page.getByRole("button", { name: "Send message" });
  await expect(send).toHaveAttribute("aria-disabled", "true");

  await page.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
  await page.getByLabel("E-mail", { exact: true }).fill("ada@example.com");
  await page.getByLabel("Budget").selectOption("Not sure yet");
  await expect(send).toHaveAttribute("aria-disabled", "true");

  await page.getByLabel("Message").fill(message);
  await expect(send).toHaveAttribute("aria-disabled", "false");
  await send.click();
  await expect(page.getByRole("status")).toContainText("your message is on its way");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form still validates on the server and sends", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter a valid e-mail address.")).toBeVisible();

    await page.getByLabel("E-mail", { exact: true }).fill("ada@example.com");
    await page.getByLabel("Budget").selectOption("Not sure yet");
    await page.getByLabel("Message").fill(message);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("your message is on its way");
  });
});

test("the availability calendar shows the times of a free day", async ({ page }) => {
  await page.goto("/contact");
  const calendar = page.getByRole("heading", { name: "Availability" }).locator("..");
  await calendar.scrollIntoViewIfNeeded();

  // The pattern changes every month, so look at next month: it's always fully ahead
  await calendar.getByRole("button", { name: "Next month" }).click();
  const free = calendar.locator("ol").getByRole("button");
  await expect(free.first()).toBeVisible();
  await free.last().click();
  await expect(free.last()).toHaveAttribute("aria-pressed", "true");
  await expect(calendar.locator("[aria-live] li").first()).toHaveText(/\d{2}:\d{2}–\d{2}:\d{2}/);
});
