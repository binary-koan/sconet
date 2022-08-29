import { orderBy } from "lodash"
import { CategoryRecord } from "../category"
import { findCategories } from "../category/findCategories"
import { db } from "../database"

export interface MonthBudgetResult {
  id: string
  year: string
  month: number
  income: number
  categories: CategoryBudgetResult[]
}

export interface CategoryBudgetResult {
  id: string
  categoryId: string | null
  category: CategoryRecord | null
  amountSpent: number
}

export function budgetsInYear(year: string): MonthBudgetResult[] {
  const start = new Date(`${year}-01-01T00:00:00+09:00`)
  const end = new Date(`${year}-12-31T23:59:59+09:00`)

  const incomeGroups = db
    .query<
      { $start: number; $end: number },
      {
        income: number
        month: number
      }
    >(
      `
        SELECT SUM(amount) AS income, EXTRACT(MONTH FROM (date AT TIME ZONE CURRENT_SETTING('TIMEZONE')) AT TIME ZONE 'Asia/Tokyo') AS month
        FROM "Transaction" transaction
        WHERE date >= $start AND date <= $end AND amount > 0 AND "includeInReports" = true AND "deletedAt" IS NULL AND (
          "splitFromId" IS NOT NULL OR
          NOT EXISTS (SELECT 1 FROM "Transaction" child WHERE child."splitFromId" = transaction.id)
        )
        GROUP BY EXTRACT(MONTH FROM (date AT TIME ZONE CURRENT_SETTING('TIMEZONE')) AT TIME ZONE 'Asia/Tokyo')
      `
    )
    .all({ $start: start.getTime(), $end: end.getTime() })

  const groups = db
    .query<
      { $start: number; $end: number },
      {
        spent: number
        categoryId: string | null
        month: number
      }
    >(
      `
        SELECT SUM(amount) AS spent, "categoryId", EXTRACT(MONTH FROM (date AT TIME ZONE CURRENT_SETTING('TIMEZONE')) AT TIME ZONE 'Asia/Tokyo') AS month
        FROM "Transaction" transaction
        WHERE date >= $start AND date <= $end AND amount < 0 AND "includeInReports" = true AND "deletedAt" IS NULL AND (
          "splitFromId" IS NOT NULL OR
          NOT EXISTS (SELECT 1 FROM "Transaction" child WHERE child."splitFromId" = transaction.id)
        )
        GROUP BY "categoryId", EXTRACT(MONTH FROM (date AT TIME ZONE CURRENT_SETTING('TIMEZONE')) AT TIME ZONE 'Asia/Tokyo')
      `
    )
    .all({ $start: start.getTime(), $end: end.getTime() })

  const categories = findCategories()

  const data: {
    [month: string]: MonthBudgetResult
  } = {}

  for (let month = 1; month <= 12; month++) {
    data[month.toString()] = data[month.toString()] || {
      id: `${year}-${month}`,
      year,
      month,
      income: incomeGroups.find((group) => group.month === month)?.income || 0,
      categories: []
    }
  }

  groups.forEach(({ spent, categoryId, month }) => {
    data[month.toString()].categories.push({
      id: `${year}-${month}-${categoryId}`,
      categoryId,
      category: categories.find((category) => category.id === categoryId) || null,
      amountSpent: Math.abs(spent)
    })
  })

  const results = Object.values(data).map((result) => ({
    ...result,
    categories: orderBy(result.categories, ({ category }) => category?.sortOrder || -1)
  }))

  return results
}
