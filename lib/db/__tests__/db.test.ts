// @vitest-environment node
import { describe, expect, it } from "vitest";
import { rateLimits } from "@/lib/db/schema";
import { testDatabase } from "@/lib/db/testing";
import { db } from "@/lib/db";

describe("database", () => {
  it("applies the migrations and stores a rate-limit row", async () => {
    const database = await testDatabase();
    const windowStart = new Date("2026-10-21T10:00:00Z");
    await database.insert(rateLimits).values({ key: "hash", windowStart, count: 1 });

    const rows = await database.select().from(rateLimits);
    expect(rows).toEqual([{ key: "hash", windowStart, count: 1 }]);
  });

  it("keeps one row per key and window", async () => {
    const database = await testDatabase();
    const windowStart = new Date("2026-10-21T10:00:00Z");
    await database.insert(rateLimits).values({ key: "hash", windowStart });
    await expect(database.insert(rateLimits).values({ key: "hash", windowStart })).rejects.toThrow();
    expect(await database.select().from(rateLimits)).toHaveLength(1);
  });

  it("has no client without DATABASE_URL", () => {
    const saved = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    expect(db()).toBeNull();
    process.env.DATABASE_URL = saved;
  });
});
