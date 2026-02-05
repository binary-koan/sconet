import { and, eq, isNotNull, isNull, max } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"
import type { Database } from "../db"
import { accounts, currencies, transactions } from "../db/schema"

const createAccountSchema = z.object({
  name: z.string().min(1),
  currencyId: z.string().uuid(),
  favourite: z.boolean().optional()
})

const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  currencyId: z.string().uuid().optional(),
  favourite: z.boolean().optional()
})

const reorderAccountsSchema = z.object({
  ids: z.array(z.string().uuid())
})

type Variables = {
  db: Database
}

const accountsRouter = new Hono<{ Variables: Variables }>()

// GET /accounts - List all accounts
accountsRouter.get("/", async (c) => {
  const db = c.get("db")
  const archived = c.req.query("archived") === "true"

  const results = await db.query.accounts.findMany({
    where: and(
      isNull(accounts.deletedAt),
      archived ? isNotNull(accounts.archivedAt) : isNull(accounts.archivedAt)
    ),
    orderBy: accounts.sortOrder,
    with: {
      currency: true,
      transactions: {
        where: isNull(transactions.deletedAt),
        columns: { id: true },
        limit: 1
      }
    }
  })

  return c.json(
    results.map((account) => ({
      id: account.id,
      name: account.name,
      favourite: account.favourite,
      sortOrder: account.sortOrder,
      hasTransactions: account.transactions.length > 0,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      currency: {
        id: account.currency.id,
        code: account.currency.code,
        name: account.currency.name,
        symbol: account.currency.symbol,
        decimalDigits: account.currency.decimalDigits
      }
    }))
  )
})

// GET /accounts/:id - Get a single account
accountsRouter.get("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, id), isNull(accounts.deletedAt)),
    with: {
      currency: true,
      transactions: {
        where: isNull(transactions.deletedAt),
        columns: { id: true },
        limit: 1
      }
    }
  })

  if (!account) {
    return c.json({ error: "Account not found" }, 404)
  }

  return c.json({
    id: account.id,
    name: account.name,
    favourite: account.favourite,
    sortOrder: account.sortOrder,
    hasTransactions: account.transactions.length > 0,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    currency: {
      id: account.currency.id,
      code: account.currency.code,
      name: account.currency.name,
      symbol: account.currency.symbol,
      decimalDigits: account.currency.decimalDigits
    }
  })
})

// POST /accounts - Create a new account
accountsRouter.post("/", async (c) => {
  const db = c.get("db")
  const parsed = createAccountSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  // Get max sort_order
  const [maxResult] = await db.select({ maxSortOrder: max(accounts.sortOrder) }).from(accounts)

  const sortOrder = (maxResult?.maxSortOrder ?? 0) + 1

  const [account] = await db
    .insert(accounts)
    .values({
      name: body.name,
      currencyId: body.currencyId,
      favourite: body.favourite ?? false,
      sortOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()

  // Fetch the currency for the response
  const currency = await db.query.currencies.findFirst({
    where: eq(currencies.id, account.currencyId)
  })

  return c.json(
    {
      id: account.id,
      name: account.name,
      favourite: account.favourite,
      sortOrder: account.sortOrder,
      hasTransactions: false,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      currency: currency
        ? {
            id: currency.id,
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            decimalDigits: currency.decimalDigits
          }
        : null
    },
    201
  )
})

// PATCH /accounts/:id - Update an account
accountsRouter.patch("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")
  const parsed = updateAccountSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const existing = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, id), isNull(accounts.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Account not found" }, 404)
  }

  const updates: Partial<typeof accounts.$inferInsert> = {
    updatedAt: new Date()
  }

  if (body.name !== undefined) updates.name = body.name
  if (body.currencyId !== undefined) updates.currencyId = body.currencyId
  if (body.favourite !== undefined) updates.favourite = body.favourite

  const [account] = await db.update(accounts).set(updates).where(eq(accounts.id, id)).returning()

  // Fetch the full account with currency for the response
  const fullAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, account.id),
    with: {
      currency: true,
      transactions: {
        where: isNull(transactions.deletedAt),
        columns: { id: true },
        limit: 1
      }
    }
  })

  return c.json({
    id: fullAccount!.id,
    name: fullAccount!.name,
    favourite: fullAccount!.favourite,
    sortOrder: fullAccount!.sortOrder,
    hasTransactions: fullAccount!.transactions.length > 0,
    createdAt: fullAccount!.createdAt,
    updatedAt: fullAccount!.updatedAt,
    currency: {
      id: fullAccount!.currency.id,
      code: fullAccount!.currency.code,
      name: fullAccount!.currency.name,
      symbol: fullAccount!.currency.symbol,
      decimalDigits: fullAccount!.currency.decimalDigits
    }
  })
})

// POST /accounts/:id/archive - Archive an account
accountsRouter.post("/:id/archive", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, id), isNull(accounts.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Account not found" }, 404)
  }

  const [account] = await db
    .update(accounts)
    .set({
      archivedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(accounts.id, id))
    .returning()

  return c.json({
    id: account.id,
    name: account.name,
    archivedAt: account.archivedAt
  })
})

// DELETE /accounts/:id - Soft delete an account and related transactions
accountsRouter.delete("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, id), isNull(accounts.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Account not found" }, 404)
  }

  const now = new Date()

  // Soft delete the account
  await db.update(accounts).set({ deletedAt: now, updatedAt: now }).where(eq(accounts.id, id))

  // Soft delete related transactions
  await db
    .update(transactions)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(transactions.accountId, id))

  return c.json({ success: true })
})

// POST /accounts/reorder - Reorder accounts
accountsRouter.post("/reorder", async (c) => {
  const db = c.get("db")
  const parsed = reorderAccountsSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  // Verify all IDs belong to active (non-archived) accounts
  const activeAccounts = await db.query.accounts.findMany({
    where: and(isNull(accounts.deletedAt), isNull(accounts.archivedAt)),
    columns: { id: true }
  })

  const activeIds = activeAccounts.map((a) => a.id).sort()
  const providedIds = [...body.ids].sort()

  if (JSON.stringify(activeIds) !== JSON.stringify(providedIds)) {
    return c.json({ error: "Must include all active account IDs" }, 400)
  }

  await Promise.all(
    body.ids.map((id, index) =>
      db
        .update(accounts)
        .set({
          sortOrder: index + 1,
          updatedAt: new Date()
        })
        .where(eq(accounts.id, id))
    )
  )

  return c.json({ success: true })
})

export default accountsRouter
