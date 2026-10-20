import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { isSigned } from "@/lib/cms/webhook";

describe("isSigned", () => {
  const body = JSON.stringify({ action: "published", story_id: 1 });
  const signature = createHmac("sha1", "secret").update(body).digest("hex");

  it("accepts Storyblok's signature and rejects anything else", () => {
    expect(isSigned(body, signature, "secret")).toBe(true);
    expect(isSigned(body, signature, "other")).toBe(false);
    expect(isSigned(`${body} `, signature, "secret")).toBe(false);
    expect(isSigned(body, null, "secret")).toBe(false);
  });
});
