import { and, asc, desc, eq, gte, ilike, isNull, lte, or } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"
import type { Database } from "../db"
import { categories, currencies, transactions } from "../db/schema"

const transactionFilterSchema = z.object({
  dateFrom: z.coerce.date().optional(),
  dateUntil: z.coerce.date().optional(),
  minAmountCents: z.coerce.number().int().optional(),
  maxAmountCents: z.coerce.number().int().optional(),
  keyword: z.string().optional(),
  categoryIds: z
    .string()
    .transform((s) => s.split(",").filter(Boolean))
    .optional()
})

const createTransactionSchema = z.object({
  shop: z.string().default(""),
  memo: z.string().default(""),
  date: z.coerce.date(),
  includeInReports: z.boolean().default(true),
  amountCents: z.number().int().nullable().optional(),
  currencyId: z.uuid().nullable().optional(),
  shopAmountCents: z.number().int().nullable().optional(),
  shopCurrencyId: z.uuid().nullable().optional(),
  categoryId: z.uuid().nullable().optional(),
  accountId: z.uuid()
})

const updateTransactionSchema = z.object({
  shop: z.string().optional(),
  memo: z.string().optional(),
  date: z.coerce.date().optional(),
  includeInReports: z.boolean().optional(),
  amountCents: z.number().int().nullable().optional(),
  currencyId: z.uuid().nullable().optional(),
  shopAmountCents: z.number().int().nullable().optional(),
  shopCurrencyId: z.uuid().nullable().optional(),
  categoryId: z.uuid().nullable().optional(),
  accountId: z.uuid().optional()
})

type Variables = {
  db: Database
}

type CurrencyRow = {
  id: string
  code: string
  name: string
  symbol: string
  decimalDigits: number
}

function formatCurrency(currency: typeof currencies.$inferSelect | null): CurrencyRow | null {
  if (!currency) return null
  return {
    id: currency.id,
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    decimalDigits: currency.decimalDigits
  }
}

type CategoryRow = {
  id: string
  name: string
  color: string
  icon: string
  emoji: string | null
  isRegular: boolean
  sortOrder: number
}

function formatCategory(category: typeof categories.$inferSelect | null): CategoryRow | null {
  if (!category) return null
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    emoji: category.emoji,
    isRegular: category.regular,
    sortOrder: category.sortOrder
  }
}

const transactionsRouter = new Hono<{ Variables: Variables }>()

// GET /transactions - List transactions
transactionsRouter.get("/", async (c) => {
  const db = c.get("db")
  const parsed = transactionFilterSchema.safeParse(c.req.query())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const filter = parsed.data

  // Build the where conditions
  const conditions = [
    isNull(transactions.deletedAt),
    isNull(transactions.splitFromId) // Only top-level transactions
  ]

  if (filter.dateFrom) {
    conditions.push(gte(transactions.date, filter.dateFrom))
  }
  if (filter.dateUntil) {
    conditions.push(lte(transactions.date, filter.dateUntil))
  }
  if (filter.minAmountCents !== undefined) {
    conditions.push(gte(transactions.amountCents, filter.minAmountCents))
  }
  if (filter.maxAmountCents !== undefined) {
    conditions.push(lte(transactions.amountCents, filter.maxAmountCents))
  }
  if (filter.keyword) {
    conditions.push(
      or(
        ilike(transactions.shop, `%${filter.keyword}%`),
        ilike(transactions.memo, `%${filter.keyword}%`)
      )!
    )
  }

  // For category filtering, we need to use the raw query builder
  // because we need to check both parent and child transactions
  let results = await db.query.transactions.findMany({
    where: and(...conditions),
    orderBy: [desc(transactions.date), asc(transactions.amountCents), asc(transactions.shop)],
    with: {
      currency: true,
      shopCurrency: true,
      category: true,
      splitTo: {
        where: isNull(transactions.deletedAt),
        orderBy: [asc(transactions.amountCents), asc(transactions.shop)],
        with: {
          currency: true,
          shopCurrency: true,
          category: true
        }
      }
    }
  })

  // Filter by category IDs if provided (check both parent and child transactions)
  if (filter.categoryIds && filter.categoryIds.length > 0) {
    results = results.filter((t) => {
      const parentMatch = t.categoryId && filter.categoryIds!.includes(t.categoryId)
      const childMatch = t.splitTo.some(
        (split) => split.categoryId && filter.categoryIds!.includes(split.categoryId)
      )
      return parentMatch || childMatch
    })
  }

  return c.json(
    results.map((t) => ({
      id: t.id,
      shop: t.shop,
      memo: t.memo,
      date: t.date,
      includeInReports: t.includeInReports,
      amountCents: t.amountCents,
      shopAmountCents: t.shopAmountCents,
      accountId: t.accountId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      currency: formatCurrency(t.currency),
      shopCurrency: formatCurrency(t.shopCurrency),
      category: formatCategory(t.category),
      splitTo: t.splitTo.map((s) => ({
        id: s.id,
        shop: s.shop,
        memo: s.memo,
        date: s.date,
        includeInReports: s.includeInReports,
        amountCents: s.amountCents,
        shopAmountCents: s.shopAmountCents,
        accountId: s.accountId,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        currency: formatCurrency(s.currency),
        shopCurrency: formatCurrency(s.shopCurrency),
        category: formatCategory(s.category)
      }))
    }))
  )
})

// GET /transactions/:id - Get a single transaction
transactionsRouter.get("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const transaction = await db.query.transactions.findFirst({
    where: and(eq(transactions.id, id), isNull(transactions.deletedAt)),
    with: {
      currency: true,
      shopCurrency: true,
      category: true,
      account: {
        with: {
          currency: true
        }
      },
      splitTo: {
        where: isNull(transactions.deletedAt),
        orderBy: [asc(transactions.amountCents), asc(transactions.shop)],
        with: {
          currency: true,
          shopCurrency: true,
          category: true
        }
      }
    }
  })

  if (!transaction) {
    return c.json({ error: "Transaction not found" }, 404)
  }

  return c.json({
    id: transaction.id,
    shop: transaction.shop,
    memo: transaction.memo,
    date: transaction.date,
    includeInReports: transaction.includeInReports,
    amountCents: transaction.amountCents,
    shopAmountCents: transaction.shopAmountCents,
    splitFromId: transaction.splitFromId,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    currency: formatCurrency(transaction.currency),
    shopCurrency: formatCurrency(transaction.shopCurrency),
    category: formatCategory(transaction.category),
    account: transaction.account
      ? {
          id: transaction.account.id,
          name: transaction.account.name,
          favourite: transaction.account.favourite,
          sortOrder: transaction.account.sortOrder,
          currency: transaction.account.currency
            ? {
                id: transaction.account.currency.id,
                code: transaction.account.currency.code,
                name: transaction.account.currency.name,
                symbol: transaction.account.currency.symbol,
                decimalDigits: transaction.account.currency.decimalDigits
              }
            : null
        }
      : null,
    splitTo: transaction.splitTo.map((s) => ({
      id: s.id,
      shop: s.shop,
      memo: s.memo,
      date: s.date,
      includeInReports: s.includeInReports,
      amountCents: s.amountCents,
      shopAmountCents: s.shopAmountCents,
      accountId: s.accountId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      currency: formatCurrency(s.currency),
      shopCurrency: formatCurrency(s.shopCurrency),
      category: formatCategory(s.category)
    }))
  })
})

// POST /transactions - Create a new transaction
transactionsRouter.post("/", async (c) => {
  const db = c.get("db")
  const parsed = createTransactionSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const [transaction] = await db
    .insert(transactions)
    .values({
      shop: body.shop,
      memo: body.memo,
      date: body.date,
      includeInReports: body.includeInReports,
      amountCents: body.amountCents ?? null,
      currencyId: body.currencyId ?? null,
      shopAmountCents: body.shopAmountCents ?? null,
      shopCurrencyId: body.shopCurrencyId ?? null,
      categoryId: body.categoryId ?? null,
      accountId: body.accountId,
      updatedAt: new Date()
    })
    .returning()

  return c.json(
    {
      id: transaction.id,
      shop: transaction.shop,
      memo: transaction.memo,
      date: transaction.date,
      includeInReports: transaction.includeInReports,
      amountCents: transaction.amountCents,
      shopAmountCents: transaction.shopAmountCents,
      categoryId: transaction.categoryId,
      accountId: transaction.accountId,
      currencyId: transaction.currencyId,
      shopCurrencyId: transaction.shopCurrencyId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    },
    201
  )
})

// PATCH /transactions/:id - Update a transaction
transactionsRouter.patch("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")
  const parsed = updateTransactionSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const existing = await db.query.transactions.findFirst({
    where: and(eq(transactions.id, id), isNull(transactions.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Transaction not found" }, 404)
  }

  const updates: Partial<typeof transactions.$inferInsert> = {
    updatedAt: new Date()
  }

  // Parent attributes that cascade to splits
  const parentUpdates: Partial<typeof transactions.$inferInsert> = {}

  if (body.shop !== undefined) {
    updates.shop = body.shop
    parentUpdates.shop = body.shop
  }
  if (body.memo !== undefined) updates.memo = body.memo
  if (body.date !== undefined) {
    updates.date = body.date
    parentUpdates.date = body.date
  }
  if (body.includeInReports !== undefined) updates.includeInReports = body.includeInReports
  if (body.amountCents !== undefined) updates.amountCents = body.amountCents
  if (body.currencyId !== undefined) {
    updates.currencyId = body.currencyId
    parentUpdates.currencyId = body.currencyId
  }
  if (body.shopAmountCents !== undefined) updates.shopAmountCents = body.shopAmountCents
  if (body.shopCurrencyId !== undefined) {
    updates.shopCurrencyId = body.shopCurrencyId
    parentUpdates.shopCurrencyId = body.shopCurrencyId
  }
  if (body.categoryId !== undefined) updates.categoryId = body.categoryId
  if (body.accountId !== undefined) {
    updates.accountId = body.accountId
    parentUpdates.accountId = body.accountId
  }

  // If this is a split child, only update non-parent attributes
  if (existing.splitFromId) {
    delete updates.date
    delete updates.shop
    delete updates.accountId
    delete updates.currencyId
    delete updates.shopCurrencyId
  }

  const [transaction] = await db
    .update(transactions)
    .set(updates)
    .where(eq(transactions.id, id))
    .returning()

  // Cascade parent attributes to split children
  if (!existing.splitFromId && Object.keys(parentUpdates).length > 0) {
    await db
      .update(transactions)
      .set({ ...parentUpdates, updatedAt: new Date() })
      .where(and(eq(transactions.splitFromId, id), isNull(transactions.deletedAt)))
  }

  return c.json({
    id: transaction.id,
    shop: transaction.shop,
    memo: transaction.memo,
    date: transaction.date,
    includeInReports: transaction.includeInReports,
    amountCents: transaction.amountCents,
    shopAmountCents: transaction.shopAmountCents,
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
    currencyId: transaction.currencyId,
    shopCurrencyId: transaction.shopCurrencyId,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt
  })
})

// DELETE /transactions/:id - Soft delete a transaction
transactionsRouter.delete("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db.query.transactions.findFirst({
    where: and(eq(transactions.id, id), isNull(transactions.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Transaction not found" }, 404)
  }

  const now = new Date()

  // Soft delete the transaction
  await db
    .update(transactions)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(transactions.id, id))

  // Soft delete split children
  await db
    .update(transactions)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(transactions.splitFromId, id))

  return c.json({ success: true })
})

export default transactionsRouter
