import { fromPairs, keyBy, orderBy, sumBy, uniq, zip } from "lodash"
import { findCategories } from "../db/queries/category/findCategories"
import { findCurrencies } from "../db/queries/currency/findCurrencies"
import { findExchangeRatesByCodes } from "../db/queries/exchangeRate/findExchangeRatesByCodes"
import { findTransactions } from "../db/queries/transaction/findTransactions"
import { CategoryRecord } from "../db/records/category"
import { CurrencyRecord } from "../db/records/currency"
import { TransactionRecord } from "../db/records/transaction"
import { QueryResolvers, Resolvers } from "../resolvers-types"
import { convertAmount } from "./money"

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
  { year, month, timezoneOffset, currency }
) => {
  const currenciesById = keyBy(findCurrencies(), "id")

  const outputCurrency = Object.values(currenciesById).find((currencyRecord) =>
    currency ? currencyRecord.code === currency : true
  )!

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

  const transactions = findTransactions({ filter: { dateFrom: start, dateUntil: end } }).data
  const categoriesById = keyBy(findCategories(), "id")

  const includedCategoryIds = orderBy(
    uniq(transactions.map((transaction) => transaction.categoryId)),
    (id) => (id ? categoriesById[id].sortOrder : -1)
  )

  const otherCurrencies = Object.values(currenciesById).filter(
    (currency) => currency.id !== outputCurrency.id
  )

  const exchangeRates = findExchangeRatesByCodes(
    otherCurrencies.map(({ code }) => ({ from: code, to: outputCurrency.code }))
  )

  const exchangeRateByCurrencyId = fromPairs(
    zip(
      otherCurrencies.map(({ id }) => id),
      exchangeRates.map(({ rate }) => rate)
    )
  )
  exchangeRateByCurrencyId[outputCurrency.id] = 1

  const transactionAmount = (transaction: TransactionRecord) =>
    convertAmount(
      transaction.amount,
      currenciesById[transaction.currencyId],
      exchangeRateByCurrencyId[transaction.currencyId]
    )

  const allCategories = includedCategoryIds.map((id) => ({
    id: `${year}-${month}-${id || "uncategorized"}`,
    category: id ? categoriesById[id] : null,
    amountSpent: Math.abs(
      sumBy(
        transactions.filter(
          (transaction) => transaction.amount < 0 && transaction.categoryId === id
        ),
        transactionAmount
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
      transactionAmount
    ),
    totalSpending: Math.abs(
      sumBy(
        transactions.filter((transaction) => transaction.amount < 0),
        transactionAmount
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
