import { db } from "../../database"
import { serializeDate } from "../../utils"

export function softDeleteAccountMailbox(id: string) {
  db.run(`UPDATE accountMailboxes SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  db.run(`UPDATE transactions SET deletedAt = $now WHERE accountMailboxId = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  return id
}
