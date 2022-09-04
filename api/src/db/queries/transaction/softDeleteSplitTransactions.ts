import { db } from "../../database"
import { serializeDate } from "../../utils"

export function softDeleteSplitTransactions(fromId: string) {
  db.run(`UPDATE transactions SET deletedAt = $now WHERE splitFromId = $id`, {
    $id: fromId,
    $now: serializeDate(new Date())
  })

  return fromId
}
