import { db } from "../../database"
import { serializeDate } from "../../utils"

export function softDeleteTransaction(id: string) {
  db.run(`UPDATE transactions SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  return id
}
