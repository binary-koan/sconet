import { CategoryRecord } from "../../records/category"

export function loadCategory(row: any): CategoryRecord {
  return {
    id: row.id,
    name: row.name,

    color: row.color,
    icon: row.icon,
    isRegular: row.isRegular,
    budget: row.budget,
    sortOrder: row.sortOrder,

    deletedAt: row.deletedAt && new Date(row.deletedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}
