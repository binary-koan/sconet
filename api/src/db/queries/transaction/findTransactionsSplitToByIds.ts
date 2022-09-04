import { fromPairs } from "lodash"
import { db } from "../../database"
import { loadTransaction } from "./loadTransaction"

export function findTransactionsSplitToByIds(splitFromIds: readonly string[]) {
  if (!splitFromIds.length) {
    return []
  }

  const args = fromPairs(splitFromIds.map((id, index) => [`$id${index}`, id]))

  const allTransactions = db
    .query(
      `SELECT * FROM transactions WHERE splitFromId IN (${splitFromIds
        .map((_, index) => `$id${index}`)
        .join(",")}) ORDER BY date DESC, id DESC`
    )
    .all(args)
    .map(loadTransaction)

  return splitFromIds.map((id) =>
    allTransactions.filter((transaction) => transaction.splitFromId === id)
  )
}
