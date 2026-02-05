import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { sign } from "hono/jwt"
import { Bindings, Variables } from ".."
import { users } from "../db"

export const addLoginRoute = (app: Hono<{ Variables: Variables; Bindings: Bindings }>) => {
  app.post("/login", async (c) => {
    const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "unknown"
    const { success } = await c.env.LOGIN_RATE_LIMITER.limit({ key: ip })

    if (!success) {
      return c.json({ error: "Too many login attempts. Please try again later." }, 429)
    }

    const body = await c.req.json<{ email?: string; password?: string }>()

    if (!body.email || !body.password) {
      return c.json({ error: "Email and password are required" }, 400)
    }

    const db = c.get("db")
    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email)
    })

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401)
    }

    const passwordValid = await bcrypt.compare(body.password, user.passwordDigest)

    if (!passwordValid) {
      return c.json({ error: "Invalid email or password" }, 401)
    }

    const exp = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60 // 2 weeks
    const token = await sign({ user_id: user.id, exp }, c.env.JWT_SECRET, "HS256")

    return c.json({ token })
  })
}
