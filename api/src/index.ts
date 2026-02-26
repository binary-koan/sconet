import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { jwt } from "hono/jwt"
import pg from "pg"
import type { Database, User } from "./db"
import { dbMiddleware } from "./db/middleware"
import { users } from "./db/schema"
import accounts from "./routes/accounts"
import categories from "./routes/categories"
import { addLoginRoute } from "./routes/sessions"
import transactions from "./routes/transactions"

export type Bindings = {
  HYPERDRIVE?: Hyperdrive
  DATABASE_URL?: string
  JWT_SECRET: string
  LOGIN_RATE_LIMITER: RateLimit
}

export type Variables = {
  db: Database
  pool: pg.Client
  user: User
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use("*", dbMiddleware)

addLoginRoute(app)

app.use("*", async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: "HS256"
  })
  return jwtMiddleware(c, next)
})

app.use("*", async (c, next) => {
  const payload = c.get("jwtPayload")
  const userId = payload?.user_id

  if (!userId) {
    return c.json({ error: "Invalid token: missing user_id" }, 401)
  }

  const db = c.get("db")
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!user) {
    return c.json({ error: "User not found" }, 401)
  }

  c.set("user", user)
  await next()
})

app.route("/accounts", accounts)
app.route("/categories", categories)
app.route("/transactions", transactions)

export default app
