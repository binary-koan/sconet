import { Hono } from "hono"
import type { Kysely } from "kysely"
import { z } from "zod"
import type { Database, NewTransaction, TransactionUpdate } from "../db/types"

const transactionFilterSchema = z.object({
  dateFrom: z.date().optional(),
  dateUntil: z.date().optional(),
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
  date: z.date(),
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
  date: z.date().optional(),
  includeInReports: z.boolean().optional(),
  amountCents: z.number().int().nullable().optional(),
  currencyId: z.uuid().nullable().optional(),
  shopAmountCents: z.number().int().nullable().optional(),
  shopCurrencyId: z.uuid().nullable().optional(),
  categoryId: z.uuid().nullable().optional(),
  accountId: z.uuid().optional()
})

type Variables = {
  db: Kysely<Database>
}

type CurrencyRow = {
  id: string
  code: string
  name: string
  symbol: string
  decimalDigits: number
}

function formatCurrency(row: {
  currency_id: string | null
  currency_code: string | null
  currency_name: string | null
  currency_symbol: string | null
  currency_decimal_digits: number | null
}): CurrencyRow | null {
  if (!row.currency_id) return null
  return {
    id: row.currency_id,
    code: row.currency_code!,
    name: row.currency_name!,
    symbol: row.currency_symbol!,
    decimalDigits: row.currency_decimal_digits!
  }
}

function formatShopCurrency(row: {
  shop_currency_id: string | null
  shop_currency_code: string | null
  shop_currency_name: string | null
  shop_currency_symbol: string | null
  shop_currency_decimal_digits: number | null
}): CurrencyRow | null {
  if (!row.shop_currency_id) return null
  return {
    id: row.shop_currency_id,
    code: row.shop_currency_code!,
    name: row.shop_currency_name!,
    symbol: row.shop_currency_symbol!,
    decimalDigits: row.shop_currency_decimal_digits!
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

function formatCategory(row: {
  cat_id: string | null
  cat_name: string | null
  cat_color: string | null
  cat_icon: string | null
  cat_emoji: string | null
  cat_regular: boolean | null
  cat_sort_order: number | null
}): CategoryRow | null {
  if (!row.cat_id) return null
  return {
    id: row.cat_id,
    name: row.cat_name!,
    color: row.cat_color!,
    icon: row.cat_icon!,
    emoji: row.cat_emoji,
    isRegular: row.cat_regular!,
    sortOrder: row.cat_sort_order!
  }
}

const transactions = new Hono<{ Variables: Variables }>()

// GET /transactions - List transactions
transactions.get("/", async (c) => {
  const db = c.get("db")
  const parsed = transactionFilterSchema.safeParse(c.req.query())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const filter = parsed.data

  let query = db
    .selectFrom("transactions as t")
    .leftJoin("currencies as cur", "cur.id", "t.currency_id")
    .leftJoin("currencies as shop_cur", "shop_cur.id", "t.shop_currency_id")
    .leftJoin("categories as cat", "cat.id", "t.category_id")
    .select([
      "t.id",
      "t.shop",
      "t.memo",
      "t.date",
      "t.include_in_reports",
      "t.amount_cents",
      "t.shop_amount_cents",
      "t.category_id",
      "t.account_id",
      "t.split_from_id",
      "t.created_at",
      "t.updated_at",
      "cur.id as currency_id",
      "cur.code as currency_code",
      "cur.name as currency_name",
      "cur.symbol as currency_symbol",
      "cur.decimal_digits as currency_decimal_digits",
      "shop_cur.id as shop_currency_id",
      "shop_cur.code as shop_currency_code",
      "shop_cur.name as shop_currency_name",
      "shop_cur.symbol as shop_currency_symbol",
      "shop_cur.decimal_digits as shop_currency_decimal_digits",
      "cat.id as cat_id",
      "cat.name as cat_name",
      "cat.color as cat_color",
      "cat.icon as cat_icon",
      "cat.emoji as cat_emoji",
      "cat.regular as cat_regular",
      "cat.sort_order as cat_sort_order"
    ])
    .where("t.deleted_at", "is", null)
    .where("t.split_from_id", "is", null) // Only top-level transactions
    .orderBy("t.date", "desc")
    .orderBy("t.amount_cents", "asc")
    .orderBy("t.shop", "asc")

  if (filter.dateFrom) {
    query = query.where("t.date", ">=", new Date(filter.dateFrom))
  }
  if (filter.dateUntil) {
    query = query.where("t.date", "<=", new Date(filter.dateUntil))
  }
  if (filter.minAmountCents !== undefined) {
    query = query.where("t.amount_cents", ">=", filter.minAmountCents)
  }
  if (filter.maxAmountCents !== undefined) {
    query = query.where("t.amount_cents", "<=", filter.maxAmountCents)
  }
  if (filter.keyword) {
    query = query.where((eb) =>
      eb.or([
        eb("t.shop", "ilike", `%${filter.keyword}%`),
        eb("t.memo", "ilike", `%${filter.keyword}%`)
      ])
    )
  }
  if (filter.categoryIds && filter.categoryIds.length > 0) {
    query = query.where((eb) =>
      eb.or([
        eb("t.category_id", "in", filter.categoryIds!),
        eb.exists(
          eb
            .selectFrom("transactions as child")
            .select(eb.lit(1).as("one"))
            .whereRef("child.split_from_id", "=", "t.id")
            .where("child.category_id", "in", filter.categoryIds!)
        )
      ])
    )
  }

  const results = await query.execute()

  // Get split_to for each transaction
  const transactionIds = results.map((t) => t.id)
  const splitToMap = new Map<string, typeof results>()

  if (transactionIds.length > 0) {
    const splits = await db
      .selectFrom("transactions as t")
      .leftJoin("currencies as cur", "cur.id", "t.currency_id")
      .leftJoin("currencies as shop_cur", "shop_cur.id", "t.shop_currency_id")
      .leftJoin("categories as cat", "cat.id", "t.category_id")
      .select([
        "t.id",
        "t.shop",
        "t.memo",
        "t.date",
        "t.include_in_reports",
        "t.amount_cents",
        "t.shop_amount_cents",
        "t.category_id",
        "t.account_id",
        "t.split_from_id",
        "t.created_at",
        "t.updated_at",
        "cur.id as currency_id",
        "cur.code as currency_code",
        "cur.name as currency_name",
        "cur.symbol as currency_symbol",
        "cur.decimal_digits as currency_decimal_digits",
        "shop_cur.id as shop_currency_id",
        "shop_cur.code as shop_currency_code",
        "shop_cur.name as shop_currency_name",
        "shop_cur.symbol as shop_currency_symbol",
        "shop_cur.decimal_digits as shop_currency_decimal_digits",
        "cat.id as cat_id",
        "cat.name as cat_name",
        "cat.color as cat_color",
        "cat.icon as cat_icon",
        "cat.emoji as cat_emoji",
        "cat.regular as cat_regular",
        "cat.sort_order as cat_sort_order"
      ])
      .where("t.deleted_at", "is", null)
      .where("t.split_from_id", "in", transactionIds)
      .orderBy("cat.sort_order", "asc")
      .orderBy("t.amount_cents", "asc")
      .orderBy("t.shop", "asc")
      .execute()

    for (const split of splits) {
      const parentId = split.split_from_id!
      if (!splitToMap.has(parentId)) {
        splitToMap.set(parentId, [])
      }
      splitToMap.get(parentId)!.push(split)
    }
  }

  return c.json(
    results.map((t) => ({
      id: t.id,
      shop: t.shop,
      memo: t.memo,
      date: t.date,
      includeInReports: t.include_in_reports,
      amountCents: t.amount_cents,
      shopAmountCents: t.shop_amount_cents,
      accountId: t.account_id,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      currency: formatCurrency(t),
      shopCurrency: formatShopCurrency(t),
      category: formatCategory(t),
      splitTo: (splitToMap.get(t.id) || []).map((s) => ({
        id: s.id,
        shop: s.shop,
        memo: s.memo,
        date: s.date,
        includeInReports: s.include_in_reports,
        amountCents: s.amount_cents,
        shopAmountCents: s.shop_amount_cents,
        accountId: s.account_id,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        currency: formatCurrency(s),
        shopCurrency: formatShopCurrency(s),
        category: formatCategory(s)
      }))
    }))
  )
})

// GET /transactions/:id - Get a single transaction
transactions.get("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const transaction = await db
    .selectFrom("transactions as t")
    .leftJoin("currencies as cur", "cur.id", "t.currency_id")
    .leftJoin("currencies as shop_cur", "shop_cur.id", "t.shop_currency_id")
    .leftJoin("categories as cat", "cat.id", "t.category_id")
    .leftJoin("accounts as acc", "acc.id", "t.account_id")
    .leftJoin("currencies as acc_cur", "acc_cur.id", "acc.currency_id")
    .select([
      "t.id",
      "t.shop",
      "t.memo",
      "t.date",
      "t.include_in_reports",
      "t.amount_cents",
      "t.shop_amount_cents",
      "t.category_id",
      "t.account_id",
      "t.split_from_id",
      "t.created_at",
      "t.updated_at",
      "cur.id as currency_id",
      "cur.code as currency_code",
      "cur.name as currency_name",
      "cur.symbol as currency_symbol",
      "cur.decimal_digits as currency_decimal_digits",
      "shop_cur.id as shop_currency_id",
      "shop_cur.code as shop_currency_code",
      "shop_cur.name as shop_currency_name",
      "shop_cur.symbol as shop_currency_symbol",
      "shop_cur.decimal_digits as shop_currency_decimal_digits",
      "cat.id as cat_id",
      "cat.name as cat_name",
      "cat.color as cat_color",
      "cat.icon as cat_icon",
      "cat.emoji as cat_emoji",
      "cat.regular as cat_regular",
      "cat.sort_order as cat_sort_order",
      "acc.id as account_id_joined",
      "acc.name as account_name",
      "acc.favourite as account_favourite",
      "acc.sort_order as account_sort_order",
      "acc_cur.id as account_currency_id",
      "acc_cur.code as account_currency_code",
      "acc_cur.name as account_currency_name",
      "acc_cur.symbol as account_currency_symbol",
      "acc_cur.decimal_digits as account_currency_decimal_digits"
    ])
    .where("t.id", "=", id)
    .where("t.deleted_at", "is", null)
    .executeTakeFirst()

  if (!transaction) {
    return c.json({ error: "Transaction not found" }, 404)
  }

  // Get split_to transactions
  const splits = await db
    .selectFrom("transactions as t")
    .leftJoin("currencies as cur", "cur.id", "t.currency_id")
    .leftJoin("currencies as shop_cur", "shop_cur.id", "t.shop_currency_id")
    .leftJoin("categories as cat", "cat.id", "t.category_id")
    .select([
      "t.id",
      "t.shop",
      "t.memo",
      "t.date",
      "t.include_in_reports",
      "t.amount_cents",
      "t.shop_amount_cents",
      "t.category_id",
      "t.account_id",
      "t.split_from_id",
      "t.created_at",
      "t.updated_at",
      "cur.id as currency_id",
      "cur.code as currency_code",
      "cur.name as currency_name",
      "cur.symbol as currency_symbol",
      "cur.decimal_digits as currency_decimal_digits",
      "shop_cur.id as shop_currency_id",
      "shop_cur.code as shop_currency_code",
      "shop_cur.name as shop_currency_name",
      "shop_cur.symbol as shop_currency_symbol",
      "shop_cur.decimal_digits as shop_currency_decimal_digits",
      "cat.id as cat_id",
      "cat.name as cat_name",
      "cat.color as cat_color",
      "cat.icon as cat_icon",
      "cat.emoji as cat_emoji",
      "cat.regular as cat_regular",
      "cat.sort_order as cat_sort_order"
    ])
    .where("t.deleted_at", "is", null)
    .where("t.split_from_id", "=", id)
    .orderBy("cat.sort_order", "asc")
    .orderBy("t.amount_cents", "asc")
    .orderBy("t.shop", "asc")
    .execute()

  return c.json({
    id: transaction.id,
    shop: transaction.shop,
    memo: transaction.memo,
    date: transaction.date,
    includeInReports: transaction.include_in_reports,
    amountCents: transaction.amount_cents,
    shopAmountCents: transaction.shop_amount_cents,
    splitFromId: transaction.split_from_id,
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at,
    currency: formatCurrency(transaction),
    shopCurrency: formatShopCurrency(transaction),
    category: formatCategory(transaction),
    account: transaction.account_id_joined
      ? {
          id: transaction.account_id_joined,
          name: transaction.account_name,
          favourite: transaction.account_favourite,
          sortOrder: transaction.account_sort_order,
          currency: transaction.account_currency_id
            ? {
                id: transaction.account_currency_id,
                code: transaction.account_currency_code!,
                name: transaction.account_currency_name!,
                symbol: transaction.account_currency_symbol!,
                decimalDigits: transaction.account_currency_decimal_digits!
              }
            : null
        }
      : null,
    splitTo: splits.map((s) => ({
      id: s.id,
      shop: s.shop,
      memo: s.memo,
      date: s.date,
      includeInReports: s.include_in_reports,
      amountCents: s.amount_cents,
      shopAmountCents: s.shop_amount_cents,
      accountId: s.account_id,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      currency: formatCurrency(s),
      shopCurrency: formatShopCurrency(s),
      category: formatCategory(s)
    }))
  })
})

// POST /transactions - Create a new transaction
transactions.post("/", async (c) => {
  const db = c.get("db")
  const parsed = createTransactionSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const newTransaction: NewTransaction = {
    shop: body.shop,
    memo: body.memo,
    date: body.date,
    include_in_reports: body.includeInReports,
    amount_cents: body.amountCents ?? null,
    currency_id: body.currencyId ?? null,
    shop_amount_cents: body.shopAmountCents ?? null,
    shop_currency_id: body.shopCurrencyId ?? null,
    category_id: body.categoryId ?? null,
    account_id: body.accountId,
    updated_at: new Date()
  }

  const transaction = await db
    .insertInto("transactions")
    .values(newTransaction)
    .returningAll()
    .executeTakeFirstOrThrow()

  return c.json(
    {
      id: transaction.id,
      shop: transaction.shop,
      memo: transaction.memo,
      date: transaction.date,
      includeInReports: transaction.include_in_reports,
      amountCents: transaction.amount_cents,
      shopAmountCents: transaction.shop_amount_cents,
      categoryId: transaction.category_id,
      accountId: transaction.account_id,
      currencyId: transaction.currency_id,
      shopCurrencyId: transaction.shop_currency_id,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    },
    201
  )
})

// PATCH /transactions/:id - Update a transaction
transactions.patch("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")
  const parsed = updateTransactionSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const existing = await db
    .selectFrom("transactions")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!existing) {
    return c.json({ error: "Transaction not found" }, 404)
  }

  const updates: TransactionUpdate = {
    updated_at: new Date()
  }

  // Parent attributes that cascade to splits
  const parentUpdates: TransactionUpdate = {}

  if (body.shop !== undefined) {
    updates.shop = body.shop
    parentUpdates.shop = body.shop
  }
  if (body.memo !== undefined) updates.memo = body.memo
  if (body.date !== undefined) {
    updates.date = body.date
    parentUpdates.date = body.date
  }
  if (body.includeInReports !== undefined) updates.include_in_reports = body.includeInReports
  if (body.amountCents !== undefined) updates.amount_cents = body.amountCents
  if (body.currencyId !== undefined) {
    updates.currency_id = body.currencyId
    parentUpdates.currency_id = body.currencyId
  }
  if (body.shopAmountCents !== undefined) updates.shop_amount_cents = body.shopAmountCents
  if (body.shopCurrencyId !== undefined) {
    updates.shop_currency_id = body.shopCurrencyId
    parentUpdates.shop_currency_id = body.shopCurrencyId
  }
  if (body.categoryId !== undefined) updates.category_id = body.categoryId
  if (body.accountId !== undefined) {
    updates.account_id = body.accountId
    parentUpdates.account_id = body.accountId
  }

  // If this is a split child, only update non-parent attributes
  if (existing.split_from_id) {
    delete updates.date
    delete updates.shop
    delete updates.account_id
    delete updates.currency_id
    delete updates.shop_currency_id
  }

  const transaction = await db
    .updateTable("transactions")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow()

  // Cascade parent attributes to split children
  if (!existing.split_from_id && Object.keys(parentUpdates).length > 0) {
    await db
      .updateTable("transactions")
      .set({ ...parentUpdates, updated_at: new Date() })
      .where("split_from_id", "=", id)
      .where("deleted_at", "is", null)
      .execute()
  }

  return c.json({
    id: transaction.id,
    shop: transaction.shop,
    memo: transaction.memo,
    date: transaction.date,
    includeInReports: transaction.include_in_reports,
    amountCents: transaction.amount_cents,
    shopAmountCents: transaction.shop_amount_cents,
    categoryId: transaction.category_id,
    accountId: transaction.account_id,
    currencyId: transaction.currency_id,
    shopCurrencyId: transaction.shop_currency_id,
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at
  })
})

// DELETE /transactions/:id - Soft delete a transaction
transactions.delete("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db
    .selectFrom("transactions")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!existing) {
    return c.json({ error: "Transaction not found" }, 404)
  }

  const now = new Date()

  // Soft delete the transaction
  await db
    .updateTable("transactions")
    .set({ deleted_at: now, updated_at: now })
    .where("id", "=", id)
    .execute()

  // Soft delete split children
  await db
    .updateTable("transactions")
    .set({ deleted_at: now, updated_at: now })
    .where("split_from_id", "=", id)
    .execute()

  return c.json({ success: true })
})

export default transactions
