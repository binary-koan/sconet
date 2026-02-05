import { describe, expect, it } from "vitest"
import { db, request, testCurrency } from "./setup"
import { accounts } from "../src/db/schema"

describe("Accounts API", () => {
  describe("GET /accounts", () => {
    it("returns empty list when no accounts exist", async () => {
      const res = await request("GET", "/accounts")
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toEqual([])
    })

    it("returns list of accounts", async () => {
      // Create test accounts directly in DB
      await db.insert(accounts).values([
        {
          name: "Checking",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Savings",
          currencyId: testCurrency.id,
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/accounts")
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveLength(2)
      expect(data[0].name).toBe("Checking")
      expect(data[1].name).toBe("Savings")
    })

    it("excludes archived accounts by default", async () => {
      await db.insert(accounts).values([
        {
          name: "Active",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Archived",
          currencyId: testCurrency.id,
          sortOrder: 2,
          archivedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/accounts")
      const data = await res.json()

      expect(data).toHaveLength(1)
      expect(data[0].name).toBe("Active")
    })

    it("returns only archived accounts when archived=true", async () => {
      await db.insert(accounts).values([
        {
          name: "Active",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Archived",
          currencyId: testCurrency.id,
          sortOrder: 2,
          archivedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      const res = await request("GET", "/accounts?archived=true")
      const data = await res.json()

      expect(data).toHaveLength(1)
      expect(data[0].name).toBe("Archived")
    })
  })

  describe("GET /accounts/:id", () => {
    it("returns a single account", async () => {
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

      const res = await request("GET", `/accounts/${account.id}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe(account.id)
      expect(data.name).toBe("Test Account")
      expect(data.currency.code).toBe("TEST")
    })

    it("returns 404 for non-existent account", async () => {
      const res = await request("GET", "/accounts/00000000-0000-0000-0000-000000000000")
      expect(res.status).toBe(404)
    })
  })

  describe("POST /accounts", () => {
    it("creates a new account", async () => {
      const res = await request("POST", "/accounts", {
        body: {
          name: "New Account",
          currencyId: testCurrency.id
        }
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.name).toBe("New Account")
      expect(data.currency.code).toBe("TEST")
      expect(data.favourite).toBe(false)
      expect(data.sortOrder).toBe(1)
    })

    it("creates account with favourite flag", async () => {
      const res = await request("POST", "/accounts", {
        body: {
          name: "Favourite Account",
          currencyId: testCurrency.id,
          favourite: true
        }
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.favourite).toBe(true)
    })

    it("auto-increments sort order", async () => {
      await request("POST", "/accounts", {
        body: { name: "First", currencyId: testCurrency.id }
      })

      const res = await request("POST", "/accounts", {
        body: { name: "Second", currencyId: testCurrency.id }
      })

      const data = await res.json()
      expect(data.sortOrder).toBe(2)
    })

    it("returns 400 for invalid input", async () => {
      const res = await request("POST", "/accounts", {
        body: { name: "" }
      })

      expect(res.status).toBe(400)
    })
  })

  describe("PATCH /accounts/:id", () => {
    it("updates account name", async () => {
      const [account] = await db
        .insert(accounts)
        .values({
          name: "Original",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("PATCH", `/accounts/${account.id}`, {
        body: { name: "Updated" }
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.name).toBe("Updated")
    })

    it("updates favourite status", async () => {
      const [account] = await db
        .insert(accounts)
        .values({
          name: "Test",
          currencyId: testCurrency.id,
          favourite: false,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("PATCH", `/accounts/${account.id}`, {
        body: { favourite: true }
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.favourite).toBe(true)
    })

    it("returns 404 for non-existent account", async () => {
      const res = await request("PATCH", "/accounts/00000000-0000-0000-0000-000000000000", {
        body: { name: "Test" }
      })

      expect(res.status).toBe(404)
    })
  })

  describe("POST /accounts/:id/archive", () => {
    it("archives an account", async () => {
      const [account] = await db
        .insert(accounts)
        .values({
          name: "To Archive",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("POST", `/accounts/${account.id}/archive`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.archivedAt).not.toBeNull()
    })
  })

  describe("DELETE /accounts/:id", () => {
    it("soft deletes an account", async () => {
      const [account] = await db
        .insert(accounts)
        .values({
          name: "To Delete",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("DELETE", `/accounts/${account.id}`)
      expect(res.status).toBe(200)

      // Verify it's no longer returned in list
      const listRes = await request("GET", "/accounts")
      const data = await listRes.json()
      expect(data).toHaveLength(0)
    })

    it("returns 404 for non-existent account", async () => {
      const res = await request("DELETE", "/accounts/00000000-0000-0000-0000-000000000000")
      expect(res.status).toBe(404)
    })
  })

  describe("POST /accounts/reorder", () => {
    it("reorders accounts", async () => {
      const [first] = await db
        .insert(accounts)
        .values({
          name: "First",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const [second] = await db
        .insert(accounts)
        .values({
          name: "Second",
          currencyId: testCurrency.id,
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      const res = await request("POST", "/accounts/reorder", {
        body: { ids: [second.id, first.id] }
      })

      expect(res.status).toBe(200)

      // Verify new order
      const listRes = await request("GET", "/accounts")
      const data = await listRes.json()
      expect(data[0].name).toBe("Second")
      expect(data[1].name).toBe("First")
    })

    it("returns 400 if not all account IDs provided", async () => {
      const [account] = await db
        .insert(accounts)
        .values({
          name: "Only One",
          currencyId: testCurrency.id,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      // Create another account but don't include it in reorder
      await db.insert(accounts).values({
        name: "Missing",
        currencyId: testCurrency.id,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const res = await request("POST", "/accounts/reorder", {
        body: { ids: [account.id] }
      })

      expect(res.status).toBe(400)
    })
  })

  describe("Authentication", () => {
    it("returns 401 without auth token", async () => {
      const res = await request("GET", "/accounts", { token: null })
      expect(res.status).toBe(401)
    })

    it("returns 401 with invalid token", async () => {
      const res = await request("GET", "/accounts", { token: "invalid-token" })
      expect(res.status).toBe(401)
    })
  })
})
