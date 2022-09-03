import ObjectID from "bson-objectid"
import { db } from "../database"
import bcrypt from "bcryptjs"
import { insertCategory } from "../queries/category/insertCategory"

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
          new Date().getTime(),
          new Date().getTime()
        ]
      )
      console.log(`Created user ${email}`)
    }
  }

  insertCategory({
    name: "First",
    color: "danger",
    icon: "3d-cube-sphere"
  })

  insertCategory({
    name: "Second",
    color: "success",
    icon: "3d-cube-sphere"
  })
}
