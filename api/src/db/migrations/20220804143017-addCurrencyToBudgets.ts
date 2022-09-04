import { db } from "../database"

export function up() {
  db.run(`
    ALTER TABLE categories ADD COLUMN budgetCurrencyId TEXT
  `)
}

export function down() {
  db.run(`
    ALTER TABLE categories DROP COLUMN budgetCurrencyId
  `)
}
