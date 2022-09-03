import { db } from "../../database"

export function setCategoryOrder(orderedIds: string[]) {
  const update = db.prepare("UPDATE categories SET sortOrder = $sortOrder WHERE id = $id")

  db.transaction(() => {
    orderedIds.forEach((id, index) => update.run({ $sortOrder: index, $id: id }))
  })()
}
