import DataLoader from "dataloader"
import { isError } from "lodash"
import { Money } from "ts-money"
import { CategoryRecord } from "../db/records/category"
import { TransactionRecord } from "../db/records/transaction"
import {
  ExchangeRatesLoader,
  ResolvedExchangeRate,
  exchangeRatesLoader
} from "./exchangeRatesLoader"

export interface AmountForConversion {
  original: Money
  targetCurrencyCode: string
  date: Date
}

export type CurrencyValuesLoader = DataLoader<AmountForConversion, Money>

export function currencyValuesLoader(
  ratesLoader: ExchangeRatesLoader = exchangeRatesLoader()
): CurrencyValuesLoader {
  return new DataLoader(async (amountsForConversion: readonly AmountForConversion[]) => {
    const exchangeRates = await ratesLoader.loadMany(
      amountsForConversion.map((amount) => ({
        fromCurrencyCode: amount.original.currency,
        toCurrencyCode: amount.targetCurrencyCode,
        date: amount.date
      }))
    )

    return amountsForConversion.map(({ original, targetCurrencyCode, date }) => {
      if (original.currency === targetCurrencyCode) {
        return original
      }

      const rate = exchangeRates.find(
        (rate) =>
          !isError(rate) &&
          rate.fromCurrencyCode === original.currency &&
          rate.toCurrencyCode === targetCurrencyCode &&
          rate.date.getTime() === date.getTime()
      ) as ResolvedExchangeRate | undefined

      if (!rate) {
        throw new Error(
          `No exchange rate found for ${original.currency} to ${targetCurrencyCode} on ${date}`
        )
      }

      return new Money(Math.round(original.amount * rate.rate), targetCurrencyCode)
    })
  })
}

export function loadTransactionCurrencyValue(
  transaction: TransactionRecord,
  targetCurrencyCode: string | null | undefined,
  loader: CurrencyValuesLoader
) {
  return loader.load(transactionToCurrencyValue(transaction, targetCurrencyCode))
}

export function loadTransactionCurrencyValues(
  transactions: TransactionRecord[],
  targetCurrencyCode: string | null | undefined,
  loader: CurrencyValuesLoader
) {
  return loader.loadMany(
    transactions.map((transaction) => transactionToCurrencyValue(transaction, targetCurrencyCode))
  )
}

function transactionToCurrencyValue(
  transaction: TransactionRecord,
  targetCurrencyCode?: string | null
): AmountForConversion {
  return {
    original: new Money(transaction.amount, transaction.currencyCode),
    targetCurrencyCode: targetCurrencyCode || transaction.currencyCode,
    date: transaction.date
  }
}

export function loadCategoryBudgetCurrencyValue(
  category: CategoryRecord,
  targetCurrencyCode: string | null | undefined,
  date: Date | null | undefined,
  loader: CurrencyValuesLoader
) {
  const amount = categoryBudgetToCurrencyValue(category, targetCurrencyCode, date)

  if (!amount) return

  return loader.load(amount)
}

function categoryBudgetToCurrencyValue(
  category: CategoryRecord,
  targetCurrencyCode?: string | null,
  date?: Date | null
): AmountForConversion | undefined {
  if (!category.budget || !category.budgetCurrencyCode) return

  return {
    original: new Money(category.budget, category.budgetCurrencyCode),
    targetCurrencyCode: targetCurrencyCode || category.budgetCurrencyCode,
    date: date || new Date()
  }
}
