import bcrypt from "bcryptjs"
import ObjectID from "bson-objectid"
import { db } from "../database"
import { accountMailboxesRepo } from "../repos/accountMailboxesRepo"
import { categoriesRepo } from "../repos/categoriesRepo"
import { currenciesRepo } from "../repos/currenciesRepo"
import { serializeDate } from "../utils"

export function seed() {
  for (const email of process.env.USER_EMAILS?.split(",") || []) {
    const existing = db.query("SELECT * FROM users WHERE email = ?").get(email)

    if (!existing) {
      db.run(
        `INSERT INTO users (id, email, encryptedPassword, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
        [
          ObjectID().toHexString(),
          email,
          bcrypt.hashSync("changeme", 10),
          serializeDate(new Date()),
          serializeDate(new Date())
        ]
      )
      console.log(`Created user ${email}`)
    }
  }

  const existingCategories = db.query("SELECT * FROM categories").all()

  if (!existingCategories.some((category) => category.name === "First")) {
    categoriesRepo.insert({
      name: "First",
      color: "red",
      icon: "3d-cube-sphere"
    })
  }

  if (!existingCategories.some((category) => category.name === "Second")) {
    categoriesRepo.insert({
      name: "Second",
      color: "green",
      icon: "3d-cube-sphere"
    })
  }

  const existingAccounts = db.query("SELECT * FROM accountMailboxes").all()

  if (!existingAccounts.some((account) => account.name === "Test")) {
    accountMailboxesRepo.insert({
      name: "Test",
      mailServerOptions: {},
      fromAddressPattern: "",
      memoPattern: "",
      datePattern: "",
      amountPattern: ""
    })
  }

  const existingCurrencies = db.query("SELECT * FROM currencies").all()

  if (!existingCurrencies.some((currency) => currency.code === "JPY")) {
    currenciesRepo.insert({
      code: "JPY",
      decimalDigits: 0,
      symbol: "¥"
    })
  }
}
