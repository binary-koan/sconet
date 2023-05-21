import bcrypt from "bcryptjs"
import { updateExchangeRates } from "../../jobs/exchangeRates"
import { sql } from "../database"
import { accountsRepo } from "../repos/accountsRepo"
import { categoriesRepo } from "../repos/categoriesRepo"
import { currenciesRepo } from "../repos/currenciesRepo"

export async function seed() {
  console.log("starting seed")
  for (const email of process.env.USER_EMAILS?.split(",") || []) {
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`

    if (!existing.length) {
      await sql`INSERT INTO users ${sql({
        email,
        encryptedPassword: bcrypt.hashSync("changeme", 10),
        createdAt: new Date(),
        updatedAt: new Date()
      })}`
      console.log(`Created user ${email}`)
    }
  }

  const existingCategories = await sql`SELECT * FROM categories`

  if (!existingCategories.some((category) => category.name === "First")) {
    await categoriesRepo.insert({
      name: "First",
      color: "red",
      icon: "ShoppingCart"
    })
    console.log(`Created category 'First'`)
  }

  if (!existingCategories.some((category) => category.name === "Second")) {
    await categoriesRepo.insert({
      name: "Second",
      color: "green",
      icon: "ShoppingCart"
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

  const existingCurrencies = await sql`SELECT * FROM currencies`

  if (!existingCurrencies.some((currency) => currency.code === "JPY")) {
    await currenciesRepo.insert({
      code: "JPY",
      decimalDigits: 0,
      symbol: "¥"
    })
    console.log(`Created currency 'JPY'`)
  }

  await updateExchangeRates()
}
