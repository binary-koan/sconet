import { fromPairs } from "lodash"
import { db } from "../../database"
import { loadTransaction } from "./loadTransaction"

export function findTransactionsByIds(ids: readonly string[]) {
  const args = fromPairs(ids.map((id, index) => [`$id${index}`, id]))

  return db
    .query(
      `SELECT * FROM transactions WHERE id IN (${ids.map((_, index) => `$id${index}`).join(",")})`
    )
    .all(args)
    .map(loadTransaction)
}
