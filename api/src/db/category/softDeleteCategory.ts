import { db } from "../database"

export function softDeleteCategory(id: string) {
  db.run(`UPDATE categories SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  db.run(`UPDATE transactions SET deletedAt = $now WHERE categoryId = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  return id
}
