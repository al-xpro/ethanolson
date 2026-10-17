import { expect, test, type Page } from "@playwright/test";

const message = "I'd like a portfolio with a CMS and a contact form.";

async function openContact(page: Page) {
  await page.goto("/contact");
  await page.locator("form").scrollIntoViewIfNeeded();
}

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

test("the button unlocks once the form is valid, then sends", async ({ page }) => {
  await openContact(page);
  const send = page.getByRole("button", { name: "Send message" });
  await expect(send).toBeDisabled();

  await page.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
  await page.getByLabel("E-mail", { exact: true }).fill("ada@example.com");
  await page.getByLabel("Budget").selectOption("Not sure yet");
  await expect(send).toBeDisabled();

  await page.getByLabel("Message").fill(message);
  await expect(send).toBeEnabled();
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
