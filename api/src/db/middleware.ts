import { drizzle } from "drizzle-orm/node-postgres"
import { MiddlewareHandler } from "hono"
import pg from "pg"
import * as schema from "./schema"

export const dbMiddleware: MiddlewareHandler = async (c, next) => {
  const connectionString = c.env.HYPERDRIVE?.connectionString ?? c.env.DATABASE_URL

  if (!connectionString) {
    return c.json({ error: "Database not configured" }, 500)
  }

  const client = new pg.Client({ connectionString })
  await client.connect()
  const db = drizzle(client, { schema })

  c.set("db", db)
  c.set("pool", client)

  await next()

  c.executionCtx.waitUntil(client.end())
}
