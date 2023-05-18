import { sql } from "../database"

export async function up() {
  await sql`
    CREATE TABLE dailyExchangeRates (
      id TEXT PRIMARY KEY,
      fromCurrencyId TEXT NOT NULL,
      date INTEGER NOT NULL,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `

  await sql`
    CREATE TABLE exchangeRateValues (
      id TEXT PRIMARY KEY,
      dailyExchangeRateId TEXT NOT NULL,
      toCurrencyId TEXT NOT NULL,
      rate REAL NOT NULL,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `

  await sql`
    ALTER TABLE transactions ADD COLUMN dailyExchangeRateId TEXT
  `
}

export async function down() {
  await sql`DROP TABLE dailyExchangeRates`
  await sql`DROP TABLE exchangeRateValues`
  await sql`ALTER TABLE transactions DROP COLUMN dailyExchangeRateId`
}
