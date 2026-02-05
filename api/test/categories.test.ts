import { describe, expect, it } from "vitest"
import { db, request, testCurrency } from "./setup"
import { accounts, categories, transactions } from "../src/db/schema"

describe("Categories API", () => {
  describe("GET /categories", () => {
    it("returns empty list when no categories exist", async () => {
      const res = await request("GET", "/categories")
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toEqual([])
    })

    it("returns list of categories", async () => {
      await db.insert(categories).values([
        {
          name: "Food",
          color: "#FF0000",
          icon: "utensils",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Transport",
          color: "#00FF00",
          icon: "car",
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/categories")
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveLength(2)
      expect(data[0].name).toBe("Food")
      expect(data[1].name).toBe("Transport")
    })

    it("excludes archived categories by default", async () => {
      await db.insert(categories).values([
        {
          name: "Active",
          color: "#FF0000",
          icon: "check",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Archived",
          color: "#00FF00",
          icon: "archive",
          sortOrder: 2,
          archivedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/categories")
      const data = await res.json()

      expect(data).toHaveLength(1)
      expect(data[0].name).toBe("Active")
    })
  })

  describe("GET /categories/:id", () => {
    it("returns a single category with budgets", async () => {
      const [category] = await db
        .insert(categories)
        .values({
          name: "Test Category",
          color: "#FF0000",
          icon: "tag",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("GET", `/categories/${category.id}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe(category.id)
      expect(data.name).toBe("Test Category")
      expect(data.budgets).toEqual([])
    })

    it("returns 404 for non-existent category", async () => {
      const res = await request("GET", "/categories/00000000-0000-0000-0000-000000000000")
      expect(res.status).toBe(404)
    })
  })

  describe("POST /categories", () => {
    it("creates a new category", async () => {
      const res = await request("POST", "/categories", {
        body: {
          name: "New Category",
          color: "#FF5733",
          icon: "star"
        }
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.name).toBe("New Category")
      expect(data.color).toBe("#FF5733")
      expect(data.icon).toBe("star")
      expect(data.isRegular).toBe(false)
    })

    it("creates category with optional fields", async () => {
      const res = await request("POST", "/categories", {
        body: {
          name: "Regular Category",
          color: "#00FF00",
          icon: "repeat",
          emoji: "🔄",
          isRegular: true
        }
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.emoji).toBe("🔄")
      expect(data.isRegular).toBe(true)
    })

    it("creates category with initial budget", async () => {
      const res = await request("POST", "/categories", {
        body: {
          name: "Budgeted Category",
          color: "#0000FF",
          icon: "dollar",
          budgetCents: 50000,
          budgetCurrencyId: testCurrency.id
        }
      })

      expect(res.status).toBe(201)

      // Fetch the category to verify budget was created
      const data = await res.json()
      const getRes = await request("GET", `/categories/${data.id}`)
      const fullData = await getRes.json()

      expect(fullData.budgets).toHaveLength(1)
      expect(fullData.budgets[0].budgetCents).toBe(50000)
    })

    it("returns 400 for invalid input", async () => {
      const res = await request("POST", "/categories", {
        body: { name: "" }
      })

      expect(res.status).toBe(400)
    })
  })

  describe("PATCH /categories/:id", () => {
    it("updates category fields", async () => {
      const [category] = await db
        .insert(categories)
        .values({
          name: "Original",
          color: "#000000",
          icon: "circle",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("PATCH", `/categories/${category.id}`, {
        body: { name: "Updated", color: "#FFFFFF" }
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.name).toBe("Updated")
      expect(data.color).toBe("#FFFFFF")
    })

    it("returns 404 for non-existent category", async () => {
      const res = await request("PATCH", "/categories/00000000-0000-0000-0000-000000000000", {
        body: { name: "Test" }
      })

      expect(res.status).toBe(404)
    })
  })

  describe("POST /categories/:id/archive", () => {
    it("archives a category", async () => {
      const [category] = await db
        .insert(categories)
        .values({
          name: "To Archive",
          color: "#FF0000",
          icon: "archive",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("POST", `/categories/${category.id}/archive`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.archivedAt).not.toBeNull()
    })
  })

  describe("DELETE /categories/:id", () => {
    it("soft deletes a category", async () => {
      const [category] = await db
        .insert(categories)
        .values({
          name: "To Delete",
          color: "#FF0000",
          icon: "trash",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("DELETE", `/categories/${category.id}`)
      expect(res.status).toBe(200)

      // Verify it's no longer returned in list
      const listRes = await request("GET", "/categories")
      const data = await listRes.json()
      expect(data).toHaveLength(0)
    })

    it("soft deletes related transactions", async () => {
      const [category] = await db
        .insert(categories)
        .values({
          name: "Category with Transactions",
          color: "#FF0000",
          icon: "tag",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const [account] = await db
        .insert(accounts)
        .values({
          name: "Test Account",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      await db.insert(transactions).values({
        shop: "Test Shop",
        date: new Date(),
        accountId: account.id,
        categoryId: category.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await request("DELETE", `/categories/${category.id}`)

      // Verify transaction is no longer in list
      const txRes = await request("GET", "/transactions")
      const txData = await txRes.json()
      expect(txData).toHaveLength(0)
    })
  })

  describe("POST /categories/reorder", () => {
    it("reorders categories", async () => {
      const [first] = await db
        .insert(categories)
        .values({
          name: "First",
          color: "#111111",
          icon: "one",
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const [second] = await db
        .insert(categories)
        .values({
          name: "Second",
          color: "#222222",
          icon: "two",
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("POST", "/categories/reorder", {
        body: { ids: [second.id, first.id] }
      })

      expect(res.status).toBe(200)

      // Verify new order
      const listRes = await request("GET", "/categories")
      const data = await listRes.json()
      expect(data[0].name).toBe("Second")
      expect(data[1].name).toBe("First")
    })
  })
})
