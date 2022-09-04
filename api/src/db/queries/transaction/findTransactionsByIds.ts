import { fromPairs, keyBy } from "lodash"
import { db } from "../../database"
import { loadTransaction } from "./loadTransaction"

export function findTransactionsByIds(ids: readonly string[]) {
  if (!ids.length) {
    return []
  }

  const args = fromPairs(ids.map((id, index) => [`$id${index}`, id]))

  const results = keyBy(
    db
      .query(
        `SELECT * FROM transactions WHERE id IN (${ids.map((_, index) => `$id${index}`).join(",")})`
      )
      .all(args)
      .map(loadTransaction),
    (transaction) => transaction.id
  )

  return ids.map((id) => results[id])
}
