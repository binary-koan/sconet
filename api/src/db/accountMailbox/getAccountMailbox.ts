import { AccountMailboxRecord } from "../accountMailbox"
import { db } from "../database"
import { loadAccountMailbox } from "./loadAccountMailbox"

export function getAccountMailbox(id: string): AccountMailboxRecord | undefined {
  const result = db.query("SELECT * FROM accountMailboxes WHERE id = ?").get(id)

  return result && loadAccountMailbox(result)
}
