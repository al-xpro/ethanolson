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

test("leaving fields shows no errors; Send shows them all", async ({ page }) => {
  await openContact(page);
  const name = page.getByLabel("Name", { exact: true });
  const email = page.getByLabel("E-mail", { exact: true });

  await name.fill("A");
  await email.fill("not an e-mail");
  await email.blur();
  await expect(page.getByText("Please enter your name.")).toBeHidden();
  await expect(page.getByText("Please enter a valid e-mail address.")).toBeHidden();

  // aria-disabled: looks disabled, but people can still press it to see what's missing.
  // Playwright treats it as disabled, so the click is forced.
  await page.getByRole("button", { name: "Send message" }).click({ force: true });
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter a valid e-mail address.")).toBeVisible();
  await expect(page.getByText("Please choose a budget.")).toBeVisible();
  await expect(name).toBeFocused();
});

test("after Send, errors clear while typing and follow the field", async ({ page }) => {
  await openContact(page);
  const name = page.getByLabel("Name", { exact: true });
  await page.getByRole("button", { name: "Send message" }).click({ force: true });
  await expect(name).toHaveAttribute("aria-invalid", "true");

  await name.focus();
  await page.keyboard.type("A");
  await expect(page.getByText("Please enter your name.")).toBeHidden();
  await name.blur();
  await expect(page.getByText("Please enter your name.")).toBeVisible();

  await name.focus();
  await page.keyboard.type("da");
  await name.blur();
  await expect(page.getByText("Please enter your name.")).toBeHidden();
  await expect(name).toHaveAttribute("aria-invalid", "false");
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

test("the date picker chooses a free call slot with the keyboard", async ({ page }) => {
  await openContact(page);
  const trigger = page.getByRole("button", { name: /Preferred call/ });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Choose a day and a time for a call" });
  await expect(dialog).toBeVisible();

  // Next month is always fully ahead, so it always has free days
  await page.keyboard.press("PageDown");
  const free = dialog.getByRole("gridcell").getByRole("button", { name: /, free$/ });
  await free.first().focus();
  await page.keyboard.press("Enter");
  const time = dialog.getByRole("group").getByRole("button").first();
  await expect(time).toBeFocused();
  const slot = (await time.textContent())!;
  await page.keyboard.press("Enter");

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText(slot);
  await expect(page.locator('input[name="call"]')).toHaveValue(new RegExp(`^\\d{4}-\\d{2}-\\d{2} ${slot}$`));

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test.describe("on phones", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("the date picker opens as a drawer that picks a slot and closes", async ({ page }) => {
    await openContact(page);
    const trigger = page.getByRole("button", { name: /Preferred call/ });
    await trigger.click();
    const drawer = page.getByRole("dialog", { name: "Preferred call" });
    await expect(drawer).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.keyboard.press("PageDown");
    await drawer.getByRole("gridcell").getByRole("button", { name: /, free$/ }).first().tap();
    const time = drawer.getByRole("group").getByRole("button").first();
    const slot = (await time.textContent())!;
    await time.tap();
    await expect(drawer).toBeHidden();
    await expect(trigger).toContainText(slot);
  });
});
