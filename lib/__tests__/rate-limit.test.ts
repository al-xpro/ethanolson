// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { rateLimits } from "@/lib/db/schema";
import { testDatabase } from "@/lib/db/testing";
import { clientIp, limit, visitorKey } from "@/lib/rate-limit";
import type { Database } from "@/lib/db";

const DAY = 86_400;
let database: Database;
const at = (time: string) => ({ database, now: new Date(`2026-10-${time}Z`) });

beforeEach(async () => {
  database = await testDatabase();
  process.env.RATE_LIMIT_SALT = "test-salt";
});
afterEach(() => {
  delete process.env.RATE_LIMIT_SALT;
});

describe("limit", () => {
  it("allows the first message of the day", async () => {
    await expect(limit("visitor", 1, DAY, at("21T10:10:00"))).resolves.toEqual({ allowed: true, count: 1 });
  });

  it("refuses a second one the same day", async () => {
    await limit("visitor", 1, DAY, at("21T10:10:00"));
    await expect(limit("visitor", 1, DAY, at("21T23:50:00"))).resolves.toEqual({ allowed: false, count: 2 });
  });

  it("starts again the next day (from midnight UTC)", async () => {
    await limit("visitor", 1, DAY, at("21T10:10:00"));
    await limit("visitor", 1, DAY, at("21T10:20:00"));
    await expect(limit("visitor", 1, DAY, at("22T00:05:00"))).resolves.toEqual({ allowed: true, count: 1 });
  });

  it("counts each visitor on their own", async () => {
    await limit("one", 1, DAY, at("21T10:10:00"));
    await expect(limit("two", 1, DAY, at("21T10:10:00"))).resolves.toEqual({ allowed: true, count: 1 });
  });

  it("supports shorter windows too, up to a day", async () => {
    await limit("visitor", 5, 3600, at("21T10:10:00"));
    await expect(limit("visitor", 5, 3600, at("21T11:00:00"))).resolves.toEqual({ allowed: true, count: 1 });
    await expect(limit("visitor", 1, DAY + 1, at("21T11:00:00"))).rejects.toThrow("longer than a day");
  });

  it("deletes windows that ended", async () => {
    await limit("old", 1, DAY, at("20T08:00:00"));
    await limit("visitor", 1, DAY, at("21T10:10:00"));
    const keys = (await database.select().from(rateLimits)).map((row) => row.key);
    expect(keys).toEqual(["visitor"]);
  });

  it("allows everything without a database or a key", async () => {
    await expect(limit("visitor", 0, DAY, { database: null })).resolves.toEqual({ allowed: true, count: 0 });
    await expect(limit(null, 0, DAY, { database })).resolves.toEqual({ allowed: true, count: 0 });
  });
});

describe("visitorKey", () => {
  it("is a salted hash, never the IP itself", () => {
    const key = visitorKey("203.0.113.7", "contact");
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.7");
    expect(visitorKey("203.0.113.7", "other")).not.toBe(key);
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
