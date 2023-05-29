import DataLoader from "dataloader"
import { GraphQLError } from "graphql"
import { isError } from "lodash"
import { Currencies, Money } from "ts-money"
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

      const converted = original.toDecimal() * rate.rate

      return Money.fromDecimal(
        parseFloat(converted.toFixed(Currencies[targetCurrencyCode].decimal_digits)),
        targetCurrencyCode
      )
    })
  })
}

export async function loadTransactionCurrencyValue(
  transaction: TransactionRecord,
  targetCurrencyCode: string | null | undefined,
  loader: CurrencyValuesLoader,
  field: "amount" | "originalAmount" = "amount"
): Promise<Money> {
  const result = await loader.load(
    transactionToCurrencyValue(transaction, targetCurrencyCode, field)
  )
  if (isError(result)) {
    throw new GraphQLError(
      `Error loading currency value for transaction ${transaction.id}: ${result.message}`,
      {
        originalError: result
      }
    )
  }
  return result
}

export async function loadTransactionCurrencyValues(
  transactions: TransactionRecord[],
  targetCurrencyCode: string | null | undefined,
  loader: CurrencyValuesLoader,
  field: "amount" | "originalAmount" = "amount"
): Promise<Money[]> {
  const results = await loader.loadMany(
    transactions.map((transaction) =>
      transactionToCurrencyValue(transaction, targetCurrencyCode, field)
    )
  )

  if (results.some(isError)) {
    throw new GraphQLError(`Error loading currency values: ${results.find(isError)!.message}`, {
      originalError: results.find(isError)
    })
  }

  return results as Money[]
}

function transactionToCurrencyValue(
  transaction: TransactionRecord,
  targetCurrencyCode: string | null | undefined,
  field: "amount" | "originalAmount"
): AmountForConversion {
  const currencyCode = transaction[field === "amount" ? "currencyCode" : "originalCurrencyCode"]
  const amount = transaction[field]

  if (amount == null || !currencyCode) {
    throw new Error(`Transaction ${transaction.id} has no ${field}`)
  }

  return {
    original: new Money(amount, currencyCode),
    targetCurrencyCode: targetCurrencyCode || currencyCode,
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
