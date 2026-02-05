import { sign } from "hono/jwt"
import { describe, expect, it } from "vitest"
import { db, request } from "./setup"
import { users } from "../src/db/schema"

const JWT_SECRET = "test-secret-key"

describe("Authorization", () => {
  describe("Protected routes require authentication", () => {
    const protectedRoutes = [
      { method: "GET", path: "/accounts" },
      { method: "POST", path: "/accounts" },
      { method: "GET", path: "/accounts/00000000-0000-0000-0000-000000000000" },
      { method: "PATCH", path: "/accounts/00000000-0000-0000-0000-000000000000" },
      { method: "DELETE", path: "/accounts/00000000-0000-0000-0000-000000000000" },
      { method: "POST", path: "/accounts/00000000-0000-0000-0000-000000000000/archive" },
      { method: "POST", path: "/accounts/reorder" },
      { method: "GET", path: "/categories" },
      { method: "POST", path: "/categories" },
      { method: "GET", path: "/categories/00000000-0000-0000-0000-000000000000" },
      { method: "PATCH", path: "/categories/00000000-0000-0000-0000-000000000000" },
      { method: "DELETE", path: "/categories/00000000-0000-0000-0000-000000000000" },
      { method: "POST", path: "/categories/00000000-0000-0000-0000-000000000000/archive" },
      { method: "POST", path: "/categories/reorder" },
      { method: "GET", path: "/transactions" },
      { method: "POST", path: "/transactions" },
      { method: "GET", path: "/transactions/00000000-0000-0000-0000-000000000000" },
      { method: "PATCH", path: "/transactions/00000000-0000-0000-0000-000000000000" },
      { method: "DELETE", path: "/transactions/00000000-0000-0000-0000-000000000000" }
    ]

    for (const { method, path } of protectedRoutes) {
      it(`${method} ${path} returns 401 without token`, async () => {
        const res = await request(method, path, { token: null })
        expect(res.status).toBe(401)
      })
    }
  })

  describe("Invalid tokens", () => {
    it("returns 401 for malformed token", async () => {
      const res = await request("GET", "/accounts", { token: "not-a-valid-jwt" })
      expect(res.status).toBe(401)
    })

    it("returns 401 for token with invalid signature", async () => {
      // Create a token signed with a different secret
      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = await sign({ user_id: "some-id", exp }, "wrong-secret", "HS256")

      const res = await request("GET", "/accounts", { token })
      expect(res.status).toBe(401)
    })

    it("returns 401 for expired token", async () => {
      // Create a token that expired 1 hour ago
      const exp = Math.floor(Date.now() / 1000) - 3600
      const token = await sign({ user_id: "some-id", exp }, JWT_SECRET, "HS256")

      const res = await request("GET", "/accounts", { token })
      expect(res.status).toBe(401)
    })

    it("returns 401 for token without user_id claim", async () => {
      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = await sign({ exp }, JWT_SECRET, "HS256")

      const res = await request("GET", "/accounts", { token })
      expect(res.status).toBe(401)
    })

    it("returns 401 for token with non-existent user_id", async () => {
      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = await sign(
        { user_id: "00000000-0000-0000-0000-000000000000", exp },
        JWT_SECRET,
        "HS256"
      )

      const res = await request("GET", "/accounts", { token })
      expect(res.status).toBe(401)
    })
  })

  describe("Valid authentication", () => {
    it("allows access with valid token", async () => {
      // The default request() uses a valid token from setup
      const res = await request("GET", "/accounts")
      expect(res.status).toBe(200)
    })

    it("allows access for newly created user", async () => {
      const [user] = await db
        .insert(users)
        .values({
          email: "new-auth-user@example.com",
          passwordDigest: "hash",
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = await sign({ user_id: user.id, exp }, JWT_SECRET, "HS256")

      const res = await request("GET", "/accounts", { token })
      expect(res.status).toBe(200)
    })
  })

  describe("Login endpoint is public", () => {
    it("POST /login does not require authentication", async () => {
      const res = await request("POST", "/login", {
        body: { email: "test@example.com", password: "wrong" },
        token: null
      })

      // Should get 401 for wrong password, not for missing auth
      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error).toBe("Invalid email or password")
    })
  })
})
