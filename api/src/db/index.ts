import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema"
import { users } from "./schema"

export * from "./schema"

export type Database = ReturnType<typeof createDb>
export type User = typeof users.$inferSelect

export function createDb(connectionString: string) {
  const pool = new pg.Pool({ connectionString })
  return drizzle(pool, { schema })
}

export function createDbWithPool(pool: pg.Pool) {
  return drizzle(pool, { schema })
}
