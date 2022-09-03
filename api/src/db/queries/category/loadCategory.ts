import { CategoryRecord } from "../../records/category"
import { loadDate } from "../../utils"

export function loadCategory(row: any): CategoryRecord {
  return {
    id: row.id,
    name: row.name,

    color: row.color,
    icon: row.icon,
    isRegular: row.isRegular,
    budget: row.budget,
    sortOrder: row.sortOrder,

    deletedAt: loadDate(row.deletedAt),
    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
