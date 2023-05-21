import { CategoryRecord } from "../../records/category"

export function loadCategory(row: any): CategoryRecord {
  return {
    id: row.id,
    name: row.name,

    color: row.color,
    icon: row.icon,
    isRegular: row.isRegular,
    budget: row.budget,
    budgetCurrencyId: row.budgetCurrencyId,
    sortOrder: row.sortOrder,

    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
