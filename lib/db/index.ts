import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/** Any Drizzle Postgres database with this schema: Neon in production, PGlite in tests */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

let client: Database | undefined;

/**
 * The database, over Neon's HTTP driver (one request per query, nothing to keep open on a
 * serverless function). Null when DATABASE_URL isn't set, so features that need it can
 * step aside instead of failing (CI, a fresh clone).
 */
export function db(): Database | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  client ??= drizzle(neon(url), { schema }) as unknown as Database;
  return client;
}
