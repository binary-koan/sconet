import { sql } from "../database"

export async function up() {
  await sql`
    ALTER TABLE "categories" ADD COLUMN "budgetCurrencyId" TEXT
  `
}

export async function down() {
  await sql`
    ALTER TABLE "categories" DROP COLUMN "budgetCurrencyId"
  `
}
