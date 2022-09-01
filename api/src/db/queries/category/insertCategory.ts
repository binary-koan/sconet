import { db } from "../../database"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { CategoryRecord } from "../../records/category"

export type CategoryForInsert = MakeOptional<
  Omit<CategoryRecord, "id">,
  "isRegular" | "budget" | "sortOrder" | "deletedAt" | "createdAt" | "updatedAt"
>

export function insertCategory(category: CategoryForInsert) {
  const id = ObjectID().toHexString()

  db.run(
    `
    INSERT INTO categories
      (id, name, color, icon, isRegular, budget, sortOrder, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $name, $color, $icon, $isRegular, $budget, $sortOrder, $deletedAt, $createdAt, $updatedAt)
  `,
    {
      $id: id,
      $name: category.name,
      $color: category.color,
      $icon: category.icon,
      $isRegular: category.isRegular || true,
      $budget: category.budget,
      $sortOrder: category.sortOrder || null,
      $deletedAt: category.deletedAt?.getTime(),
      $createdAt: (category.createdAt || new Date()).getTime(),
      $updatedAt: (category.updatedAt || new Date()).getTime()
    }
  )

  return id
}
