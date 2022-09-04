import { fromPairs, keyBy } from "lodash"
import { db } from "../../database"
import { loadCurrency } from "./loadCurrency"

export function findCurrenciesByIds(ids: readonly string[]) {
  if (!ids.length) {
    return []
  }

  const args = fromPairs(ids.map((id, index) => [`$id${index}`, id]))

  const results = keyBy(
    db
      .query(
        `SELECT * FROM currencies WHERE deletedAt IS NULL AND id IN (${ids
          .map((_, index) => `$id${index}`)
          .join(",")})`
      )
      .all(args)
      .map(loadCurrency),
    (currency) => currency.id
  )

  return ids.map((id) => results[id])
}
