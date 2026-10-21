import "server-only";
import { createHash } from "node:crypto";
import { lt, sql } from "drizzle-orm";
import { db, type Database } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";

// Every limiter counts in windows of one hour at most: the privacy policy promises the
// counters are gone after an hour, and the clean-up below relies on it
const HOUR = 3600;

/**
 * Who's asking, without knowing who: a salted SHA-256 of the IP address and the route.
 * The IP itself is never stored. Null without RATE_LIMIT_SALT.
 */
export function visitorKey(ip: string, route: string): string | null {
  const salt = process.env.RATE_LIMIT_SALT;
  if (!salt) return null;
  return createHash("sha256").update(`${salt}:${ip}:${route}`).digest("hex");
}

/** The visitor's IP address, as Vercel passes it on */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/**
 * Counts one more request for `key` in the current window, and says whether it's still
 * within `max`. One atomic upsert does the counting, so concurrent requests can't both
 * slip through. Windows that ended are deleted on the way. Without a database or a key,
 * everything is allowed: the site keeps working in CI and in a fresh clone.
 */
export async function limit(
  key: string | null,
  max: number,
  windowSeconds: number,
  { database = db(), now = new Date() }: { database?: Database | null; now?: Date } = {}
): Promise<{ allowed: boolean; count: number }> {
  if (windowSeconds > HOUR) throw new Error("Rate-limit windows can't be longer than an hour");
  if (!database || !key) return { allowed: true, count: 0 };

  const windowStart = new Date(Math.floor(now.getTime() / (windowSeconds * 1000)) * windowSeconds * 1000);
  const [[row]] = await Promise.all([
    database
      .insert(rateLimits)
      .values({ key, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: [rateLimits.key, rateLimits.windowStart],
        set: { count: sql`${rateLimits.count} + 1` },
      })
      .returning({ count: rateLimits.count }),
    database.delete(rateLimits).where(lt(rateLimits.windowStart, new Date(now.getTime() - HOUR * 1000))),
  ]);
  return { allowed: row.count <= max, count: row.count };
}
