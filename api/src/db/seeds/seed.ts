import bcrypt from "bcryptjs"
import ObjectID from "bson-objectid"
import { updateExchangeRates } from "../../jobs/exchangeRates"
import { sql } from "../database"
import { accountMailboxesRepo } from "../repos/accountMailboxesRepo"
import { categoriesRepo } from "../repos/categoriesRepo"
import { currenciesRepo } from "../repos/currenciesRepo"
import { serializeDate } from "../utils"

export async function seed() {
  for (const email of process.env.USER_EMAILS?.split(",") || []) {
    const existing = sql`SELECT * FROM users WHERE email = ${email}`

    if (!existing) {
      await sql`INSERT INTO users ${sql({
        id: ObjectID().toHexString(),
        email,
        encryptedPassword: bcrypt.hashSync("changeme", 10),
        createdAt: serializeDate(new Date()),
        updatedAt: serializeDate(new Date())
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
  }

  if (!existingCategories.some((category) => category.name === "Second")) {
    await categoriesRepo.insert({
      name: "Second",
      color: "green",
      icon: "ShoppingCart"
    })
  }

  const existingAccounts = await sql`SELECT * FROM accountMailboxes`

  if (!existingAccounts.some((account) => account.name === "Test")) {
    await accountMailboxesRepo.insert({
      name: "Test",
      mailServerOptions: {},
      fromAddressPattern: "",
      memoPattern: "",
      datePattern: "",
      amountPattern: ""
    })
  }

  const existingCurrencies = await sql`SELECT * FROM currencies`

  if (!existingCurrencies.some((currency) => currency.code === "JPY")) {
    await currenciesRepo.insert({
      code: "JPY",
      decimalDigits: 0,
      symbol: "¥"
    })
  }

  await updateExchangeRates()
}
