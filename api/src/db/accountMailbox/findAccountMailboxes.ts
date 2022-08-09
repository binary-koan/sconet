import { db } from "../database"
import { loadAccountMailbox } from "./loadAccountMailbox"

export function findAccountMailboxes() {
  return db
    .query(`SELECT * FROM accountMailboxes WHERE deletedAt IS NULL ORDER BY name ASC`)
    .all()
    .map(loadAccountMailbox)
}
