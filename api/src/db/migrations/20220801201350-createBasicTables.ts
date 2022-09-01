import { db } from "../database"

export function up() {
  db.run(`
    CREATE TABLE accountMailboxes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,

      mailServerOptions TEXT,

      fromAddressPattern TEXT,
      datePattern TEXT,
      memoPattern TEXT,
      amountPattern TEXT,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `)

  db.run(`
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,

      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      isRegular BOOLEAN NOT NULL,
      budget INTEGER,
      sortOrder INTEGER,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `)

  db.run(`
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY,
      memo TEXT NOT NULL,
      originalMemo TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      date INTEGER NOT NULL,
      includeInReports INTEGER NOT NULL,

      categoryId STRING,
      accountMailboxId STRING NOT NULL,

      remoteId STRING,

      splitFromId STRING,

      deletedAt INTEGER,

      createdAt INTEGER,
      updatedAt INTEGER
    )
  `)

  db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      encryptedPassword TEXT NOT NULL,

      createdAt INTEGER,
      updatedAt INTEGER
    )
  `)
}

export function down() {
  db.run("DROP TABLE accountMailboxes")
  db.run("DROP TABLE categories")
  db.run("DROP TABLE transactions")
  db.run("DROP TABLE users")
}
