import { chunk, keyBy, orderBy, sumBy, uniq } from "lodash"
import { CategoryRecord } from "../db/records/category"
import { CurrencyRecord } from "../db/records/currency"
import { categoriesRepo } from "../db/repos/categoriesRepo"
import { currenciesRepo } from "../db/repos/currenciesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { QueryResolvers, Resolvers } from "../resolvers-types"

export interface MonthBudgetResult {
  id: string
  year: number
  month: number
  income: number
  totalSpending: number
  currency: CurrencyRecord
  regularCategories: CategoryBudgetGroupResult
  irregularCategories: CategoryBudgetGroupResult
}

export interface CategoryBudgetGroupResult {
  currency: CurrencyRecord
  categories: CategoryBudgetResult[]
}
export interface CategoryBudgetResult {
  id: string
  category: CategoryRecord | null
  amountSpent: number
  currency: CurrencyRecord
}

// TODO: Optimise some of this nicely in SQL so it works well for larger numbers of transactions
export const budget: QueryResolvers["budget"] = async (
  _,
  { year, month, timezoneOffset, currencyId }
) => {
  const currenciesById = keyBy(await currenciesRepo.findAll(), "id")

  const outputCurrency = currencyId ? currenciesById[currencyId] : Object.values(currenciesById)[0]

  const start = new Date(
    `${year}-${month.toString().padStart(2, "0")}-01T00:00:00${timezoneOffset}`
  )

  const lastDay = new Date(start)
  lastDay.setMonth(lastDay.getMonth() + 1)
  lastDay.setDate(lastDay.getDate() - 1)

  const end = new Date(
    `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1).toString().padStart(2, "0")}-${lastDay
      .getDate()
      .toString()
      .padStart(2, "0")}T23:59:59${timezoneOffset}`
  )

  const parentTransactions = await transactionsRepo.filter({
    filter: { dateFrom: start, dateUntil: end }
  }).data

  const transactions = await Promise.all(
    chunk(parentTransactions, 100).map(async (transactions) => {
      const split = await transactionsRepo.findSplitTransactionsByIds(transactions.map((t) => t.id))

      return transactions.flatMap((transaction, index) => {
        if (split[index].length) {
          return split[index]
        } else {
          return [transaction]
        }
      })
    })
  ).then((chunks) => chunks.flat())

  const categoriesById = keyBy(await categoriesRepo.findAll(), "id")

  const includedCategoryIds = orderBy(
    uniq(transactions.map((transaction) => transaction.categoryId)),
    (id) => (id ? categoriesById[id].sortOrder : -1)
  )

  const transactionValues = keyBy(
    await transactionsRepo.findValuesInCurrency(
      transactions.map((transaction) => transaction.id),
      outputCurrency
    ),
    "id"
  )

  const allCategories = includedCategoryIds.map((id) => ({
    id: `${year}-${month}-${id || "uncategorized"}`,
    category: id ? categoriesById[id] : null,
    amountSpent: Math.abs(
      sumBy(
        transactions.filter(
          (transaction) => transaction.amount < 0 && transaction.categoryId === id
        ),
        (transaction) => transactionValues[transaction.id].value
      )
    ),
    currency: outputCurrency
  }))

  return {
    id: `${year}-${month}`,
    year,
    month,
    income: sumBy(
      transactions.filter((transaction) => transaction.amount > 0),
      (transaction) => transactionValues[transaction.id].value
    ),
    totalSpending: Math.abs(
      sumBy(
        transactions.filter((transaction) => transaction.amount < 0),
        (transaction) => transactionValues[transaction.id].value
      )
    ),
    currency: outputCurrency,
    regularCategories: {
      currency: outputCurrency,
      categories: allCategories.filter(({ category }) => category?.isRegular)
    },
    irregularCategories: {
      currency: outputCurrency,
      categories: allCategories.filter(({ category }) => !category?.isRegular)
    }
  }
}

export const MonthBudget: Resolvers["MonthBudget"] = {
  id: (budget) => budget.id,
  income: (budget) => ({ amount: budget.income, currency: budget.currency }),
  month: (budget) => budget.month,
  year: (budget) => budget.year,
  totalSpending: (budget) => ({
    amount: budget.totalSpending,
    currency: budget.currency
  }),
  difference: (budget) => ({
    amount: budget.income - budget.totalSpending,
    currency: budget.currency
  }),
  regularCategories: (budget) => budget.regularCategories,
  irregularCategories: (budget) => budget.irregularCategories
}

export const CategoryBudgetGroup: Resolvers["CategoryBudgetGroup"] = {
  totalSpending: (group) => ({
    amount: sumBy(group.categories, (category) => category.amountSpent),
    currency: group.currency
  }),
  categories: (group) => group.categories
}

export const CategoryBudget: Resolvers["CategoryBudget"] = {
  id: (budget) => budget.id,
  amountSpent: (budget) => ({ amount: budget.amountSpent, currency: budget.currency }),
  categoryId: (budget) => budget.category?.id || null,
  category: (budget) => budget.category
}
