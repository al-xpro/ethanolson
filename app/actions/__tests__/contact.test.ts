import { describe, expect, it, vi } from "vitest";

// The action reads the visitor's address from the request
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7" }) }));

// The rate limiter is tested on its own (lib/__tests__/rate-limit.test.ts); here it's a switch
const rate = vi.hoisted(() => ({ allowed: true }));
const mail = vi.hoisted(() => ({ delivered: true }));
vi.mock("@/lib/email", () => ({ readableCall: (value: string) => value, sendEnquiry: async () => ({ delivered: mail.delivered }) }));
vi.mock("@/lib/rate-limit", () => ({
  clientIp: () => "203.0.113.7",
  visitorKey: () => "key",
  limit: async () => ({ allowed: rate.allowed, count: 0 }),
}));
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

  it("refuses a valid message over the limit, and keeps it in the form", async () => {
    rate.allowed = false;
    const state = await submitContact(initialContactState, form(valid));
    rate.allowed = true;

    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(state.formError).toMatch(/one message a day/);
    expect(state.values.message).toBe(valid.message);
  });

  it("keeps the message and explains when it couldn't be e-mailed", async () => {
    mail.delivered = false;
    const state = await submitContact(initialContactState, form(valid));
    mail.delivered = true;

    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(state.formError).toMatch(/couldn't be sent/);
    expect(state.values.message).toBe(valid.message);
  });
});
