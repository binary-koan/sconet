import { sql } from "../database"

export async function up() {
  await sql`
    CREATE TABLE userCredentials (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      device TEXT NOT NULL,

      credentialId BYTEA NOT NULL,
      credentialPublicKey BYTEA NOT NULL,
      counter INTEGER NOT NULL,

      deletedAt TIMESTAMP,
      createdAt TIMESTAMP,
      updatedAt TIMESTAMP
    )
  `
}

export async function down() {
  await sql`DROP TABLE userCredentials`
}
