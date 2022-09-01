import { fromPairs, keyBy } from "lodash"
import { db } from "../database"
import { loadAccountMailbox } from "./loadAccountMailbox"

export function findAccountMailboxesByIds(ids: readonly string[]) {
  const args = fromPairs(ids.map((id, index) => [`$id${index}`, id]))

  return db
    .query(
      `SELECT * FROM accountMailboxes WHERE id IN (${ids
        .map((_, index) => `$id${index}`)
        .join(",")})`
    )
    .all(args)
    .map(loadAccountMailbox)
}
