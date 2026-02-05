import { drizzle } from "drizzle-orm/node-postgres"
import { MiddlewareHandler } from "hono"
import pg from "pg"
import * as schema from "./schema"

export const dbMiddleware: MiddlewareHandler = async (c, next) => {
  const connectionString = c.env.HYPERDRIVE?.connectionString ?? c.env.DATABASE_URL

  if (!connectionString) {
    return c.json({ error: "Database not configured" }, 500)
  }

  const pool = new pg.Pool({ connectionString })
  const db = drizzle(pool, { schema })

  c.set("db", db)
  c.set("pool", pool)

  await next()

  await pool.end()
}
