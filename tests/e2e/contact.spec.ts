import { expect, test, type Page } from "@playwright/test";

async function openContact(page: Page) {
  await page.goto("/#contact");
  await page.locator("#contact form").scrollIntoViewIfNeeded();
}

test("shows field errors and focuses the first one", async ({ page }) => {
  await openContact(page);
  await page.getByRole("button", { name: "Send message" }).click();

  const name = page.getByLabel("Name", { exact: true });
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please choose a budget.")).toBeVisible();
});

test("keeps what was typed after an error, then sends", async ({ page }) => {
  await openContact(page);
  await page.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
  await page.getByLabel("E-mail", { exact: true }).fill("ada@example.com");
  await page.getByLabel("Budget").selectOption("Not sure yet");
  await page.getByLabel("Message").fill("Too short");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByLabel("Message")).toBeFocused();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Ada Lovelace");

  await page.getByLabel("Message").fill("I'd like a portfolio with a CMS and a contact form.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("your message is on its way");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form still validates and sends", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter a valid e-mail address.")).toBeVisible();

    await page.getByLabel("E-mail", { exact: true }).fill("ada@example.com");
    await page.getByLabel("Budget").selectOption("Not sure yet");
    await page.getByLabel("Message").fill("I'd like a portfolio with a CMS and a contact form.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("your message is on its way");
  });
});
