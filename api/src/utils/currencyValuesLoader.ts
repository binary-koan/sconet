import DataLoader from "dataloader"
import { isEqual, isError } from "lodash"
import { Money } from "ts-money"
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
          isEqual(rate.date, date)
      ) as ResolvedExchangeRate | undefined

      if (!rate) {
        throw new Error(
          `No exchange rate found for ${original.currency} to ${targetCurrencyCode} on ${date}`
        )
      }

      return new Money(original.amount * rate.rate, targetCurrencyCode)
    })
  })
}

export function loadTransactionCurrencyValue(
  transaction: TransactionRecord,
  loader: CurrencyValuesLoader
) {
  return loader.load({
    original: new Money(transaction.amount, transaction.currencyCode),
    targetCurrencyCode: transaction.currencyCode,
    date: transaction.date
  })
}

export function loadTransactionCurrencyValues(
  transactions: TransactionRecord[],
  loader: CurrencyValuesLoader
) {
  return loader.loadMany(
    transactions.map((transaction) => ({
      original: new Money(transaction.amount, transaction.currencyCode),
      targetCurrencyCode: transaction.currencyCode,
      date: transaction.date
    }))
  )
}
