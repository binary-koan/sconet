import { budgetsInYear } from "../db/queries/budgets/budgetsInYear"
import { QueryResolvers, Resolvers } from "../resolvers-types"

export const budgets: QueryResolvers["budgets"] = async (_, { year }) => {
  return budgetsInYear(year)
}

export const MonthBudget: Resolvers["MonthBudget"] = {
  categories: (budget) => budget.categories,
  id: (budget) => budget.id,
  income: (budget) => budget.income,
  month: (budget) => budget.month,
  year: (budget) => budget.year
}

export const CategoryBudget: Resolvers["CategoryBudget"] = {
  amountSpent: (budget) => budget.amountSpent,
  category: (budget) => budget.category,
  categoryId: (budget) => budget.categoryId,
  id: (budget) => budget.id
}
