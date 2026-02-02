import { Hono } from "hono"
import { Kysely, PostgresDialect } from "kysely"
import pg from "pg"
import type { Database } from "./db/types"
import categories from "./routes/categories"
import transactions from "./routes/transactions"

type Bindings = {
  HYPERDRIVE?: Hyperdrive
  DATABASE_URL?: string
}

type Variables = {
  db: Kysely<Database>
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use("*", async (c, next) => {
  const connectionString =
    c.env.HYPERDRIVE?.connectionString ?? c.env.DATABASE_URL

  if (!connectionString) {
    return c.json({ error: "Database not configured" }, 500)
  }

  const pool = new pg.Pool({ connectionString })

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool })
  })

  c.set("db", db)

  await next()

  await pool.end()
})

app.route("/categories", categories)
app.route("/transactions", transactions)

export default app
