import { db } from "../database"

export function deleteSplitTransactions(fromId: string) {
  db.run(`DELETE FROM transactions WHERE splitFromId = $id`, {
    $id: fromId
  })

  return fromId
}
