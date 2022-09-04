import { db } from "../../database"
import { serializeDate } from "../../utils"

export function softDeleteCategory(id: string) {
  db.run(`UPDATE categories SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  db.run(`UPDATE transactions SET deletedAt = $now WHERE categoryId = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  return id
}
