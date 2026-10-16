import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact/schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  budget: "€5k–15k",
  message: "I'd like a portfolio with a CMS and a contact form.",
};

describe("contactSchema", () => {
  it("accepts a complete enquiry and trims whitespace", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  Ada Lovelace  " });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Ada Lovelace");
  });

  it.each([
    ["name", "A", "Please enter your name."],
    ["email", "not-an-email", "Please enter a valid e-mail address."],
    ["budget", "A million", "Please choose a budget."],
    ["message", "Too short", "Tell me a bit more: at least 20 characters."],
  ])("rejects an invalid %s", (field, value, message) => {
    const result = contactSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([field]);
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it("rejects messages over 2,000 characters", () => {
    const result = contactSchema.safeParse({ ...valid, message: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });
});
