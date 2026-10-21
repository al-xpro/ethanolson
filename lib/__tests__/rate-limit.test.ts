// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { rateLimits } from "@/lib/db/schema";
import { testDatabase } from "@/lib/db/testing";
import { clientIp, limit, visitorKey } from "@/lib/rate-limit";
import type { Database } from "@/lib/db";

let database: Database;
const at = (time: string) => ({ database, now: new Date(`2026-10-21T${time}Z`) });

beforeEach(async () => {
  database = await testDatabase();
  process.env.RATE_LIMIT_SALT = "test-salt";
});
afterEach(() => {
  delete process.env.RATE_LIMIT_SALT;
});

describe("limit", () => {
  it("allows requests under the limit, and up to it", async () => {
    for (let count = 1; count <= 5; count++) {
      await expect(limit("visitor", 5, 3600, at("10:10:00"))).resolves.toEqual({ allowed: true, count });
    }
  });

  it("refuses the request over the limit", async () => {
    for (let i = 0; i < 5; i++) await limit("visitor", 5, 3600, at("10:10:00"));
    await expect(limit("visitor", 5, 3600, at("10:50:00"))).resolves.toEqual({ allowed: false, count: 6 });
  });

  it("starts again in a new window", async () => {
    for (let i = 0; i < 6; i++) await limit("visitor", 5, 3600, at("10:10:00"));
    await expect(limit("visitor", 5, 3600, at("11:00:00"))).resolves.toEqual({ allowed: true, count: 1 });
  });

  it("counts each visitor on their own", async () => {
    for (let i = 0; i < 6; i++) await limit("one", 5, 3600, at("10:10:00"));
    await expect(limit("two", 5, 3600, at("10:10:00"))).resolves.toEqual({ allowed: true, count: 1 });
  });

  it("deletes windows that ended", async () => {
    await limit("old", 5, 3600, at("08:00:00"));
    await limit("visitor", 5, 3600, at("10:10:00"));
    const keys = (await database.select().from(rateLimits)).map((row) => row.key);
    expect(keys).toEqual(["visitor"]);
  });

  it("allows everything without a database or a key", async () => {
    await expect(limit("visitor", 0, 3600, { database: null })).resolves.toEqual({ allowed: true, count: 0 });
    await expect(limit(null, 0, 3600, { database })).resolves.toEqual({ allowed: true, count: 0 });
  });
});

describe("visitorKey", () => {
  it("is a salted hash, never the IP itself", () => {
    const key = visitorKey("203.0.113.7", "contact");
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.7");
    expect(visitorKey("203.0.113.7", "vitals")).not.toBe(key);
  });

  it("is null without a salt", () => {
    delete process.env.RATE_LIMIT_SALT;
    expect(visitorKey("203.0.113.7", "contact")).toBeNull();
  });
});

describe("clientIp", () => {
  it("takes the first address Vercel forwards", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });
});
