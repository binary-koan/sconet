import bcrypt from "bcryptjs"
import ObjectID from "bson-objectid"
import { db } from "../database"
import { accountMailboxesRepo } from "../repos/accountMailboxesRepo"
import { categoriesRepo } from "../repos/categoriesRepo"
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

  categoriesRepo.insert({
    name: "First",
    color: "danger",
    icon: "3d-cube-sphere"
  })

  categoriesRepo.insert({
    name: "Second",
    color: "success",
    icon: "3d-cube-sphere"
  })

  accountMailboxesRepo.insert({
    name: "Test",
    mailServerOptions: {},
    fromAddressPattern: "",
    memoPattern: "",
    datePattern: "",
    amountPattern: ""
  })
}
