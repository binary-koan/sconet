import { db } from "../database"

export function up() {
  db.run(`
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
  `)
}

export function down() {
  db.run(`DROP TABLE userCredentials`)
}
