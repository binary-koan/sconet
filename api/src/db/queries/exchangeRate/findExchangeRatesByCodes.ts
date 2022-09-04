import { fromPairs, keyBy } from "lodash"
import { MakeOptional } from "../../../types"
import { db } from "../../database"
import { ExchangeRateRecord } from "../../records/exchangeRate"
import { findCurrencies } from "../currency/findCurrencies"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export function findExchangeRatesByCodes(
  queries: ReadonlyArray<{ from: string; to: string }>
): Array<{ rate: number; fromId: string; toId: string }> {
  if (!queries.length) {
    return []
  }

  const currencies = keyBy(findCurrencies(), (currency) => currency.code)

  if (
    queries.some(
      (query) =>
        !Object.keys(currencies).includes(query.from) || !Object.keys(currencies).includes(query.to)
    )
  ) {
    throw new Error("Unknown currency code")
  }

  const args = fromPairs(queries.map(({ from }, index) => [`$from${index}`, currencies[from].id]))

  const allRates = db
    .query(
      `SELECT * FROM exchangeRates WHERE deletedAt IS NULL AND fromCurrencyId IN (${queries
        .map((_, index) => `$from${index}`)
        .join(",")})`
    )
    .all(args)

  return queries.map((query) => {
    const from = currencies[query.from].id
    const to = currencies[query.to].id

    if (from === to) {
      return {
        fromId: from,
        toId: to,
        rate: 1
      }
    }

    return {
      fromId: from,
      toId: to,
      rate: allRates.find((rate) => rate.fromCurrencyId === from && rate.toCurrencyId === to)!.rate
    }
  })
}
