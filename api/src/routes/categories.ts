import { Hono } from "hono"
import type { Kysely } from "kysely"
import { z } from "zod"
import type { CategoryUpdate, Database, NewCategory } from "../db/types"

const createCategorySchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1),
  emoji: z.string().optional(),
  isRegular: z.boolean().optional(),
  budgetCents: z.number().int().optional(),
  budgetCurrencyId: z.string().uuid().optional()
})

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  emoji: z.string().optional(),
  isRegular: z.boolean().optional(),
  budgetCents: z.number().int().optional(),
  budgetCurrencyId: z.string().uuid().optional()
})

const reorderCategoriesSchema = z.object({
  ids: z.array(z.string().uuid())
})

type Variables = {
  db: Kysely<Database>
}

const categories = new Hono<{ Variables: Variables }>()

// GET /categories - List all categories
// Query params: archived=true to show archived categories
categories.get("/", async (c) => {
  const db = c.get("db")
  const archived = c.req.query("archived") === "true"

  let query = db
    .selectFrom("categories as c")
    .select((eb) => [
      "c.id",
      "c.name",
      "c.color",
      "c.icon",
      "c.emoji",
      "c.regular",
      "c.sort_order",
      "c.created_at",
      "c.updated_at",
      eb
        .exists(
          eb
            .selectFrom("transactions")
            .select(eb.lit(1).as("one"))
            .whereRef("transactions.category_id", "=", "c.id")
            .where("transactions.deleted_at", "is", null)
        )
        .as("has_transactions")
    ])
    .where("c.deleted_at", "is", null)
    .orderBy("c.sort_order", "asc")

  if (archived) {
    query = query.where("c.archived_at", "is not", null)
  } else {
    query = query.where("c.archived_at", "is", null)
  }

  const results = await query.execute()

  return c.json(
    results.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      emoji: category.emoji,
      isRegular: category.regular,
      sortOrder: category.sort_order,
      hasTransactions: Boolean(category.has_transactions),
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }))
  )
})

// GET /categories/:id - Get a single category
categories.get("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const category = await db
    .selectFrom("categories")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!category) {
    return c.json({ error: "Category not found" }, 404)
  }

  const transactionCount = await db
    .selectFrom("transactions")
    .select(db.fn.count("id").as("count"))
    .where("category_id", "=", category.id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  const budgets = await db
    .selectFrom("category_budgets")
    .selectAll()
    .where("category_id", "=", id)
    .where("deleted_at", "is", null)
    .orderBy("date_from", "asc")
    .execute()

  return c.json({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    emoji: category.emoji,
    isRegular: category.regular,
    sortOrder: category.sort_order,
    hasTransactions: Number(transactionCount?.count ?? 0) > 0,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
    budgets: budgets.map((b) => ({
      id: b.id,
      dateFrom: b.date_from,
      dateTo: b.date_to,
      budgetCents: b.budget_cents,
      currencyId: b.currency_id,
      createdAt: b.created_at,
      updatedAt: b.updated_at
    }))
  })
})

// POST /categories - Create a new category
categories.post("/", async (c) => {
  const db = c.get("db")
  const parsed = createCategorySchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  // Get max sort_order
  const maxSortOrder = await db
    .selectFrom("categories")
    .select(db.fn.max("sort_order").as("max_sort_order"))
    .executeTakeFirst()

  const sortOrder = ((maxSortOrder?.max_sort_order as number) ?? 0) + 1

  const newCategory: NewCategory = {
    name: body.name,
    color: body.color,
    icon: body.icon,
    emoji: body.emoji ?? null,
    regular: body.isRegular ?? false,
    sort_order: sortOrder,
    updated_at: new Date()
  }

  const category = await db
    .insertInto("categories")
    .values(newCategory)
    .returningAll()
    .executeTakeFirstOrThrow()

  // Create initial budget if provided
  if (body.budgetCents !== undefined && body.budgetCurrencyId) {
    const dateFrom = new Date()
    dateFrom.setDate(1) // Start of current month

    await db
      .insertInto("category_budgets")
      .values({
        category_id: category.id,
        date_from: dateFrom,
        date_to: null,
        budget_cents: body.budgetCents,
        currency_id: body.budgetCurrencyId,
        updated_at: new Date()
      })
      .execute()
  }

  return c.json(
    {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      emoji: category.emoji,
      isRegular: category.regular,
      sortOrder: category.sort_order,
      hasTransactions: false,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    },
    201
  )
})

// PATCH /categories/:id - Update a category
categories.patch("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")
  const parsed = updateCategorySchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const existing = await db
    .selectFrom("categories")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!existing) {
    return c.json({ error: "Category not found" }, 404)
  }

  const updates: CategoryUpdate = {
    updated_at: new Date()
  }

  if (body.name !== undefined) updates.name = body.name
  if (body.color !== undefined) updates.color = body.color
  if (body.icon !== undefined) updates.icon = body.icon
  if (body.emoji !== undefined) updates.emoji = body.emoji
  if (body.isRegular !== undefined) updates.regular = body.isRegular

  const category = await db
    .updateTable("categories")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow()

  // Handle budget updates
  if (body.budgetCents !== undefined && body.budgetCurrencyId) {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    // Check if there's an existing budget for this month
    const existingBudget = await db
      .selectFrom("category_budgets")
      .selectAll()
      .where("category_id", "=", id)
      .where("deleted_at", "is", null)
      .where("date_from", "=", monthStart)
      .executeTakeFirst()

    if (existingBudget) {
      // Update existing budget
      await db
        .updateTable("category_budgets")
        .set({
          budget_cents: body.budgetCents,
          currency_id: body.budgetCurrencyId,
          updated_at: new Date()
        })
        .where("id", "=", existingBudget.id)
        .execute()
    } else {
      // Close previous budget and create new one
      await db
        .updateTable("category_budgets")
        .set({
          date_to: monthStart,
          updated_at: new Date()
        })
        .where("category_id", "=", id)
        .where("deleted_at", "is", null)
        .where("date_to", "is", null)
        .execute()

      await db
        .insertInto("category_budgets")
        .values({
          category_id: id,
          date_from: monthStart,
          date_to: null,
          budget_cents: body.budgetCents,
          currency_id: body.budgetCurrencyId,
          updated_at: new Date()
        })
        .execute()
    }
  }

  const transactionCount = await db
    .selectFrom("transactions")
    .select(db.fn.count("id").as("count"))
    .where("category_id", "=", category.id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  return c.json({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    emoji: category.emoji,
    isRegular: category.regular,
    sortOrder: category.sort_order,
    hasTransactions: Number(transactionCount?.count ?? 0) > 0,
    createdAt: category.created_at,
    updatedAt: category.updated_at
  })
})

// POST /categories/:id/archive - Archive a category
categories.post("/:id/archive", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db
    .selectFrom("categories")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!existing) {
    return c.json({ error: "Category not found" }, 404)
  }

  const category = await db
    .updateTable("categories")
    .set({
      archived_at: new Date(),
      updated_at: new Date()
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow()

  return c.json({
    id: category.id,
    name: category.name,
    archivedAt: category.archived_at
  })
})

// DELETE /categories/:id - Soft delete a category and related data
categories.delete("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db
    .selectFrom("categories")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!existing) {
    return c.json({ error: "Category not found" }, 404)
  }

  const now = new Date()

  // Soft delete the category
  await db
    .updateTable("categories")
    .set({
      deleted_at: now,
      updated_at: now
    })
    .where("id", "=", id)
    .execute()

  // Soft delete related budgets
  await db
    .updateTable("category_budgets")
    .set({
      deleted_at: now,
      updated_at: now
    })
    .where("category_id", "=", id)
    .execute()

  // Soft delete related transactions
  await db
    .updateTable("transactions")
    .set({
      deleted_at: now,
      updated_at: now
    })
    .where("category_id", "=", id)
    .execute()

  return c.json({ success: true })
})

// POST /categories/reorder - Reorder categories
categories.post("/reorder", async (c) => {
  const db = c.get("db")
  const parsed = reorderCategoriesSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  await Promise.all(
    body.ids.map((id, index) =>
      db
        .updateTable("categories")
        .set({
          sort_order: index + 1,
          updated_at: new Date()
        })
        .where("id", "=", id)
        .execute()
    )
  )

  return c.json({ success: true })
})

export default categories
