import { eq } from "drizzle-orm"
import { sign } from "hono/jwt"
import pg from "pg"
import { afterAll, beforeAll, beforeEach } from "vitest"
import { createDbWithPool, type Database } from "../src/db"
import {
  accounts,
  categories,
  categoryBudgets,
  currencies,
  transactions,
  users
} from "../src/db/schema"
import app from "../src/index"

export let pool: pg.Pool
export let db: Database
export let testUser: typeof users.$inferSelect
export let testCurrency: typeof currencies.$inferSelect
export let authToken: string

const JWT_SECRET = "test-secret-key"

// Mock rate limiter that always allows requests
const mockRateLimiter = {
  limit: async () => ({ success: true })
}

// Helper to make authenticated requests to the app
export async function request(
  method: string,
  path: string,
  options: { body?: unknown; token?: string | null } = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  // Use provided token, or default to authToken, or skip auth if explicitly null
  const tokenToUse = options.token === null ? null : (options.token ?? authToken)
  if (tokenToUse) {
    headers["Authorization"] = `Bearer ${tokenToUse}`
  }

  const res = await app.request(
    path,
    {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    },
    {
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET,
      LOGIN_RATE_LIMITER: mockRateLimiter
    }
  )

  return res
}

beforeAll(async () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required for tests")
  }

  pool = new pg.Pool({ connectionString })
  db = createDbWithPool(pool)

  // Create or find test currency
  const existingCurrency = await db.query.currencies.findFirst({
    where: eq(currencies.code, "TEST")
  })

  if (existingCurrency) {
    testCurrency = existingCurrency
  } else {
    const [currency] = await db
      .insert(currencies)
      .values({
        code: "TEST",
        name: "Test Currency",
        symbol: "T",
        decimalDigits: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()
    testCurrency = currency
  }

  // Create or find test user
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, "test@example.com")
  })

  if (existingUser) {
    testUser = existingUser
  } else {
    const [user] = await db
      .insert(users)
      .values({
        email: "test@example.com",
        passwordDigest: "$2a$10$test.hash.for.testing.only",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()
    testUser = user
  }

  // Generate auth token for test user
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
  authToken = await sign({ user_id: testUser.id, exp }, JWT_SECRET, "HS256")
})

beforeEach(async () => {
  // Clean up test data before each test
  await db.delete(transactions)
  await db.delete(categoryBudgets)
  await db.delete(categories)
  await db.delete(accounts)
  // Clean up test users except the main test user
  const { ne } = await import("drizzle-orm")
  await db.delete(users).where(ne(users.email, "test@example.com"))
})

afterAll(async () => {
  await pool.end()
})
