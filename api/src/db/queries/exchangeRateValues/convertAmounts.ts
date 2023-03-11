import { db } from "../../database"
import { commonTableExpressionBindings, commonTableExpressionQuery } from "../../utils/fields"

export function convertAmounts(
  queries: ReadonlyArray<{
    fromCurrencyId: string
    toCurrencyId: string
    dailyExchangeRateId: string
    amount: number
  }>
) {
  return db
    .query(
      `
    WITH queries(amount, fromCurrencyId, toCurrencyId, dailyExchangeRateId) AS (
      VALUES ${commonTableExpressionQuery(queries)}
    )
    SELECT
      (amount * COALESCE(exchangeRateValues.rate, 1)) AS convertedAmount,
      fromCurrency.decimalDigits AS fromDigits,
      toCurrency.decimalDigits AS toDigits
    FROM queries
    LEFT OUTER JOIN dailyExchangeRates ON queries.dailyExchangeRateId = dailyExchangeRates.id
    LEFT OUTER JOIN exchangeRateValues ON queries.toCurrencyId = exchangeRateValues.toCurrencyId AND exchangeRateValues.dailyExchangeRateId = dailyExchangeRates.id
    INNER JOIN currencies fromCurrency ON queries.fromCurrencyId = fromCurrency.id
    INNER JOIN currencies toCurrency ON queries.toCurrencyId = toCurrency.id
  `
    )
    .all(commonTableExpressionBindings(queries))
    .map((row) => {
      const fromMultiplier = 10 ** row.fromDigits
      const toMultiplier = 10 ** row.toDigits
      return (row.convertedAmount / fromMultiplier) * toMultiplier
    })
}
