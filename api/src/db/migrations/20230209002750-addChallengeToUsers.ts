import { sql } from "../database"

export async function up() {
  await sql`
    ALTER TABLE "users" ADD COLUMN "webauthnChallenge" TEXT
  `
}

export async function down() {
  await sql`ALTER TABLE "users" DROP COLUMN "webauthnChallenge"`
}
