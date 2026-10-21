import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";
import type { Database } from "./index";

/** A fresh Postgres in memory (PGlite) with every migration applied: for tests only */
export async function testDatabase(): Promise<Database> {
  const database = drizzle(new PGlite(), { schema });
  await migrate(database, { migrationsFolder: path.resolve(import.meta.dirname, "../../drizzle") });
  return database as unknown as Database;
}
