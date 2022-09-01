import { db } from "../../database"

export function softDeleteTransaction(id: string) {
  db.run(`UPDATE transactions SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  return id
}
