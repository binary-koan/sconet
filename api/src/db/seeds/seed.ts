import { runDbSession } from "../../utils/runDbSession"
import { hashPassword } from "../../utils/scrypt"
import { db } from "../database"
import { accountsRepo } from "../repos/accountsRepo"
import { categoriesRepo } from "../repos/categoriesRepo"
import { usersRepo } from "../repos/usersRepo"

export async function seed(
  { users, categories, accounts }: { users?: boolean; categories?: boolean; accounts?: boolean } = {
    users: true,
    categories: true,
    accounts: true
  }
) {
  console.log("Starting seed")

  await runDbSession(async () => {
    if (categories) {
      const existingCategories = await db.sql`SELECT * FROM categories`

      if (!existingCategories.some((category) => category.name === "First")) {
        await categoriesRepo.insert({
          name: "First",
          color: "red",
          icon: "ShoppingCart",
          isRegular: true,
          budget: null,
          budgetCurrencyCode: null,
          sortOrder: 0
        })
        console.log(`Created category 'First'`)
      }

      if (!existingCategories.some((category) => category.name === "Second")) {
        await categoriesRepo.insert({
          name: "Second",
          color: "green",
          icon: "ShoppingCart",
          isRegular: true,
          budget: null,
          budgetCurrencyCode: null,
          sortOrder: 1
        })
        console.log(`Created category 'Second'`)
      }
    }

    if (accounts) {
      const existingAccounts = await db.sql`SELECT * FROM accounts`

      if (!existingAccounts.some((account) => account.name === "Test")) {
        await accountsRepo.insert({
          name: "Test",
          currencyCode: "USD"
        })
        console.log(`Created account 'Test'`)
      }
    }

    if (users) {
      const defaultAccountId = (await db.sql`SELECT id FROM accounts LIMIT 1`)[0]?.id

      for (const email of process.env.USER_EMAILS?.split(",") || []) {
        const existing = await db.sql`SELECT * FROM users WHERE email = ${email}`

        if (!existing.length) {
          await usersRepo.insert({
            email,
            encryptedPassword: await hashPassword("changeme"),
            webauthnChallenge: null,
            settings: {
              defaultCurrencyCode: "USD",
              favoriteCurrencyCodes: [],
              defaultAccountId
            }
          })
          console.log(`Created user ${email}`)
        }
      }
    }
  })
}
