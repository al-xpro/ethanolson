import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

// One row per visitor key and time window: the rate limiter counts in it (lib/rate-limit.ts).
// The key is a salted hash, never an IP address.
export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.key, table.windowStart] })]
);
