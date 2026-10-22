// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readableCall, sendEnquiry } from "@/lib/email";

const send = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));

const enquiry = {
  name: "Ada\r\nBcc: someone@example.com",
  email: "ada@example.com",
  budget: "Not sure yet",
  call: "No call requested",
  message: "I'd like a portfolio with a CMS and a contact form.",
};

beforeEach(() => {
  process.env.RESEND_API_KEY = "re_test";
  send.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  delete process.env.RESEND_API_KEY;
  vi.restoreAllMocks();
});

describe("sendEnquiry", () => {
  it("logs the message in Resend, replying to the visitor, then sends a confirmation to them", async () => {
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    await expect(sendEnquiry(enquiry)).resolves.toEqual({ delivered: true });

    expect(send).toHaveBeenCalledTimes(2);
    const [toMe, toVisitor] = send.mock.calls.map(([options]) => options);
    expect(toMe).toMatchObject({ to: "delivered@resend.dev", replyTo: "ada@example.com" });
    expect(toVisitor).toMatchObject({ to: "ada@example.com", replyTo: "hello@ethanolson.alxpro.com" });
    // A name can't add lines (or headers) to the subject
    expect(toMe.subject).toBe("New enquiry from Ada Bcc: someone@example.com");
  });

  it("reports a failed notification, and sends no confirmation", async () => {
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    await expect(sendEnquiry(enquiry)).resolves.toEqual({ delivered: false });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("treats a thrown error like a failed notification", async () => {
    send.mockRejectedValue(new Error("network"));
    await expect(sendEnquiry(enquiry)).resolves.toEqual({ delivered: false });
  });

  it("still succeeds when only the confirmation fails, and logs it", async () => {
    send.mockResolvedValueOnce({ data: { id: "1" }, error: null }).mockResolvedValueOnce({ data: null, error: { message: "bounced" } });
    await expect(sendEnquiry(enquiry)).resolves.toEqual({ delivered: true });
    expect(console.error).toHaveBeenCalledWith("The confirmation couldn't be e-mailed:", { message: "bounced" });
  });

  it("sends nothing without an API key", async () => {
    delete process.env.RESEND_API_KEY;
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(sendEnquiry(enquiry)).resolves.toEqual({ delivered: true });
    expect(send).not.toHaveBeenCalled();
  });
});

describe("readableCall", () => {
  it("spells out a chosen slot", () => {
    expect(readableCall("2026-10-21 14:00–15:30")).toBe("Wednesday, 21 October 2026, 14:00–15:30 (Central European Time)");
  });

  it("says when no call was requested", () => {
    expect(readableCall("")).toBe("No call requested");
  });
});
