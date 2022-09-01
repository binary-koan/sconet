import { db } from "../../database"

export function softDeleteAccountMailbox(id: string) {
  db.run(`UPDATE accountMailboxes SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  db.run(`UPDATE transactions SET deletedAt = $now WHERE accountMailboxId = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  return id
}
