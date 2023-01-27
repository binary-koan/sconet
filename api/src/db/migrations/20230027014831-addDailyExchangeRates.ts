import { db } from "../database"

export function up() {
  db.run(`
    CREATE TABLE dailyExchangeRates (
      id TEXT PRIMARY KEY,
      fromCurrencyId TEXT NOT NULL,
      toCurrencyId TEXT NOT NULL,
      rate REAL NOT NULL,
      date INTEGER NOT NULL,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `)

  db.run(`
    ALTER TABLE transactions ADD COLUMN dailyExchangeRateId TEXT
  `)
}

export function down() {
  db.run(`DROP TABLE dailyExchangeRates`)
  db.run(`ALTER TABLE transactions DROP COLUMN dailyExchangeRateId`)
}
