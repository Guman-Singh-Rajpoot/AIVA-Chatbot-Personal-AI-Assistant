import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// The app can run in two modes:
//  - With DATABASE_URL set: a real Postgres database is used (via Drizzle),
//    and all chat messages, tasks, memories and analyses are persisted.
//  - Without DATABASE_URL: server/storage.ts falls back to an in-memory
//    store so the app still runs out of the box for local development.
export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const pool = hasDatabase
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : undefined;

export const db = pool ? drizzle(pool, { schema }) : undefined;
