import { and, eq, isNotNull, isNull, max } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"
import type { Database } from "../db"
import { categories, categoryBudgets, transactions } from "../db/schema"

const createCategorySchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1),
  emoji: z.string().optional(),
  isRegular: z.boolean().optional(),
  budgetCents: z.number().int().optional(),
  budgetCurrencyId: z.uuid().optional()
})

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  emoji: z.string().optional(),
  isRegular: z.boolean().optional(),
  budgetCents: z.number().int().optional(),
  budgetCurrencyId: z.uuid().optional()
})

const reorderCategoriesSchema = z.object({
  ids: z.array(z.uuid())
})

type Variables = {
  db: Database
}

const categoriesRouter = new Hono<{ Variables: Variables }>()

// GET /categories - List all categories
categoriesRouter.get("/", async (c) => {
  const db = c.get("db")
  const archived = c.req.query("archived") === "true"

  const results = await db.query.categories.findMany({
    where: and(
      isNull(categories.deletedAt),
      archived ? isNotNull(categories.archivedAt) : isNull(categories.archivedAt)
    ),
    orderBy: categories.sortOrder,
    with: {
      transactions: {
        where: isNull(transactions.deletedAt),
        columns: { id: true },
        limit: 1
      }
    }
  })

  return c.json(
    results.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      emoji: category.emoji,
      isRegular: category.regular,
      sortOrder: category.sortOrder,
      hasTransactions: category.transactions.length > 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }))
  )
})

// GET /categories/:id - Get a single category
categoriesRouter.get("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const category = await db.query.categories.findFirst({
    where: and(eq(categories.id, id), isNull(categories.deletedAt)),
    with: {
      transactions: {
        where: isNull(transactions.deletedAt),
        columns: { id: true },
        limit: 1
      },
      budgets: {
        where: isNull(categoryBudgets.deletedAt),
        orderBy: categoryBudgets.dateFrom
      }
    }
  })

  if (!category) {
    return c.json({ error: "Category not found" }, 404)
  }

  return c.json({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    emoji: category.emoji,
    isRegular: category.regular,
    sortOrder: category.sortOrder,
    hasTransactions: category.transactions.length > 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    budgets: category.budgets.map((b) => ({
      id: b.id,
      dateFrom: b.dateFrom,
      dateTo: b.dateTo,
      budgetCents: b.budgetCents,
      currencyId: b.currencyId,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    }))
  })
})

// POST /categories - Create a new category
categoriesRouter.post("/", async (c) => {
  const db = c.get("db")
  const parsed = createCategorySchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  // Get max sort_order
  const [maxResult] = await db.select({ maxSortOrder: max(categories.sortOrder) }).from(categories)

  const sortOrder = (maxResult?.maxSortOrder ?? 0) + 1

  const [category] = await db
    .insert(categories)
    .values({
      name: body.name,
      color: body.color,
      icon: body.icon,
      emoji: body.emoji ?? null,
      regular: body.isRegular ?? false,
      sortOrder,
      updatedAt: new Date()
    })
    .returning()

  // Create initial budget if provided
  if (body.budgetCents !== undefined && body.budgetCurrencyId) {
    const dateFrom = new Date()
    dateFrom.setDate(1) // Start of current month

    await db.insert(categoryBudgets).values({
      categoryId: category.id,
      dateFrom,
      dateTo: null,
      budgetCents: body.budgetCents,
      currencyId: body.budgetCurrencyId,
      updatedAt: new Date()
    })
  }

  return c.json(
    {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      emoji: category.emoji,
      isRegular: category.regular,
      sortOrder: category.sortOrder,
      hasTransactions: false,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    },
    201
  )
})

// PATCH /categories/:id - Update a category
categoriesRouter.patch("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")
  const parsed = updateCategorySchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  const existing = await db.query.categories.findFirst({
    where: and(eq(categories.id, id), isNull(categories.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Category not found" }, 404)
  }

  const updates: Partial<typeof categories.$inferInsert> = {
    updatedAt: new Date()
  }

  if (body.name !== undefined) updates.name = body.name
  if (body.color !== undefined) updates.color = body.color
  if (body.icon !== undefined) updates.icon = body.icon
  if (body.emoji !== undefined) updates.emoji = body.emoji
  if (body.isRegular !== undefined) updates.regular = body.isRegular

  const [category] = await db
    .update(categories)
    .set(updates)
    .where(eq(categories.id, id))
    .returning()

  // Handle budget updates
  if (body.budgetCents !== undefined && body.budgetCurrencyId) {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    // Check if there's an existing budget for this month
    const existingBudget = await db.query.categoryBudgets.findFirst({
      where: and(
        eq(categoryBudgets.categoryId, id),
        isNull(categoryBudgets.deletedAt),
        eq(categoryBudgets.dateFrom, monthStart)
      )
    })

    if (existingBudget) {
      // Update existing budget
      await db
        .update(categoryBudgets)
        .set({
          budgetCents: body.budgetCents,
          currencyId: body.budgetCurrencyId,
          updatedAt: new Date()
        })
        .where(eq(categoryBudgets.id, existingBudget.id))
    } else {
      // Close previous budget and create new one
      await db
        .update(categoryBudgets)
        .set({
          dateTo: monthStart,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(categoryBudgets.categoryId, id),
            isNull(categoryBudgets.deletedAt),
            isNull(categoryBudgets.dateTo)
          )
        )

      await db.insert(categoryBudgets).values({
        categoryId: id,
        dateFrom: monthStart,
        dateTo: null,
        budgetCents: body.budgetCents,
        currencyId: body.budgetCurrencyId,
        updatedAt: new Date()
      })
    }
  }

  const transactionCount = await db.query.transactions.findMany({
    where: and(eq(transactions.categoryId, category.id), isNull(transactions.deletedAt)),
    columns: { id: true },
    limit: 1
  })

  return c.json({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    emoji: category.emoji,
    isRegular: category.regular,
    sortOrder: category.sortOrder,
    hasTransactions: transactionCount.length > 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  })
})

// POST /categories/:id/archive - Archive a category
categoriesRouter.post("/:id/archive", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db.query.categories.findFirst({
    where: and(eq(categories.id, id), isNull(categories.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Category not found" }, 404)
  }

  const [category] = await db
    .update(categories)
    .set({
      archivedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(categories.id, id))
    .returning()

  return c.json({
    id: category.id,
    name: category.name,
    archivedAt: category.archivedAt
  })
})

// DELETE /categories/:id - Soft delete a category and related data
categoriesRouter.delete("/:id", async (c) => {
  const db = c.get("db")
  const id = c.req.param("id")

  const existing = await db.query.categories.findFirst({
    where: and(eq(categories.id, id), isNull(categories.deletedAt))
  })

  if (!existing) {
    return c.json({ error: "Category not found" }, 404)
  }

  const now = new Date()

  // Soft delete the category
  await db.update(categories).set({ deletedAt: now, updatedAt: now }).where(eq(categories.id, id))

  // Soft delete related budgets
  await db
    .update(categoryBudgets)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(categoryBudgets.categoryId, id))

  // Soft delete related transactions
  await db
    .update(transactions)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(transactions.categoryId, id))

  return c.json({ success: true })
})

// POST /categories/reorder - Reorder categories
categoriesRouter.post("/reorder", async (c) => {
  const db = c.get("db")
  const parsed = reorderCategoriesSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400)
  }

  const body = parsed.data

  await Promise.all(
    body.ids.map((id, index) =>
      db
        .update(categories)
        .set({
          sortOrder: index + 1,
          updatedAt: new Date()
        })
        .where(eq(categories.id, id))
    )
  )

  return c.json({ success: true })
})

export default categoriesRouter
