import { db } from "./database"
import bcrypt from "bcryptjs"
import ObjectID from "bson-objectid"

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    encryptedPassword TEXT NOT NULL,

    createdAt INTEGER,
    updatedAt INTEGER
  )
`)

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
  }
}

export interface UserRecord {
  id: string
  email: string
  encryptedPassword: string

  createdAt: Date
  updatedAt: Date
}
