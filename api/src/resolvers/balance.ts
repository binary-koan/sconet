import { range } from "lodash"
import { Currencies, Currency, Money } from "ts-money"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { QueryResolvers, Resolvers } from "../resolvers-types"
import { loadTransactionCurrencyValues } from "../utils/currencyValuesLoader"
import { moneyAbs, moneySum } from "../utils/money"

export interface AnnualBalanceResult {
  id: string
  year: number
  currency: Currency
  months: MonthBalanceResult[]
}

export interface MonthBalanceResult {
  id: string
  year: number
  month: number
  income: Money
  totalSpending: Money
}

// TODO: Optimise some of this nicely in SQL so it works well for larger numbers of transactions
export const balance: QueryResolvers["balance"] = async (_, { year, currencyCode }, context) => {
  const outputCurrency =
    Currencies[currencyCode || context.currentUser.settings.defaultCurrencyCode]

  const start = new Date(`${year}-01-01T00:00:00Z`)

  const end = new Date(`${year}-12-31T23:59:59Z`)

  const transactions = await transactionsRepo.filter({
    filter: { dateFrom: start, dateUntil: end, includeInReports: true }
  }).data

  const transactionValues = (
    (await loadTransactionCurrencyValues(
      transactions,
      outputCurrency.code,
      context.data.currencyValues
    )) as Money[]
  ).map((value, index) => ({ value, transaction: transactions[index] }))

  const transactionsByMonth = range(0, 12).map((month) => ({
    month: month + 1,
    transactionValues: transactionValues.filter(
      ({ transaction }) => transaction.date.getMonth() === month
    )
  }))

  const months = transactionsByMonth.map(({ month, transactionValues }) => ({
    id: `${year}-${month}`,
    year,
    month,

    income: moneySum(
      transactionValues
        .filter(({ transaction }) => transaction.amount > 0)
        .map(({ value }) => value),
      outputCurrency
    ),
    totalSpending: moneyAbs(
      moneySum(
        transactionValues
          .filter(({ transaction }) => transaction.amount < 0)
          .map(({ value }) => value),
        outputCurrency
      )
    )
  }))

  return {
    id: `${year}`,
    year,
    currency: outputCurrency,
    months
  }
}

export const AnnualBalance: Resolvers["AnnualBalance"] = {
  id: (budget) => budget.id,
  year: (budget) => budget.year,
  currency: (budget) => budget.currency,
  income: (budget) =>
    moneySum(
      budget.months.map((month) => month.income),
      budget.currency
    ),
  totalSpending: (budget) =>
    moneySum(
      budget.months.map((month) => month.totalSpending),
      budget.currency
    ),
  difference: (budget) =>
    moneySum(
      budget.months.map((month) => month.income),
      budget.currency
    ).subtract(
      moneySum(
        budget.months.map((month) => month.totalSpending),
        budget.currency
      )
    ),
  months: (budget) => budget.months
}

export const MonthBalance: Resolvers["MonthBalance"] = {
  id: (budget) => budget.id,
  month: (budget) => budget.month,
  year: (budget) => budget.year,
  income: (budget) => budget.income,
  totalSpending: (budget) => budget.totalSpending,
  difference: (budget) => budget.income.subtract(budget.totalSpending)
}
