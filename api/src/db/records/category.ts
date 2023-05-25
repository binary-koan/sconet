export interface CategoryRecord {
  id: string
  name: string

  color: string
  icon: string
  isRegular: boolean
  budget: number | null
  budgetCurrencyCode: string | null
  sortOrder: number | null

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
