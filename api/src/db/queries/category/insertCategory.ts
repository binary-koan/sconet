import { db } from "../../database"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { CategoryRecord } from "../../records/category"
import { serializeDate } from "../../utils"

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
      $deletedAt: serializeDate(category.deletedAt),
      $createdAt: serializeDate(category.createdAt || new Date()),
      $updatedAt: serializeDate(category.updatedAt || new Date())
    }
  )

  return id
}
