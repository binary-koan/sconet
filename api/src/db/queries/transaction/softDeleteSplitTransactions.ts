import { db } from "../../database"

export function softDeleteSplitTransactions(fromId: string) {
  db.run(`UPDATE transactions SET deletedAt = $now WHERE splitFromId = $id`, {
    $id: fromId,
    $now: new Date().getTime()
  })

  return fromId
}
