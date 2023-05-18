import { sql } from "../database"

export async function up() {
  await sql`
    CREATE TABLE userCredentials (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      device TEXT NOT NULL,

      credentialId BLOB NOT NULL,
      credentialPublicKey BLOB NOT NULL,
      counter INTEGER NOT NULL,

      deletedAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `
}

export async function down() {
  await sql`DROP TABLE userCredentials`
}
