import { runDbSession } from "../../utils/runDbSession"
import { hashPassword } from "../../utils/scrypt"
import { sql } from "../database"
import { accountsRepo } from "../repos/accountsRepo"
import { categoriesRepo } from "../repos/categoriesRepo"
import { usersRepo } from "../repos/usersRepo"

export async function seed() {
  console.log("Starting seed")

  await runDbSession(async () => {
    for (const email of process.env.USER_EMAILS?.split(",") || []) {
      const existing = await sql`SELECT * FROM users WHERE email = ${email}`

      if (!existing.length) {
        await usersRepo.insert({
          email,
          encryptedPassword: await hashPassword("changeme"),
          webauthnChallenge: null,
          settings: {
            defaultCurrencyCode: "USD",
            favoriteCurrencyCodes: [],
            defaultAccountId: null
          }
        })
        console.log(`Created user ${email}`)
      }
    }

    const existingCategories = await sql`SELECT * FROM categories`

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

    const existingAccounts = await sql`SELECT * FROM accounts`

    if (!existingAccounts.some((account) => account.name === "Test")) {
      await accountsRepo.insert({
        name: "Test"
      })
      console.log(`Created account 'Test'`)
    }
  })
}
