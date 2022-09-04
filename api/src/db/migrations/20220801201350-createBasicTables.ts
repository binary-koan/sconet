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
      date INTEGER NOT NULL,
      includeInReports INTEGER NOT NULL,

      currencyId TEXT NOT NULL,
      categoryId TEXT,
      accountMailboxId TEXT NOT NULL,

      remoteId TEXT,

      splitFromId TEXT,

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

  db.run(`
    CREATE TABLE currencies (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      symbol TEXT NOT NULL,
      decimalDigits INTEGER NOT NULL,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `)

  db.run(`
    CREATE TABLE exchangeRates (
      id TEXT PRIMARY KEY,
      fromCurrencyId TEXT NOT NULL,
      toCurrencyId TEXT NOT NULL,
      rate REAL NOT NULL,

      deletedAt INTEGER,
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
  db.run("DROP TABLE currencies")
  db.run("DROP TABLE exchangeRates")
}
