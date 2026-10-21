import { defineConfig } from "drizzle-kit";

// `npm run db:generate` writes a migration from lib/db/schema.ts into drizzle/;
// `npm run db:migrate` applies the pending ones to DATABASE_URL.
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
