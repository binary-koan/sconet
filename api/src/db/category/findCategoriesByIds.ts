import { fromPairs } from "lodash"
import { db } from "../database"
import { loadCategory } from "./loadCategory"

export function findCategoriesByIds(ids: readonly string[]) {
  const args = fromPairs(ids.map((id, index) => [`$id${index}`, id]))

  return db
    .query(
      `SELECT * FROM categories WHERE id IN (${ids.map((_, index) => `$id${index}`).join(",")})`
    )
    .all(args)
    .map(loadCategory)
}
