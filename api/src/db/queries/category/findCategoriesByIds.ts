import { fromPairs, keyBy } from "lodash"
import { db } from "../../database"
import { loadCategory } from "./loadCategory"

export function findCategoriesByIds(ids: readonly string[]) {
  if (!ids.length) {
    return []
  }

  const args = fromPairs(ids.map((id, index) => [`$id${index}`, id]))

  const results = keyBy(
    db
      .query(
        `SELECT * FROM categories WHERE deletedAt IS NULL AND id IN (${ids
          .map((_, index) => `$id${index}`)
          .join(",")})`
      )
      .all(args)
      .map(loadCategory),
    (category) => category.id
  )

  return ids.map((id) => results[id])
}
