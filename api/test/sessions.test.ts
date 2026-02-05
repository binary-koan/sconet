import bcrypt from "bcryptjs"
import { describe, expect, it } from "vitest"
import { db, request } from "./setup"
import { users } from "../src/db/schema"

describe("Sessions API", () => {
  describe("POST /login", () => {
    it("returns JWT token for valid credentials", async () => {
      const password = "testpassword123"
      const passwordHash = await bcrypt.hash(password, 10)

      await db.insert(users).values({
        email: "login-test@example.com",
        passwordDigest: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const res = await request("POST", "/login", {
        body: { email: "login-test@example.com", password },
        token: null // Login doesn't require auth
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.token).toBeDefined()
      expect(typeof data.token).toBe("string")
    })

    it("returns 401 for invalid email", async () => {
      const res = await request("POST", "/login", {
        body: { email: "nonexistent@example.com", password: "anypassword" },
        token: null
      })

      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.error).toBe("Invalid email or password")
    })

    it("returns 401 for invalid password", async () => {
      const passwordHash = await bcrypt.hash("correctpassword", 10)

      await db.insert(users).values({
        email: "wrong-password@example.com",
        passwordDigest: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const res = await request("POST", "/login", {
        body: { email: "wrong-password@example.com", password: "wrongpassword" },
        token: null
      })

      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.error).toBe("Invalid email or password")
    })

    it("returns 400 for missing email", async () => {
      const res = await request("POST", "/login", {
        body: { password: "somepassword" },
        token: null
      })

      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data.error).toBe("Email and password are required")
    })

    it("returns 400 for missing password", async () => {
      const res = await request("POST", "/login", {
        body: { email: "test@example.com" },
        token: null
      })

      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data.error).toBe("Email and password are required")
    })

    it("returned token can be used to access protected routes", async () => {
      const password = "testpassword123"
      const passwordHash = await bcrypt.hash(password, 10)

      await db.insert(users).values({
        email: "token-test@example.com",
        passwordDigest: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Login to get token
      const loginRes = await request("POST", "/login", {
        body: { email: "token-test@example.com", password },
        token: null
      })

      const { token } = await loginRes.json()

      // Use token to access protected route
      const accountsRes = await request("GET", "/accounts", { token })
      expect(accountsRes.status).toBe(200)
    })
  })
})
