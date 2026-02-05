import { describe, expect, it } from "vitest"
import { db, request, testCurrency } from "./setup"
import { accounts, categories, transactions } from "../src/db/schema"

async function createTestAccount() {
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
  return account
}

async function createTestCategory() {
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
  return category
}

describe("Transactions API", () => {
  describe("GET /transactions", () => {
    it("returns empty list when no transactions exist", async () => {
      const res = await request("GET", "/transactions")
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toEqual([])
    })

    it("returns list of transactions", async () => {
      const account = await createTestAccount()

      await db.insert(transactions).values([
        {
          shop: "Coffee Shop",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 500,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "Grocery Store",
          date: new Date("2024-01-14"),
          accountId: account.id,
          amountCents: 5000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/transactions")
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveLength(2)
    })

    it("filters by date range", async () => {
      const account = await createTestAccount()

      await db.insert(transactions).values([
        {
          shop: "January",
          date: new Date("2024-01-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "February",
          date: new Date("2024-02-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "March",
          date: new Date("2024-03-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/transactions?dateFrom=2024-02-01&dateUntil=2024-02-28")
      const data = await res.json()

      expect(data).toHaveLength(1)
      expect(data[0].shop).toBe("February")
    })

    it("filters by amount range", async () => {
      const account = await createTestAccount()

      await db.insert(transactions).values([
        {
          shop: "Small",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "Medium",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 500,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "Large",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 1000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/transactions?minAmountCents=300&maxAmountCents=700")
      const data = await res.json()

      expect(data).toHaveLength(1)
      expect(data[0].shop).toBe("Medium")
    })

    it("filters by keyword in shop or memo", async () => {
      const account = await createTestAccount()

      await db.insert(transactions).values([
        {
          shop: "Coffee Shop",
          memo: "",
          date: new Date("2024-01-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "Restaurant",
          memo: "Great coffee",
          date: new Date("2024-01-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "Grocery Store",
          memo: "Weekly shopping",
          date: new Date("2024-01-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/transactions?keyword=coffee")
      const data = await res.json()

      expect(data).toHaveLength(2)
    })

    it("excludes split child transactions from list", async () => {
      const account = await createTestAccount()

      const [parent] = await db
        .insert(transactions)
        .values({
          shop: "Supermarket",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 10000,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      await db.insert(transactions).values({
        shop: "Supermarket",
        date: new Date("2024-01-15"),
        accountId: account.id,
        amountCents: 5000,
        splitFromId: parent.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const res = await request("GET", "/transactions")
      const data = await res.json()

      // Only parent should be returned
      expect(data).toHaveLength(1)
      expect(data[0].id).toBe(parent.id)
    })

    it("includes split children in parent response", async () => {
      const account = await createTestAccount()
      const category = await createTestCategory()

      const [parent] = await db
        .insert(transactions)
        .values({
          shop: "Supermarket",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 10000,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      await db.insert(transactions).values([
        {
          shop: "Supermarket",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 6000,
          categoryId: category.id,
          splitFromId: parent.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          shop: "Supermarket",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 4000,
          splitFromId: parent.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/transactions")
      const data = await res.json()

      expect(data[0].splitTo).toHaveLength(2)
    })
  })

  describe("GET /transactions/:id", () => {
    it("returns a single transaction with relations", async () => {
      const account = await createTestAccount()
      const category = await createTestCategory()

      const [tx] = await db
        .insert(transactions)
        .values({
          shop: "Test Shop",
          memo: "Test memo",
          date: new Date("2024-01-15"),
          accountId: account.id,
          categoryId: category.id,
          amountCents: 5000,
          currencyId: testCurrency.id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("GET", `/transactions/${tx.id}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe(tx.id)
      expect(data.shop).toBe("Test Shop")
      expect(data.account.name).toBe("Test Account")
      expect(data.category.name).toBe("Test Category")
      expect(data.currency.code).toBe("TEST")
    })

    it("returns 404 for non-existent transaction", async () => {
      const res = await request("GET", "/transactions/00000000-0000-0000-0000-000000000000")
      expect(res.status).toBe(404)
    })
  })

  describe("POST /transactions", () => {
    it("creates a new transaction", async () => {
      const account = await createTestAccount()

      const res = await request("POST", "/transactions", {
        body: {
          shop: "New Shop",
          memo: "Test purchase",
          date: "2024-01-15",
          accountId: account.id,
          amountCents: 1500,
          currencyId: testCurrency.id
        }
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.shop).toBe("New Shop")
      expect(data.memo).toBe("Test purchase")
      expect(data.amountCents).toBe(1500)
    })

    it("creates transaction with category", async () => {
      const account = await createTestAccount()
      const category = await createTestCategory()

      const res = await request("POST", "/transactions", {
        body: {
          shop: "Categorized",
          date: "2024-01-15",
          accountId: account.id,
          categoryId: category.id
        }
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.categoryId).toBe(category.id)
    })

    it("returns 400 for missing required fields", async () => {
      const res = await request("POST", "/transactions", {
        body: { shop: "Missing account" }
      })

      expect(res.status).toBe(400)
    })
  })

  describe("PATCH /transactions/:id", () => {
    it("updates transaction fields", async () => {
      const account = await createTestAccount()

      const [tx] = await db
        .insert(transactions)
        .values({
          shop: "Original",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 1000,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("PATCH", `/transactions/${tx.id}`, {
        body: {
          shop: "Updated",
          amountCents: 2000,
          memo: "Added memo"
        }
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.shop).toBe("Updated")
      expect(data.amountCents).toBe(2000)
      expect(data.memo).toBe("Added memo")
    })

    it("returns 404 for non-existent transaction", async () => {
      const res = await request("PATCH", "/transactions/00000000-0000-0000-0000-000000000000", {
        body: { shop: "Test" }
      })

      expect(res.status).toBe(404)
    })
  })

  describe("DELETE /transactions/:id", () => {
    it("soft deletes a transaction", async () => {
      const account = await createTestAccount()

      const [tx] = await db
        .insert(transactions)
        .values({
          shop: "To Delete",
          date: new Date("2024-01-15"),
          accountId: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("DELETE", `/transactions/${tx.id}`)
      expect(res.status).toBe(200)

      // Verify it's no longer returned in list
      const listRes = await request("GET", "/transactions")
      const data = await listRes.json()
      expect(data).toHaveLength(0)
    })

    it("soft deletes split children when deleting parent", async () => {
      const account = await createTestAccount()

      const [parent] = await db
        .insert(transactions)
        .values({
          shop: "Parent",
          date: new Date("2024-01-15"),
          accountId: account.id,
          amountCents: 10000,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      await db.insert(transactions).values({
        shop: "Parent",
        date: new Date("2024-01-15"),
        accountId: account.id,
        amountCents: 5000,
        splitFromId: parent.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await request("DELETE", `/transactions/${parent.id}`)

      // Verify both parent and child are deleted
      const listRes = await request("GET", "/transactions")
      const data = await listRes.json()
      expect(data).toHaveLength(0)
    })

    it("returns 404 for non-existent transaction", async () => {
      const res = await request("DELETE", "/transactions/00000000-0000-0000-0000-000000000000")
      expect(res.status).toBe(404)
    })
  })
})
