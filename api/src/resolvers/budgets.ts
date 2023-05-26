import { chunk, keyBy, orderBy, uniq } from "lodash"
import { Currencies, Currency, Money } from "ts-money"
import { CategoryRecord } from "../db/records/category"
import { categoriesRepo } from "../db/repos/categoriesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { QueryResolvers, Resolvers } from "../resolvers-types"
import { loadTransactionCurrencyValues } from "../utils/currencyValuesLoader"

export interface MonthBudgetResult {
  id: string
  year: number
  month: number
  income: Money
  totalSpending: Money
  regularCategories: CategoryBudgetGroupResult
  irregularCategories: CategoryBudgetGroupResult
}

export interface CategoryBudgetGroupResult {
  currency: Currency
  categories: CategoryBudgetResult[]
}
export interface CategoryBudgetResult {
  id: string
  category: CategoryRecord | null
  amountSpent: Money
}

const moneyAbs = (money: Money) => new Money(Math.abs(money.amount), money.currency)

// TODO: Optimise some of this nicely in SQL so it works well for larger numbers of transactions
export const budget: QueryResolvers["budget"] = async (
  _,
  { year, month, timezoneOffset, currencyCode },
  context
) => {
  const outputCurrency =
    Currencies[currencyCode || context.currentUser.settings.defaultCurrencyCode]

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

  const transactionValues = (
    (await loadTransactionCurrencyValues(
      transactions,
      outputCurrency.code,
      context.data.currencyValues
    )) as Money[]
  ).map((value, index) => ({ value, transaction: transactions[index] }))

  const allCategories = includedCategoryIds.map((id) => ({
    id: `${year}-${month}-${id || "uncategorized"}`,
    category: id ? categoriesById[id] : null,
    amountSpent: moneyAbs(
      transactionValues
        .filter(({ transaction }) => transaction.amount < 0 && transaction.categoryId === id)
        .reduce((total, transaction) => total.add(transaction.value), new Money(0, outputCurrency))
    ),
    currency: outputCurrency
  }))

  return {
    id: `${year}-${month}`,
    year,
    month,
    income: transactionValues
      .filter(({ transaction }) => transaction.amount > 0)
      .reduce((total, transaction) => total.add(transaction.value), new Money(0, outputCurrency)),
    totalSpending: moneyAbs(
      transactionValues
        .filter(({ transaction }) => transaction.amount < 0)
        .reduce((total, transaction) => total.add(transaction.value), new Money(0, outputCurrency))
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
  income: (budget) => budget.income,
  month: (budget) => budget.month,
  year: (budget) => budget.year,
  totalSpending: (budget) => budget.totalSpending,
  difference: (budget) => budget.income.subtract(budget.totalSpending),
  regularCategories: (budget) => budget.regularCategories,
  irregularCategories: (budget) => budget.irregularCategories
}

export const CategoryBudgetGroup: Resolvers["CategoryBudgetGroup"] = {
  totalSpending: (group) =>
    group.categories.reduce(
      (total, category) => total.add(category.amountSpent),
      new Money(0, group.currency)
    ),
  categories: (group) => group.categories
}

export const CategoryBudget: Resolvers["CategoryBudget"] = {
  id: (budget) => budget.id,
  amountSpent: (budget) => budget.amountSpent,
  categoryId: (budget) => budget.category?.id || null,
  category: (budget) => budget.category
}
