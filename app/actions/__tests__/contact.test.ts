import { describe, expect, it } from "vitest";
import { submitContact } from "@/app/actions/contact";
import { initialContactState } from "@/lib/contact/schema";

function form(fields: Record<string, string>) {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => data.set(key, value));
  return data;
}

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  budget: "Not sure yet",
  message: "I'd like a portfolio with a CMS and a contact form.",
};

describe("submitContact", () => {
  it("succeeds with a valid enquiry", async () => {
    await expect(submitContact(initialContactState, form(valid))).resolves.toEqual({
      status: "success",
    });
  });

  it("returns the first error per field, and the values to refill the form", async () => {
    const state = await submitContact(
      initialContactState,
      form({ ...valid, email: "nope", message: "short" })
    );

    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(state.fieldErrors).toEqual({
      email: "Please enter a valid e-mail address.",
      message: "Tell me a bit more: at least 20 characters.",
    });
    expect(state.values.name).toBe("Ada Lovelace");
  });

  it("silently accepts a filled honeypot without validating", async () => {
    await expect(
      submitContact(initialContactState, form({ company: "Spam Inc." }))
    ).resolves.toEqual({ status: "success" });
  });
});
