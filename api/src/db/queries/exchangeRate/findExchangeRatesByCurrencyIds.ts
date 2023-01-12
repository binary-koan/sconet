import { MakeOptional } from "../../../types"
import { db } from "../../database"
import { ExchangeRateRecord } from "../../records/exchangeRate"
import { arrayBindings, arrayQuery } from "../../utils/fields"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export function findExchangeRatesByCurrencyIds(
  queries: ReadonlyArray<{ from: string; to: string }>
): Array<{ rate: number; fromId: string; toId: string }> {
  if (!queries.length) {
    return []
  }

  const allRates = db
    .query(
      `SELECT * FROM exchangeRates WHERE deletedAt IS NULL AND fromCurrencyId IN ${arrayQuery(
        queries
      )}`
    )
    .all(arrayBindings(queries.map(({ from }) => from)))

  return queries.map(({ from, to }) => {
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
