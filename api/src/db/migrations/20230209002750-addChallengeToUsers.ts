import { db } from "../database"

export function up() {
  db.run(`
    ALTER TABLE users ADD COLUMN webauthnChallenge TEXT
  `)
}

export function down() {
  db.run(`ALTER TABLE users DROP COLUMN webauthnChallenge`)
}
